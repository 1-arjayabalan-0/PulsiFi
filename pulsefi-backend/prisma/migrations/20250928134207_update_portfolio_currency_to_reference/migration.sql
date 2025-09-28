/*
  Warnings:

  - You are about to drop the column `currency` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `portfolios` table. All the data in the column will be lost.
  - Added the required column `currency_id` to the `portfolios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "currency";

-- AlterTable
ALTER TABLE "portfolios" DROP COLUMN "currency",
ADD COLUMN "currency_id" TEXT NOT NULL DEFAULT 'cba532eb-54fe-4f9b-98c6-4e95058ec3a2';

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

