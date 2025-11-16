import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreatePassengerProfileDto {
  @IsUUID()
  userId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  nationality?: string;
}
