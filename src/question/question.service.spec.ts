import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { PrismaService } from '../prisma/prisma.service';

describe('QuestionService', () => {
  let service: QuestionService;
  let prisma: PrismaService;

  const prismaMock = {
    question: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a question', async () => {
    const dto = {
      text: '¿Qué es NestJS?',
      difficulty: 2,
      subject_id: 1,
      sub_topic_id: 1,
    } as any;

    (prisma.question.create as jest.Mock).mockResolvedValue(dto);

    const result = await service.create(dto);

    expect(prisma.question.create).toHaveBeenCalledWith({ data: dto });
    expect(result).toEqual(dto);
  });

  it('should find all questions with relations', async () => {
    const data = [
      {
        id: 1,
        text: 'Pregunta 1',
        subject: { id: 1, name: 'Matemática' },
        sub_topic: { id: 1, name: 'Álgebra' },
      },
    ];

    (prisma.question.findMany as jest.Mock).mockResolvedValue(data);

    const result = await service.findAll();

    expect(prisma.question.findMany).toHaveBeenCalledWith({
      include: { subject: true, sub_topic: true },
    });
    expect(result).toEqual(data);
  });

  it('should find one question by id', async () => {
    const question = {
      id: 1,
      text: 'Pregunta única',
      subject: { id: 1, name: 'Física' },
    };

    (prisma.question.findUnique as jest.Mock).mockResolvedValue(question);

    const result = await service.findOne(1);

    expect(prisma.question.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { subject: true },
    });
    expect(result).toEqual(question);
  });

  it('should update a question', async () => {
    const dto = { text: 'Texto actualizado' };

    const updated = { id: 1, ...dto };

    (prisma.question.update as jest.Mock).mockResolvedValue(updated);

    const result = await service.update(1, dto as any);

    expect(prisma.question.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
    expect(result).toEqual(updated);
  });

  it('should delete a question', async () => {
    const deleted = { id: 1 };

    (prisma.question.delete as jest.Mock).mockResolvedValue(deleted);

    const result = await service.remove(1);

    expect(prisma.question.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(deleted);
  });
});
