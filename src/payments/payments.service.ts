import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Booking } from '../bookings/entities/booking.entity';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { BookingStatus } from '../common/enums/booking-status.enum';
import { PaymentMethod } from '../common/enums/payment-method.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { bookingId, amount, method, token } = createPaymentDto;

    console.log('💰 Creating payment:', { bookingId, amount, method });

    // Find booking with user relation to check ownership
    const booking = await this.bookingsRepository.findOne({
      where: { id: bookingId },
      relations: ['user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Booking is not in pending status');
    }

    // Create payment record
    const payment = this.paymentsRepository.create({
      bookingId,
      amount,
      method,
      status: PaymentStatus.PENDING,
      transactionId: this.generateTransactionId(method),
      paymentGatewayResponse: {
        method,
        mock: true,
        timestamp: new Date().toISOString(),
      },
    });

    const savedPayment = await this.paymentsRepository.save(payment);
    console.log('✅ Payment created:', savedPayment.id);

    return savedPayment;
  }

  async confirmPayment(paymentId: string): Promise<Payment> {
    console.log('💰 Confirming payment:', paymentId);

    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['booking'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Mock payment confirmation - always succeed for demo
    payment.status = PaymentStatus.COMPLETED;
    payment.paymentGatewayResponse = {
      ...payment.paymentGatewayResponse,
      confirmed: true,
      confirmedAt: new Date().toISOString(),
      mockTransaction: true,
    };

    // Update booking status
    if (payment.booking) {
      payment.booking.status = BookingStatus.CONFIRMED;
      payment.booking.expiresAt = null;
      await this.bookingsRepository.save(payment.booking);
      console.log('✅ Booking updated to CONFIRMED');
    }

    const confirmedPayment = await this.paymentsRepository.save(payment);
    console.log('✅ Payment confirmed:', confirmedPayment.id);

    return confirmedPayment;
  }

  async processMockPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    // Combined create + confirm for mock payments
    const payment = await this.createPayment(createPaymentDto);
    return await this.confirmPayment(payment.id);
  }

  private generateTransactionId(method: PaymentMethod): string {
    const prefix =
      {
        [PaymentMethod.CARD]: 'CARD',
        [PaymentMethod.STRIPE]: 'STRIPE',
        [PaymentMethod.MOCK]: 'MOCK',
      }[method] || 'TXN';

    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['booking', 'booking.user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async findByBookingId(bookingId: string): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { bookingId },
      relations: ['booking'],
      order: { createdAt: 'DESC' },
    });
  }
}
