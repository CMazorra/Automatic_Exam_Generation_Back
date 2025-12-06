import { IsInt, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAnswerDto {
    
    @Type(() => Number)
    @IsInt()
    exam_id: number;


    @Type(() => Number)
    @IsInt()
    question_id: number;

    @Type(() => Number)
    @IsInt()
    student_id: number;

    @IsString()
    answer_text: string;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    score: number;
}
