import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerProfilesService } from './passenger-profiles.service';
import { PassengerProfilesController } from './passenger-profiles.controller';
import { PassengerProfile } from './entities/passenger-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PassengerProfile])],
  controllers: [PassengerProfilesController],
  providers: [PassengerProfilesService],
  exports: [PassengerProfilesService],
})
export class PassengerProfilesModule {}