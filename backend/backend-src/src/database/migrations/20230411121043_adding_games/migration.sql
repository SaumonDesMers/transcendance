-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "winnerScore" INTEGER NOT NULL,
    "LoserScore" INTEGER NOT NULL,
    "winnerId" INTEGER NOT NULL,
    "loserId" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
