import { IsBoolean, IsString, IsInt, Min, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateTeacherDto {
   @IsInt()
   @IsNotEmpty()
   @Min(1)
   id: number;

   @IsString()
   @MaxLength(100)
   @IsNotEmpty()
   specialty: string;
 
   @IsBoolean()
   isHeadTeacher?: boolean = false;
}
