import { CreateUserDto } from './create-user.dto';
import { CreateTeacherRequestDto } from '../../teacher/dto/create-teacher-request.dto';
import { ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserRequestDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTeacherRequestDto)
  teacher?: CreateTeacherRequestDto;
}
