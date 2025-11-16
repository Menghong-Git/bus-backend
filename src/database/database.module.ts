import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { PassengerProfile } from '../passenger-profiles/entities/passenger-profile.entity';
import { OperatorProfile } from '../operator-profiles/entities/operator-profile.entity';
import { AdminProfile } from '../admin-profiles/entities/admin-profile.entity';
import { Bus } from '../buses/entities/bus.entity';
import { Station } from '../stations/entities/station.entity';
import { Route } from '../routes/entities/route.entity';
import { Trip } from '../trips/entities/trip.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Seat } from '../seats/entities/seat.entity';
import { BookingSeat } from '../booking-seats/entities/booking-seat.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Ticket } from '../tickets/entities/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', '1234'),
        database: configService.get('DB_NAME', 'bus-booking'),
        entities: [
          User,
          PassengerProfile,
          OperatorProfile,
          AdminProfile,
          Bus,
          Station,
          Route,
          Trip,
          Booking,
          Seat,
          BookingSeat,
          Payment,
          Ticket,
        ],
        synchronize: configService.get('DB_SYNC', true),
        logging: configService.get('DB_LOGGING', false),
      }),
    }),
  ],
})
export class DatabaseModule {}
