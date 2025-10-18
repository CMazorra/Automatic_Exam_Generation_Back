import { IsString } from 'class-validator';

export class CreateParametersDto {
  @IsString()
  proportion: string;

  @IsString()
  amount_quest: string;

  @IsString()
  quest_topics: string;
}
