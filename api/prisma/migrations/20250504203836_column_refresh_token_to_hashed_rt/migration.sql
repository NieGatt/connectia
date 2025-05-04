/*
  Warnings:

  - You are about to drop the column `lastLogoutAt` on the `Login` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Login` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hashedRt]` on the table `Login` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Login_refreshToken_key";

-- AlterTable
ALTER TABLE "Login" DROP COLUMN "lastLogoutAt",
DROP COLUMN "refreshToken",
ADD COLUMN     "hashedRt" TEXT,
ADD COLUMN     "lastLogout" TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Login_hashedRt_key" ON "Login"("hashedRt");
