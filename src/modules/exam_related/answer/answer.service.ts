import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAnswerDto) {
    return this.prisma.answer.create({ data });
  }

  findAll() {
    return this.prisma.answer.findMany({
      include: {
        exam_question: true,
        student: true,
      },
    });
  }

  findOne(exam_id: number, question_id: number, student_id: number) {
    return this.prisma.answer.findUnique({
      where: { 
        exam_id_question_id_student_id: {
          exam_id,
          question_id,
          student_id,
        },
      },
      include: {
        exam_question: true,
        student: true,
      },
    });
  }

  update(exam_id: number, question_id: number, student_id: number, data: UpdateAnswerDto) {
    return this.prisma.answer.update({
      where: {
        exam_id_question_id_student_id: {
          exam_id,
          question_id,
          student_id,
        },
      },
      data,
    });
  }

  remove(exam_id: number, question_id: number, student_id: number) {
    return this.prisma.answer.delete({
      where: {
        exam_id_question_id_student_id: {
          exam_id,
          question_id,
          student_id,
        },
      },
    });
  }
}
