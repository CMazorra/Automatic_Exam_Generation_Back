import { PartialType } from '@nestjs/swagger';
import { CreateReevaluationDto } from './create-reevaluation.dto';

export class UpdateReevaluationDto extends PartialType(CreateReevaluationDto) {}
