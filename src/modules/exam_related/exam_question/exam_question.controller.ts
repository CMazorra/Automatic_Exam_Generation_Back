import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamQuestionService } from './exam_question.service';
import { CreateExamQuestionDto } from './dto/create-exam_question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam_question.dto';

@Controller('exam-question')
export class ExamQuestionController {
  constructor(private readonly examQuestionService: ExamQuestionService) {}

  @Post()
  create(@Body() createExamQuestionDto: CreateExamQuestionDto) {
    return this.examQuestionService.create(createExamQuestionDto);
  }

  @Get()
  findAll() {
    return this.examQuestionService.findAll();
  }

@Get(':exam_id/:question_id/')
  findOne(
    @Param('exam_id') exam_id: string,
    @Param('question_id') question_id: string,
  ) {
    return this.examQuestionService.findOne(+exam_id, +question_id);
  }

  @Patch(':exam_id/:question_id/')
  update(
    @Param('exam_id') exam_id: string,
    @Param('question_id') question_id: string,
    @Body() updateExamQuestionDto: UpdateExamQuestionDto,
  ) {
    return this.examQuestionService.update(+exam_id, +question_id,  updateExamQuestionDto);
  }

  @Delete(':exam_id/:question_id/')
  remove(
    @Param('exam_id') exam_id: string,
    @Param('question_id') question_id: string,
  ) {
    return this.examQuestionService.remove(+exam_id, +question_id);
  }
}