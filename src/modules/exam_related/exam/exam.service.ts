import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { GenerateExamDto } from './dto/generated-exam.dto';
import { Question } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateExamDto) {
    return this.prisma.exam.create({ data });
  }

async generated(data: GenerateExamDto) {

  // Helper: generar combinaciones
  function combinations<T>(arr: T[], k: number): T[][] {
    if (k === 0) return [[]];
    if (arr.length === 0) return [];

    const [first, ...rest] = arr;

    const withFirst = combinations(rest, k - 1).map(c => [first, ...c]);
    const withoutFirst = combinations(rest, k);

    return [...withFirst, ...withoutFirst];
  }

  // Helper: producto cartesiano
  function cartesian<T>(arrays: T[][][]): T[][] {
    return arrays.reduce((acc, curr) =>
      acc.flatMap(a => curr.map(c => [...a, ...c])), [[]]);
  }

  let typeCombos: Question[][][] = [];

  // 1️⃣ Para cada tipo → obtener TODAS las combinaciones
  for (const dist of data.questionDistribution) {
    const { type, amount } = dist;

    const available = await this.prisma.question.findMany({
      where: {
        subject_id: data.subject_id,
        type: type
      },
    });

    if (available.length < amount) {
      throw new NotFoundException(
        `No hay suficientes preguntas del tipo "${type}". (Hay ${available.length}, se necesitan ${amount})`
      );
    }

    const combos = combinations(available, amount); // TODAS las combinaciones
    typeCombos.push(combos);
  }

  // 2️⃣ Generar TODAS las combinaciones completas de examen
  const allPossibleExams = cartesian(typeCombos);

  if (allPossibleExams.length === 0) {
    throw new BadRequestException("No existen combinaciones posibles para generar un examen.");
  }

  // 3️⃣ Buscar la PRIMERA combinación que no exista en DB
  for (const candidate of allPossibleExams) {

    const candidateIds = candidate.map(q => q.id).sort();

    // Buscar si YA existe un examen con EXACTAMENTE esa combinación de preguntas
    const exists = await this.prisma.exam.findFirst({
      where: {
        exam_questions: {
          every: { question_id: { in: candidateIds } }
        },
        AND: {
          exam_questions: {
            none: { question_id: { notIn: candidateIds } }
          }
        }
      }
    });

    // 4️⃣ Si no existe → CREAR EL EXAMEN AQUÍ
    if (!exists) {
      return await this.prisma.exam.create({
        data: {
          name: data.name,
          subject_id: data.subject_id,
          teacher_id: data.teacher_id,
          head_teacher_id: data.head_teacher_id,
          parameters_id: data.parameters_id,
          status: 'generated',
          difficulty: 'mixed',
          exam_questions: {
            create: candidateIds.map(id => ({
              question: { connect: { id } }
            }))
          }
        },
        include: {
          exam_questions: { include: { question: true } }
        }
      });
    }
  }

  // 5️⃣ Si todas las combinaciones ya existen → imposible generar uno nuevo
  throw new BadRequestException(
    "No es posible generar un examen nuevo. Todas las combinaciones posibles ya existen."
  );
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
