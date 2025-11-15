/*
  Warnings:

  - The primary key for the `Approved_Exam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_id` on the `Approved_Exam` table. All the data in the column will be lost.
  - You are about to drop the `Date` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Approved_Exam" DROP CONSTRAINT "Approved_Exam_date_id_fkey";

-- AlterTable
ALTER TABLE "Approved_Exam" DROP CONSTRAINT "Approved_Exam_pkey",
DROP COLUMN "date_id",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Approved_Exam_pkey" PRIMARY KEY ("date", "exam_id", "head_teacher_id");

-- DropTable
DROP TABLE "public"."Date";
