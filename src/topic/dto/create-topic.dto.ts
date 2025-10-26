import { IsString } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  name: string;
}
