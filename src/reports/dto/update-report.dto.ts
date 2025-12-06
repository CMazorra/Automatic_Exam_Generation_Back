import { PartialType } from '@nestjs/swagger';
import { WorstQuestionReportDto } from './create-report.dto';

export class UpdateReportDto extends PartialType(WorstQuestionReportDto) {}
