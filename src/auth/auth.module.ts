import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassengerProfilesModule } from '../passenger-profiles/passenger-profiles.module';
import { OperatorProfilesModule } from '../operator-profiles/operator-profiles.module';
import { BusesModule } from '../buses/buses.module';
import { JWT_CONSTANTS } from './strategies/jwt.constant';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_CONSTANTS.secret,
      signOptions: { expiresIn: '78h' },
    }),
    UsersModule,
    PassengerProfilesModule,
    OperatorProfilesModule,
    BusesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
