import { IsString, IsInt } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsInt()
  head_teacher_id: number;

  @IsString()
  programme: string;
}
