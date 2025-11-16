import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    // Add userId to the DTO from the authenticated user
    const bookingData = {
      ...createBookingDto,
      userId: req.user.id,
    };
    return this.bookingsService.create(bookingData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    // Use findByUserId instead of findByUser
    return this.bookingsService.findByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    // Remove the second parameter, handle authorization in service if needed
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }

  // Add the new endpoints we discussed
  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  async completeBooking(
    @Param('id') id: string,
    @Body() body: { paymentId: string },
  ) {
    return this.bookingsService.completeBooking(id, body.paymentId);
  }

  @Get(':id/validate-payment')
  @UseGuards(JwtAuthGuard)
  async validateBookingForPayment(@Param('id') id: string) {
    return this.bookingsService.validateBookingCompletion(id);
  }

  @Delete(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelBooking(@Param('id') id: string) {
    return this.bookingsService.cancelBooking(id);
  }
}
