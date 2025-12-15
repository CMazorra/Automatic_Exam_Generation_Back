import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { StudentService } from '../student/student.service';
import { TeacherService } from '../teacher/teacher.service';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UserService', () => {
  let service: UserService;

  const prismaMock = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    teacher: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const studentServiceMock = {
    create: jest.fn(),
  };

  const teacherServiceMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: StudentService, useValue: studentServiceMock },
        { provide: TeacherService, useValue: teacherServiceMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ----------------------------
  // CREATE
  // ----------------------------
  it('should create a STUDENT user and call studentService', async () => {
    const dto: CreateUserDto = {
      name: 'John',
      password: '1234',
      account: 'john123',
      age: 20,
      course: 'Math',
      role: Role.STUDENT,
    };

    const hashed = 'hashedPassword';
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashed);

    prismaMock.user.create.mockResolvedValue({ ...dto, password: hashed, id_us: 1 });

    const result = await service.create(dto);

    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 'salt');
    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: { ...dto, password: hashed } });
    expect(studentServiceMock.create).toHaveBeenCalledWith({ id: 1 });
    expect(result.password).toBe(hashed);
  });

  it('should create a TEACHER user and call teacherService', async () => {
    const dto: CreateUserDto = {
      name: 'Carlos',
      password: '1234',
      account: 'carlos01',
      age: 30,
      course: 'Math',
      role: Role.TEACHER,
    };

    const teacherDto = { specialty: 'Algebra', isHeadTeacher: false };

    const hashed = 'hashedPassword';
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashed);

    prismaMock.user.create.mockResolvedValue({ ...dto, password: hashed, id_us: 2 });

    const result = await service.create(dto, teacherDto as any);

    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 'salt');
    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: { ...dto, password: hashed } });
    expect(teacherServiceMock.create).toHaveBeenCalledWith({ id: 2, ...teacherDto });
    expect(result.password).toBe(hashed);
  });

  // ----------------------------
  // FIND ALL
  // ----------------------------
  it('should return all active users', async () => {
    const users = [{ id_us: 1, name: 'John', isActive: true }];
    prismaMock.user.findMany.mockResolvedValue(users);

    const result = await service.findAll();

    expect(result).toEqual(users);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({ where: { isActive: true } });
  });

  it('should return all users regardless of isActive', async () => {
    const users = [{ id_us: 1, name: 'John', isActive: true }];
    prismaMock.user.findMany.mockResolvedValue(users);

    const result = await service.findAllAll();

    expect(result).toEqual(users);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith();
  });

  it('should return deleted users', async () => {
    const users = [{ id_us: 1, name: 'John', isActive: false }];
    prismaMock.user.findMany.mockResolvedValue(users);

    const result = await service.findAllDelete();

    expect(result).toEqual(users);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({ where: { isActive: false } });
  });

  // ----------------------------
  // FIND ONE
  // ----------------------------
  it('should find one active user by id', async () => {
    const user = { id_us: 1, name: 'John', isActive: true };
    prismaMock.user.findFirst.mockResolvedValue(user);

    const result = await service.findOne(1);

    expect(result).toEqual(user);
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { id_us: 1, isActive: true } });
  });

  it('should find one user regardless of isActive', async () => {
    const user = { id_us: 1, name: 'John', isActive: true };
    prismaMock.user.findUnique.mockResolvedValue(user);

    const result = await service.findOneAll(1);

    expect(result).toEqual(user);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id_us: 1 } });
  });

  it('should find one deleted user by id', async () => {
    const user = { id_us: 1, name: 'John', isActive: false };
    prismaMock.user.findFirst.mockResolvedValue(user);

    const result = await service.findOneDelete(1);

    expect(result).toEqual(user);
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { id_us: 1, isActive: false } });
  });

  // ----------------------------
  // UPDATE
  // ----------------------------
  it('should update user password and teacher specialty if provided', async () => {
    const updateDto: UpdateUserDto = { password: 'newpass', specialty: 'Physics' };
    const hashed = 'hashedNewPass';

    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashed);

    prismaMock.user.findUnique.mockResolvedValue({ id_us: 1, role: Role.TEACHER });
    prismaMock.teacher.findUnique.mockResolvedValue({ id: 1, specialty: 'Math' });
    prismaMock.teacher.update.mockResolvedValue({ id: 1, specialty: 'Physics' });
    prismaMock.user.update.mockResolvedValue({ id_us: 1, password: hashed });

    const result = await service.update(1, updateDto);

    expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 'salt');
    expect(prismaMock.teacher.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { specialty: 'Physics' },
    });
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id_us: 1 },
      data: { password: hashed },
    });
    expect(result.password).toBe(hashed);
  });

  // ----------------------------
  // REMOVE / RESTORE
  // ----------------------------
  it('should deactivate a user', async () => {
    const user = { id_us: 1, isActive: false };
    prismaMock.user.update.mockResolvedValue(user);

    const result = await service.remove(1);

    expect(result).toEqual(user);
    expect(prismaMock.user.update).toHaveBeenCalledWith({ where: { id_us: 1 }, data: { isActive: false } });
  });

  it('should restore a user', async () => {
    const user = { id_us: 1, isActive: true };
    prismaMock.user.update.mockResolvedValue(user);

    const result = await service.restore(1);

    expect(result).toEqual(user);
    expect(prismaMock.user.update).toHaveBeenCalledWith({ where: { id_us: 1 }, data: { isActive: true } });
  });
});
