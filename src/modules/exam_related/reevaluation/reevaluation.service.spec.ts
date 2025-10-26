import { Test, TestingModule } from '@nestjs/testing';
import { ReevaluationService } from './reevaluation.service';

describe('ReevaluationService', () => {
  let service: ReevaluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReevaluationService],
    }).compile();

    service = module.get<ReevaluationService>(ReevaluationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
