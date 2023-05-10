/*
  Warnings:

  - Added the required column `type` to the `invite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invite" ADD COLUMN     "type" TEXT NOT NULL;
