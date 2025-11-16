import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { PassengerProfilesModule } from './passenger-profiles/passenger-profiles.module';
import { OperatorProfilesModule } from './operator-profiles/operator-profiles.module';
import { AdminProfilesModule } from './admin-profiles/admin-profiles.module';
import { BusesModule } from './buses/buses.module';
import { StationsModule } from './stations/stations.module';
import { RoutesModule } from './routes/routes.module';
import { TripsModule } from './trips/trips.module';
import { BookingsModule } from './bookings/bookings.module';
import { SeatsModule } from './seats/seats.module';
import { BookingSeatsModule } from './booking-seats/booking-seats.module';
import { PaymentsModule } from './payments/payments.module';
import { TicketsModule } from './tickets/tickets.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    PassengerProfilesModule,
    OperatorProfilesModule,
    AdminProfilesModule,
    BusesModule,
    StationsModule,
    RoutesModule,
    TripsModule,
    BookingsModule,
    SeatsModule,
    BookingSeatsModule,
    PaymentsModule,
    TicketsModule,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
