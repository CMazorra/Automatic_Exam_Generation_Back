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
import { UserModule } from './user/user.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';
import { HeadTeacherModule } from './head_teacher/head_teacher.module';
import { TopicModule } from './topic/topic.module';
import { SubTopicModule } from './sub-topic/sub-topic.module';
import { SubjectModule } from './subject/subject.module';
import { QuestionModule } from './question/question.module';
import { ParametersModule } from './parameters/parameters.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';


@Module({
  imports: [ AuthModule, ExamModule, ExamStudentModule, ApprovedExamModule, ExamQuestionModule, AnswerModule, ReevaluationModule,
    PrismaModule, UserModule, TeacherModule, StudentModule, HeadTeacherModule,
     TopicModule,SubTopicModule,SubjectModule, QuestionModule, ParametersModule, ReportsModule],
   controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
