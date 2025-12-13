import { Test, TestingModule } from '@nestjs/testing';
import { ReevaluationService } from './reevaluation.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ReevaluationService', () => {
  let service: ReevaluationService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      reevaluation: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      exam_Student: {
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReevaluationService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ReevaluationService>(ReevaluationService);
  });

  // ============================================================
  // 🧪 CREATE
  // ============================================================

  it('create debe crear una solicitud de reevaluación', async () => {
    prismaMock.reevaluation.create.mockResolvedValue({
      exam_id: 1,
      student_id: 2,
      teacher_id: 3,
    });

    const result = await service.create({
      exam_id: 1,
      student_id: 2,
      teacher_id: 3,
    });

    expect(prismaMock.reevaluation.create).toHaveBeenCalledWith({
      data: {
        exam_id: 1,
        student_id: 2,
        teacher_id: 3,
      },
    });

    expect(result.exam_id).toBe(1);
  });

  // ============================================================
  // 🧪 FIND ALL
  // ============================================================

  it('findAll debe retornar reevaluaciones con relaciones', async () => {
    prismaMock.reevaluation.findMany.mockResolvedValue([{ id: 1 }]);

    const result = await service.findAll();

    expect(prismaMock.reevaluation.findMany).toHaveBeenCalledWith({
      include: {
        exam_student: true,
        teacher: true,
      },
    });

    expect(result).toEqual([{ id: 1 }]);
  });

  // ============================================================
  // 🧪 FIND ONE
  // ============================================================

  it('findOne debe buscar por clave compuesta', async () => {
    prismaMock.reevaluation.findUnique.mockResolvedValue({ id: 1 });

    const result = await service.findOne(1, 2, 3);

    expect(prismaMock.reevaluation.findUnique).toHaveBeenCalledWith({
      where: {
        exam_id_student_id_teacher_id: {
          exam_id: 1,
          student_id: 2,
          teacher_id: 3,
        },
      },
    });

    expect(result).toEqual({ id: 1 });
  });

  // ============================================================
  // 🧪 UPDATE
  // ============================================================

 it('update debe actualizar la reevaluación', async () => {
  prismaMock.reevaluation.findUnique.mockResolvedValue({ id: 1 });
  prismaMock.reevaluation.update.mockResolvedValue({ id: 1, score: 8.5 });

  const result = await service.update(1, 2, 3, {
    score: 8.5,
  });

  expect(prismaMock.reevaluation.update).toHaveBeenCalledWith({
    where: {
      exam_id_student_id_teacher_id: {
        exam_id: 1,
        student_id: 2,
        teacher_id: 3,
      },
    },
    data: {
      score: 8.5,
    },
  });

  expect(result).toEqual({ id: 1, score: 8.5 });
});


  it('update debe actualizar la nota del exam_student si viene score', async () => {
    prismaMock.reevaluation.findUnique.mockResolvedValue({ id: 1 });
    prismaMock.reevaluation.update.mockResolvedValue({ id: 1 });
    prismaMock.exam_Student.update.mockResolvedValue({});

    await service.update(1, 2, 3, {
      score: 9,
    });

    expect(prismaMock.exam_Student.update).toHaveBeenCalledWith({
      where: {
        exam_id_student_id: {
          exam_id: 1,
          student_id: 2,
        },
      },
      data: { score: 9 },
    });
  });

  // ============================================================
  // 🧪 REMOVE
  // ============================================================

  it('remove debe eliminar la reevaluación', async () => {
    prismaMock.reevaluation.delete.mockResolvedValue({ id: 1 });

    const result = await service.remove(1, 2, 3);

    expect(prismaMock.reevaluation.delete).toHaveBeenCalledWith({
      where: {
        exam_id_student_id_teacher_id: {
          exam_id: 1,
          student_id: 2,
          teacher_id: 3,
        },
      },
    });

    expect(result).toEqual({ id: 1 });
  });
});
