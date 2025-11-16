import { IsString, IsUUID } from 'class-validator';

export class CreateBookingSeatDto {
  @IsUUID()
  bookingId: string;

  @IsUUID()
  seatId: string;

  @IsString()
  seatNumber: string;

  @IsString()
  passengerName: string;
}
