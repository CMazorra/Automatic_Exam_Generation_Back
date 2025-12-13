import { Test, TestingModule } from '@nestjs/testing';
import { ExamStudentService } from './exam_student.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ExamStudentService', () => {
  let service: ExamStudentService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      $transaction: jest.fn(),
      exam: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      exam_Student: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamStudentService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ExamStudentService>(ExamStudentService);
  });

  // =====================================================
  // 🧪 CREATE
  // =====================================================

  it('create debe lanzar error si el examen no existe', async () => {
    prismaMock.$transaction.mockImplementation(async (cb) =>
      cb({
        exam: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      }),
    );

    await expect(
      service.create({
        exam_id: 1,
        student_id: 2,
        teacher_id: 3,
      }),
    ).rejects.toThrow('Exam not found');
  });

  it('create debe asignar el examen y cambiar estado a "Asignado"', async () => {
    prismaMock.$transaction.mockImplementation(async (cb) =>
      cb({
        exam: {
          findUnique: jest.fn().mockResolvedValue({ id: 1 }),
          update: jest.fn().mockResolvedValue({}),
        },
        exam_Student: {
          create: jest.fn().mockResolvedValue({
            exam_id: 1,
            student_id: 2,
            teacher_id: 3,
          }),
        },
      }),
    );

    const result = await service.create({
      exam_id: 1,
      student_id: 2,
      teacher_id: 3,
    });

    expect(result.exam_id).toBe(1);
    expect(result.student_id).toBe(2);
  });

  // =====================================================
  // 🧪 FIND ALL
  // =====================================================

  it('findAll debe retornar examenes asignados con relaciones', async () => {
    prismaMock.exam_Student.findMany.mockResolvedValue([{ id: 1 }]);

    const result = await service.findAll();

    expect(prismaMock.exam_Student.findMany).toHaveBeenCalledWith({
      include: {
        exam: true,
        student: true,
        teacher: true,
        reevaluations: true,
      },
    });

    expect(result).toEqual([{ id: 1 }]);
  });

  // =====================================================
  // 🧪 FIND ONE
  // =====================================================

  it('findOne debe buscar por clave compuesta', async () => {
    prismaMock.exam_Student.findUnique.mockResolvedValue({ id: 1 });

    const result = await service.findOne(1, 2);

    expect(prismaMock.exam_Student.findUnique).toHaveBeenCalledWith({
      where: {
        exam_id_student_id: {
          exam_id: 1,
          student_id: 2,
        },
      },
      include: {
        exam: true,
        student: true,
        teacher: true,
        reevaluations: true,
      },
    });

    expect(result).toEqual({ id: 1 });
  });

  // =====================================================
  // 🧪 UPDATE
  // =====================================================

  it('update debe modificar exam_student', async () => {
    prismaMock.exam_Student.update.mockResolvedValue({ id: 1, score: 9 });

    const result = await service.update(1, 2, { score: 9 });

    expect(prismaMock.exam_Student.update).toHaveBeenCalledWith({
      where: {
        exam_id_student_id: {
          exam_id: 1,
          student_id: 2,
        },
      },
      data: { score: 9 },
    });

    expect(result.score).toBe(9);
  });

  // =====================================================
  // 🧪 REMOVE
  // =====================================================

  it('remove debe eliminar exam_student', async () => {
    prismaMock.exam_Student.delete.mockResolvedValue({ id: 1 });

    const result = await service.remove(1, 2);

    expect(prismaMock.exam_Student.delete).toHaveBeenCalledWith({
      where: {
        exam_id_student_id: {
          exam_id: 1,
          student_id: 2,
        },
      },
    });

    expect(result).toEqual({ id: 1 });
  });
});
