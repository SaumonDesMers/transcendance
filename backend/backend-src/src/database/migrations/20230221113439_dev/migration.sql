-- CreateTable
CREATE TABLE "ChatUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "chatUserId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DMChannel" (
    "channelId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "TextChannel" (
    "channelId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelToChatUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatUser_userId_key" ON "ChatUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DMChannel_channelId_key" ON "DMChannel"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "TextChannel_channelId_key" ON "TextChannel"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToChatUser_AB_unique" ON "_ChannelToChatUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToChatUser_B_index" ON "_ChannelToChatUser"("B");

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatUserId_fkey" FOREIGN KEY ("chatUserId") REFERENCES "ChatUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DMChannel" ADD CONSTRAINT "DMChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextChannel" ADD CONSTRAINT "TextChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToChatUser" ADD CONSTRAINT "_ChannelToChatUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToChatUser" ADD CONSTRAINT "_ChannelToChatUser_B_fkey" FOREIGN KEY ("B") REFERENCES "ChatUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
