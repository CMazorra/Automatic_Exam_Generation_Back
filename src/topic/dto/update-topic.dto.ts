import { PartialType } from '@nestjs/mapped-types';
import { CreateTopicDto } from './create-topic.dto';
import { IsOptional, IsInt } from 'class-validator';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {

  @IsOptional()
  @IsInt()
  subject_id?: number; // <-- PERMITES MODIFICAR EL RELACIONAMIENTO
}
