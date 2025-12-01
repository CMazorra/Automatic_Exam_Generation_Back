import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RequireHeadTeacher } from '../auth/require-head-teacher.decorator';
import { Role } from '@prisma/client';
import { RequireStudentOwner } from 'src/auth/require-student-owner.decorator';

@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  findAllActive() {
    return this.studentService.findAll();
  }

  @Get('all')
  @Roles(Role.ADMIN, Role.TEACHER)
  findAllAll() {
    return this.studentService.findAllAll();
  }

  @Get('deleted/all')
  @Roles(Role.ADMIN, Role.TEACHER)
  findAllDeleted() {
    return this.studentService.findAllDeleted();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @RequireStudentOwner()
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Get('all/:id')
  @Roles(Role.ADMIN, Role.TEACHER)
  findOneAll(@Param('id') id: string) {
    return this.studentService.findOneAll(+id);
  }

  @Get('deleted/:id')
  @Roles(Role.ADMIN, Role.TEACHER)
  findOneDeleted(@Param('id') id: string) {
    return this.studentService.findOneDeleted(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @RequireHeadTeacher()
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @RequireHeadTeacher()
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }

  @Patch('restore/:id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @RequireHeadTeacher()
  restore(@Param('id') id: string) {
    return this.studentService.restore(+id);
  }
}
