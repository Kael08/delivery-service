import { IsString, IsEnum } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  address: string;

  @IsEnum(['open', 'closed'])
  status: string;
}