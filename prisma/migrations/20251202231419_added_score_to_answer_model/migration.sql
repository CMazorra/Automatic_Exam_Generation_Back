/*
  Warnings:

  - Added the required column `score` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "score" DOUBLE PRECISION NOT NULL;
