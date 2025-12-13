import { IsInt, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReevaluationDto {

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  score?: number;

  @Type(() => Number)
  @IsInt()
  exam_id: number;

  @Type(() => Number)
  @IsInt()
  student_id: number;

  @Type(() => Number)
  @IsInt()
  teacher_id: number;
}
