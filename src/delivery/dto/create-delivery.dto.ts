import { IsArray, IsString } from 'class-validator';

export class CreateDeliveryDto {
  @IsArray()
  apps: string[];

  @IsArray()
  couriers: string[];

  @IsString()
  companyId: string;
}