import { Test, TestingModule } from '@nestjs/testing';
import { AnswerService } from './answer.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AnswerService', () => {
  let service: AnswerService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      exam_Student: { findUnique: jest.fn() },
      exam_Question: { findUnique: jest.fn() },
      question: { findUnique: jest.fn() },
      answer: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<AnswerService>(AnswerService);
  });

  // ============================================================
  // 🧪 TESTS DE CREATE()
  // ============================================================

  it('debe lanzar error si el estudiante no tiene asignado el examen', async () => {
    prismaMock.exam_Student.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        exam_id: 1,
        question_id: 10,
        student_id: 99,
        answer_text: 'A',
      }),
    ).rejects.toThrow('El estudiante no tiene asignado el examen');
  });

  it('debe lanzar error si la pregunta no pertenece al examen asignado', async () => {
    prismaMock.exam_Student.findUnique.mockResolvedValue({});
    prismaMock.exam_Question.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        exam_id: 1,
        question_id: 10,
        student_id: 99,
        answer_text: 'A',
      }),
    ).rejects.toThrow('La pregunta no pertenece al examen asignado');
  });

  it('debe lanzar error si la pregunta no existe', async () => {
    prismaMock.exam_Student.findUnique.mockResolvedValue({});
    prismaMock.exam_Question.findUnique.mockResolvedValue({});
    prismaMock.question.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        exam_id: 1,
        question_id: 10,
        student_id: 99,
        answer_text: 'A',
      }),
    ).rejects.toThrow('La pregunta no existe');
  });

  it('debe asignar el score si la respuesta es correcta (Selección Múltiple / VoF)', async () => {
    prismaMock.exam_Student.findUnique.mockResolvedValue({});
    prismaMock.exam_Question.findUnique.mockResolvedValue({});
    prismaMock.question.findUnique.mockResolvedValue({
      id: 10,
      type: 'Selección Múltiple',
      answer: 'B',
      score: 5,
    });

    prismaMock.answer.create.mockResolvedValue({
      exam_id: 1,
      question_id: 10,
      student_id: 99,
      answer_text: 'b',
      score: 5,
    });

    const result = await service.create({
      exam_id: 1,
      question_id: 10,
      student_id: 99,
      answer_text: ' b ', // con espacios y minúsculas
    });

    expect(result.score).toBe(5);
  });

  it('debe asignar score 1 si la respuesta es incorrecta', async () => {
    prismaMock.exam_Student.findUnique.mockResolvedValue({});
    prismaMock.exam_Question.findUnique.mockResolvedValue({});
    prismaMock.question.findUnique.mockResolvedValue({
      id: 10,
      type: 'VoF',
      answer: 'Verdadero',
      score: 2,
    });

    prismaMock.answer.create.mockResolvedValue({
      exam_id: 1,
      question_id: 10,
      student_id: 99,
      answer_text: 'Falso',
      score: 1,
    });

    const result = await service.create({
      exam_id: 1,
      question_id: 10,
      student_id: 99,
      answer_text: 'Falso',
    });

    expect(result.score).toBe(1);
  });

  // ============================================================
  // 🧪 TESTS PARA MÉTODOS CRUD
  // ============================================================

  it('getAnswerByStudent debe llamar a prisma.answer.findMany correctamente', async () => {
    prismaMock.answer.findMany.mockResolvedValue([{ id: 1 }]);

    const result = await service.getAnswerByStudent(1, 99);

    expect(prismaMock.answer.findMany).toHaveBeenCalledWith({
      where: { exam_id: 1, student_id: 99 },
      include: {
        exam_question: {
          include: { question: true },
        },
      },
    });

    expect(result).toEqual([{ id: 1 }]);
  });

  it('findAll debe llamar a prisma.answer.findMany con include', async () => {
    prismaMock.answer.findMany.mockResolvedValue([{ id: 1 }]);

    const result = await service.findAll();

    expect(prismaMock.answer.findMany).toHaveBeenCalledWith({
      include: {
        exam_question: true,
        student: true,
      },
    });

    expect(result).toEqual([{ id: 1 }]);
  });

  it('findOne debe llamar a prisma.answer.findUnique', async () => {
    prismaMock.answer.findUnique.mockResolvedValue({ id: 1 });

    const result = await service.findOne(1, 10, 99);

    expect(prismaMock.answer.findUnique).toHaveBeenCalledWith({
      where: {
        exam_id_question_id_student_id: {
          exam_id: 1,
          question_id: 10,
          student_id: 99,
        },
      },
      include: {
        exam_question: true,
        student: true,
      },
    });

    expect(result).toEqual({ id: 1 });
  });

  it('update debe llamar a prisma.answer.update', async () => {
    prismaMock.answer.update.mockResolvedValue({ id: 1 });

    const result = await service.update(1, 10, 99, { answer_text: 'Nueva' });

    expect(prismaMock.answer.update).toHaveBeenCalledWith({
      where: {
        exam_id_question_id_student_id: {
          exam_id: 1,
          question_id: 10,
          student_id: 99,
        },
      },
      data: { answer_text: 'Nueva' },
    });

    expect(result).toEqual({ id: 1 });
  });

  it('remove debe llamar a prisma.answer.delete', async () => {
    prismaMock.answer.delete.mockResolvedValue({ id: 1 });

    const result = await service.remove(1, 10, 99);

    expect(prismaMock.answer.delete).toHaveBeenCalledWith({
      where: {
        exam_id_question_id_student_id: {
          exam_id: 1,
          question_id: 10,
          student_id: 99,
        },
      },
    });

    expect(result).toEqual({ id: 1 });
  });
});
