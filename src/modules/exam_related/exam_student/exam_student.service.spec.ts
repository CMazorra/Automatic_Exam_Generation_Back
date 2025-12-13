import { Test, TestingModule } from '@nestjs/testing';
import { ExamStudentService } from './exam_student.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamStudentDto } from './dto/create-exam_student.dto';
import { UpdateExamStudentDto } from './dto/update-exam_student.dto';

describe('ExamStudentService', () => {
  let service: ExamStudentService;
  let prisma: PrismaService;

  const prismaMock = {
    $transaction: jest.fn(),
    exam_Student: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    },
    exam: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamStudentService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ExamStudentService>(ExamStudentService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create exam student', async () => {
    const dto: CreateExamStudentDto = { exam_id: 1, student_id: 2 } as any;

    prismaMock.$transaction.mockImplementation(async (fn) => fn(prismaMock));

    prismaMock.exam.findUnique.mockResolvedValue({ id: 1 });
    prismaMock.exam.update.mockResolvedValue({ id: 1, status: 'Asignado' });
    prismaMock.exam_Student.create.mockResolvedValue(dto);

    const result = await service.create(dto);
    expect(result).toEqual(dto);
  });

  it('should find all exam students', async () => {
    prismaMock.exam_Student.findMany.mockResolvedValue([]);
    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('should find one exam student', async () => {
    prismaMock.exam_Student.findUnique.mockResolvedValue(null);
    const result = await service.findOne(1, 2);
    expect(result).toBeNull();
  });

  it('should update exam student', async () => {
    const dto: UpdateExamStudentDto = {} as any;
    prismaMock.exam_Student.update.mockResolvedValue(dto);
    const result = await service.update(1, 2, dto);
    expect(result).toEqual(dto);
  });

  it('should remove exam student', async () => {
    prismaMock.exam_Student.delete.mockResolvedValue({});
    const result = await service.remove(1, 2);
    expect(result).toEqual({});
  });
});
