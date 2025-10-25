import { IsEnum, IsString, IsInt, Min, MaxLength, IsNotEmpty } from 'class-validator';
import { Role } from '../../../generated/prisma';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  account: string;

  @IsInt()
  @Min(1)
  age: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  course: string;

  @IsEnum(Role)
  role : Role;
}
