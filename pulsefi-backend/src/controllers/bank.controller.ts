import { Request, Response } from 'express';
import { prisma } from '../index';
import { sendSuccessResponse, sendErrorResponse, HttpStatus, ErrorCode } from '../utils/response.utils';

export const createBank = async (req: Request, res: Response) => {
  try {
    const { name, code, logo, website } = req.body;
    
    // Check if bank with same code already exists
    const existingBank = await prisma.bankMaster.findUnique({
      where: { code }
    });

    if (existingBank) {
      return sendErrorResponse(
        res,
        ErrorCode.BAD_REQUEST,
        'Bank with this code already exists',
        HttpStatus.BAD_REQUEST
      );
    }

    const bank = await prisma.bankMaster.create({
      data: {
        name,
        code,
        logo,
        website,
        isActive: true
      }
    });

    return sendSuccessResponse(
      res,
      { bank },
      'Bank created successfully',
      HttpStatus.CREATED
    );
  } catch (error) {
    console.error('Create bank error:', error);
    return sendErrorResponse(
      res,
      ErrorCode.SERVER_ERROR,
      'Failed to create bank',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const getAllBanks = async (req: Request, res: Response) => {
  try {
    const banks = await prisma.bankMaster.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return sendSuccessResponse(
      res,
      { banks },
      'Banks retrieved successfully',
      HttpStatus.OK
    );
  } catch (error) {
    console.error('Get banks error:', error);
    return sendErrorResponse(
      res,
      ErrorCode.SERVER_ERROR,
      'Failed to retrieve banks',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const getBankById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const bank = await prisma.bankMaster.findUnique({
      where: { id }
    });

    if (!bank) {
      return sendErrorResponse(
        res,
        ErrorCode.NOT_FOUND,
        'Bank not found',
        HttpStatus.NOT_FOUND
      );
    }

    return sendSuccessResponse(
      res,
      { bank },
      'Bank retrieved successfully',
      HttpStatus.OK
    );
  } catch (error) {
    console.error('Get bank error:', error);
    return sendErrorResponse(
      res,
      ErrorCode.SERVER_ERROR,
      'Failed to retrieve bank',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateBank = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, logo, website, isActive } = req.body;

    const bank = await prisma.bankMaster.findUnique({
      where: { id }
    });

    if (!bank) {
      return sendErrorResponse(
        res,
        ErrorCode.NOT_FOUND,
        'Bank not found',
        HttpStatus.NOT_FOUND
      );
    }

    const updatedBank = await prisma.bankMaster.update({
      where: { id },
      data: {
        name,
        logo,
        website,
        isActive
      }
    });

    return sendSuccessResponse(
      res,
      { bank: updatedBank },
      'Bank updated successfully',
      HttpStatus.OK
    );
  } catch (error) {
    console.error('Update bank error:', error);
    return sendErrorResponse(
      res,
      ErrorCode.SERVER_ERROR,
      'Failed to update bank',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteBank = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const bank = await prisma.bankMaster.findUnique({
      where: { id }
    });

    if (!bank) {
      return sendErrorResponse(
        res,
        ErrorCode.NOT_FOUND,
        'Bank not found',
        HttpStatus.NOT_FOUND
      );
    }

    // Check if bank is used in any accounts
    const accountsWithBank = await prisma.account.findFirst({
      where: { bankId: id }
    });

    if (accountsWithBank) {
      // Instead of deleting, mark as inactive
      await prisma.bankMaster.update({
        where: { id },
        data: { isActive: false }
      });

      return sendSuccessResponse(
        res,
        {},
        'Bank marked as inactive because it is used in accounts',
        HttpStatus.OK
      );
    }

    // If not used, delete the bank
    await prisma.bankMaster.delete({
      where: { id }
    });

    return sendSuccessResponse(
      res,
      {},
      'Bank deleted successfully',
      HttpStatus.OK
    );
  } catch (error) {
    console.error('Delete bank error:', error);
    return sendErrorResponse(
      res,
      ErrorCode.SERVER_ERROR,
      'Failed to delete bank',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};