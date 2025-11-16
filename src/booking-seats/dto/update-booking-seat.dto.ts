import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingSeatDto } from './create-booking-seat.dto';

export class UpdateBookingSeatDto extends PartialType(CreateBookingSeatDto) {}
