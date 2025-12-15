// dto/create-teacher-request.dto.ts
import { IsBoolean, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateTeacherRequestDto {
  @IsString()
  @MaxLength(100)
  specialty: string;

  @IsOptional()
  @IsBoolean()
  isHeadTeacher?: boolean;
}
