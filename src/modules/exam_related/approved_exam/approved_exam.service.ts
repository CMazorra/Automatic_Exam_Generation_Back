import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApprovedExamDto } from './dto/create-approved_exam.dto';
import { UpdateApprovedExamDto } from './dto/update-approved_exam.dto';

@Injectable()
export class approved_examService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateApprovedExamDto) {
    return this.prisma.approved_Exam.create({ data });
  }
  findAll() {
    return this.prisma.approved_Exam.findMany({
      include: {
        date: true,
        exam: true,
        head_teacher: true,
      },
    });
  }

  findOne(date_id: number, exam_id: number, head_teacher_id: number) {
    return this.prisma.approved_Exam.findUnique({
      where:{
        date_id_exam_id_head_teacher_id: {
          date_id,
          exam_id,
          head_teacher_id,
      },
    },
    include: {
        date: true,
        exam: true,
        head_teacher: true,
    },
    });
  }

  update(date_id: number, exam_id: number, head_teacher_id: number, data: UpdateApprovedExamDto) {
    return this.prisma.approved_Exam.update({
      where: {
        date_id_exam_id_head_teacher_id: {
          date_id,
          exam_id,
          head_teacher_id,
        },
      },
      data,
    });
  }

  remove(date_id: number, exam_id: number, head_teacher_id: number) {
    return this.prisma.approved_Exam.delete({
      where: {
        date_id_exam_id_head_teacher_id: {
          date_id,
          exam_id,
          head_teacher_id,
        },
      },
    });
  }
}
