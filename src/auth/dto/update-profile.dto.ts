import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  // Common fields
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  // Operator-specific fields
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  driverName?: string;

  @IsOptional()
  @IsString()
  driverPhone?: string;

  @IsOptional()
  @IsString()
  licensePlate?: string;

  @IsOptional()
  @IsString()
  busType?: string;

  @IsOptional()
  @IsString()
  route?: string;
}
