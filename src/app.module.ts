import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TopicModule } from './topic/topic.module';
import { SubTopicModule } from './sub-topic/sub-topic.module';
import { SubjectModule } from './subject/subject.module';

@Module({
  imports: [TopicModule,SubTopicModule,SubjectModule],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {}
