import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ExamStudentService } from './exam_student.service';
import { CreateExamStudentDto } from './dto/create-exam_student.dto';
import { UpdateExamStudentDto } from './dto/update-exam_student.dto';

@Controller('exam-student')
export class ExamStudentController {
  constructor(private readonly examStudentService: ExamStudentService) {}

  @Post()
  create(@Body() createExamStudentDto: CreateExamStudentDto) {
    return this.examStudentService.create(createExamStudentDto);
  }

  @Get()
  findAll() {
    return this.examStudentService.findAll();
  }

  @Get(':exam_id/:student_id')
  findOne(
    @Param('exam_id', ParseIntPipe) exam_id: number,
    @Param('student_id', ParseIntPipe) student_id: number,
  ) {
    return this.examStudentService.findOne(exam_id, student_id);
  }

  @Patch(':exam_id/:student_id')
  update(
    @Param('exam_id', ParseIntPipe) exam_id: number,
    @Param('student_id', ParseIntPipe) student_id: number,
    @Body() updateExamStudentDto: UpdateExamStudentDto,
  ) {
    return this.examStudentService.update(exam_id, student_id, updateExamStudentDto);
  }

  @Delete(':exam_id/:student_id')
  remove(
    @Param('exam_id', ParseIntPipe) exam_id: number,
    @Param('student_id', ParseIntPipe) student_id: number,
  ) {
    return this.examStudentService.remove(exam_id, student_id);
  }
}