import { Module } from '@nestjs/common';
import { ReevaluationService } from './reevaluation.service';
import { ReevaluationController } from './reevaluation.controller';

@Module({
  controllers: [ReevaluationController],
  providers: [ReevaluationService],
})
export class ReevaluationModule {}
