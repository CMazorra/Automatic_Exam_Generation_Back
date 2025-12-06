import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamStudentDto } from './dto/create-exam_student.dto';
import { UpdateExamStudentDto } from './dto/update-exam_student.dto';

@Injectable()
export class ExamStudentService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateExamStudentDto) {
    return this.prisma.$transaction( async(tx) => {
      const exam = await tx.exam.findUnique({
        where: { id : data.exam_id}
      });
      if(!exam) throw new Error('Exam not found');
      await tx.exam.update({
        where: { id: exam.id},
        data: {status: "Asignado"}
      });
      return tx.exam_Student.create({data});
    });
  }

  findAll() {
    return this.prisma.exam_Student.findMany({
      include: {
        exam: true,
        student: true,
        teacher: true,
        reevaluations: true,
      },
    });
  }

  findOne(exam_id: number, student_id: number) {
    return this.prisma.exam_Student.findUnique({
      where: {
        exam_id_student_id: {
          exam_id,
          student_id,
        },
      },
      include: {
        exam: true,
        student: true,
        teacher: true,
        reevaluations: true,
      },
    });
  }

  update(exam_id: number, student_id: number, data: UpdateExamStudentDto) {
    return this.prisma.exam_Student.update({
      where: {
        exam_id_student_id: {
          exam_id,
          student_id,
        },
      },
      data,
    });
  }

  remove(exam_id: number, student_id: number) {
    return this.prisma.exam_Student.delete({
      where: {
        exam_id_student_id: {
          exam_id,
          student_id,
        },
      },
    });
  }
}
