import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly bookingsService: BookingsService) {}

  // @Cron(CronExpression.EVERY_MINUTE)
  // async handleExpiredSeatHolds() {
  //   this.logger.debug('Checking for expired seat holds...');

  //   try {
  //     await this.bookingsService.releaseExpiredHolds();
  //     this.logger.debug('Expired seat holds released successfully');
  //   } catch (error) {
  //     this.logger.error(`Error releasing expired seat holds: ${error.message}`);
  //     this.logger.debug(error.stack);
  //   }
  // }
}
