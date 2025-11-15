import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(createAnswerDto);
  }

  @Get()
  findAll() {
    return this.answerService.findAll();
  }

 @Get(':exam_id/:question_id/:student_id')
  findOne(
    @Param('exam_id') exam_id: string,
    @Param('question_id') question_id: string,
    @Param('student_id') student_id: string,
  ) {
    return this.answerService.findOne(+exam_id, +question_id, +student_id);
  }
  
 @Get(':exam_id/:student_id')
   findByExamAndStudent(
    @Param('exam_id') exam_id: string,
    @Param('student_id') student_id: string,
   ) {
    return this.answerService.getAnswerByStudent(+exam_id, +student_id);
   }


  @Patch(':exam_id/:question_id/:student_id')
  update(
    @Param('exam_id') exam_id: string,
    @Param('question_id') question_id: string,
    @Param('student_id') student_id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    return this.answerService.update(+exam_id, +question_id, +student_id, updateAnswerDto);
  }

  @Delete(':exam_id/:question_id/:student_id')
  remove(
    @Param('exam_id') exam_id: string,
    @Param('question_id') question_id: string,
    @Param('student_id') student_id: string,
  ) {
    return this.answerService.remove(+exam_id, +question_id, +student_id);
  }
}