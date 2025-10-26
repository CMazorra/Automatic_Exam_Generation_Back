import { Module } from '@nestjs/common';
import { SubTopicService } from './sub-topic.service';
import { SubTopicController } from './sub-topic.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SubTopicController],
  providers: [SubTopicService, PrismaService],
})
export class SubTopicModule {}
