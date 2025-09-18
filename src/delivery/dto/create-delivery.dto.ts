import { IsArray, IsString } from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  clientId: string;

  // @IsArray()
  // goods: string[];

  // @IsString()
  // restaurantId: string;
}