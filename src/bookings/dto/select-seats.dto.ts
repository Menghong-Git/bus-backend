import {
  IsArray,
  IsUUID,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsString,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PassengerDetailDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  nationality: string;
}

export class SelectSeatsDto {
  @IsUUID()
  tripId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsUUID('4', { each: true })
  seatIds: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => PassengerDetailDto)
  passengerDetails: PassengerDetailDto[];
}
