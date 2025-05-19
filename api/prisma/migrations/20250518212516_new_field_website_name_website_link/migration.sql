/*
  Warnings:

  - You are about to drop the column `website` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "website",
ADD COLUMN     "websiteLink" TEXT,
ADD COLUMN     "websiteName" VARCHAR(50);
