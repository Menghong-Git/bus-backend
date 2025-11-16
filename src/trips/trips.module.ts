import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { Trip } from './entities/trip.entity';
import { Seat } from '../seats/entities/seat.entity';
import { BookingSeat } from '../booking-seats/entities/booking-seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Seat, BookingSeat])],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
