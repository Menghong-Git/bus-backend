import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookingSeatsService } from './booking-seats.service';
import { CreateBookingSeatDto } from './dto/create-booking-seat.dto';
import { UpdateBookingSeatDto } from './dto/update-booking-seat.dto';

@Controller('booking-seats')
export class BookingSeatsController {
  constructor(private readonly bookingSeatsService: BookingSeatsService) {}

  @Post()
  create(@Body() createBookingSeatDto: CreateBookingSeatDto) {
    return this.bookingSeatsService.create(createBookingSeatDto);
  }

  @Get()
  findAll() {
    return this.bookingSeatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingSeatsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingSeatDto: UpdateBookingSeatDto,
  ) {
    return this.bookingSeatsService.update(id, updateBookingSeatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingSeatsService.remove(id);
  }
}
