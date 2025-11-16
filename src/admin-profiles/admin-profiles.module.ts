import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminProfilesService } from './admin-profiles.service';
import { AdminProfilesController } from './admin-profiles.controller';
import { AdminProfile } from './entities/admin-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminProfile])],
  controllers: [AdminProfilesController],
  providers: [AdminProfilesService],
  exports: [AdminProfilesService],
})
export class AdminProfilesModule {}
