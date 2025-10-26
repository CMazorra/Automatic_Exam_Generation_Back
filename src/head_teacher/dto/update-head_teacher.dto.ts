import { PartialType } from '@nestjs/mapped-types';
import { CreateHeadTeacherDto } from './create-head_teacher.dto';

export class UpdateHeadTeacherDto extends PartialType(CreateHeadTeacherDto) {}
