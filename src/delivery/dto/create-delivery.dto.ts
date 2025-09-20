import { IsArray, IsString } from 'class-validator';

export class CreateDeliveryDto {
  //@IsString()
  //clientId:string

  @IsString()
  clientName: string

  @IsString()
  address: string

  @IsString()
  clientPhone: string = '' 

  @IsString()
  details: string =''

  @IsString()
  commentary: string =''

  @IsString()
  domofon: string =''

  @IsString()
  flat: string =''

  @IsString()
  floor: string =''

  @IsString()
  porch: string =''

  // @IsArray()
  // goods: string[];

  // @IsString()
  // restaurantId: string;
}