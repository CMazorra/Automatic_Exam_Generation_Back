import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ExamModule } from './modules/exam_related/exam/exam.module';
import { ExamStudentModule } from './modules/exam_related/exam_student/exam_student.module';
import { ApprovedExamModule } from './modules/exam_related/approved_exam/approved_exam.module';
import { ExamQuestionModule } from './modules/exam_related/exam_question/exam_question.module';
import { AnswerModule } from './modules/exam_related/answer/answer.module';
import { ReevaluationModule } from './modules/exam_related/reevaluation/reevaluation.module';

@Module({
  imports: [PrismaModule, ExamModule, ExamStudentModule, ApprovedExamModule, ExamQuestionModule, AnswerModule, ReevaluationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
