import { Test, TestingModule } from '@nestjs/testing';
import { HeadTeacherController } from './head_teacher.controller';
import { HeadTeacherService } from './head_teacher.service';

describe('HeadTeacherController', () => {
  let controller: HeadTeacherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeadTeacherController],
      providers: [HeadTeacherService],
    }).compile();

    controller = module.get<HeadTeacherController>(HeadTeacherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
