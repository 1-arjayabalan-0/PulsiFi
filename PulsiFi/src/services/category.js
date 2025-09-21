import ApiService from './api';
import AlertService from '../components/Alert/Alert';

class CategoryService {
  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category
   */
  static async createCategory(categoryData) {
    try {
      const response = await ApiService.post('/categories', categoryData);
      
      // Handle backend bug where success messages are returned as errors
      if (response.error && response.error.includes('successfully')) {
        AlertService.showSuccess('Category created successfully');
        return { success: true, category: categoryData };
      }
      
      if (response.error) {
        AlertService.showError(response.error);
        return { success: false, error: response.error };
      }
      
      AlertService.showSuccess('Category created successfully');
      return { success: true, category: response.data };
    } catch (error) {
      console.error('Error creating category:', error);
      AlertService.showError('Failed to create category');
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all categories
   * @returns {Promise<Array>} List of categories
   */
  static async getAllCategories() {
    try {
      const response = await ApiService.get('/categories');
      
      if (response.error) {
        console.error('Error fetching categories:', response.error);
        return this.getDefaultCategories();
      }
      
      // Transform backend categories to match mobile app format
      const categories = response.categories || response.data || [];
      return categories.map(category => ({
        id: category.id,
        name: category.name,
        icon: category.icon || this.getDefaultIcon(category.name),
        color: category.color || this.getDefaultColor(category.type),
        type: category.type,
        description: category.description
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return this.getDefaultCategories();
    }
  }

  /**
   * Get categories by type (income/expense)
   * @param {string} type - Category type
   * @returns {Promise<Array>} Filtered categories
   */
  static async getCategoriesByType(type) {
    try {
      const response = await ApiService.get(`/categories?type=${type}`);
      
      if (response.error) {
        console.error('Error fetching categories by type:', response.error);
        return this.getDefaultCategories().filter(cat => cat.type === type || cat.type === 'both');
      }
      
      // Transform backend categories to match mobile app format
      const categories = response.categories || response.data || [];
      return categories.map(category => ({
        id: category.id,
        name: category.name,
        icon: category.icon || this.getDefaultIcon(category.name),
        color: category.color || this.getDefaultColor(category.type),
        type: category.type,
        description: category.description
      }));
    } catch (error) {
      console.error('Error fetching categories by type:', error);
      return this.getDefaultCategories().filter(cat => cat.type === type || cat.type === 'both');
    }
  }

  /**
   * Get category by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<Object|null>} Category object or null
   */
  static async getCategoryById(categoryId) {
    try {
      const response = await ApiService.get(`/categories/${categoryId}`);
      
      if (response.error) {
        console.error('Error fetching category by ID:', response.error);
        return this.getDefaultCategories().find(cat => cat.id === categoryId) || null;
      }
      
      // Transform backend category to match mobile app format
      const category = response.category || response.data;
      if (!category) return null;
      
      return {
        id: category.id,
        name: category.name,
        icon: category.icon || this.getDefaultIcon(category.name),
        color: category.color || this.getDefaultColor(category.type),
        type: category.type,
        description: category.description
      };
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      return this.getDefaultCategories().find(cat => cat.id === categoryId) || null;
    }
  }

  /**
   * Update an existing category
   * @param {string} categoryId - Category ID
   * @param {Object} updateData - Updated category data
   * @returns {Promise<Object>} Update result
   */
  static async updateCategory(categoryId, updateData) {
    try {
      const response = await ApiService.put(`/categories/${categoryId}`, updateData);
      
      // Handle backend bug where success messages are returned as errors
      if (response.error && response.error.includes('successfully')) {
        AlertService.showSuccess('Category updated successfully');
        return { success: true, category: updateData };
      }
      
      if (response.error) {
        AlertService.showError(response.error);
        return { success: false, error: response.error };
      }
      
      AlertService.showSuccess('Category updated successfully');
      return { success: true, category: response.data };
    } catch (error) {
      console.error('Error updating category:', error);
      AlertService.showError('Failed to update category');
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a category
   * @param {string} categoryId - Category ID
   * @returns {Promise<Object>} Delete result
   */
  static async deleteCategory(categoryId) {
    try {
      const response = await ApiService.delete(`/categories/${categoryId}`);
      
      // Handle backend bug where success messages are returned as errors
      if (response.error && response.error.includes('successfully')) {
        AlertService.showSuccess('Category deleted successfully');
        return { success: true };
      }
      
      if (response.error) {
        AlertService.showError(response.error);
        return { success: false, error: response.error };
      }
      
      AlertService.showSuccess('Category deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      AlertService.showError('Failed to delete category');
      return { success: false, error: error.message };
    }
  }

  /**
   * Get default categories as fallback
   * @returns {Array} Default categories
   */
  /**
   * Get default icon for a category name
   * @param {string} categoryName - Category name
   * @returns {string} Icon name
   */
  static getDefaultIcon(categoryName) {
    const iconMap = {
      'Food & Dining': 'restaurant',
      'Transportation': 'car',
      'Shopping': 'shopping-bag',
      'Entertainment': 'film',
      'Bills & Utilities': 'receipt',
      'Healthcare': 'heart',
      'Education': 'book',
      'Travel': 'airplane',
      'Insurance': 'shield',
      'Home & Garden': 'home',
      'Personal Care': 'user',
      'Salary': 'briefcase',
      'Freelance': 'laptop',
      'Investment': 'trending-up',
      'Business': 'store',
      'Gift': 'gift',
      'Other Income': 'plus-circle',
      'Other Expenses': 'more-horizontal'
    };
    
    return iconMap[categoryName] || 'circle';
  }

  /**
   * Get default color for a category type
   * @param {string} categoryType - Category type
   * @returns {string} Color hex code
   */
  static getDefaultColor(categoryType) {
    return categoryType === 'income' ? '#4CAF50' : '#F44336';
  }

  /**
   * Get default categories (fallback when API is unavailable)
   * @returns {Array} Default categories
   */
  static getDefaultCategories() {
    return [
      // Expense Categories
      {
        id: "food_dining",
        name: "Food & Dining",
        icon: "food",
        color: "#FF9500",
        type: "expense"
      },
      {
        id: "transportation",
        name: "Transportation",
        icon: "car",
        color: "#007AFF",
        type: "expense"
      },
      {
        id: "entertainment",
        name: "Entertainment",
        icon: "film",
        color: "#5856D6",
        type: "expense"
      },
      {
        id: "utilities",
        name: "Utilities",
        icon: "lightbulb",
        color: "#FF2D55",
        type: "expense"
      },
      {
        id: "shopping",
        name: "Shopping",
        icon: "shopping-bag",
        color: "#AF52DE",
        type: "expense"
      },
      {
        id: "health",
        name: "Health & Medical",
        icon: "medical",
        color: "#FF3B30",
        type: "expense"
      },
      {
        id: "education",
        name: "Education",
        icon: "school",
        color: "#FF9F0A",
        type: "expense"
      },
      {
        id: "travel",
        name: "Travel",
        icon: "airplane",
        color: "#30D158",
        type: "expense"
      },
      // Income Categories
      {
        id: "salary",
        name: "Salary",
        icon: "briefcase",
        color: "#4CD964",
        type: "income"
      },
      {
        id: "freelance",
        name: "Freelance",
        icon: "laptop",
        color: "#007AFF",
        type: "income"
      },
      {
        id: "investment",
        name: "Investment",
        icon: "trending-up",
        color: "#34C759",
        type: "income"
      },
      {
        id: "business",
        name: "Business",
        icon: "store",
        color: "#FF9500",
        type: "income"
      },
      {
        id: "gift",
        name: "Gift",
        icon: "gift",
        color: "#AF52DE",
        type: "income"
      },
      // General
      {
        id: "other",
        name: "Other",
        icon: "dots-horizontal",
        color: "#8E8E93",
        type: "both"
      }
    ];
  }
}

export default CategoryService;