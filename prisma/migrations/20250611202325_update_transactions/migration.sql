-- CreateEnum
CREATE TYPE "RecurrenceType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "recurrence" "RecurrenceType",
ADD COLUMN     "repeatUntil" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
