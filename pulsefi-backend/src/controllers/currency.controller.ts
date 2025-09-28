import { Request, Response } from 'express';
import { prisma } from '../index';
import { sendSuccessResponse, sendErrorResponse, HttpStatus, ErrorCode } from '../utils/response.utils';

/**
 * Get all currencies
 */
export const getAllCurrencies = async (req: Request, res: Response) => {
  try {
    const currencies = await prisma.currency.findMany({
      orderBy: {
        code: 'asc'
      }
    });

    return sendSuccessResponse(
      res,
      { currencies },
      'Currencies retrieved successfully',
      HttpStatus.OK
    );
  } catch (error) {
    console.error('Get currencies error:', error);
    return sendErrorResponse(
      res,
      ErrorCode.SERVER_ERROR,
      'Failed to fetch currencies',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get currency by code
 */
export const getCurrencyByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    
    const currency = await prisma.currency.findUnique({
      where: { code }
    });

    if (!currency) {
      return sendErrorResponse(
        res,
        ErrorCode.NOT_FOUND,
        'Currency not found',
        HttpStatus.NOT_FOUND
      );
    }

    return sendSuccessResponse(
      res,
      { currency },
      'Currency retrieved successfully',
      HttpStatus.OK
    );
  } catch (error) {
    console.error('Get currency error:', error);
    return sendErrorResponse(
      res,
      ErrorCode.SERVER_ERROR,
      'Failed to fetch currency',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};