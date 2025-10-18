import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TopicModule } from './topic/topic.module';
import { SubTopicModule } from './sub-topic/sub-topic.module';
import { SubjectModule } from './subject/subject.module';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [TopicModule,SubTopicModule,SubjectModule, QuestionModule],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {}
