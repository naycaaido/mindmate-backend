/*
  Warnings:

  - You are about to drop the column `contentType` on the `RelaxationContent` table. All the data in the column will be lost.
  - You are about to drop the column `contentUrl` on the `RelaxationContent` table. All the data in the column will be lost.
  - You are about to drop the column `durationMinutes` on the `RelaxationContent` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `RelaxationContent` table. All the data in the column will be lost.
  - Added the required column `modalIntro` to the `RelaxationContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modalSteps` to the `RelaxationContent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RelaxationContent" DROP CONSTRAINT "RelaxationContent_tagId_fkey";

-- AlterTable
ALTER TABLE "RelaxationContent" DROP COLUMN "contentType",
DROP COLUMN "contentUrl",
DROP COLUMN "durationMinutes",
DROP COLUMN "thumbnailUrl",
ADD COLUMN     "modalIntro" TEXT NOT NULL,
ADD COLUMN     "modalSteps" JSONB NOT NULL,
ALTER COLUMN "tagId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RelaxationContent" ADD CONSTRAINT "RelaxationContent_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "ContentTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
