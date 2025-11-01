import { PartialType } from '@nestjs/swagger';
import { CreateExamStudentDto } from './create-exam_student.dto';

export class UpdateExamStudentDto extends PartialType(CreateExamStudentDto) {}
