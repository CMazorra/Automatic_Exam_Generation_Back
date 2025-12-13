import { Test, TestingModule } from '@nestjs/testing';
import { SubTopicService } from './sub-topic.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SubTopicService', () => {
  let service: SubTopicService;
  let prisma: PrismaService;

  const prismaMock = {
    sub_Topic: {
      findFirst: jest.fn(),
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
        SubTopicService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<SubTopicService>(SubTopicService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create sub topic with next calculated id when previous exists', async () => {
      const dto = {
        name: 'Subtema 2',
        topic_id: 1,
      };

      (prisma.sub_Topic.findFirst as jest.Mock).mockResolvedValue({ id: 3 });
      (prisma.sub_Topic.create as jest.Mock).mockResolvedValue({
        id: 4,
        name: dto.name,
        topic_id: dto.topic_id,
      });

      const result = await service.create(dto as any);

      expect(prisma.sub_Topic.findFirst).toHaveBeenCalledWith({
        where: { topic_id: dto.topic_id },
        orderBy: { id: 'desc' },
      });

      expect(prisma.sub_Topic.create).toHaveBeenCalledWith({
        data: {
          id: 4,
          name: dto.name,
          topic_id: dto.topic_id,
        },
      });

      expect(result.id).toBe(4);
    });

    it('should create sub topic with id = 1 when none exists', async () => {
      const dto = {
        name: 'Primer subtema',
        topic_id: 2,
      };

      (prisma.sub_Topic.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.sub_Topic.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: dto.name,
        topic_id: dto.topic_id,
      });

      const result = await service.create(dto as any);

      expect(prisma.sub_Topic.create).toHaveBeenCalledWith({
        data: {
          id: 1,
          name: dto.name,
          topic_id: dto.topic_id,
        },
      });

      expect(result.id).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return all sub topics with topic relation', async () => {
      const data = [
        {
          id: 1,
          name: 'Subtema',
          topic: { id: 1, name: 'Tema' },
        },
      ];

      (prisma.sub_Topic.findMany as jest.Mock).mockResolvedValue(data);

      const result = await service.findAll();

      expect(prisma.sub_Topic.findMany).toHaveBeenCalledWith({
        include: { topic: true },
      });

      expect(result).toEqual(data);
    });
  });

  describe('findOne', () => {
    it('should return a sub topic by composite key', async () => {
      const subTopic = {
        id: 1,
        topic_id: 1,
        name: 'Subtema',
        topic: { id: 1, name: 'Tema' },
      };

      (prisma.sub_Topic.findUnique as jest.Mock).mockResolvedValue(subTopic);

      const result = await service.findOne(1, 1);

      expect(prisma.sub_Topic.findUnique).toHaveBeenCalledWith({
        where: { id_topic_id: { id: 1, topic_id: 1 } },
        include: { topic: true },
      });

      expect(result).toEqual(subTopic);
    });
  });

  describe('update', () => {
    it('should update a sub topic by composite key', async () => {
      const updated = {
        id: 1,
        topic_id: 1,
        name: 'Actualizado',
      };

      (prisma.sub_Topic.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update(1, 1, { name: 'Actualizado' } as any);

      expect(prisma.sub_Topic.update).toHaveBeenCalledWith({
        where: { id_topic_id: { id: 1, topic_id: 1 } },
        data: { name: 'Actualizado' },
      });

      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a sub topic by composite key', async () => {
      const deleted = { id: 1, topic_id: 1 };

      (prisma.sub_Topic.delete as jest.Mock).mockResolvedValue(deleted);

      const result = await service.remove(1, 1);

      expect(prisma.sub_Topic.delete).toHaveBeenCalledWith({
        where: { id_topic_id: { id: 1, topic_id: 1 } },
      });

      expect(result).toEqual(deleted);
    });
  });
});
