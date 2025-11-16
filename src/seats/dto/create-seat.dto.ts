import { IsString, IsUUID, IsEnum, IsBoolean } from 'class-validator';

export class CreateSeatDto {
  @IsUUID()
  busId: string;

  @IsString()
  seatNumber: string;

  @IsEnum(['WINDOW', 'AISLE', 'MIDDLE'])
  type: string;

  @IsBoolean()
  isActive: boolean;
}
