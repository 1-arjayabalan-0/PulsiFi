import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const currencies = [
    { code: 'USD', name: 'United States Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    // 👉 You can extend with full ISO 4217 list if needed
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: currency,
    });
  }
}

main()
  .then(() => {
    console.log('✅ Currencies seeded successfully!');
  })
  .catch((e) => {
    console.error('❌ Error seeding currencies:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
