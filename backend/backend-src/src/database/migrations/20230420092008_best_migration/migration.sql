-- CreateTable
CREATE TABLE "_ChannelInvites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelInvites_AB_unique" ON "_ChannelInvites"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelInvites_B_index" ON "_ChannelInvites"("B");

-- AddForeignKey
ALTER TABLE "_ChannelInvites" ADD CONSTRAINT "_ChannelInvites_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatUser"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelInvites" ADD CONSTRAINT "_ChannelInvites_B_fkey" FOREIGN KEY ("B") REFERENCES "GroupChannel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;
