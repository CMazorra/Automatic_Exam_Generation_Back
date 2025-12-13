import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ReportsService', () => {
  let service: ReportsService;

 const prismaMock = {
  question: {
    findMany: jest.fn().mockResolvedValue([]),
  },
  subject: {
    findMany: jest.fn().mockResolvedValue([]),
  },
  exam_Question: {
    findMany: jest.fn().mockResolvedValue([]),
  },
  exam_Student: {
    findMany: jest.fn().mockResolvedValue([]),
    aggregate: jest.fn().mockResolvedValue({ _avg: { score: null } }),
  },
  reevaluation: {
    findMany: jest.fn().mockResolvedValue([]),
  },
};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call getWorstQuestions', async () => {
    await service.getWorstQuestions();
    expect(prismaMock.question.findMany).toHaveBeenCalled();
  });

  it('should call getDifficultyCorrelation', async () => {
    await service.getDifficultyCorrelation();
    expect(prismaMock.subject.findMany).toHaveBeenCalled();
  });

  it('should call compareExamsBetweenSubjects', async () => {
    await service.compareExamsBetweenSubjects();
    expect(prismaMock.subject.findMany).toHaveBeenCalled();
  });

  it('should call getExamPerformance', async () => {
    prismaMock.exam_Question.findMany.mockResolvedValue([]);
    await expect(service.getExamPerformance(1)).rejects.toThrow();
    expect(prismaMock.exam_Question.findMany).toHaveBeenCalled();
  });

  it('should call getTeachersReviewReport', async () => {
    await service.getTeachersReviewReport();
    expect(prismaMock.exam_Student.findMany).toHaveBeenCalled();
  });

  it('should call getReevaluationComparisonReport', async () => {
    await service.getReevaluationComparisonReport();
    expect(prismaMock.reevaluation.findMany).toHaveBeenCalled();
  });
});
