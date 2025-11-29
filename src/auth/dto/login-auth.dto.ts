import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  account: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;
}
