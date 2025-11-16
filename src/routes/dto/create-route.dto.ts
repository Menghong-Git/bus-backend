import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  originId: string;

  @IsString()
  @IsNotEmpty()
  destinationId: string;

  @IsNumber()
  @IsPositive()
  distance: number;

  @IsNumber()
  @IsPositive()
  estimatedDuration: number;
}
