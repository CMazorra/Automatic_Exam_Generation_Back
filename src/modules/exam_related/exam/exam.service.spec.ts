import { Test, TestingModule } from '@nestjs/testing';
import { ExamService } from './exam.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ExamService', () => {
  let service: ExamService;

  // 🔹 Mock mínimo pero suficiente de PrismaService
  const prismaMock = {
    exam: {
      create: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    exam_Question: {
      findMany: jest.fn().mockResolvedValue([]),
      createMany: jest.fn(),
    },
    question: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    // Importante: simular $transaction ejecutando el callback
    $transaction: jest.fn(async (callback) => callback(prismaMock)),
  };

  beforeEach(async () => {
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
