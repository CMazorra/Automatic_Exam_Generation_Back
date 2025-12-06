import { ApiProperty } from "@nestjs/swagger";

export class WorstQuestionReportDto {
  @ApiProperty()
  questionId: number;

  @ApiProperty()
  questionText: string;

  @ApiProperty()
  difficulty: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  teacher: string;

  @ApiProperty()
  totalAnswers: number;

  @ApiProperty()
  wrongAnswers: number;

  @ApiProperty()
  failRate: number;
}
