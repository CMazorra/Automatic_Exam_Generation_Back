import { Test, TestingModule } from '@nestjs/testing';
import { SubjectService } from './subject.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SubjectService', () => {
  let service: SubjectService;
  let prisma: PrismaService;

  const prismaMock = {
    subject: {
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
        SubjectService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<SubjectService>(SubjectService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a subject', async () => {
      const dto = {
        name: 'Matemáticas',
        head_teacher_id: 1,
      };

      (prisma.subject.create as jest.Mock).mockResolvedValue(dto);

      const result = await service.create(dto as any);

      expect(prisma.subject.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(dto);
    });
  });

  describe('findAll', () => {
    it('should return all subjects with head_teacher', async () => {
      const subjects = [
        {
          id: 1,
          name: 'Historia',
          head_teacher: { id: 1 },
        },
      ];

      (prisma.subject.findMany as jest.Mock).mockResolvedValue(subjects);

      const result = await service.findAll();

      expect(prisma.subject.findMany).toHaveBeenCalledWith({
        include: { head_teacher: true },
      });

      expect(result).toEqual(subjects);
    });
  });

  describe('findOne', () => {
    it('should return a subject by id', async () => {
      const subject = {
        id: 1,
        name: 'Física',
        head_teacher: { id: 2 },
      };

      (prisma.subject.findUnique as jest.Mock).mockResolvedValue(subject);

      const result = await service.findOne(1);

      expect(prisma.subject.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { head_teacher: true },
      });

      expect(result).toEqual(subject);
    });
  });

  describe('update', () => {
    it('should update a subject', async () => {
      const updated = {
        id: 1,
        name: 'Química',
      };

      (prisma.subject.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update(1, { name: 'Química' } as any);

      expect(prisma.subject.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Química' },
      });

      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a subject', async () => {
      const deleted = { id: 1 };

      (prisma.subject.delete as jest.Mock).mockResolvedValue(deleted);

      const result = await service.remove(1);

      expect(prisma.subject.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual(deleted);
    });
  });

  describe('getTeachersBySubject', () => {
    it('should return teachers of a subject', async () => {
      const teachers = [
        { id: 1, user: { name: 'Juan' } },
        { id: 2, user: { name: 'Ana' } },
      ];

      (prisma.subject.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        teachers,
      });

      const result = await service.getTeachersBySubject(1);

      expect(prisma.subject.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          teachers: {
            include: {
              user: true,
            },
          },
        },
      });

      expect(result).toEqual(teachers);
    });

    it('should throw NotFoundException if subject does not exist', async () => {
      (prisma.subject.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getTeachersBySubject(99)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getSubjectStudents', () => {
    it('should return students of a subject', async () => {
      const response = {
        id: 1,
        name: 'Biología',
        students: [
          {
            id: 1,
            user: {
              name: 'Carlos',
              account: 'A123',
              age: 20,
            },
          },
        ],
      };

      (prisma.subject.findUnique as jest.Mock).mockResolvedValue(response);

      const result = await service.getSubjectStudents(1);

      expect(prisma.subject.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          name: true,
          students: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  account: true,
                  age: true,
                },
              },
            },
          },
        },
      });

      expect(result).toEqual(response);
    });
  });
});
