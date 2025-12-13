import { Test, TestingModule } from '@nestjs/testing';
import { ExamService } from './exam.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ExamService', () => {
  let service: ExamService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      exam: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      exam_Question: {
        createMany: jest.fn(),
        findMany: jest.fn(),
      },
      question: {
        findMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ExamService>(ExamService);
  });

  // ============================================================
  // 🧪 CREATE
  // ============================================================

  it('create debe crear un examen y asociar preguntas', async () => {
    prismaMock.$transaction.mockImplementation(async (cb) =>
      cb({
        exam: {
          create: jest.fn().mockResolvedValue({ id: 1 }),
          findUnique: jest.fn().mockResolvedValue({
            id: 1,
            exam_questions: [],
          }),
        },
        exam_Question: {
          createMany: jest.fn(),
        },
      }),
    );

    const result = await service.create(
      {
        name: 'Parcial',
        status: 'Borrador',
        difficulty: 'Media',
        subject_id: 1,
        teacher_id: 2,
        parameters_id: 3,
        head_teacher_id: 4,
      },
      [10, 11],
    );

    expect(result?.id).toBe(1);
  });

  // ============================================================
  // 🧪 GENERATED
  // ============================================================
  it('generated debe insertar una nueva combinación válida', async () => {
  prismaMock.question.findMany.mockResolvedValue([
    { id: 1, type: 'Multiple', subject_id: 1 },
    { id: 2, type: 'Multiple', subject_id: 1 },
  ]);

  prismaMock.exam_Question.findMany.mockResolvedValue([
    { question_id: 1 }, // combinación previa distinta
  ]);

  prismaMock.exam_Question.createMany.mockResolvedValue({ count: 1 });

  const result = await service.generated({
    exam_id: 1,
    subject_id: 1,
    questionDistribution: [
      { type: 'Multiple', amount: 1 },
    ],
  });

  expect(prismaMock.exam_Question.createMany).toHaveBeenCalledWith({
    data: [{ exam_id: 1, question_id: expect.any(Number) }],
  });

  expect(result.questions_added).toBe(1);
});


  
  it('generated debe lanzar error si no hay suficientes preguntas', async () => {
    prismaMock.question.findMany.mockResolvedValue([]);

    await expect(
      service.generated({
        exam_id: 1,
        subject_id: 1,
        questionDistribution: [
          { type: 'Multiple', amount: 2 },
        ],
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('generated debe lanzar error si no existen combinaciones', async () => {
    prismaMock.question.findMany.mockResolvedValue([
      { id: 1, type: 'Multiple', subject_id: 1 },
    ]);

    prismaMock.exam_Question.findMany.mockResolvedValue([
      { question_id: 1 },
    ]);

    await expect(
      service.generated({
        exam_id: 1,
        subject_id: 1,
        questionDistribution: [
          { type: 'Multiple', amount: 1 },
        ],
      }),
    ).rejects.toThrow(BadRequestException);
  });
   // ============================================================
  // 🧪 Task1
  // ============================================================
  it('listGeneratedExamsBySubject debe retornar exámenes generados por asignatura', async () => {
  prismaMock.exam.findMany.mockResolvedValue([
    {
      id: 10,
      name: 'Parcial Matemática',
      status: 'GENERADO',
      difficulty: 'MEDIA',
      subject_id: 3,
      teacher: {
        id: 5,
        specialty: 'Álgebra',
        user: {
          id_us: 20,
          name: 'Ana López',
        },
      },
      parameters: {
        id: 7,
      },
    },
  ]);

  const result = await service.listGeneratedExamsBySubject(3);

  expect(prismaMock.exam.findMany).toHaveBeenCalledWith({
    where: {
      subject_id: 3,
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

  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Parcial Matemática');
});


  // ============================================================
  // 🧪 CRUD
  // ============================================================

  it('findAll debe retornar examenes con relaciones', async () => {
    prismaMock.exam.findMany.mockResolvedValue([{ id: 1 }]);

    const result = await service.findAll();

    expect(prismaMock.exam.findMany).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('findOne debe retornar un examen', async () => {
    prismaMock.exam.findUnique.mockResolvedValue({ id: 1 });

    const result = await service.findOne(1);

    expect(prismaMock.exam.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: expect.any(Object),
    });

    expect(result).toEqual({ id: 1 });
  });

  it('update debe actualizar el examen', async () => {
    prismaMock.exam.update.mockResolvedValue({ id: 1, name: 'Actualizado' });

    const result = await service.update(1, { name: 'Actualizado' });

    expect(prismaMock.exam.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'Actualizado' },
    });

    expect(result.name).toBe('Actualizado');
  });

  it('remove debe eliminar el examen', async () => {
    prismaMock.exam.delete.mockResolvedValue({ id: 1 });

    const result = await service.remove(1);

    expect(prismaMock.exam.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(result.id).toBe(1);
  });
});
