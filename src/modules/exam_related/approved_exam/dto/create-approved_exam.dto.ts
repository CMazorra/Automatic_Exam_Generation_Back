import{ IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApprovedExamDto {
    @Type(() => Number)
    @IsInt()
    date_id: number;

    @Type(() => Number)
    @IsInt()
    exam_id: number;

    @Type(() => Number)
    @IsInt()
    head_teacher_id: number;

    @IsString()
    guidelines: string;
}
