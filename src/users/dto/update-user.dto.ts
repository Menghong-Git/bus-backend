import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  otpCode?: string | null; // Allow null

  @IsOptional()
  @IsDateString()
  otpExpiresAt?: string | null; // Allow null and use DateString

  @IsOptional()
  @IsString()
  profileImage?: string;
}
