import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { PaymentMethod } from '../../common/enums/payment-method.enum';

@Entity('payments')
export class Payment extends BaseEntity {
  @Column({ name: 'booking_id' })
  bookingId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CARD,
  })
  method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ name: 'transaction_id', nullable: true })
  transactionId: string;

  @Column({ name: 'payment_gateway_response', type: 'jsonb', nullable: true })
  paymentGatewayResponse: any;

  // Relationships - ManyToOne instead of OneToOne
  @ManyToOne(() => Booking, (booking) => booking.payments)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}
