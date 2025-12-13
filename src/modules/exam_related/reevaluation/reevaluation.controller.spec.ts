import { Test, TestingModule } from '@nestjs/testing';
import { ReevaluationController } from './reevaluation.controller';
import { ReevaluationService } from './reevaluation.service';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { StudentOwnerGuard } from 'src/auth/student-owner.guard';

// Mock de los guards
@Injectable()
class MockGuard {
  canActivate(context: ExecutionContext) {
    return true;
  }
}

describe('ReevaluationController', () => {
  let controller: ReevaluationController;
  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReevaluationController],
      providers: [{ provide: ReevaluationService, useValue: serviceMock }],
    })
    .overrideGuard(JwtAuthGuard)
    .useClass(MockGuard)
    .overrideGuard(RolesGuard)
    .useClass(MockGuard)
    .overrideGuard(StudentOwnerGuard)
    .useClass(MockGuard)
    .compile();

    controller = module.get<ReevaluationController>(ReevaluationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
