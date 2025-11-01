import { PartialType } from '@nestjs/swagger';
import { CreateApprovedExamDto } from './create-approved_exam.dto';

export class UpdateApprovedExamDto extends PartialType(CreateApprovedExamDto) {}
