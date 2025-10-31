import { IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateHeadTeacherDto {
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    id: number;
}
