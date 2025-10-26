import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExamQuestionDto {

    @Type(() => Number)
    @IsInt()
    exam_id: number;

    @Type(() => Number)
    @IsInt()
    question_id: number;
}
