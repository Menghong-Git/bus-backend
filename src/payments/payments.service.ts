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

// Mock Stripe service - in real implementation, use Stripe SDK
@Injectable()
export class StripeMockService {
  async createPaymentIntent(amount: number, currency: string = 'usd') {
    // Mock Stripe payment intent creation
    return {
      id: `pi_${Math.random().toString(36).substr(2, 10)}`,
      client_secret: `cs_${Math.random().toString(36).substr(2, 20)}`,
      status: 'requires_payment_method',
    };
  }

  async confirmPayment(paymentIntentId: string) {
    // Mock payment confirmation
    return {
      id: paymentIntentId,
      status: 'succeeded',
    };
  }
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private stripeMockService: StripeMockService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { bookingId, amount, method, token } = createPaymentDto;

    const booking = await this.bookingsRepository.findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Booking is not in pending status');
    }

    let paymentIntent;
    let transactionId;

    if (method === 'STRIPE') {
      paymentIntent = await this.stripeMockService.createPaymentIntent(amount);
      transactionId = paymentIntent.id;
    }

    const payment = this.paymentsRepository.create({
      bookingId,
      amount,
      method,
      transactionId,
      paymentGatewayResponse: paymentIntent,
      status: PaymentStatus.PENDING,
    });

    return await this.paymentsRepository.save(payment);
  }

  async confirmPayment(paymentId: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['booking'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Mock payment confirmation
    let confirmedPayment;
    if (payment.method === 'STRIPE') {
      confirmedPayment = await this.stripeMockService.confirmPayment(
        payment.transactionId,
      );
    } else {
      // Mock payment confirmation for other methods
      confirmedPayment = { status: 'succeeded' };
    }

    if (confirmedPayment.status === 'succeeded') {
      payment.status = PaymentStatus.COMPLETED;

      // Update booking status
      const booking = payment.booking;
      booking.status = BookingStatus.CONFIRMED;
      booking.expiresAt = null; // Remove expiry since payment is complete
      await this.bookingsRepository.save(booking);
    } else {
      payment.status = PaymentStatus.FAILED;
    }

    payment.paymentGatewayResponse = confirmedPayment;

    return await this.paymentsRepository.save(payment);
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['booking'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}
