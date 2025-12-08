import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';

class QuestionDistributionDto {
  @IsString()
  type: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  amount: number;
}

export class GenerateExamDto {
  @Type(() => Number)
  @IsInt()
  exam_id: number;

  @Type(() => Number)
  @IsInt()
  subject_id: number;

  @Type(() => Number)
  @IsInt()
  teacher_id: number;

  @Type(() => Number)
  @IsInt()
  head_teacher_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDistributionDto)
  questionDistribution: QuestionDistributionDto[];
}
