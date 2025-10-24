import { IsInt, Min,IsNotEmpty } from 'class-validator';

export class CreateStudentDto {
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    id: number;
}
