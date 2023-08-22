-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Citation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    CONSTRAINT "Citation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Citation_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Citation" ("editionId", "id", "sourceId") SELECT "editionId", "id", "sourceId" FROM "Citation";
DROP TABLE "Citation";
ALTER TABLE "new_Citation" RENAME TO "Citation";
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "primary" BOOLEAN,
    "quoteId" TEXT NOT NULL,
    "textId" TEXT NOT NULL,
    CONSTRAINT "Source_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Source_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Source" ("id", "primary", "quoteId", "textId") SELECT "id", "primary", "quoteId", "textId" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
