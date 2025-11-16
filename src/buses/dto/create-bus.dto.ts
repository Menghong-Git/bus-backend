import { IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';

export class CreateBusDto {
  @IsString()
  name: string;

  @IsString()
  licensePlate: string;

  @IsNumber()
  capacity: number;

  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @IsBoolean()
  isActive: boolean;
}
