import { Test, TestingModule } from '@nestjs/testing';
import { ExamQuestionService } from './exam_question.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ExamQuestionService', () => {
  let service: ExamQuestionService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      exam_Question: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        groupBy: jest.fn(),
      },
      question: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamQuestionService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ExamQuestionService>(ExamQuestionService);
  });

  // ======================================================
  // 🧪 CRUD BÁSICO
  // ======================================================

  it('create debe crear una relación exam_question', async () => {
    prismaMock.exam_Question.create.mockResolvedValue({
      exam_id: 1,
      question_id: 2,
    });

    const result = await service.create({
      exam_id: 1,
      question_id: 2,
    });

    expect(prismaMock.exam_Question.create).toHaveBeenCalledWith({
      data: {
        exam_id: 1,
        question_id: 2,
      },
    });

    expect(result.exam_id).toBe(1);
  });

  it('findAll debe retornar relaciones con exam y question', async () => {
    prismaMock.exam_Question.findMany.mockResolvedValue([{ id: 1 }]);

    const result = await service.findAll();

    expect(prismaMock.exam_Question.findMany).toHaveBeenCalledWith({
      include: {
        exam: true,
        question: true,
      },
    });

    expect(result).toEqual([{ id: 1 }]);
  });

  it('findOne debe buscar por clave compuesta', async () => {
    prismaMock.exam_Question.findUnique.mockResolvedValue({ id: 1 });

    const result = await service.findOne(1, 2);

    expect(prismaMock.exam_Question.findUnique).toHaveBeenCalledWith({
      where: {
        exam_id_question_id: {
          exam_id: 1,
          question_id: 2,
        },
      },
      include: {
        exam: true,
        question: true,
      },
    });

    expect(result).toEqual({ id: 1 });
  });

  it('update debe actualizar la relación', async () => {
    prismaMock.exam_Question.update.mockResolvedValue({ id: 1 });

    const result = await service.update(1, 2, {});

    expect(prismaMock.exam_Question.update).toHaveBeenCalledWith({
      where: {
        exam_id_question_id: {
          exam_id: 1,
          question_id: 2,
        },
      },
      data: {},
    });

    expect(result).toEqual({ id: 1 });
  });

  it('remove debe eliminar la relación', async () => {
    prismaMock.exam_Question.delete.mockResolvedValue({ id: 1 });

    const result = await service.remove(1, 2);

    expect(prismaMock.exam_Question.delete).toHaveBeenCalledWith({
      where: {
        exam_id_question_id: {
          exam_id: 1,
          question_id: 2,
        },
      },
    });

    expect(result).toEqual({ id: 1 });
  });

  // ======================================================
  // 🧪 TASK 3 — listMostUsedQuestions
  // ======================================================

  it('listMostUsedQuestions debe retornar preguntas ordenadas por uso', async () => {
    prismaMock.exam_Question.groupBy.mockResolvedValue([
      { question_id: 1, _count: { question_id: 3 } },
      { question_id: 2, _count: { question_id: 1 } },
    ]);

    prismaMock.question.findUnique
      .mockResolvedValueOnce({
        id: 1,
        question_text: 'Pregunta 1',
        difficulty: 'MEDIA',
        subject: { name: 'Matemática' },
        sub_topic: {
          name: 'Álgebra',
          topic: { name: 'Ecuaciones' },
        },
      })
      .mockResolvedValueOnce({
        id: 2,
        question_text: 'Pregunta 2',
        difficulty: 'BAJA',
        subject: { name: 'Física' },
        sub_topic: {
          name: 'Cinemática',
          topic: { name: 'Movimiento' },
        },
      });

    const result = await service.listMostUsedQuestions();

    expect(prismaMock.exam_Question.groupBy).toHaveBeenCalled();

    expect(prismaMock.question.findUnique).toHaveBeenCalledTimes(2);

    expect(result).toEqual([
      {
        usage_count: 3,
        id: 1,
        question_text: 'Pregunta 1',
        difficulty: 'MEDIA',
        subject: { name: 'Matemática' },
        sub_topic: {
          name: 'Álgebra',
          topic: { name: 'Ecuaciones' },
        },
      },
      {
        usage_count: 1,
        id: 2,
        question_text: 'Pregunta 2',
        difficulty: 'BAJA',
        subject: { name: 'Física' },
        sub_topic: {
          name: 'Cinemática',
          topic: { name: 'Movimiento' },
        },
      },
    ]);
  });
});
