import { PartialType } from '@nestjs/mapped-types';
import { CreateSubTopicDto } from './create-sub-topic.dto';

export class UpdateSubTopicDto extends PartialType(CreateSubTopicDto) {}
