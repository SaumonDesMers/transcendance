/*
  Warnings:

  - Added the required column `bio` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coa` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Coa" AS ENUM ('ORDER', 'ASSEMBLY', 'FEDERATION', 'ALLIANCE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" VARCHAR(200) NOT NULL,
ADD COLUMN     "coa" "Coa" NOT NULL;
