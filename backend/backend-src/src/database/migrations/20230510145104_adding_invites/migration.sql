-- CreateEnum
CREATE TYPE "inviteStatus" AS ENUM ('PENDING', 'EXPIRED');

-- CreateTable
CREATE TABLE "invite" (
    "messageId" INTEGER NOT NULL,
    "uid" TEXT NOT NULL,
    "status" "inviteStatus" NOT NULL,

    CONSTRAINT "invite_pkey" PRIMARY KEY ("messageId")
);

-- AddForeignKey
ALTER TABLE "invite" ADD CONSTRAINT "invite_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
