import { Test, TestingModule } from '@nestjs/testing';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ExamController', () => {
  let controller: ExamController;
  let service: ExamService;

  const prismaMock = {
    exam: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const serviceMock = {
    create: jest.fn(),
    generated: jest.fn(),
    listGeneratedExamsBySubject: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamController],
      providers: [
        ExamService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    })
      .overrideProvider(ExamService)
      .useValue(serviceMock)
      .compile();

    controller = module.get<ExamController>(ExamController);
    service = module.get<ExamService>(ExamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create with correct data', async () => {
    const body = { title: 'Exam 1', questions: [1, 2, 3] };
    await controller.create(body);
    expect(service.create).toHaveBeenCalledWith({ title: 'Exam 1' }, [1, 2, 3]);
  });

  // Otros tests similares para findOne, update, remove, generated...
});
