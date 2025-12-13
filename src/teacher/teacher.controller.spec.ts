import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Role } from '@prisma/client';

describe('TeacherController', () => {
  let controller: TeacherController;
  let service: TeacherService;

  const mockTeacherService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllAll: jest.fn(),
    findAllDeleted: jest.fn(),
    findOne: jest.fn(),
    findOneAll: jest.fn(),
    findOneDeleted: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
    getSubjectsByTeacher: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [{ provide: TeacherService, useValue: mockTeacherService }],
    }).compile();

    controller = module.get<TeacherController>(TeacherController);
    service = module.get<TeacherService>(TeacherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ----------------------------
  // create
  // ----------------------------
  it('should create a teacher', async () => {
    const dto: CreateTeacherDto = { id: 1, specialty: 'Ingeneria' };
    const result = { ...dto };
    mockTeacherService.create.mockResolvedValue(result);

    expect(await controller.create(dto)).toEqual(result);
    expect(mockTeacherService.create).toHaveBeenCalledWith(dto);
  });

  // ----------------------------
  // findAll / findAllAll / findAllDeleted
  // ----------------------------
  it('should return all active teachers', async () => {
    const result = [{ id: 1 }];
    mockTeacherService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toEqual(result);
    expect(mockTeacherService.findAll).toHaveBeenCalled();
  });

  it('should return all teachers', async () => {
    const result = [{ id: 1 }];
    mockTeacherService.findAllAll.mockResolvedValue(result);

    expect(await controller.findAllAll()).toEqual(result);
    expect(mockTeacherService.findAllAll).toHaveBeenCalled();
  });

  it('should return all deleted teachers', async () => {
    const result = [{ id: 1 }];
    mockTeacherService.findAllDeleted.mockResolvedValue(result);

    expect(await controller.findAllDeleted()).toEqual(result);
    expect(mockTeacherService.findAllDeleted).toHaveBeenCalled();
  });

  // ----------------------------
  // findOne variants
  // ----------------------------
  it('should find one active teacher by id', async () => {
    const result = { id: 1 };
    mockTeacherService.findOne.mockResolvedValue(result);

    expect(await controller.findOne('1')).toEqual(result);
    expect(mockTeacherService.findOne).toHaveBeenCalledWith(1);
  });

  it('should find one teacher regardless of status', async () => {
    const result = { id: 1 };
    mockTeacherService.findOneAll.mockResolvedValue(result);

    expect(await controller.findOneAll('1')).toEqual(result);
    expect(mockTeacherService.findOneAll).toHaveBeenCalledWith(1);
  });

  it('should find one deleted teacher by id', async () => {
    const result = { id: 1 };
    mockTeacherService.findOneDeleted.mockResolvedValue(result);

    expect(await controller.findOneDeleted('1')).toEqual(result);
    expect(mockTeacherService.findOneDeleted).toHaveBeenCalledWith(1);
  });

  // ----------------------------
  // update / remove / restore
  // ----------------------------
  it('should update a teacher', async () => {
    const dto: UpdateTeacherDto = { specialty: 'value' };
    const result = { id: 1, ...dto };
    mockTeacherService.update.mockResolvedValue(result);

    expect(await controller.update('1', dto)).toEqual(result);
    expect(mockTeacherService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should deactivate a teacher', async () => {
    const result = { id: 1 };
    mockTeacherService.remove.mockResolvedValue(result);

    expect(await controller.remove('1')).toEqual(result);
    expect(mockTeacherService.remove).toHaveBeenCalledWith(1);
  });

  it('should restore a teacher', async () => {
    const result = { id: 1 };
    mockTeacherService.restore.mockResolvedValue(result);

    expect(await controller.restore('1')).toEqual(result);
    expect(mockTeacherService.restore).toHaveBeenCalledWith(1);
  });

  // ----------------------------
  // getSubjectsByTeacher
  // ----------------------------
  it('should return subjects as teacher and as head', async () => {
    const result = { subjectsAsTeacher: ['Math'], subjectsAsHead: ['Biology'] };
    mockTeacherService.getSubjectsByTeacher.mockResolvedValue(result);

    expect(await controller.getSubjects('1')).toEqual(result);
    expect(mockTeacherService.getSubjectsByTeacher).toHaveBeenCalledWith(1);
  });
});
