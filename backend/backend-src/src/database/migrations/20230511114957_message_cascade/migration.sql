-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatUserId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatUserId_fkey" FOREIGN KEY ("chatUserId") REFERENCES "ChatUser"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
