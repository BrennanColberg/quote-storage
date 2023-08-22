-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "key" TEXT,
    "text" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "yearBorn" TEXT,
    "yearDied" TEXT,
    "fictional" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "bio" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Text" (
    "id" TEXT NOT NULL,
    "subtitle" TEXT,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "year" TEXT,
    "notes" TEXT,

    CONSTRAINT "Text_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "primary" BOOLEAN,
    "quoteId" TEXT NOT NULL,
    "textId" TEXT NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Citation" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,

    CONSTRAINT "Citation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edition" (
    "id" TEXT NOT NULL,
    "subtitle" TEXT,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "link" TEXT,
    "year" TEXT,
    "publisherId" TEXT,

    CONSTRAINT "Edition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PersonToQuote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonToText" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EditionToText" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EditionAuthors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EditionTranslators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EditionEditors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PersonToQuote_AB_unique" ON "_PersonToQuote"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonToQuote_B_index" ON "_PersonToQuote"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonToText_AB_unique" ON "_PersonToText"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonToText_B_index" ON "_PersonToText"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EditionToText_AB_unique" ON "_EditionToText"("A", "B");

-- CreateIndex
CREATE INDEX "_EditionToText_B_index" ON "_EditionToText"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EditionAuthors_AB_unique" ON "_EditionAuthors"("A", "B");

-- CreateIndex
CREATE INDEX "_EditionAuthors_B_index" ON "_EditionAuthors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EditionTranslators_AB_unique" ON "_EditionTranslators"("A", "B");

-- CreateIndex
CREATE INDEX "_EditionTranslators_B_index" ON "_EditionTranslators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EditionEditors_AB_unique" ON "_EditionEditors"("A", "B");

-- CreateIndex
CREATE INDEX "_EditionEditors_B_index" ON "_EditionEditors"("B");

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edition" ADD CONSTRAINT "Edition_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToQuote" ADD CONSTRAINT "_PersonToQuote_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToQuote" ADD CONSTRAINT "_PersonToQuote_B_fkey" FOREIGN KEY ("B") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToText" ADD CONSTRAINT "_PersonToText_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToText" ADD CONSTRAINT "_PersonToText_B_fkey" FOREIGN KEY ("B") REFERENCES "Text"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditionToText" ADD CONSTRAINT "_EditionToText_A_fkey" FOREIGN KEY ("A") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditionToText" ADD CONSTRAINT "_EditionToText_B_fkey" FOREIGN KEY ("B") REFERENCES "Text"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditionAuthors" ADD CONSTRAINT "_EditionAuthors_A_fkey" FOREIGN KEY ("A") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditionAuthors" ADD CONSTRAINT "_EditionAuthors_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditionTranslators" ADD CONSTRAINT "_EditionTranslators_A_fkey" FOREIGN KEY ("A") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditionTranslators" ADD CONSTRAINT "_EditionTranslators_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditionEditors" ADD CONSTRAINT "_EditionEditors_A_fkey" FOREIGN KEY ("A") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditionEditors" ADD CONSTRAINT "_EditionEditors_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
