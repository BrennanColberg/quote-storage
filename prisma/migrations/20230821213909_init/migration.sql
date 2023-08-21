-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT,
    "text" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "yearBorn" INTEGER,
    "yearDied" INTEGER,
    "textId" TEXT,
    "sourceId" TEXT,
    "fictional" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "bio" TEXT,
    CONSTRAINT "Person_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Person_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Text" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subtitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "year" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "primary" BOOLEAN NOT NULL,
    "quoteId" TEXT NOT NULL,
    "textId" TEXT NOT NULL,
    CONSTRAINT "Source_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Source_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Citation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    CONSTRAINT "Citation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Citation_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Edition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subtitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "link" TEXT,
    "year" INTEGER NOT NULL,
    "publisherId" TEXT NOT NULL,
    CONSTRAINT "Edition_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT
);

-- CreateTable
CREATE TABLE "_PersonToQuote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PersonToQuote_A_fkey" FOREIGN KEY ("A") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PersonToQuote_B_fkey" FOREIGN KEY ("B") REFERENCES "Quote" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EditionToText" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EditionToText_A_fkey" FOREIGN KEY ("A") REFERENCES "Edition" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EditionToText_B_fkey" FOREIGN KEY ("B") REFERENCES "Text" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_PersonToQuote_AB_unique" ON "_PersonToQuote"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonToQuote_B_index" ON "_PersonToQuote"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EditionToText_AB_unique" ON "_EditionToText"("A", "B");

-- CreateIndex
CREATE INDEX "_EditionToText_B_index" ON "_EditionToText"("B");
