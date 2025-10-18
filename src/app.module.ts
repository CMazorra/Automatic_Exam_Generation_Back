import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TopicModule } from './topic/topic.module';

@Module({
  imports: [TopicModule],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {}
