/*
  Warnings:

  - You are about to drop the column `creator_id` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `Exam_Approval` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `teacher_id` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Exam_Approval" DROP CONSTRAINT "Exam_Approval_date_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Exam_Approval" DROP CONSTRAINT "Exam_Approval_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Exam_Approval" DROP CONSTRAINT "Exam_Approval_head_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_creator_id_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "creator_id",
ADD COLUMN     "teacher_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Exam_Approval";

-- CreateTable
CREATE TABLE "Approved_Exam" (
    "date_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "head_teacher_id" INTEGER NOT NULL,
    "guidelines" TEXT NOT NULL,

    CONSTRAINT "Approved_Exam_pkey" PRIMARY KEY ("date_id","exam_id","head_teacher_id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approved_Exam" ADD CONSTRAINT "Approved_Exam_date_id_fkey" FOREIGN KEY ("date_id") REFERENCES "Date"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approved_Exam" ADD CONSTRAINT "Approved_Exam_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approved_Exam" ADD CONSTRAINT "Approved_Exam_head_teacher_id_fkey" FOREIGN KEY ("head_teacher_id") REFERENCES "Head_Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
