import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { GenerateExamDto } from './dto/generated-exam.dto';
import { Question } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateExamDto) {
    return this.prisma.exam.create({ data });
  }

 async generated(data: GenerateExamDto) {
    let selectedQuestions: Question[] = [];
    
    // 🔁 Recorremos cada tipo pedido
    for (const dist of data.questionDistribution) {
      const { type, amount } = dist;
      
      const available = await this.prisma.question.findMany({
        where: {
          subject_id: data.subject_id,
          type: type,
        },
      });
      console.log('Available questions of type', type);
       console.log(available);
      if (available.length === 0) {
        throw new NotFoundException(
          `No se encontraron preguntas del tipo "${type}" , "${available.length}"para la asignatura dada.`,
        );
      }

      // Mezclamos aleatoriamente
      const shuffled = available.sort(() => Math.random() - 0.5);

      const chosen = shuffled.slice(0, amount);

      if (chosen.length < amount) {
        throw new NotFoundException(
          `Solo hay ${chosen.length} preguntas disponibles del tipo "${type}" , "${chosen.length}" en esta asignatura.`,
        );
      }

      selectedQuestions = [...selectedQuestions, ...chosen];
    }

    // 🧩 Crear el examen
    const exam = await this.prisma.exam.create({
      data: {
        name: data.name,
        subject_id: data.subject_id,
        teacher_id: data.teacher_id,
        head_teacher_id: data.head_teacher_id,
        parameters_id: data.parameters_id,
        status: 'generated',
        difficulty: 'mixed', 
        exam_questions: {
          create: selectedQuestions.map((q) => ({
            question: { connect: { id: q.id } },
          })),
        },
      },
      include: {
        exam_questions: { include: { question: true } },
      },
    });

    return exam;
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
