import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingSeatsService } from './booking-seats.service';
import { BookingSeatsController } from './booking-seats.controller';
import { BookingSeat } from './entities/booking-seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingSeat])],
  controllers: [BookingSeatsController],
  providers: [BookingSeatsService],
  exports: [BookingSeatsService],
})
export class BookingSeatsModule {}
