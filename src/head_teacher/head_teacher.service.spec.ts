import { Test, TestingModule } from '@nestjs/testing';
import { HeadTeacherService } from './head_teacher.service';

describe('HeadTeacherService', () => {
  let service: HeadTeacherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeadTeacherService],
    }).compile();

    service = module.get<HeadTeacherService>(HeadTeacherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
