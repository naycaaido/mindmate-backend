/*
  Warnings:

  - You are about to drop the column `iconUrl` on the `MoodType` table. All the data in the column will be lost.
  - Added the required column `login_provider` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LoginProvider" AS ENUM ('manual', 'google');

-- AlterTable
ALTER TABLE "MoodType" DROP COLUMN "iconUrl";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "login_provider" "LoginProvider" NOT NULL,
ADD COLUMN     "oauth_id" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
