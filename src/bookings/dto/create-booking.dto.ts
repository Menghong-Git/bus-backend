import {
  IsString,
  IsNumber,
  IsArray,
  IsUUID,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class PassengerDetailDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  idNumber: string;

  @IsString()
  seatNumber: string;

  @IsString()
  nationality?: string;
}

export class CreateBookingDto {
  @IsUUID()
  tripId: string;

  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(1)
  seatCount: number;

  @IsArray()
  @IsString({ each: true }) // Validate each item in the array is a string
  seatNumbers: string[]; // Changed from string to string[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerDetailDto)
  passengers: PassengerDetailDto[];
}
