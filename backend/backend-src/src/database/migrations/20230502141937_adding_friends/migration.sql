-- CreateTable
CREATE TABLE "_friend" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_friend_AB_unique" ON "_friend"("A", "B");

-- CreateIndex
CREATE INDEX "_friend_B_index" ON "_friend"("B");

-- AddForeignKey
ALTER TABLE "_friend" ADD CONSTRAINT "_friend_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friend" ADD CONSTRAINT "_friend_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
