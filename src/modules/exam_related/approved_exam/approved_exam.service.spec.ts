import { Test, TestingModule } from '@nestjs/testing';
import { approved_examService } from './approved_exam.service';

describe('ApprovedExamService', () => {
  let service: approved_examService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [approved_examService],
    }).compile();

    service = module.get<approved_examService>(approved_examService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
