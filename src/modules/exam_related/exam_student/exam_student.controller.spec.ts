import { Test, TestingModule } from '@nestjs/testing';
import { ExamStudentController } from './exam_student.controller';
import { ExamStudentService } from './exam_student.service';

describe('ExamStudentController', () => {
  let controller: ExamStudentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamStudentController],
      providers: [ExamStudentService],
    }).compile();

    controller = module.get<ExamStudentController>(ExamStudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
