import { Test, TestingModule } from '@nestjs/testing';
import { ExamStudentController } from './exam_student.controller';
import { ExamStudentService } from './exam_student.service';

describe('ExamStudentController', () => {
  let controller: ExamStudentController;
  let service: ExamStudentService;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamStudentController],
      providers: [{ provide: ExamStudentService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ExamStudentController>(ExamStudentController);
    service = module.get<ExamStudentService>(ExamStudentService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    const dto = {} as any;
    serviceMock.create.mockResolvedValue(dto);
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should call findAll', async () => {
    serviceMock.findAll.mockResolvedValue([]);
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should call findOne with parsed params', async () => {
    await controller.findOne(1, 2);
    expect(service.findOne).toHaveBeenCalledWith(1, 2);
  });

  it('should call update with parsed params', async () => {
    const dto = {} as any;
    await controller.update(1, 2, dto);
    expect(service.update).toHaveBeenCalledWith(1, 2, dto);
  });

  it('should call remove with parsed params', async () => {
    await controller.remove(1, 2);
    expect(service.remove).toHaveBeenCalledWith(1, 2);
  });
});
