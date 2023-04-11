-- CreateEnum
CREATE TYPE "Coa" AS ENUM ('ORDER', 'ASSEMBLY', 'FEDERATION', 'ALLIANCE');

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "darkMode" BOOLEAN NOT NULL,
    "bio" VARCHAR(200) NOT NULL,
    "coa" "Coa" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatUser" (
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "chatUserId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DMChannel" (
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "DMChannel_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "GroupChannel" (
    "channelId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "GroupChannel_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "winnerScore" INTEGER NOT NULL,
    "LoserScore" INTEGER NOT NULL,
    "winnerId" INTEGER NOT NULL,
    "loserId" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatUserblocking" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelAdmin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelToChatUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DMChannel_channelId_key" ON "DMChannel"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupChannel_channelId_key" ON "GroupChannel"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatUserblocking_AB_unique" ON "_ChatUserblocking"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatUserblocking_B_index" ON "_ChatUserblocking"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelAdmin_AB_unique" ON "_ChannelAdmin"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelAdmin_B_index" ON "_ChannelAdmin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToChatUser_AB_unique" ON "_ChannelToChatUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToChatUser_B_index" ON "_ChannelToChatUser"("B");

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatUserId_fkey" FOREIGN KEY ("chatUserId") REFERENCES "ChatUser"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DMChannel" ADD CONSTRAINT "DMChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChannel" ADD CONSTRAINT "GroupChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChannel" ADD CONSTRAINT "GroupChannel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "ChatUser"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatUserblocking" ADD CONSTRAINT "_ChatUserblocking_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatUser"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatUserblocking" ADD CONSTRAINT "_ChatUserblocking_B_fkey" FOREIGN KEY ("B") REFERENCES "ChatUser"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelAdmin" ADD CONSTRAINT "_ChannelAdmin_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatUser"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelAdmin" ADD CONSTRAINT "_ChannelAdmin_B_fkey" FOREIGN KEY ("B") REFERENCES "GroupChannel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToChatUser" ADD CONSTRAINT "_ChannelToChatUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToChatUser" ADD CONSTRAINT "_ChannelToChatUser_B_fkey" FOREIGN KEY ("B") REFERENCES "ChatUser"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
