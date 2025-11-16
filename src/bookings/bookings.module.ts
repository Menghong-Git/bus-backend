import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { Trip } from '../trips/entities/trip.entity';
import { BookingSeat } from '../booking-seats/entities/booking-seat.entity';
import { Payment } from '../payments/entities/payment.entity';
import { TripsModule } from '../trips/trips.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Trip, BookingSeat, Payment]),
    TripsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
