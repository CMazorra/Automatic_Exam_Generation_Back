import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HeadTeacherService } from './head_teacher.service';
import { CreateHeadTeacherDto } from './dto/create-head_teacher.dto';
import { UpdateHeadTeacherDto } from './dto/update-head_teacher.dto';

@Controller('head-teacher')
export class HeadTeacherController {
  constructor(private readonly headTeacherService: HeadTeacherService) {}

  @Post()
  create(@Body() createHeadTeacherDto: CreateHeadTeacherDto) {
    return this.headTeacherService.create(createHeadTeacherDto);
  }

  @Get()
  findAll() {
    return this.headTeacherService.findAll();
  }

   @Get('all')
  findAllAll() {
    return this.headTeacherService.findAllAll();
  }

  @Get('deleted')
  findAllDeleted() {
    return this.headTeacherService.findAllDeleted();
  }

  @Get('all/:id')
  findOneAll(@Param('id') id: string) {
    return this.headTeacherService.findOneAll(+id);
  }

  @Get('deleted/:id')
  findOneDeleted(@Param('id') id: string) {
    return this.headTeacherService.findOneDelete(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.headTeacherService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHeadTeacherDto: UpdateHeadTeacherDto) {
    return this.headTeacherService.update(+id, updateHeadTeacherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.headTeacherService.remove(+id);
  }
}
