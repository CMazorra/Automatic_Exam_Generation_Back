import { Test, TestingModule } from '@nestjs/testing';
import { ExamQuestionController } from './exam_question.controller';
import { ExamQuestionService } from './exam_question.service';

describe('ExamQuestionController', () => {
  let controller: ExamQuestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamQuestionController],
      providers: [ExamQuestionService],
    }).compile();

    controller = module.get<ExamQuestionController>(ExamQuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
