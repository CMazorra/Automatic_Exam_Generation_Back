import { Module } from '@nestjs/common';
import { HeadTeacherService } from './head_teacher.service';
import { HeadTeacherController } from './head_teacher.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [HeadTeacherController],
  providers: [HeadTeacherService, PrismaService],
})
export class HeadTeacherModule {}
