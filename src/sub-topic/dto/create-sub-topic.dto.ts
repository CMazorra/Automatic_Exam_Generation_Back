import { IsString, IsInt } from 'class-validator';

export class CreateSubTopicDto {
  @IsString()
  name: string;

  @IsInt()
  topic_id: number;
}
