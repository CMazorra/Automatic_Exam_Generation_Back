import { Test, TestingModule } from '@nestjs/testing';
import '@jest/globals';
import { TeacherService } from './teacher.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

describe('TeacherService', () => {
  let service: TeacherService;
  let prisma: PrismaService;

 const prismaMock: Partial<jest.Mocked<PrismaService>> = {
  teacher: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  } as any,
  head_Teacher: {
    findFirst: jest.fn(),
  } as any,
};


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ----------------------------
  // create
  // ----------------------------
  it('should create a teacher', async () => {
    const dto: CreateTeacherDto = { id: 1, specialty: "Ingeneria" };
    const result = {...dto };
    prisma.teacher.create = jest.fn().mockResolvedValue(result);

    expect(await service.create(dto)).toEqual(result);
    expect(prisma.teacher.create).toHaveBeenCalledWith({ data: dto });
  });

  // ----------------------------
  // findAll / findAllAll / findAllDeleted
  // ----------------------------
  it('should return all active teachers', async () => {
    const result = [{ id: 1, user: { isActive: true } }];
    prisma.teacher.findMany = jest.fn().mockResolvedValue(result);

    expect(await service.findAll()).toEqual(result);
    expect(prisma.teacher.findMany).toHaveBeenCalledWith({ where: { user: { isActive: true } }, include: { user: true } });
  });

  it('should return all teachers', async () => {
    const result = [{ id: 1 }];
    prisma.teacher.findMany = jest.fn().mockResolvedValue(result);

    expect(await service.findAllAll()).toEqual(result);
    expect(prisma.teacher.findMany).toHaveBeenCalledWith({ include: { user: true } });
  });

  it('should return all deleted teachers', async () => {
    const result = [{ id: 1, user: { isActive: false } }];
    prisma.teacher.findMany = jest.fn().mockResolvedValue(result);

    expect(await service.findAllDeleted()).toEqual(result);
    expect(prisma.teacher.findMany).toHaveBeenCalledWith({ where: { user: { isActive: false } }, include: { user: true } });
  });

  // ----------------------------
  // findOne variants
  // ----------------------------
  it('should find one active teacher by id', async () => {
    const result = { id: 1, user: { isActive: true } };
    prisma.teacher.findFirst = jest.fn().mockResolvedValue(result);

    expect(await service.findOne(1)).toEqual(result);
    expect(prisma.teacher.findFirst).toHaveBeenCalledWith({ where: { id: 1, user: { isActive: true } }, include: { user: true } });
  });

  it('should find one teacher regardless of status', async () => {
    const result = { id: 1 };
    prisma.teacher.findUnique = jest.fn().mockResolvedValue(result);

    expect(await service.findOneAll(1)).toEqual(result);
    expect(prisma.teacher.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { user: true } });
  });

  it('should find one deleted teacher by id', async () => {
    const result = { id: 1, user: { isActive: false } };
    prisma.teacher.findFirst =  jest.fn().mockResolvedValue(result);

    expect(await service.findOneDeleted(1)).toEqual(result);
    expect(prisma.teacher.findFirst).toHaveBeenCalledWith({ where: { id: 1, user: { isActive: false } }, include: { user: true } });
  });

  // ----------------------------
  // update
  // ----------------------------
  it('should update a teacher', async () => {
    const dto: UpdateTeacherDto = { specialty: 'value' };
    const result = { id: 1, ...dto };
    prisma.teacher.update = jest.fn().mockResolvedValue(result);

    expect(await service.update(1, dto)).toEqual(result);
    expect(prisma.teacher.update).toHaveBeenCalledWith({ where: { id: 1 }, data: dto });
  });

  it('should deactivate a teacher', async () => {
    const result = { id: 1, user: { isActive: false } };
    prisma.teacher.update = jest.fn().mockResolvedValue(result);

    expect(await service.remove(1)).toEqual(result);
    expect(prisma.teacher.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { user: { update: { isActive: false } } } });
  });

  it('should restore a teacher', async () => {
    const result = { id: 1, user: { isActive: true } };
    prisma.teacher.update = jest.fn().mockResolvedValue(result);

    expect(await service.restore(1)).toEqual(result);
    expect(prisma.teacher.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { user: { update: { isActive: true } } } });
  });

  // ----------------------------
  // getSubjectsByTeacher
  // ----------------------------
  it('should return subjects as teacher and as head', async () => {
    const teacherData = { subjects: ['Math', 'Physics'] };
    const headTeacherData = { subject: ['Biology'] };

    prisma.teacher.findUnique = jest.fn().mockResolvedValue(teacherData as any);
    prisma.head_Teacher.findFirst = jest.fn().mockResolvedValue(headTeacherData as any);

    const result = await service.getSubjectsByTeacher(1);

    expect(result).toEqual({
      subjectsAsTeacher: ['Math', 'Physics'],
      subjectsAsHead: ['Biology'],
    });
    expect(prisma.teacher.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { subjects: true } });
    expect(prisma.head_Teacher.findFirst).toHaveBeenCalledWith({ where: { id: 1 }, include: { subject: true } });
  });

});
