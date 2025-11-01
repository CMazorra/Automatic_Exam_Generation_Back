import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamQuestionDto } from './dto/create-exam_question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam_question.dto';

@Injectable()
export class ExamQuestionService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateExamQuestionDto) {
    return this.prisma.exam_Question.create({ data });
  }

  findAll() {
    return this.prisma.exam_Question.findMany({
      include: {
        exam: true,
        question: true,
      },
    });
  }

  findOne(exam_id: number, question_id: number) {
    return this.prisma.exam_Question.findUnique({
      where: {
        exam_id_question_id: {
          exam_id,
          question_id,
        },
      },
      include: {
        exam: true,
        question:true,
      },
    });
  }

  update(exam_id: number, question_id: number, data: UpdateExamQuestionDto) {
    return this.prisma.exam_Question.update({
      where: {
        exam_id_question_id: {
          exam_id,
          question_id,
        },
      },
      data,
    });
  }

  remove(exam_id: number, question_id: number) {
    return this.prisma.exam_Question.delete({
      where:{
        exam_id_question_id: {
          exam_id,
          question_id,
        },
      },
    });
  }
}
