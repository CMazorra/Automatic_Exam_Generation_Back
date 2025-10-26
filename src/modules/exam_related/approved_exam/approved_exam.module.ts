import { Module } from '@nestjs/common';
import { approved_examService } from './approved_exam.service';
import { ApprovedExamController } from './approved_exam.controller';

@Module({
  controllers: [ApprovedExamController],
  providers: [approved_examService],
})
export class ApprovedExamModule {}
