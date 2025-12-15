import { Injectable,  NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { GenerateExamDto } from './dto/generated-exam.dto';
import { Question } from '@prisma/client';
import { InternalServerErrorException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}
//Task 4




async create(
  dto: CreateExamDto,
  questions: number[] = [],
) {

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
        throw new BadRequestException(
          'Examen duplicado: mismo conjunto de preguntas',
        );
      }
    }

    // Obtener información completa de las preguntas
const dbQuestions = await tx.question.findMany({
  where: {
    id: { in: normalizedQuestions },
  },
  select: {
    type: true,
    sub_topic: {
      select: {
        topic: {
          select: {
            name: true,
          },
        },
      },
    },
  },
});


    const totalQuestions = dbQuestions.length;

    // Calcular proporciones por tipo
    const typeCount: Record<string, number> = {};
    for (const q of dbQuestions) {
      typeCount[q.type] = (typeCount[q.type] || 0) + 1;
    }

    const proportion = Object.entries(typeCount)
      .map(([type, count]) => {
        const percent = Math.round((count / totalQuestions) * 100);
        return `${type}:${percent}`;
      })
      .sort()
      .join('|');

    // Calcular cantidad de preguntas
    const amount_quest = `TOTAL:${totalQuestions}`;

    // Calcular topics involucrados
const quest_topics = Array.from(
  new Set(
    dbQuestions.map(q => q.sub_topic.topic.name),
  ),
)
  .sort()
  .join(',');

    // Buscar parámetros existentes
    let parameters = await tx.parameters.findFirst({
      where: {
        proportion,
        amount_quest,
        quest_topics,
      },
    });

    // Crear parámetros si no existen
    if (!parameters) {
      parameters = await tx.parameters.create({
        data: {
          proportion,
          amount_quest,
          quest_topics,
        },
      });
    }

    // Crear examen
    const exam = await tx.exam.create({
      data: {
        name: dto.name,
        status: dto.status,
        difficulty: dto.difficulty,
        subject_id: dto.subject_id,
        teacher_id: dto.teacher_id,
        head_teacher_id: dto.head_teacher_id,
        parameters_id: parameters.id,
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
        parameters: true,
        exam_questions: {
          include: { question: true },
        },
      },
    });
  });
}

async generated(data: GenerateExamDto) {

  // =========================
  // Helpers
  // =========================

  function combinations<T>(arr: T[], k: number): T[][] {
    if (k === 0) return [[]];
    if (arr.length === 0) return [];

    const [first, ...rest] = arr;

    return [
      ...combinations(rest, k - 1).map(c => [first, ...c]),
      ...combinations(rest, k),
    ];
  }

  function cartesian<T>(arrays: T[][][]): T[][] {
    return arrays.reduce(
      (acc, curr) => acc.flatMap(a => curr.map(c => [...a, ...c])),
      [[]] as T[][]
    );
  }

  // =========================
  // 1️⃣ Calcular parametrización
  // =========================

  const totalQuestions = data.questionDistribution.reduce(
    (sum, d) => sum + d.amount,
    0,
  );

  if (totalQuestions === 0) {
    throw new BadRequestException(
      'La distribución de preguntas no puede estar vacía',
    );
  }
  
  const TYPE_LABELS: Record<string, string> = {
  TRUE_FALSE: 'VoF',
  ARGUMENTATION: 'Argumentación',
  MULTIPLE_CHOICE: 'Selección múltiple',
  };

  const proportion = data.questionDistribution
    .map(d => {
      const percent = Math.round((d.amount / totalQuestions) * 100);
      const label = TYPE_LABELS[d.type] ?? d.type;
      return `${percent}-${label}`;
    })
    .join('|');

  const amountQuest = `TOTAL:${totalQuestions}`;
  const questTopics = 'Mixto'; // por ahora fijo

  let parameters = await this.prisma.parameters.findFirst({
    where: {
      proportion,
      amount_quest: amountQuest,
      quest_topics: questTopics,
    },
  });

  if (!parameters) {
    parameters = await this.prisma.parameters.create({
      data: {
        proportion,
        amount_quest: amountQuest,
        quest_topics: questTopics,
      },
    });
  }

  // Asociar parámetros al examen
  await this.prisma.exam.update({
    where: { id: data.exam_id },
    data: { parameters_id: parameters.id },
  });

  // =========================
  // 2️⃣ Generar combinaciones por tipo
  // =========================

  let typeCombos: Question[][][] = [];

  for (const dist of data.questionDistribution) {
    const { type, amount } = dist;

    const available = await this.prisma.question.findMany({
      where: {
        subject_id: data.subject_id,
        type: type,
      },
    });

    if (available.length < amount) {
      throw new NotFoundException(
        `No hay suficientes preguntas del tipo "${type}". (Hay ${available.length}, se necesitan ${amount})`,
      );
    }

    const combos = combinations(available, amount);
    typeCombos.push(combos);
  }

  const allPossibleExams = cartesian(typeCombos);

  if (allPossibleExams.length === 0) {
    throw new BadRequestException(
      'No existen combinaciones posibles para generar un examen',
    );
  }

  // =========================
  // 3️⃣ Preguntas ya existentes en el examen
  // =========================

  const existing = await this.prisma.exam_Question.findMany({
    where: { exam_id: data.exam_id },
    select: { question_id: true },
  });

  const existingIds = existing.map(e => e.question_id);

  // =========================
  // 4️⃣ Buscar combinación válida
  // =========================

  for (const candidate of allPossibleExams) {
    const candidateIds = candidate.map(q => q.id);

    // ❗ Evitar duplicados parciales
    const hasAnyDuplicate = candidateIds.some(id =>
      existingIds.includes(id),
    );

    if (hasAnyDuplicate) continue;

    try {
      await this.prisma.exam_Question.createMany({
        data: candidateIds.map(id => ({
          exam_id: data.exam_id,
          question_id: id,
        })),
        skipDuplicates: true, // red de seguridad
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'La combinación generada contiene preguntas ya asociadas a este examen',
        );
      }

      throw new InternalServerErrorException(
        'Error inesperado al generar el examen',
      );
    }

    return {
      exam_id: data.exam_id,
      parameters_id: parameters.id,
      questions_added: candidateIds.length,
      inserted_questions: candidateIds,
    };
  }

  // =========================
  // 5️⃣ Sin combinaciones posibles
  // =========================

  throw new BadRequestException(
    'No es posible generar una nueva combinación sin reutilizar preguntas existentes',
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
