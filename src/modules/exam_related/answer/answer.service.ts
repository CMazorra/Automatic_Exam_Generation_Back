import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAnswerDto) {
    const {exam_id, question_id, student_id, answer_text} = data;

    const examStudent = await this.prisma.exam_Student.findUnique({
      where: {exam_id_student_id : {exam_id, student_id}},
    });
    if(!examStudent) throw new Error('El estudiante no tiene asignado el examen');

    const examQuestion = await  this.prisma.exam_Question.findUnique({
      where: {exam_id_question_id : {exam_id, question_id}},
    });
    if(!examQuestion) throw new Error('La pregunta no pertenece al examen asignado');

    return this.prisma.answer.create({
      data: { exam_id, question_id, student_id, answer_text},
    });
  }

    async getAnswerByStudent(exam_id: number, student_id: number) {
      return this.prisma.answer.findMany({
        where: { exam_id, student_id},
        include: {
          exam_question: {
            include: { question: true},
          },
        },
      });
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
