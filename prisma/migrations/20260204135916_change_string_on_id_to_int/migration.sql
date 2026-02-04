/*
  Warnings:

  - The primary key for the `ContentTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ContentTag` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `FeelingTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `FeelingTag` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `feelingTagId` column on the `MoodLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `MoodType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MoodType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `moodTypeId` on the `FeelingTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `moodTypeId` on the `MoodLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `moodTypeId` on the `RelaxationContent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tagId` on the `RelaxationContent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "FeelingTag" DROP CONSTRAINT "FeelingTag_moodTypeId_fkey";

-- DropForeignKey
ALTER TABLE "MoodLog" DROP CONSTRAINT "MoodLog_feelingTagId_fkey";

-- DropForeignKey
ALTER TABLE "MoodLog" DROP CONSTRAINT "MoodLog_moodTypeId_fkey";

-- DropForeignKey
ALTER TABLE "RelaxationContent" DROP CONSTRAINT "RelaxationContent_moodTypeId_fkey";

-- DropForeignKey
ALTER TABLE "RelaxationContent" DROP CONSTRAINT "RelaxationContent_tagId_fkey";

-- AlterTable
ALTER TABLE "ContentTag" DROP CONSTRAINT "ContentTag_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ContentTag_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FeelingTag" DROP CONSTRAINT "FeelingTag_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "moodTypeId",
ADD COLUMN     "moodTypeId" INTEGER NOT NULL,
ADD CONSTRAINT "FeelingTag_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MoodLog" DROP COLUMN "moodTypeId",
ADD COLUMN     "moodTypeId" INTEGER NOT NULL,
DROP COLUMN "feelingTagId",
ADD COLUMN     "feelingTagId" INTEGER;

-- AlterTable
ALTER TABLE "MoodType" DROP CONSTRAINT "MoodType_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "MoodType_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RelaxationContent" DROP COLUMN "moodTypeId",
ADD COLUMN     "moodTypeId" INTEGER NOT NULL,
DROP COLUMN "tagId",
ADD COLUMN     "tagId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FeelingTag" ADD CONSTRAINT "FeelingTag_moodTypeId_fkey" FOREIGN KEY ("moodTypeId") REFERENCES "MoodType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelaxationContent" ADD CONSTRAINT "RelaxationContent_moodTypeId_fkey" FOREIGN KEY ("moodTypeId") REFERENCES "MoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelaxationContent" ADD CONSTRAINT "RelaxationContent_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "ContentTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodLog" ADD CONSTRAINT "MoodLog_moodTypeId_fkey" FOREIGN KEY ("moodTypeId") REFERENCES "MoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodLog" ADD CONSTRAINT "MoodLog_feelingTagId_fkey" FOREIGN KEY ("feelingTagId") REFERENCES "FeelingTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
