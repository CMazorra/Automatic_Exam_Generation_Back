import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

describe('StudentService', () => {
  let service: StudentService;
  let prisma: PrismaService;

  const prismaMock = {
    student: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
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
  it('should create a student', async () => {
    const dto: CreateStudentDto = { id: 1 };
    const result = { ...dto };
    prisma.student.create = jest.fn().mockResolvedValue(result);

    expect(await service.create(dto)).toEqual(result);
    expect(prisma.student.create).toHaveBeenCalledWith({ data: dto });
  });

  // ----------------------------
  // findAll / findAllAll / findAllDeleted
  // ----------------------------
  it('should return all active students', async () => {
    const result = [{ id: 1, user: { isActive: true } }];
    prisma.student.findMany = jest.fn().mockResolvedValue(result);

    expect(await service.findAll()).toEqual(result);
    expect(prisma.student.findMany).toHaveBeenCalledWith({ where: { user: { isActive: true } }, include: { user: true } });
  });

  it('should return all students', async () => {
    const result = [{ id: 1 }];
    prisma.student.findMany = jest.fn().mockResolvedValue(result);

    expect(await service.findAllAll()).toEqual(result);
    expect(prisma.student.findMany).toHaveBeenCalledWith({ include: { user: true } });
  });

  it('should return all deleted students', async () => {
    const result = [{ id: 1, user: { isActive: false } }];
    prisma.student.findMany = jest.fn().mockResolvedValue(result);

    expect(await service.findAllDeleted()).toEqual(result);
    expect(prisma.student.findMany).toHaveBeenCalledWith({ where: { user: { isActive: false } }, include: { user: true } });
  });

  // ----------------------------
  // findOne variants
  // ----------------------------
  it('should find one active student by id', async () => {
    const result = { id: 1, user: { isActive: true } };
    prisma.student.findFirst = jest.fn().mockResolvedValue(result);

    expect(await service.findOne(1)).toEqual(result);
    expect(prisma.student.findFirst).toHaveBeenCalledWith({ where: { id: 1, user: { isActive: true } }, include: { user: true } });
  });

  it('should find one student regardless of status', async () => {
    const result = { id: 1 };
    prisma.student.findUnique = jest.fn().mockResolvedValue(result);

    expect(await service.findOneAll(1)).toEqual(result);
    expect(prisma.student.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { user: true } });
  });

  it('should find one deleted student by id', async () => {
    const result = { id: 1, user: { isActive: false } };
    prisma.student.findFirst = jest.fn().mockResolvedValue(result);

    expect(await service.findOneDeleted(1)).toEqual(result);
    expect(prisma.student.findFirst).toHaveBeenCalledWith({ where: { id: 1, user: { isActive: false } }, include: { user: true } });
  });

  // ----------------------------
  //  remove / restore
  // ----------------------------

  it('should deactivate a student', async () => {
    const result = { id: 1, user: { isActive: false } };
    prisma.student.update = jest.fn().mockResolvedValue(result);

    expect(await service.remove(1)).toEqual(result);
    expect(prisma.student.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { user: { update: { isActive: false } } } });
  });

  it('should restore a student', async () => {
    const result = { id: 1, user: { isActive: true } };
    prisma.student.update = jest.fn().mockResolvedValue(result);

    expect(await service.restore(1)).toEqual(result);
    expect(prisma.student.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { user: { update: { isActive: true } } } });
  });

  // ----------------------------
  // getStudentSubjects
  // ----------------------------
  it('should return subjects of a student', async () => {
    const result = { id: 1, subjects: [{ id: 1, name: 'Math' }] };
    prisma.student.findUnique = jest.fn().mockResolvedValue(result);

    expect(await service.getStudentSubjects(1)).toEqual(result);
    expect(prisma.student.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: {
        id: true,
        subjects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  });
});
