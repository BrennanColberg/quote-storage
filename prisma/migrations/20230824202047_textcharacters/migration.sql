-- rename "_PersonToText" to "_TextAuthors"
ALTER TABLE "_PersonToText" RENAME CONSTRAINT "_PersonToText_A_fkey" TO "_TextAuthors_A_fkey";
ALTER TABLE "_PersonToText" RENAME CONSTRAINT "_PersonToText_B_fkey" TO "_TextAuthors_B_fkey";
ALTER TABLE "_PersonToText" RENAME TO "_TextAuthors";
ALTER INDEX "_PersonToText_AB_unique" RENAME TO "_TextAuthors_AB_unique";
ALTER INDEX "_PersonToText_B_index" RENAME TO "_TextAuthors_B_index";

-- CreateTable
CREATE TABLE "_TextCharacters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TextCharacters_AB_unique" ON "_TextCharacters"("A", "B");

-- CreateIndex
CREATE INDEX "_TextCharacters_B_index" ON "_TextCharacters"("B");

-- AddForeignKey
ALTER TABLE "_TextCharacters" ADD CONSTRAINT "_TextCharacters_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TextCharacters" ADD CONSTRAINT "_TextCharacters_B_fkey" FOREIGN KEY ("B") REFERENCES "Text"("id") ON DELETE CASCADE ON UPDATE CASCADE;
