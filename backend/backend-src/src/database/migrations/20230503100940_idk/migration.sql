-- DropForeignKey
ALTER TABLE "GroupChannel" DROP CONSTRAINT "GroupChannel_ownerId_fkey";

-- AlterTable
ALTER TABLE "GroupChannel" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GroupChannel" ADD CONSTRAINT "GroupChannel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "ChatUser"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
