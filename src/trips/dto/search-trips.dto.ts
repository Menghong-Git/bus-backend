import { IsString, IsDateString, IsOptional } from 'class-validator';

export class SearchTripsDto {
  @IsString()
  originCity: string;

  @IsString()
  destinationCity: string;

  @IsDateString()
  departureDate: string;

  @IsOptional()
  @IsString()
  passengerCount?: string;
}
