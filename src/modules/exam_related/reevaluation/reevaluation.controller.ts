import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReevaluationService } from './reevaluation.service';
import { CreateReevaluationDto } from './dto/create-reevaluation.dto';
import { UpdateReevaluationDto } from './dto/update-reevaluation.dto';

@Controller('reevaluation')
export class ReevaluationController {
  constructor(private readonly reevaluationService: ReevaluationService) {}

  @Post()
  create(@Body() createReevaluationDto: CreateReevaluationDto) {
    return this.reevaluationService.create(createReevaluationDto);
  }

  @Get()
  findAll() {
    return this.reevaluationService.findAll();
  }

 @Get(':exam_id/:student_id/:teacher_id')
  findOne(
    @Param('exam_id') exam_id: string,
    @Param('student_id') student_id: string,
    @Param('teacher_id') teacher_id: string,
  ) {
    return this.reevaluationService.findOne(+exam_id, +student_id, +teacher_id);
  }

  @Patch(':exam_id/:student_id/:teacher_id')
  update(
    @Param('exam_id') exam_id: string,
    @Param('student_id') student_id: string,
    @Param('teacher_id') teacher_id: string,
    @Body() updatereevaluationDto: UpdateReevaluationDto,
  ) {
    return this.reevaluationService.update(+exam_id, +student_id, +teacher_id, updatereevaluationDto);
  }

  @Delete(':exam_id/:student_id/:teacher_id')
  remove(
    @Param('exam_id') exam_id: string,
    @Param('student_id') student_id: string,
    @Param('teacher_id') teacher_id: string,
  ) {
    return this.reevaluationService.remove(+exam_id, +student_id, +teacher_id);
  }
}