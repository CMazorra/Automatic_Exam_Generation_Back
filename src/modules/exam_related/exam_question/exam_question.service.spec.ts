import { Test, TestingModule } from '@nestjs/testing';
import { ExamQuestionService } from './exam_question.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamQuestionDto } from './dto/create-exam_question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam_question.dto';

describe('ExamQuestionService', () => {
  let service: ExamQuestionService;
  let prisma: PrismaService;

  const prismaMock = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamQuestionService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ExamQuestionService>(ExamQuestionService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create exam question', async () => {
    const dto: CreateExamQuestionDto = { exam_id: 1, question_id: 2 } as any;
    prismaMock.exam_Question.create.mockResolvedValue(dto);

    const result = await service.create(dto);
    expect(prismaMock.exam_Question.create).toHaveBeenCalledWith({ data: dto });
    expect(result).toEqual(dto);
  });

  it('should find all exam questions', async () => {
    prismaMock.exam_Question.findMany.mockResolvedValue([]);
    const result = await service.findAll();
    expect(prismaMock.exam_Question.findMany).toHaveBeenCalledWith({
      include: { exam: true, question: true },
    });
    expect(result).toEqual([]);
  });

  it('should find one exam question', async () => {
    prismaMock.exam_Question.findUnique.mockResolvedValue(null);
    const result = await service.findOne(1, 2);
    expect(prismaMock.exam_Question.findUnique).toHaveBeenCalledWith({
      where: { exam_id_question_id: { exam_id: 1, question_id: 2 } },
      include: { exam: true, question: true },
    });
    expect(result).toBeNull();
  });

  it('should update exam question', async () => {
    const dto: UpdateExamQuestionDto = {} as any;
    prismaMock.exam_Question.update.mockResolvedValue(dto);

    const result = await service.update(1, 2, dto);
    expect(prismaMock.exam_Question.update).toHaveBeenCalledWith({
      where: { exam_id_question_id: { exam_id: 1, question_id: 2 } },
      data: dto,
    });
    expect(result).toEqual(dto);
  });

  it('should remove exam question', async () => {
    prismaMock.exam_Question.delete.mockResolvedValue({});
    const result = await service.remove(1, 2);
    expect(prismaMock.exam_Question.delete).toHaveBeenCalledWith({
      where: { exam_id_question_id: { exam_id: 1, question_id: 2 } },
    });
    expect(result).toEqual({});
  });

  it('should list most used questions', async () => {
    prismaMock.exam_Question.groupBy.mockResolvedValue([
      { question_id: 1, _count: { question_id: 3 } },
    ]);
    prismaMock.question.findUnique.mockResolvedValue({
      id: 1,
      question_text: 'Q1',
      difficulty: 'easy',
      subject: { name: 'Math' },
      sub_topic: { name: 'Algebra', topic: { name: 'Math' } },
    });

    const result = await service.listMostUsedQuestions();

    expect(prismaMock.exam_Question.groupBy).toHaveBeenCalled();
    expect(prismaMock.question.findUnique).toHaveBeenCalled();
    expect(result).toEqual([
      {
        usage_count: 3,
        id: 1,
        question_text: 'Q1',
        difficulty: 'easy',
        subject: { name: 'Math' },
        sub_topic: { name: 'Algebra', topic: { name: 'Math' } },
      },
    ]);
  });
});
