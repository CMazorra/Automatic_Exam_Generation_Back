import { IsString, IsInt } from 'class-validator';

export class CreateSubTopicDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsInt()
  topic_id: number;
}
