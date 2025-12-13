import { Test, TestingModule } from '@nestjs/testing';
import { TopicService } from './topic.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TopicService', () => {
  let service: TopicService;
  let prisma: PrismaService;

  const prismaMock = {
    topic: {
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
        TopicService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<TopicService>(TopicService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a topic', async () => {
      const dto = { name: 'Álgebra' };

      (prisma.topic.create as jest.Mock).mockResolvedValue(dto);

      const result = await service.create(dto as any);

      expect(prisma.topic.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(dto);
    });
  });

  describe('findAll', () => {
    it('should return all topics with sub_topics', async () => {
      const topics = [
        {
          id: 1,
          name: 'Geometría',
          sub_topics: [],
        },
      ];

      (prisma.topic.findMany as jest.Mock).mockResolvedValue(topics);

      const result = await service.findAll();

      expect(prisma.topic.findMany).toHaveBeenCalledWith({
        include: { sub_topics: true },
      });
      expect(result).toEqual(topics);
    });
  });

  describe('findOne', () => {
    it('should return a topic if it exists', async () => {
      const topic = {
        id: 1,
        name: 'Trigonometría',
        sub_topics: [],
      };

      (prisma.topic.findUnique as jest.Mock).mockResolvedValue(topic);

      const result = await service.findOne(1);

      expect(prisma.topic.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { sub_topics: true },
      });

      expect(result).toEqual(topic);
    });

    it('should throw NotFoundException if topic does not exist', async () => {
      (prisma.topic.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update topic name only', async () => {
      const updated = { id: 1, name: 'Álgebra Lineal' };

      (prisma.topic.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update(1, { name: 'Álgebra Lineal' } as any);

      expect(prisma.topic.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Álgebra Lineal',
        },
      });

      expect(result).toEqual(updated);
    });

    it('should update topic and connect subject', async () => {
      const updated = { id: 1 };

      (prisma.topic.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update(1, {
        subject_id: 5,
        name: 'Probabilidad',
      } as any);

      expect(prisma.topic.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          subjects: {
            connect: { id: 5 },
          },
          name: 'Probabilidad',
        },
      });

      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a topic', async () => {
      const deleted = { id: 1 };

      (prisma.topic.delete as jest.Mock).mockResolvedValue(deleted);

      const result = await service.remove(1);

      expect(prisma.topic.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual(deleted);
    });
  });

  describe('getTopicsBySubject', () => {
    it('should return topics related to a subject', async () => {
      const topics = [
        {
          id: 1,
          name: 'Funciones',
          sub_topics: [],
        },
      ];

      (prisma.topic.findMany as jest.Mock).mockResolvedValue(topics);

      const result = await service.getTopicsBySubject(3);

      expect(prisma.topic.findMany).toHaveBeenCalledWith({
        where: {
          subjects: {
            some: { id: 3 },
          },
        },
        include: {
          sub_topics: true,
        },
      });

      expect(result).toEqual(topics);
    });
  });
});
