import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  // Mock simple de PrismaService
  const prismaMock = {
    exam: { findMany: jest.fn() },
    exam_Student: { findMany: jest.fn() },
    $transaction: jest.fn(),
  };

  // Mock de ReportsService para tests unitarios
  const serviceMock = {
    getWorstQuestions: jest.fn(),
    getDifficultyCorrelation: jest.fn(),
    compareExamsBetweenSubjects: jest.fn(),
    getExamPerformance: jest.fn(),
    getTeachersReviewReport: jest.fn(),
    getReevaluationComparisonReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    })
      .overrideProvider(ReportsService)
      .useValue(serviceMock)
      .compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getWorstQuestions', async () => {
    await controller.getWorstQuestions();
    expect(service.getWorstQuestions).toHaveBeenCalled();
  });

  it('should call correlationReport', async () => {
    await controller.correlationReport();
    expect(service.getDifficultyCorrelation).toHaveBeenCalled();
  });

  it('should call compareExams', async () => {
    await controller.compareExams();
    expect(service.compareExamsBetweenSubjects).toHaveBeenCalled();
  });

  it('should call getPerformance', async () => {
    await controller.getPerformance('1');
    expect(service.getExamPerformance).toHaveBeenCalledWith(1);
  });

  it('should call getTeachersReviewReport', async () => {
    await controller.getTeachersReviewReport();
    expect(service.getTeachersReviewReport).toHaveBeenCalled();
  });

  it('should call getReevaluationComparisonReport', async () => {
    await controller.getReevaluationComparisonReport();
    expect(service.getReevaluationComparisonReport).toHaveBeenCalled();
  });
});
