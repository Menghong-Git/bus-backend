import { PartialType } from '@nestjs/mapped-types';
import { CreatePassengerProfileDto } from './create-passenger-profile.dto';

export class UpdatePassengerProfileDto extends PartialType(CreatePassengerProfileDto) {}
