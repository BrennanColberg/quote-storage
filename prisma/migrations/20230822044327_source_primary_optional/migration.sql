-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "primary" BOOLEAN,
    "quoteId" TEXT NOT NULL,
    "textId" TEXT NOT NULL,
    CONSTRAINT "Source_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Source_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Source" ("id", "primary", "quoteId", "textId") SELECT "id", "primary", "quoteId", "textId" FROM "Source";
DROP TABLE "Source";
ALTER TABLE "new_Source" RENAME TO "Source";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
