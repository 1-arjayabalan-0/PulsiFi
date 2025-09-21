import { Request, Response } from 'express';
import { prisma } from '../index';
import { validationResult } from 'express-validator';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { type, active } = req.query;
    
    const where: any = {};
    
    if (type && type !== 'both') {
      where.OR = [
        { type: type as string },
        { type: 'both' }
      ];
    }
    
    if (active !== undefined) {
      where.isActive = active === 'true';
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, type, color, icon, description } = req.body;

    // Check if category with same name and type already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.trim(),
        type,
        isActive: true
      }
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: `Category '${name}' already exists for type '${type}'`
      });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        type,
        color: color || '#007AFF',
        icon: icon || 'category',
        description: description?.trim()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const { name, type, color, icon, description, isActive } = req.body;

    // Check for duplicate name/type combination if name or type is being updated
    if ((name && name !== category.name) || (type && type !== category.type)) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: name?.trim() || category.name,
          type: type || category.type,
          isActive: true,
          NOT: { id }
        }
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: `Category '${name || category.name}' already exists for type '${type || category.type}'`
        });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(type && { type }),
        ...(color && { color }),
        ...(icon && { icon }),
        ...(description !== undefined && { description: description?.trim() }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Soft delete by setting isActive to false
    await prisma.category.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const hardDeleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        transactions: true
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has associated transactions
    if (category.transactions.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot permanently delete category with associated transactions. Use soft delete instead.'
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category permanently deleted'
    });
  } catch (error) {
    console.error('Error hard deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to permanently delete category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};