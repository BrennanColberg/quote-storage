/*
  Warnings:

  - The `type` column on the `Text` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TextType" AS ENUM ('BOOK', 'ARTICLE', 'SPEECH', 'LETTER', 'BLOG_POST', 'SOCIAL_MEDIA_POST', 'INTERVIEW', 'ESSAY');

-- AlterTable
ALTER TABLE "Text" DROP COLUMN "type",
ADD COLUMN     "type" "TextType";
