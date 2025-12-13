import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------------------------
  // LOGIN
  // -------------------------
  it('should login successfully', async () => {
    const userMock = {
      id_us: 1,
      account: 'admin',
      password: 'hashedPassword',
      role: Role.TEACHER,
      isActive: true,
      teachers: [{ isHeadTeacher: true }],
      students: [],
    };

    prisma.user.findUnique = jest.fn().mockResolvedValue(userMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign = jest.fn().mockReturnValue('fake-jwt-token');

    const result = await service.login('admin', 'password123');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { account: 'admin' },
      include: { teachers: true, students: true },
    });

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', userMock.password);

    expect(jwtService.sign).toHaveBeenCalledWith({
      id: userMock.id_us,
      account: userMock.account,
      role: userMock.role,
      headTeacher: true,
    });

    expect(result).toEqual({
      user: userMock,
      headTeacher: true,
      token: 'fake-jwt-token',
    });
  });

  it('should throw error if user does not exist', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.login('admin', 'password'))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should throw error if user is inactive', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue({
      isActive: false,
    });

    await expect(service.login('admin', 'password'))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should throw error if password is incorrect', async () => {
    const userMock = {
      id_us: 1,
      account: 'admin',
      password: 'hashedPassword',
      role: Role.ADMIN,
      isActive: true,
      teachers: [],
      students: [],
    };

    prisma.user.findUnique = jest.fn().mockResolvedValue(userMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login('admin', 'wrongpassword'))
      .rejects
      .toThrow(UnauthorizedException);
  });

  // -------------------------
  // LOGOUT
  // -------------------------
  it('should logout correctly', async () => {
    const result = await service.logout();

    expect(result).toEqual({
      message: 'Sesión cerrada',
      clearCookie: true,
    });
  });
});
