-- DropForeignKey
ALTER TABLE "GroupChannel" DROP CONSTRAINT "GroupChannel_channelId_fkey";

-- AddForeignKey
ALTER TABLE "GroupChannel" ADD CONSTRAINT "GroupChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
