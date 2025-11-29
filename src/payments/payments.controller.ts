import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Get,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(UserRole.PASSENGER, UserRole.OPERATOR, UserRole.ADMIN)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Post('mock')
  @Roles(UserRole.PASSENGER, UserRole.OPERATOR, UserRole.ADMIN)
  createMockPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.processMockPayment(createPaymentDto);
  }

  @Patch(':id/confirm')
  @Roles(UserRole.PASSENGER, UserRole.OPERATOR, UserRole.ADMIN)
  confirm(@Param('id') id: string) {
    return this.paymentsService.confirmPayment(id);
  }

  @Get(':id')
  @Roles(UserRole.PASSENGER, UserRole.OPERATOR, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Get('booking/:bookingId')
  @Roles(UserRole.PASSENGER, UserRole.OPERATOR, UserRole.ADMIN)
  findByBookingId(@Param('bookingId') bookingId: string) {
    return this.paymentsService.findByBookingId(bookingId);
  }
}
