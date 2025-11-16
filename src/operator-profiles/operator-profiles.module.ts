import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperatorProfilesService } from './operator-profiles.service';
import { OperatorProfilesController } from './operator-profiles.controller';
import { OperatorProfile } from './entities/operator-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OperatorProfile])],
  controllers: [OperatorProfilesController],
  providers: [OperatorProfilesService],
  exports: [OperatorProfilesService],
})
export class OperatorProfilesModule {}
