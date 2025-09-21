import { Request, Response } from 'express';
import { prisma } from '../index';
import { sendSuccessResponse, sendErrorResponse, HttpStatus, ErrorCode } from '../utils/response.utils';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { type, amount, categoryId, description, date, accountId } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return sendErrorResponse(
        res,
        ErrorCode.UNAUTHORIZED,
        'Authentication required',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Check if account exists and belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        portfolio: {
          userId
        }
      },
      include: {
        portfolio: true
      }
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Validate category if provided
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        return res.status(400).json({ message: 'Invalid category' });
      }

      // Validate category type matches transaction type
      if (category.type !== type) {
        return res.status(400).json({ 
          message: `Category type '${category.type}' does not match transaction type '${type}'` 
        });
      }
    }

    // Calculate balance impact based on transaction type
    const balanceImpact = type === 'income' ? amount : -amount;

    // Create transaction and update balances in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create transaction
      const transaction = await prisma.transaction.create({
        data: {
          type,
          amount: parseFloat(amount),
          category: categoryId ? '' : description || 'Uncategorized', // Keep category field for backward compatibility
          categoryId: categoryId || null,
          description,
          date: new Date(date),
          accountId
        },
        include: {
          categoryRef: true
        }
      });

      // Update account balance
      const updatedAccount = await prisma.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: balanceImpact
          }
        }
      });

      // Update portfolio total balance
      const updatedPortfolio = await prisma.portfolio.update({
        where: { id: account.portfolioId },
        data: {
          totalBalance: {
            increment: balanceImpact
          }
        }
      });

      return { transaction, account: updatedAccount, portfolio: updatedPortfolio };
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: result.transaction,
      account: {
        id: result.account.id,
        balance: result.account.balance
      },
      portfolio: {
        id: result.portfolio.id,
        totalBalance: result.portfolio.totalBalance
      }
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTransactionsByAccount = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return sendErrorResponse(
        res,
        ErrorCode.UNAUTHORIZED,
        'Authentication required',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Check if account exists and belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        portfolio: {
          userId
        }
      }
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where: { accountId },
      include: {
        categoryRef: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return sendErrorResponse(
        res,
        ErrorCode.UNAUTHORIZED,
        'Authentication required',
        HttpStatus.UNAUTHORIZED
      );
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        account: {
          portfolio: {
            userId
          }
        }
      },
      include: {
        account: true,
        categoryRef: true
      }
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, amount, categoryId, description, date } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return sendErrorResponse(
        res,
        ErrorCode.UNAUTHORIZED,
        'Authentication required',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Get existing transaction with account info
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        account: {
          portfolio: {
            userId
          }
        }
      },
      include: {
        account: {
          include: {
            portfolio: true
          }
        }
      }
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Validate category if provided
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        return res.status(400).json({ message: 'Invalid category' });
      }

      // Validate category type matches transaction type
      if (category.type !== type) {
        return res.status(400).json({ 
          message: `Category type '${category.type}' does not match transaction type '${type}'` 
        });
      }
    }

    // Calculate old balance impact
    const oldBalanceImpact = existingTransaction.type === 'income' ? existingTransaction.amount : -existingTransaction.amount;
    
    // Calculate new balance impact
    const newBalanceImpact = type === 'income' ? amount : -amount;
    
    // Calculate net balance change
    const netBalanceChange = newBalanceImpact - oldBalanceImpact;

    // Update transaction and balances in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update transaction
      const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data: {
          type,
          amount: parseFloat(amount),
          categoryId: categoryId || null,
          description,
          date: new Date(date)
        },
        include: {
          categoryRef: true
        }
      });

      // Update account balance
      const updatedAccount = await prisma.account.update({
        where: { id: existingTransaction.accountId },
        data: {
          balance: {
            increment: netBalanceChange
          }
        }
      });

      // Update portfolio total balance
      const updatedPortfolio = await prisma.portfolio.update({
        where: { id: existingTransaction.account.portfolioId },
        data: {
          totalBalance: {
            increment: netBalanceChange
          }
        }
      });

      return { transaction: updatedTransaction, account: updatedAccount, portfolio: updatedPortfolio };
    });

    res.json({
      message: 'Transaction updated successfully',
      transaction: result.transaction,
      account: {
        id: result.account.id,
        balance: result.account.balance
      },
      portfolio: {
        id: result.portfolio.id,
        totalBalance: result.portfolio.totalBalance
      }
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return sendErrorResponse(
        res,
        ErrorCode.UNAUTHORIZED,
        'Authentication required',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Get existing transaction with account info
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        account: {
          portfolio: {
            userId
          }
        }
      },
      include: {
        account: {
          include: {
            portfolio: true
          }
        }
      }
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Calculate balance impact to reverse
    const balanceImpact = existingTransaction.type === 'income' ? -existingTransaction.amount : existingTransaction.amount;

    // Delete transaction and update balances in a transaction
    await prisma.$transaction(async (prisma) => {
      // Delete transaction
      await prisma.transaction.delete({
        where: { id }
      });

      // Update account balance
      await prisma.account.update({
        where: { id: existingTransaction.accountId },
        data: {
          balance: {
            increment: balanceImpact
          }
        }
      });

      // Update portfolio total balance
      await prisma.portfolio.update({
        where: { id: existingTransaction.account.portfolioId },
        data: {
          totalBalance: {
            increment: balanceImpact
          }
        }
      });
    });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        account: {
          portfolio: {
            userId
          }
        }
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        categoryRef: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json({
      success: true,
      data: {
        transactions
      }
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};