import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOperatorProfileDto {
  @IsUUID()
  userId: string;

  @IsBoolean()
  isVerified: boolean;

  @IsOptional()
  @IsString()
  licensePlate?: string;

  @IsOptional()
  @IsString()
  busType?: string;

  @IsOptional()
  @IsString()
  driverPhone?: string;
}
