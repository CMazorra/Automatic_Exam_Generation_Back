import { IsString, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsString()
  question_text: string;

  @IsString()
  difficulty: string;

  @IsString()
  answer: string;

  @IsString()
  type: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  score: number;

  @IsInt()
  subject_id: number;

  @IsInt()
  sub_topic_id: number;

  @IsInt()
  topic_id: number;

  @IsInt()
  teacher_id: number;
}
