import { Module } from '@nestjs/common';
import { ExamStudentService } from './exam_student.service';
import { ExamStudentController } from './exam_student.controller';

@Module({
  controllers: [ExamStudentController],
  providers: [ExamStudentService],
})
export class ExamStudentModule {}
