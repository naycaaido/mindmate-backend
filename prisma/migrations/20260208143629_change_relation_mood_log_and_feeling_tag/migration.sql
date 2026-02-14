/*
  Warnings:

  - Added the required column `logId` to the `FeelingTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MoodLog" DROP CONSTRAINT "MoodLog_feelingTagId_fkey";

-- AlterTable
ALTER TABLE "FeelingTag" ADD COLUMN     "logId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FeelingTag" ADD CONSTRAINT "FeelingTag_logId_fkey" FOREIGN KEY ("logId") REFERENCES "MoodLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
