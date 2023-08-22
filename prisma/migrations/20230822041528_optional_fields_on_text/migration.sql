-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Text" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subtitle" TEXT,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "year" TEXT
);
INSERT INTO "new_Text" ("id", "subtitle", "title", "type", "year") SELECT "id", "subtitle", "title", "type", "year" FROM "Text";
DROP TABLE "Text";
ALTER TABLE "new_Text" RENAME TO "Text";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
