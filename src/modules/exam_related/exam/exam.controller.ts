import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { GenerateExamDto } from './dto/generated-exam.dto';
import { ParseIntPipe } from '@nestjs/common';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

@Post()
create(@Body() body: any) {
  // Separamos dto y preguntas
  const { questions, ...dto } = body;

  return this.examService.create(dto, questions);
}
  @Post('generate')
  generated(@Body() generatedexamDto : GenerateExamDto) {
    return this.examService.generated(generatedexamDto);
  }

//http://localhost:3000/app/exam/generated/subject/1
@Get('generated/subject/:subjectId')
  async getGeneratedExamsBySubject(
    @Param('subjectId', ParseIntPipe) subjectId: number,
  ) {
    return this.examService.listGeneratedExamsBySubject(subjectId);
  }



  @Get()
  findAll() {
    return this.examService.findAll();
  }
 @Get(':id')
 findOne(@Param('id', ParseIntPipe) id: number) {
  return this.examService.findOne(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(+id, updateExamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examService.remove(+id);
  }
}


