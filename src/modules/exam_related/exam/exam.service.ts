import { Injectable,  NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { GenerateExamDto } from './dto/generated-exam.dto';
import { Question } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}
//Task 4




async create(
  dto: CreateExamDto,
  questions: number[] = [],
) {

  // VALIDACIÓN 1: no permitir exámenes sin preguntas
  if (!questions || questions.length === 0) {
    throw new BadRequestException(
      'No se puede crear un examen sin preguntas',
    );
  }

  return this.prisma.$transaction(async (tx) => {

    // Normalizar preguntas
    const normalizedQuestions = [...questions].sort((a, b) => a - b);

    // Buscar exámenes existentes del mismo contexto
    const existingExams = await tx.exam.findMany({
      where: {
        subject_id: dto.subject_id,
        teacher_id: dto.teacher_id,
      },
      include: {
        exam_questions: {
          select: { question_id: true },
        },
      },
    });

    // VALIDACIÓN 2: evitar exámenes duplicados
    for (const existingExam of existingExams) {
      const existingQuestions = existingExam.exam_questions
        .map(q => q.question_id)
        .sort((a, b) => a - b);

      const isDuplicate =
        existingQuestions.length === normalizedQuestions.length &&
        existingQuestions.every(
          (value, index) => value === normalizedQuestions[index],
        );

      if (isDuplicate) {
        console.log(
          `Examen duplicado detectado. Coincide con el examen ID ${existingExam.id}`,
        );
        throw new BadRequestException(
          'Examen duplicado: mismo conjunto de preguntas',
        );
      }
    }

    // Crear examen
    const exam = await tx.exam.create({
      data: {
        name: dto.name,
        status: dto.status,
        difficulty: dto.difficulty,
        subject_id: dto.subject_id,
        teacher_id: dto.teacher_id,
        parameters_id: dto.parameters_id,
        head_teacher_id: dto.head_teacher_id,
      },
    });

    // Crear relaciones exam_question
    await tx.exam_Question.createMany({
      data: normalizedQuestions.map((id) => ({
        exam_id: exam.id,
        question_id: id,
      })),
      skipDuplicates: true,
    });

    // Retornar examen completo
    return tx.exam.findUnique({
      where: { id: exam.id },
      include: {
        exam_questions: {
          include: { question: true },
        },
      },
    });
  });
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

  // 3️⃣ Buscar la PRIMERA combinación que no exista en DB (para EL EXAMEN dado)
  for (const candidate of allPossibleExams) {

    const candidateIds = candidate.map(q => q.id).sort();

    // Verificar si YA existen EXACTAMENTE esas preguntas EN ESTE EXAMEN
    const exists = await this.prisma.exam_Question.findMany({
      where: { exam_id: data.exam_id },
      select: { question_id: true }
    });

    const existingIds = exists.map(e => e.question_id).sort();

    // Si coincide 100% → ES repetido
    if (
      existingIds.length === candidateIds.length &&
      existingIds.every((id, i) => id === candidateIds[i])
    ) {
      continue; // seguir buscando otra combinación
    }

    // 4️⃣ Insertar las preguntas en exam_question
    await this.prisma.exam_Question.createMany({
      data: candidateIds.map(id => ({
        exam_id: data.exam_id,
        question_id: id,
      }))
    });

    // Retornar la lista generada
    return {
      exam_id: data.exam_id,
      questions_added: candidateIds.length,
      inserted_questions: candidateIds
    };
  }

  // 5️⃣ Si todas las combinaciones ya existen → imposible generar uno nuevo
  throw new BadRequestException(
    "No es posible generar una nueva combinación. Todas las combinaciones posibles ya existen para este examen."
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

#Task1
  async listGeneratedExamsBySubject(subjectId: number) {
    return this.prisma.exam.findMany({
      where: {
        subject_id: subjectId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        difficulty: true,
        subject_id: true,
        teacher: {
          select: {
            id: true,
            specialty: true,
            user: {
              select: {
                id_us: true,
                name: true,
              },
            },
          },
        },
        parameters: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }
  
}
