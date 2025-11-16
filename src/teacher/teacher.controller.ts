import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @Get()
  findAll() {
    return this.teacherService.findAll();
  }

  @Get('all')
  findAllAll() {
    return this.teacherService.findAllAll();
  }

  @Get('deleted')
  findAllDeleted() {
    return this.teacherService.findAllDeleted();
  }

  @Get('all/:id')
  findOneAll(@Param('id') id: string) {
    return this.teacherService.findOneAll(+id);
  }

  @Get('deleted/:id')
  findOneDeleted(@Param('id') id: string) {
    return this.teacherService.findOneDeleted(+id);
  }

  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(+id, updateTeacherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherService.remove(+id);
  }

  @Get("review-report")
  getTeachersReviewReport() {
    return this.teacherService.getTeachersReviewReport();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(+id);
  }
}
