import { Test, TestingModule } from '@nestjs/testing';
import { ApprovedExamController } from './approved_exam.controller';
import { approved_examService } from './approved_exam.service';

describe('ApprovedExamController', () => {
  let controller: ApprovedExamController;
  let service: approved_examService;

  const approvedExamServiceMock = {
    create: jest.fn(),
    listApprovedByHeadTeacher: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApprovedExamController],
      providers: [
        {
          provide: approved_examService,
          useValue: approvedExamServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ApprovedExamController>(ApprovedExamController);
    service = module.get<approved_examService>(approved_examService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create on service', async () => {
    const dto = {} as any;
    approvedExamServiceMock.create.mockResolvedValue(dto);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should call listApprovedByHeadTeacher with id', async () => {
    await controller.listApprovedByHeadTeacher(5);

    expect(service.listApprovedByHeadTeacher).toHaveBeenCalledWith(5);
  });

  it('should call findAll', async () => {
    approvedExamServiceMock.findAll.mockResolvedValue([]);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should call findOne with parsed params', async () => {
    const date = '2024-01-01';

    await controller.findOne(date, '1', '2');

    expect(service.findOne).toHaveBeenCalledWith(
      new Date(date),
      1,
      2,
    );
  });

  it('should call update with parsed params and dto', async () => {
    const date = '2024-01-01';
    const dto = {} as any;

    await controller.update(date, '1', '2', dto);

    expect(service.update).toHaveBeenCalledWith(
      new Date(date),
      1,
      2,
      dto,
    );
  });

  it('should call remove with parsed params', async () => {
    const date = '2024-01-01';

    await controller.remove(date, '1', '2');

    expect(service.remove).toHaveBeenCalledWith(
      new Date(date),
      1,
      2,
    );
  });
});
