import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [ScheduleModule.forRoot(), BookingsModule],
  providers: [TasksService],
})
export class TasksModule {}
