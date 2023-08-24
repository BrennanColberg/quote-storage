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
    "thingId" TEXT NOT NULL,

    CONSTRAINT "Citation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thing" (
    "id" TEXT NOT NULL,
    "subtitle" TEXT,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "link" TEXT,
    "year" TEXT,
    "publisherId" TEXT,

    CONSTRAINT "Thing_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "_ThingToText" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ThingAuthors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ThingTranslators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ThingEditors" (
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
CREATE UNIQUE INDEX "_ThingToText_AB_unique" ON "_ThingToText"("A", "B");

-- CreateIndex
CREATE INDEX "_ThingToText_B_index" ON "_ThingToText"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ThingAuthors_AB_unique" ON "_ThingAuthors"("A", "B");

-- CreateIndex
CREATE INDEX "_ThingAuthors_B_index" ON "_ThingAuthors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ThingTranslators_AB_unique" ON "_ThingTranslators"("A", "B");

-- CreateIndex
CREATE INDEX "_ThingTranslators_B_index" ON "_ThingTranslators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ThingEditors_AB_unique" ON "_ThingEditors"("A", "B");

-- CreateIndex
CREATE INDEX "_ThingEditors_B_index" ON "_ThingEditors"("B");

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_thingId_fkey" FOREIGN KEY ("thingId") REFERENCES "Thing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thing" ADD CONSTRAINT "Thing_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToQuote" ADD CONSTRAINT "_PersonToQuote_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToQuote" ADD CONSTRAINT "_PersonToQuote_B_fkey" FOREIGN KEY ("B") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToText" ADD CONSTRAINT "_PersonToText_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToText" ADD CONSTRAINT "_PersonToText_B_fkey" FOREIGN KEY ("B") REFERENCES "Text"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThingToText" ADD CONSTRAINT "_ThingToText_A_fkey" FOREIGN KEY ("A") REFERENCES "Thing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThingToText" ADD CONSTRAINT "_ThingToText_B_fkey" FOREIGN KEY ("B") REFERENCES "Text"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThingAuthors" ADD CONSTRAINT "_ThingAuthors_A_fkey" FOREIGN KEY ("A") REFERENCES "Thing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThingAuthors" ADD CONSTRAINT "_ThingAuthors_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThingTranslators" ADD CONSTRAINT "_ThingTranslators_A_fkey" FOREIGN KEY ("A") REFERENCES "Thing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThingTranslators" ADD CONSTRAINT "_ThingTranslators_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThingEditors" ADD CONSTRAINT "_ThingEditors_A_fkey" FOREIGN KEY ("A") REFERENCES "Thing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThingEditors" ADD CONSTRAINT "_ThingEditors_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
