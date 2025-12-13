jest.mock('src/statistics/helpers', () => ({
  normalizeDate: jest.fn((d: Date) => d),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { approved_examService } from './approved_exam.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('approved_examService', () => {
  let service: approved_examService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      exam: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      approved_Exam: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        approved_examService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<approved_examService>(approved_examService);
  });

  // ============================================================
  // 🧪 TESTS DE CREATE()
  // ============================================================

  it('debe lanzar error si el examen no existe', async () => {
    prismaMock.exam.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        exam_id: 1,
        head_teacher_id: 10,
        guidelines: 'Todo correcto',
      }),
    ).rejects.toThrow('Exam not found');
  });

  it('debe marcar el examen como Aprobado si no contiene "rechazado"', async () => {
    prismaMock.exam.findUnique.mockResolvedValue({ id: 1 });
    prismaMock.exam.update.mockResolvedValue({});
    prismaMock.approved_Exam.create.mockResolvedValue({
      exam_id: 1,
      head_teacher_id: 10,
      guidelines: 'Examen aprobado',
    });

    const result = await service.create({
      exam_id: 1,
      head_teacher_id: 10,
      guidelines: 'Examen aprobado',
    });

    expect(prismaMock.exam.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: 'Aprobado' },
    });

    expect(result.exam_id).toBe(1);
  });

  it('debe marcar el examen como Rechazado si contiene "rechazado"', async () => {
    prismaMock.exam.findUnique.mockResolvedValue({ id: 1 });
    prismaMock.exam.update.mockResolvedValue({});
    prismaMock.approved_Exam.create.mockResolvedValue({
      exam_id: 1,
      head_teacher_id: 10,
      guidelines: 'Examen rechazado por errores',
    });

    const result = await service.create({
      exam_id: 1,
      head_teacher_id: 10,
      guidelines: 'Examen RECHAZADO por errores',
    });

    expect(prismaMock.exam.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: 'Rechazado' },
    });

    expect(result.guidelines).toContain('rechazado');
  });

  // ============================================================
  // 🧪 TESTS CRUD
  // ============================================================

  it('findAll debe retornar aprobaciones con relaciones', async () => {
    prismaMock.approved_Exam.findMany.mockResolvedValue([{ id: 1 }]);

    const result = await service.findAll();

    expect(prismaMock.approved_Exam.findMany).toHaveBeenCalledWith({
      include: {
        exam: true,
        head_teacher: true,
      },
    });

    expect(result).toEqual([{ id: 1 }]);
  });

  it('findOne debe llamar a findUnique correctamente', async () => {
    const date = new Date();

    prismaMock.approved_Exam.findUnique.mockResolvedValue({ id: 1 });

    const result = await service.findOne(date, 1, 10);

    expect(prismaMock.approved_Exam.findUnique).toHaveBeenCalledWith({
      where: {
        date_exam_id_head_teacher_id: {
          date,
          exam_id: 1,
          head_teacher_id: 10,
        },
      },
      include: {
        exam: true,
        head_teacher: true,
      },
    });

    expect(result).toEqual({ id: 1 });
  });

  it('update debe llamar a prisma.approved_Exam.update', async () => {
    const date = new Date();
    prismaMock.approved_Exam.update.mockResolvedValue({ id: 1 });

    const result = await service.update(date, 1, 10, {
      guidelines: 'Actualizado',
    });

    expect(prismaMock.approved_Exam.update).toHaveBeenCalledWith({
      where: {
        date_exam_id_head_teacher_id: {
          date,
          exam_id: 1,
          head_teacher_id: 10,
        },
      },
      data: { guidelines: 'Actualizado' },
    });

    expect(result).toEqual({ id: 1 });
  });

  it('remove debe llamar a prisma.approved_Exam.delete', async () => {
    const date = new Date();
    prismaMock.approved_Exam.delete.mockResolvedValue({ id: 1 });

    const result = await service.remove(date, 1, 10);

    expect(prismaMock.approved_Exam.delete).toHaveBeenCalledWith({
      where: {
        date_exam_id_head_teacher_id: {
          date,
          exam_id: 1,
          head_teacher_id: 10,
        },
      },
    });

    expect(result).toEqual({ id: 1 });
  });

  // ============================================================
  // 🧪 TASK 2
  // ============================================================

  it('listApprovedByHeadTeacher debe retornar examenes aprobados del jefe de cátedra', async () => {
    prismaMock.approved_Exam.findMany.mockResolvedValue([
      {
        exam: {
          id: 1,
          name: 'Examen Final',
          subject: { name: 'Matemática' },
        },
        date: new Date(),
        guidelines: 'Aprobado',
      },
    ]);

    const result = await service.listApprovedByHeadTeacher(10);

    expect(prismaMock.approved_Exam.findMany).toHaveBeenCalledWith({
      where: { head_teacher_id: 10 },
      select: {
        exam: {
          select: {
            id: true,
            name: true,
            subject: {
              select: { name: true },
            },
          },
        },
        date: true,
        guidelines: true,
      },
    });

    expect(result.length).toBe(1);
  });
});
