import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  // Passenger specific fields
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

  // Operator specific fields
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
