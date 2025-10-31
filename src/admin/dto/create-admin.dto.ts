import { IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateAdminDto {
   @IsInt()
   @IsNotEmpty()
   @Min(1)
   id: number;
}
