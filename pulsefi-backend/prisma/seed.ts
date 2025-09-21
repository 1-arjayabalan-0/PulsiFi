import { PrismaClient } from '@prisma/client';
import { hashPassword } from './seed-utils';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting seed...');

    // Create a test user
    const hashedPassword = await hashPassword('password123');
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        isVerified: true, // Mark as verified for testing
        profile: {
          create: {
            firstName: 'Test',
            lastName: 'User'
          }
        }
      }
    });

    console.log('Created user:', user.id);

    // Create a portfolio
    const portfolio = await prisma.portfolio.create({
      data: {
        name: 'My Finances',
        currency: 'USD',
        userId: user.id
      }
    });

    console.log('Created portfolio:', portfolio.id);

    // Create accounts
    const checkingAccount = await prisma.account.create({
      data: {
        name: 'Checking Account',
        type: 'bank_account',
        balance: 3245.65,
        currency: 'USD',
        portfolioId: portfolio.id
      }
    });

    const creditCard = await prisma.account.create({
      data: {
        name: 'Credit Card',
        type: 'credit_debit',
        balance: -450.25,
        currency: 'USD',
        portfolioId: portfolio.id
      }
    });

    const cashWallet = await prisma.account.create({
      data: {
        name: 'Cash Wallet',
        type: 'cash_wallet',
        balance: 150.00,
        currency: 'USD',
        portfolioId: portfolio.id
      }
    });

    // Create a sub-account
    const savingsAccount = await prisma.account.create({
      data: {
        name: 'Savings',
        type: 'bank_account',
        balance: 1500.00,
        currency: 'USD',
        portfolioId: portfolio.id,
        parentId: checkingAccount.id
      }
    });

    console.log('Created accounts');

    // Update portfolio total balance
    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: {
        totalBalance: 3245.65 + (-450.25) + 150.00 + 1500.00
      }
    });

    // Create transactions
    const transactions = [
      {
        type: 'expense',
        amount: 45.99,
        category: 'Food & Dining',
        description: 'Grocery shopping',
        date: new Date('2025-09-12'),
        accountId: checkingAccount.id
      },
      {
        type: 'income',
        amount: 2500.00,
        category: 'Salary',
        description: 'Monthly salary',
        date: new Date('2025-09-01'),
        accountId: checkingAccount.id
      },
      {
        type: 'expense',
        amount: 9.99,
        category: 'Entertainment',
        description: 'Streaming subscription',
        date: new Date('2025-09-10'),
        accountId: creditCard.id
      },
      {
        type: 'expense',
        amount: 35.50,
        category: 'Transportation',
        description: 'Fuel',
        date: new Date('2025-09-08'),
        accountId: creditCard.id
      },
      {
        type: 'expense',
        amount: 120.00,
        category: 'Utilities',
        description: 'Electricity bill',
        date: new Date('2025-09-05'),
        accountId: checkingAccount.id
      }
    ];

    for (const transaction of transactions) {
      await prisma.transaction.create({
        data: transaction
      });
    }

    console.log('Created transactions');
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();