import { Request, Response } from 'express';
import { prisma } from '../index';
import { sendSuccessResponse, sendErrorResponse, HttpStatus, ErrorCode } from '../utils/response.utils';

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { name, type, balance = 0, currency = 'USD', portfolioId, parentId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if portfolio exists and belongs to user
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: portfolioId,
        userId
      }
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // If parentId is provided, check if parent account exists and belongs to the same portfolio
    if (parentId) {
      const parentAccount = await prisma.account.findFirst({
        where: {
          id: parentId,
          portfolioId
        }
      });

      if (!parentAccount) {
        return res.status(404).json({ message: 'Parent account not found' });
      }
    }

    // Create account and update portfolio balance in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create account
      const account = await prisma.account.create({
        data: {
          name,
          type,
          balance,
          currency,
          portfolioId,
          parentId
        }
      });

      // Update portfolio total balance
      const updatedPortfolio = await prisma.portfolio.update({
        where: { id: portfolioId },
        data: {
          totalBalance: {
            increment: balance
          }
        }
      });

      return { account, portfolio: updatedPortfolio };
    });

    res.status(201).json({
      message: 'Account created successfully',
      account: result.account,
      portfolio: {
        id: result.portfolio.id,
        totalBalance: result.portfolio.totalBalance
      }
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAccountById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const account = await prisma.account.findFirst({
      where: {
        id,
        portfolio: {
          userId
        }
      },
      include: {
        subAccounts: true,
        transactions: {
          orderBy: {
            date: 'desc'
          },
          take: 10 // Limit to recent transactions
        }
      }
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json({ account });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if account exists and belongs to user
    const existingAccount = await prisma.account.findFirst({
      where: {
        id,
        portfolio: {
          userId
        }
      }
    });

    if (!existingAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Update account
    const updatedAccount = await prisma.account.update({
      where: { id },
      data: {
        name,
        type
      }
    });

    res.json({
      message: 'Account updated successfully',
      account: updatedAccount
    });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if account exists and belongs to user
    const existingAccount = await prisma.account.findFirst({
      where: {
        id,
        portfolio: {
          userId
        }
      }
    });

    if (!existingAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Delete account and update portfolio balance in a transaction
    await prisma.$transaction(async (prisma) => {
      // Get all sub-accounts to calculate total balance impact
      const allAccounts = await prisma.account.findMany({
        where: {
          OR: [
            { id },
            { parentId: id }
          ]
        }
      });

      const totalBalanceImpact = allAccounts.reduce((sum, account) => sum + account.balance, 0);

      // Delete account (cascade will delete sub-accounts and transactions)
      await prisma.account.delete({
        where: { id }
      });

      // Update portfolio total balance
      await prisma.portfolio.update({
        where: { id: existingAccount.portfolioId },
        data: {
          totalBalance: {
            decrement: totalBalanceImpact
          }
        }
      });
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const accounts = await prisma.account.findMany({
      where: {
        portfolio: {
          userId
        }
      },
      include: {
        portfolio: {
          select: {
            id: true,
            name: true
          }
        },
        subAccounts: {
          select: {
            id: true,
            name: true,
            balance: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: {
        accounts
      }
    });
  } catch (error) {
    console.error('Get all accounts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};