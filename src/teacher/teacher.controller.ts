import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RequireHeadTeacher } from '../auth/require-head-teacher.decorator';
import { Role } from '@prisma/client';

@Controller('teacher')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @Roles(Role.ADMIN)  
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @Get()
  @Roles(Role.ADMIN,Role.TEACHER)
  findAll() {
    return this.teacherService.findAll();
  }

  @Get('all')
  @Roles(Role.ADMIN)
  findAllAll() {
    return this.teacherService.findAllAll();
  }

  @Get('deleted')
  @Roles(Role.ADMIN)
  findAllDeleted() {
    return this.teacherService.findAllDeleted();
  }

  @Get('all/:id')
  @Roles(Role.ADMIN)
  findOneAll(@Param('id') id: string) {
    return this.teacherService.findOneAll(+id);
  }

  @Get('deleted/:id')
  @Roles(Role.ADMIN)
  findOneDeleted(@Param('id') id: string) {
    return this.teacherService.findOneDeleted(+id);
  }
  
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(+id, updateTeacherDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.teacherService.remove(+id);
  }

  @Get("review-report")
  getTeachersReviewReport() {
    return this.teacherService.getTeachersReviewReport();
  }
  
  @Get(':id')
  @Roles(Role.ADMIN,Role.TEACHER)
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(+id);
  }
}
