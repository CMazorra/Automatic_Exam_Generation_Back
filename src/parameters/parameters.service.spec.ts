import { Test, TestingModule } from '@nestjs/testing';
import { ParametersService } from './parameters.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ParametersService', () => {
  let service: ParametersService;
  let prisma: PrismaService;

  const prismaMock = {
    parameters: {
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
        ParametersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ParametersService>(ParametersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create parameters', async () => {
    const dto = { maxQuestions: 10 } as any;

    (prisma.parameters.create as jest.Mock).mockResolvedValue(dto);

    const result = await service.create(dto);

    expect(prisma.parameters.create).toHaveBeenCalledWith({ data: dto });
    expect(result).toEqual(dto);
  });

  it('should find all parameters', async () => {
    const data = [{ id: 1 }, { id: 2 }];

    (prisma.parameters.findMany as jest.Mock).mockResolvedValue(data);

    const result = await service.findAll();

    expect(result).toEqual(data);
  });

  it('should find one parameter', async () => {
    const param = { id: 1 };

    (prisma.parameters.findUnique as jest.Mock).mockResolvedValue(param);

    const result = await service.findOne(1);

    expect(prisma.parameters.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(param);
  });

  it('should update parameters', async () => {
    const dto = { maxQuestions: 20 };

    (prisma.parameters.update as jest.Mock).mockResolvedValue({
      id: 1,
      ...dto,
    });

    const result = await service.update(1, dto as any);

    expect(prisma.parameters.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should delete parameters', async () => {
    (prisma.parameters.delete as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await service.remove(1);

    expect(prisma.parameters.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual({ id: 1 });
  });
});
