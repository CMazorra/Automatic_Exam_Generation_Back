import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));


describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const prismaMock = {
    user: {
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
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
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
  it('should create a user with hashed password', async () => {
    const dto: CreateUserDto = {
        name: 'John',
        password: '1234',
        account: 'john123',
        age: 20,
        course: 'Matemáticas',
        role: Role.STUDENT,
      };

     const hashed = 'hashedPassword';
     (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashed);

     prisma.user.create = jest.fn().mockResolvedValue({ ...dto, password: hashed, id_us: 1 });


    const result = await service.create(dto);

    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 'salt');
    expect(prisma.user.create).toHaveBeenCalledWith({ data: { ...dto, password: hashed } });
    expect(result.password).toBe(hashed);
  });

  // ----------------------------
  // findAll / findAllAll / findAllDelete
  // ----------------------------
  it('should return all active users', async () => {
    const users = [{ id_us: 1, name: 'John', isActive: true }];
    prisma.user.findMany = jest.fn().mockResolvedValue(users);

    const result = await service.findAll();

    expect(result).toEqual(users);
    expect(prisma.user.findMany).toHaveBeenCalledWith({ where: { isActive: true } });
  });

  it('should return all users regardless of isActive', async () => {
    const users = [{ id_us: 1, name: 'John', isActive: true }];
    prisma.user.findMany = jest.fn().mockResolvedValue(users);

    const result = await service.findAllAll();

    expect(result).toEqual(users);
    expect(prisma.user.findMany).toHaveBeenCalledWith();
  });

  it('should return deleted users', async () => {
    const users = [{ id_us: 1, name: 'John', isActive: false }];
    prisma.user.findMany = jest.fn().mockResolvedValue(users);

    const result = await service.findAllDelete();

    expect(result).toEqual(users);
    expect(prisma.user.findMany).toHaveBeenCalledWith({ where: { isActive: false } });
  });

  // ----------------------------
  // findOne / findOneAll / findOneDelete
  // ----------------------------
  it('should find one active user by id', async () => {
    const user = { id_us: 1, name: 'John', isActive: true };
    prisma.user.findFirst = jest.fn().mockResolvedValue(user);

    const result = await service.findOne(1);

    expect(result).toEqual(user);
    expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { id_us: 1, isActive: true } });
  });

  it('should find one user regardless of isActive', async () => {
    const user = { id_us: 1, name: 'John', isActive: true };
    prisma.user.findUnique = jest.fn().mockResolvedValue(user);

    const result = await service.findOneAll(1);

    expect(result).toEqual(user);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id_us: 1 } });
  });

  it('should find one deleted user by id', async () => {
    const user = { id_us: 1, name: 'John', isActive: false };
    prisma.user.findFirst = jest.fn().mockResolvedValue(user);

    const result = await service.findOneDelete(1);

    expect(result).toEqual(user);
    expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { id_us: 1, isActive: false } });
  });

  // ----------------------------
  // update
  // ----------------------------
  it('should update user and hash new password', async () => {
  const updateDto = { password: 'newpass' };
  const hashed = 'hashedNewPass';

  (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashed);

  prisma.user.update = jest.fn().mockResolvedValue({ id_us: 1, password: hashed });

  const result = await service.update(1, updateDto);

  expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 'salt');
  expect(prisma.user.update).toHaveBeenCalledWith({
    where: { id_us: 1 },
    data: { password: hashed },
  });
  expect(result.password).toBe(hashed);
});


  // ----------------------------
  // remove / restore
  // ----------------------------
  it('should deactivate a user', async () => {
    const user = { id_us: 1, isActive: false };
    prisma.user.update = jest.fn().mockResolvedValue(user);

    const result = await service.remove(1);

    expect(result).toEqual(user);
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id_us: 1 }, data: { isActive: false } });
  });

  it('should restore a user', async () => {
    const user = { id_us: 1, isActive: true };
    prisma.user.update = jest.fn().mockResolvedValue(user);

    const result = await service.restore(1);

    expect(result).toEqual(user);
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id_us: 1 }, data: { isActive: true } });
  });
});
