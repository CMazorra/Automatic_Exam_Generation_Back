import { IsString, IsInt } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  question_text: string;

  @IsString()
  difficulty: string;

  @IsString()
  answer: string;

  @IsString()
  type: string;

  @IsInt()
  subject_id: number;

  @IsInt()
  sub_topic_id: number;

  @IsInt()
  topic_id: number;

  @IsInt()
  teacher_id: number;
}
