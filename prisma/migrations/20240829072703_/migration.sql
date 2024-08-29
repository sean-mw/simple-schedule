-- CreateEnum
CREATE TYPE "ShiftColor" AS ENUM ('Green', 'Yellow', 'Pink', 'Blue', 'Purple', 'Red');

-- CreateTable
CREATE TABLE "ShiftType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "color" "ShiftColor" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ShiftType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShiftType" ADD CONSTRAINT "ShiftType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
