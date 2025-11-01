import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateExamDto) {
    return this.prisma.exam.create({ data });
  }

  findAll() {
    return this.prisma.exam.findMany({
      include: {
        subject: true,
        teacher: true,
        head_teacher: true,
        parameters: true,
        exam_questions: true,
        exam_students: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        subject: true,
        teacher: true,
        head_teacher: true,
        parameters: true,
        exam_questions: true,
        exam_students: true,
      },
    });
  }

  update(id: number, data: UpdateExamDto) {
    return this.prisma.exam.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.exam.delete({
      where: { id },
    });
  }
}
