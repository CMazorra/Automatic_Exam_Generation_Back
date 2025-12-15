import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // solo para teachers
  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialty?: string;
}
