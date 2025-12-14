import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExamDto {
    @IsString()
    name: string;

    @IsString()
    status: string;

    @IsString()
    difficulty: string;

    @Type(() => Number)
    @IsInt()
    subject_id: number;

    @Type(() => Number)
    @IsInt()
    teacher_id: number;

    @Type(() => Number)
    @IsInt()
    head_teacher_id: number;
}
