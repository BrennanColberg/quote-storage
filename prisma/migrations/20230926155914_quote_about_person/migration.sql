-- Rename Table
ALTER TABLE "_PersonToQuote" RENAME TO "_QuoteAuthors";

-- Rename Indices
ALTER INDEX "_PersonToQuote_AB_unique" RENAME TO "_QuoteAuthors_AB_unique";
ALTER INDEX "_PersonToQuote_B_index" RENAME TO "_QuoteAuthors_B_index";

-- Rename Foreign Keys
ALTER TABLE "_QuoteAuthors" RENAME CONSTRAINT "_PersonToQuote_A_fkey" TO "_QuoteAuthors_A_fkey";
ALTER TABLE "_QuoteAuthors" RENAME CONSTRAINT "_PersonToQuote_B_fkey" TO "_QuoteAuthors_B_fkey";

-- Create New Table
CREATE TABLE "_QuoteSubjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- Create New Indices
CREATE UNIQUE INDEX "_QuoteSubjects_AB_unique" ON "_QuoteSubjects"("A", "B");
CREATE INDEX "_QuoteSubjects_B_index" ON "_QuoteSubjects"("B");

-- Add Foreign Keys for New Table
ALTER TABLE "_QuoteSubjects" ADD CONSTRAINT "_QuoteSubjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_QuoteSubjects" ADD CONSTRAINT "_QuoteSubjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
