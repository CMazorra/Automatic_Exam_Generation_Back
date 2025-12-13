import { Test, TestingModule } from '@nestjs/testing';
import { ExamQuestionController } from './exam_question.controller';
import { ExamQuestionService } from './exam_question.service';

describe('ExamQuestionController', () => {
  let controller: ExamQuestionController;
  let service: ExamQuestionService;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    listMostUsedQuestions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamQuestionController],
      providers: [
        { provide: ExamQuestionService, useValue: serviceMock },
      ],
    }).compile();

    controller = module.get<ExamQuestionController>(ExamQuestionController);
    service = module.get<ExamQuestionService>(ExamQuestionService);

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
  await controller.findOne('1', '2');
  expect(service.findOne).toHaveBeenCalledWith(1, 2);
});

it('should call update with parsed params', async () => {
  const dto = {} as any;
  await controller.update('1', '2', dto);
  expect(service.update).toHaveBeenCalledWith(1, 2, dto);
});

it('should call remove with parsed params', async () => {
  await controller.remove('1', '2');
  expect(service.remove).toHaveBeenCalledWith(1, 2);
});

  it('should call listMostUsedQuestions', async () => {
    serviceMock.listMostUsedQuestions.mockResolvedValue([]);
    const result = await controller.mostUsedQuestions();
    expect(service.listMostUsedQuestions).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
