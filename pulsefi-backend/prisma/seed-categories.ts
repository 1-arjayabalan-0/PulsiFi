import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  // Income categories
  {
    name: 'Salary',
    type: 'income',
    color: '#4CAF50',
    icon: 'briefcase',
    description: 'Regular salary income'
  },
  {
    name: 'Freelance',
    type: 'income',
    color: '#8BC34A',
    icon: 'laptop',
    description: 'Freelance work income'
  },
  {
    name: 'Investment',
    type: 'income',
    color: '#2196F3',
    icon: 'trending-up',
    description: 'Investment returns and dividends'
  },
  {
    name: 'Business',
    type: 'income',
    color: '#FF9800',
    icon: 'store',
    description: 'Business income'
  },
  {
    name: 'Gift',
    type: 'income',
    color: '#E91E63',
    icon: 'gift',
    description: 'Gifts and bonuses'
  },
  {
    name: 'Other Income',
    type: 'income',
    color: '#9C27B0',
    icon: 'plus-circle',
    description: 'Other sources of income'
  },

  // Expense categories
  {
    name: 'Food & Dining',
    type: 'expense',
    color: '#F44336',
    icon: 'restaurant',
    description: 'Food, restaurants, and dining expenses'
  },
  {
    name: 'Transportation',
    type: 'expense',
    color: '#FF5722',
    icon: 'car',
    description: 'Transportation and vehicle expenses'
  },
  {
    name: 'Shopping',
    type: 'expense',
    color: '#E91E63',
    icon: 'shopping-bag',
    description: 'Shopping and retail purchases'
  },
  {
    name: 'Entertainment',
    type: 'expense',
    color: '#9C27B0',
    icon: 'film',
    description: 'Entertainment and leisure activities'
  },
  {
    name: 'Bills & Utilities',
    type: 'expense',
    color: '#607D8B',
    icon: 'receipt',
    description: 'Monthly bills and utilities'
  },
  {
    name: 'Healthcare',
    type: 'expense',
    color: '#4CAF50',
    icon: 'heart',
    description: 'Medical and healthcare expenses'
  },
  {
    name: 'Education',
    type: 'expense',
    color: '#2196F3',
    icon: 'book',
    description: 'Education and learning expenses'
  },
  {
    name: 'Travel',
    type: 'expense',
    color: '#00BCD4',
    icon: 'airplane',
    description: 'Travel and vacation expenses'
  },
  {
    name: 'Insurance',
    type: 'expense',
    color: '#795548',
    icon: 'shield',
    description: 'Insurance premiums and coverage'
  },
  {
    name: 'Home & Garden',
    type: 'expense',
    color: '#8BC34A',
    icon: 'home',
    description: 'Home maintenance and garden expenses'
  },
  {
    name: 'Personal Care',
    type: 'expense',
    color: '#FF9800',
    icon: 'user',
    description: 'Personal care and grooming'
  },
  {
    name: 'Other Expenses',
    type: 'expense',
    color: '#757575',
    icon: 'more-horizontal',
    description: 'Other miscellaneous expenses'
  }
];

async function seedCategories() {
  console.log('🌱 Seeding categories...');

  try {
    // Check if categories already exist
    const existingCategories = await prisma.category.count();
    
    if (existingCategories > 0) {
      console.log(`📊 Found ${existingCategories} existing categories. Skipping seed.`);
      return;
    }

    // Create categories
    const createdCategories = await prisma.category.createMany({
      data: defaultCategories,
      skipDuplicates: true
    });

    console.log(`✅ Successfully created ${createdCategories.count} categories`);

    // Display created categories
    const categories = await prisma.category.findMany({
      orderBy: [{ type: 'asc' }, { name: 'asc' }]
    });

    console.log('\n📋 Created categories:');
    let currentType = '';
    categories.forEach(category => {
      if (category.type !== currentType) {
        currentType = category.type;
        console.log(`\n${currentType.toUpperCase()} CATEGORIES:`);
      }
      console.log(`  • ${category.name} (${category.color})`);
    });

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedCategories();
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { seedCategories };