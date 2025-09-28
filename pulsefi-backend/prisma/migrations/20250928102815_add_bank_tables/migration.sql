-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "account_number" TEXT,
ADD COLUMN     "bank_id" TEXT,
ADD COLUMN     "routing_number" TEXT;

-- CreateTable
CREATE TABLE "bank_masters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_masters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bank_masters_code_key" ON "bank_masters"("code");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "bank_masters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
