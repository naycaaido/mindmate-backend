/*
  Warnings:

  - You are about to drop the column `logId` on the `FeelingTag` table. All the data in the column will be lost.
  - You are about to drop the column `feelingTagId` on the `MoodLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FeelingTag" DROP CONSTRAINT "FeelingTag_logId_fkey";

-- AlterTable
ALTER TABLE "FeelingTag" DROP COLUMN "logId";

-- AlterTable
ALTER TABLE "MoodLog" DROP COLUMN "feelingTagId";

-- CreateTable
CREATE TABLE "mood_log_tags" (
    "id" TEXT NOT NULL,
    "moodLogId" TEXT NOT NULL,
    "feelingTagId" INTEGER NOT NULL,

    CONSTRAINT "mood_log_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mood_log_tags_moodLogId_feelingTagId_key" ON "mood_log_tags"("moodLogId", "feelingTagId");

-- AddForeignKey
ALTER TABLE "mood_log_tags" ADD CONSTRAINT "mood_log_tags_moodLogId_fkey" FOREIGN KEY ("moodLogId") REFERENCES "MoodLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mood_log_tags" ADD CONSTRAINT "mood_log_tags_feelingTagId_fkey" FOREIGN KEY ("feelingTagId") REFERENCES "FeelingTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
