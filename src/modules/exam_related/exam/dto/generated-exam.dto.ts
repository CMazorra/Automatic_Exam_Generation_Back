// src/modules/exams/dto/generate-exam.dto.ts
import { Type } from 'class-transformer';
import {IsArray,IsInt,IsString,Min,ValidateNested} from 'class-validator';

class QuestionDistributionDto {
  @IsString()
  type: string;

  @IsInt()
  @Min(1)
  amount: number;
}

export class GenerateExamDto {
  @IsString()
  name: string;

  @IsInt()
  subject_id: number;

  @IsInt()
  teacher_id: number;

  @IsInt()
  head_teacher_id: number;

  @IsInt()
  parameters_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDistributionDto)
  questionDistribution: QuestionDistributionDto[];
}
