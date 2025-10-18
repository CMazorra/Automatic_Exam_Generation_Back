import { PartialType } from '@nestjs/mapped-types';
import { CreateParametersDto } from './create-parameters.dto';

export class UpdateParametersDto extends PartialType(CreateParametersDto) {}
