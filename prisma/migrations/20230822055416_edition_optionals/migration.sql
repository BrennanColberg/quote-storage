-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Edition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subtitle" TEXT,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "link" TEXT,
    "year" TEXT,
    "publisherId" TEXT,
    CONSTRAINT "Edition_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Edition" ("id", "link", "publisherId", "subtitle", "title", "type", "year") SELECT "id", "link", "publisherId", "subtitle", "title", "type", "year" FROM "Edition";
DROP TABLE "Edition";
ALTER TABLE "new_Edition" RENAME TO "Edition";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
