import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HeadTeacherService } from './head_teacher.service';
import { CreateHeadTeacherDto } from './dto/create-head_teacher.dto';
import { UpdateHeadTeacherDto } from './dto/update-head_teacher.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RequireHeadTeacher } from '../auth/require-head-teacher.decorator';
import { RequireTeacherOwner } from 'src/auth/require-teacher-owner.decorator';
import { Role } from '@prisma/client';


@Controller('head-teacher')
@UseGuards(JwtAuthGuard,RolesGuard)
export class HeadTeacherController {
  constructor(private readonly headTeacherService: HeadTeacherService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createHeadTeacherDto: CreateHeadTeacherDto) {
    return this.headTeacherService.create(createHeadTeacherDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findAll() {
    return this.headTeacherService.findAll();
  }

  @Get('all')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findAllAll() {
    return this.headTeacherService.findAllAll();
  }

  @Get('deleted')
  @Roles(Role.ADMIN)
  findAllDeleted() {
    return this.headTeacherService.findAllDeleted();
  }

  @Get('all/:id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findOneAll(@Param('id') id: string) {
    return this.headTeacherService.findOneAll(+id);
  }

  @Get('deleted/:id')
  @Roles(Role.ADMIN)
  findOneDeleted(@Param('id') id: string) {
    return this.headTeacherService.findOneDelete(+id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @RequireTeacherOwner()
  findOne(@Param('id') id: string) {
    return this.headTeacherService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateHeadTeacherDto: UpdateHeadTeacherDto) {
    return this.headTeacherService.update(+id, updateHeadTeacherDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.headTeacherService.remove(+id);
  }

  @Patch('restore/:id')
  @Roles(Role.ADMIN)
  restore(@Param('id') id: string) {
    return this.headTeacherService.restore(+id);
  }
}
