/*
  Warnings:

  - You are about to alter the column `employeeNumber` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - A unique constraint covering the columns `[email,userId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employeeNumber,userId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Employee_email_key";

-- DropIndex
DROP INDEX "Employee_employeeNumber_key";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "employeeNumber" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_userId_key" ON "Employee"("email", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeNumber_userId_key" ON "Employee"("employeeNumber", "userId");
