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
  
  //task3
   async listMostUsedQuestions() {
    // 1. Agrupar por cantidad de uso
    const grouped = await this.prisma.exam_Question.groupBy({
      by: ['question_id'],
      _count: { question_id: true },
      orderBy: {
        _count: {
          question_id: 'desc',
        },
      },
    });

    // 2. Obtener datos completos de cada pregunta
    const questions = await Promise.all(
      grouped.map(async (row) => {
        const question = await this.prisma.question.findUnique({
          where: { id: row.question_id },
          select: {
            id: true,
            question_text: true,
            difficulty: true,
            subject: {
              select: { name: true },
            },
            sub_topic: {
              select: {
                name: true,
                topic: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });

        return {
          usage_count: row._count.question_id,
          ...question,
        };
      }),
    );

    return questions;
  }

}
