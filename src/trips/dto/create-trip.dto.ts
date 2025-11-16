import {
  IsString,
  IsNumber,
  IsPositive,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { TripStatus } from '../../common/enums/trip-status.enum';

export class CreateTripDto {
  @IsString()
  routeId: string;

  @IsString()
  busId: string;

  @IsDateString()
  departureDate: string;

  @IsString()
  departureTime: string;

  @IsString()
  arrivalTime: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  capacity: number;

  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;
}
