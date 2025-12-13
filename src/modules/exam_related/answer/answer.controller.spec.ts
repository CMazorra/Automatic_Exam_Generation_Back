import { Test, TestingModule } from '@nestjs/testing';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';

describe('AnswerController', () => {
  let controller: AnswerController;
  let service: AnswerService;

  const answerServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    getAnswerByStudent: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerController],
      providers: [
        {
          provide: AnswerService,
          useValue: answerServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AnswerController>(AnswerController);
    service = module.get<AnswerService>(AnswerService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create on service', async () => {
    const dto = {} as any;
    answerServiceMock.create.mockResolvedValue(dto);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should call findAll on service', async () => {
    answerServiceMock.findAll.mockResolvedValue([]);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should call findOne with parsed params', async () => {
    await controller.findOne('1', '2', '3');

    expect(service.findOne).toHaveBeenCalledWith(1, 2, 3);
  });

  it('should call getAnswerByStudent', async () => {
    await controller.findByExamAndStudent('1', '2');

    expect(service.getAnswerByStudent).toHaveBeenCalledWith(1, 2);
  });

  it('should call update with parsed params and dto', async () => {
    const dto = {} as any;

    await controller.update('1', '2', '3', dto);

    expect(service.update).toHaveBeenCalledWith(1, 2, 3, dto);
  });

  it('should call remove with parsed params', async () => {
    await controller.remove('1', '2', '3');

    expect(service.remove).toHaveBeenCalledWith(1, 2, 3);
  });
});
