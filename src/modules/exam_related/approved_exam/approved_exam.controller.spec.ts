import { Test, TestingModule } from '@nestjs/testing';
import { ApprovedExamController } from './approved_exam.controller';
import { approved_examService } from './approved_exam.service';

describe('ApprovedExamController', () => {
  let controller: ApprovedExamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApprovedExamController],
      providers: [approved_examService],
    }).compile();

    controller = module.get<ApprovedExamController>(ApprovedExamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
