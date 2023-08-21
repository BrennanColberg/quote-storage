-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Text" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subtitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "year" TEXT NOT NULL
);
INSERT INTO "new_Text" ("id", "subtitle", "title", "type", "year") SELECT "id", "subtitle", "title", "type", "year" FROM "Text";
DROP TABLE "Text";
ALTER TABLE "new_Text" RENAME TO "Text";
CREATE TABLE "new_Edition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subtitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "link" TEXT,
    "year" TEXT NOT NULL,
    "publisherId" TEXT NOT NULL,
    CONSTRAINT "Edition_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Edition" ("id", "link", "publisherId", "subtitle", "title", "type", "year") SELECT "id", "link", "publisherId", "subtitle", "title", "type", "year" FROM "Edition";
DROP TABLE "Edition";
ALTER TABLE "new_Edition" RENAME TO "Edition";
CREATE TABLE "new_Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "yearBorn" TEXT,
    "yearDied" TEXT,
    "textId" TEXT,
    "sourceId" TEXT,
    "fictional" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "bio" TEXT,
    CONSTRAINT "Person_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Person_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Person" ("bio", "fictional", "id", "name", "notes", "shortName", "sourceId", "textId", "yearBorn", "yearDied") SELECT "bio", "fictional", "id", "name", "notes", "shortName", "sourceId", "textId", "yearBorn", "yearDied" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
