/*
  Warnings:

  - You are about to drop the column `token` on the `Availability` table. All the data in the column will be lost.
  - The primary key for the `AvailabilityRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `AvailabilityRequest` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `AvailabilityRequest` table. All the data in the column will be lost.
  - Added the required column `availabilityRequestId` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `AvailabilityRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Availability_token_idx";

-- DropIndex
DROP INDEX "AvailabilityRequest_token_key";

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "token",
ADD COLUMN     "availabilityRequestId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AvailabilityRequest" DROP CONSTRAINT "AvailabilityRequest_pkey",
DROP COLUMN "email",
DROP COLUMN "token",
ADD COLUMN     "employeeId" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "AvailabilityRequest_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AvailabilityRequest_id_seq";

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_availabilityRequestId_fkey" FOREIGN KEY ("availabilityRequestId") REFERENCES "AvailabilityRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityRequest" ADD CONSTRAINT "AvailabilityRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
