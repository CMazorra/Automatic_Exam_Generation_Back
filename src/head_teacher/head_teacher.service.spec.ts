import { Test, TestingModule } from '@nestjs/testing';
import { HeadTeacherService } from './head_teacher.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HeadTeacherService', () => {
  let service: HeadTeacherService;

  const prismaMock = {
    head_Teacher: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    teacher: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeadTeacherService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<HeadTeacherService>(HeadTeacherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a head teacher', async () => {
    const dto = { teacherId: 1 };
    prismaMock.head_Teacher.create.mockResolvedValue(dto);

    const result = await service.create(dto as any);

    expect(prismaMock.head_Teacher.create).toHaveBeenCalledWith({ data: dto });
    expect(result).toEqual(dto);
  });

  it('should return all active head teachers', async () => {
    const resultMock = [{ id: 1 }];
    prismaMock.head_Teacher.findMany.mockResolvedValue(resultMock);

    const result = await service.findAll();

    expect(prismaMock.head_Teacher.findMany).toHaveBeenCalled();
    expect(result).toEqual(resultMock);
  });

  it('should return all head teachers (including inactive)', async () => {
    const resultMock = [{ id: 1 }];
    prismaMock.head_Teacher.findMany.mockResolvedValue(resultMock);

    const result = await service.findAllAll();

    expect(prismaMock.head_Teacher.findMany).toHaveBeenCalled();
    expect(result).toEqual(resultMock);
  });

  it('should return all deleted head teachers', async () => {
    const resultMock = [{ id: 1 }];
    prismaMock.head_Teacher.findMany.mockResolvedValue(resultMock);

    const result = await service.findAllDeleted();

    expect(prismaMock.head_Teacher.findMany).toHaveBeenCalled();
    expect(result).toEqual(resultMock);
  });

  it('should find one active head teacher', async () => {
    const resultMock = { id: 1 };
    prismaMock.head_Teacher.findFirst.mockResolvedValue(resultMock);

    const result = await service.findOne(1);

    expect(prismaMock.head_Teacher.findFirst).toHaveBeenCalled();
    expect(result).toEqual(resultMock);
  });

  it('should find one head teacher regardless of status', async () => {
    const resultMock = { id: 1 };
    prismaMock.head_Teacher.findUnique.mockResolvedValue(resultMock);

    const result = await service.findOneAll(1);

    expect(prismaMock.head_Teacher.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { teacher: { include: { user: true } } },
    });
    expect(result).toEqual(resultMock);
  });

  it('should find one deleted head teacher', async () => {
    const resultMock = { id: 1 };
    prismaMock.head_Teacher.findFirst.mockResolvedValue(resultMock);

    const result = await service.findOneDelete(1);

    expect(prismaMock.head_Teacher.findFirst).toHaveBeenCalled();
    expect(result).toEqual(resultMock);
  });

  it('should update a head teacher', async () => {
    const dto = { teacherId: 2 };
    prismaMock.head_Teacher.update.mockResolvedValue(dto);

    const result = await service.update(1, dto as any);

    expect(prismaMock.head_Teacher.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
    expect(result).toEqual(dto);
  });

  it('should remove a head teacher', async () => {
    prismaMock.teacher.update.mockResolvedValue({});

    await service.remove(1);

    expect(prismaMock.teacher.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isHeadTeacher: false },
    });
  });

  it('should restore a head teacher', async () => {
    prismaMock.teacher.update.mockResolvedValue({});

    await service.restore(1);

    expect(prismaMock.teacher.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isHeadTeacher: true },
    });
  });
});
