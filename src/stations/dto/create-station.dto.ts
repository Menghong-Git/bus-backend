import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateStationDto {
  @IsString()
  city: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
