import { Test, TestingModule } from '@nestjs/testing';
import { ReevaluationController } from './reevaluation.controller';
import { ReevaluationService } from './reevaluation.service';

describe('ReevaluationController', () => {
  let controller: ReevaluationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReevaluationController],
      providers: [ReevaluationService],
    }).compile();

    controller = module.get<ReevaluationController>(ReevaluationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
