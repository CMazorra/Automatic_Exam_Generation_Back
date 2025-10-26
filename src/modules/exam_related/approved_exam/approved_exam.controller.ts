import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { approved_examService } from './approved_exam.service';
import { CreateApprovedExamDto } from './dto/create-approved_exam.dto';
import { UpdateApprovedExamDto } from './dto/update-approved_exam.dto';

@Controller('approved-exam')
export class ApprovedExamController {
  constructor(private readonly approvedExamService: approved_examService) {}

  @Post()
  create(@Body() createApprovedExamDto: CreateApprovedExamDto) {
    return this.approvedExamService.create(createApprovedExamDto);
  }

 @Get(':date_id/:exam_id/:head_teacher_id')
  findOne(
    @Param('date_id') date_id: string,
    @Param('exam_id') exam_id: string,
    @Param('head_teacher_id') head_teacher_id: string,
  ) {
    return this.approvedExamService.findOne(+date_id, +exam_id, +head_teacher_id);
  }

  @Patch(':date_id/:exam_id/:head_teacher_id')
  update(
    @Param('date_id') date_id: string,
    @Param('exam_id') exam_id: string,
    @Param('head_teacher_id') head_teacher_id: string,
    @Body() updateapproved_examDto: UpdateApprovedExamDto,
  ) {
    return this.approvedExamService.update(+date_id, +exam_id, +head_teacher_id, updateapproved_examDto);
  }

  @Delete(':date_id/:exam_id/:head_teacher_id')
  remove(
    @Param('date_id') date_id: string,
    @Param('exam_id') exam_id: string,
    @Param('head_teacher_id') head_teacher_id: string,
  ) {
    return this.approvedExamService.remove(+date_id, +exam_id, +head_teacher_id);
  }
}