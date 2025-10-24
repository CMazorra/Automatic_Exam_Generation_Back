import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';
import { HeadTeacherModule } from './head_teacher/head_teacher.module';

@Module({
  imports: [PrismaModule, UserModule, TeacherModule, StudentModule, AdminModule, HeadTeacherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
