import { PartialType } from '@nestjs/swagger';
import { CreateExamQuestionDto } from './create-exam_question.dto';

export class UpdateExamQuestionDto extends PartialType(CreateExamQuestionDto) {}
