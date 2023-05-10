/*
  Warnings:

  - Changed the type of `type` on the `invite` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('NORMAL', 'CUSTOM');

-- AlterTable
ALTER TABLE "invite" DROP COLUMN "type",
ADD COLUMN     "type" "GameType" NOT NULL;
