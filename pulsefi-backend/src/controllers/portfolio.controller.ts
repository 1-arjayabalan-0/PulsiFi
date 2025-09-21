import { Request, Response } from 'express';
import { prisma } from '../index';
import { sendSuccessResponse, sendErrorResponse, HttpStatus, ErrorCode } from '../utils/response.utils';

export const createPortfolio = async (req: Request, res: Response) => {
  try {
    const { name, currency = 'USD' } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return sendErrorResponse(
        res,
        ErrorCode.UNAUTHORIZED,
        'Authentication required',
        HttpStatus.UNAUTHORIZED
      );
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        name,
        currency,
        userId
      }
    });

    sendSuccessResponse(
      res,
      { portfolio },
      'Portfolio created successfully',
      HttpStatus.CREATED
    );
  } catch (error) {
    console.error('Create portfolio error:', error);
    sendErrorResponse(
      res,
      ErrorCode.INTERNAL_ERROR,
      'Failed to create portfolio',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const getUserPortfolios = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return sendErrorResponse(
        res,
        ErrorCode.UNAUTHORIZED,
        'Authentication required',
        HttpStatus.UNAUTHORIZED
      );
    }

    const portfolios = await prisma.portfolio.findMany({
      where: { userId },
      include: {
        accounts: {
          where: { parentId: null }, // Only get top-level accounts
          include: {
            subAccounts: true // Include sub-accounts
          }
        }
      }
    });

    sendSuccessResponse(
      res,
      { portfolios },
      'Portfolios retrieved successfully',
      HttpStatus.OK
    );
  } catch (error) {
    console.error('Get portfolios error:', error);
    sendErrorResponse(
      res,
      ErrorCode.INTERNAL_ERROR,
      'Failed to fetch portfolios',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const getPortfolioById = async (req: Request, res: Response) => {
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

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id,
        userId
      },
      include: {
        accounts: {
          include: {
            subAccounts: true
          }
        }
      }
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.json({ portfolio });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, currency } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return sendErrorResponse(
        res,
        ErrorCode.UNAUTHORIZED,
        'Authentication required',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Check if portfolio exists and belongs to user
    const existingPortfolio = await prisma.portfolio.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingPortfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Update portfolio
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        name,
        currency
      }
    });

    res.json({
      message: 'Portfolio updated successfully',
      portfolio: updatedPortfolio
    });
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePortfolio = async (req: Request, res: Response) => {
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

    // Check if portfolio exists and belongs to user
    const existingPortfolio = await prisma.portfolio.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingPortfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Delete portfolio (cascade will delete related accounts and transactions)
    await prisma.portfolio.delete({
      where: { id }
    });

    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};