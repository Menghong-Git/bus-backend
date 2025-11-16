import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('tickets')
export class Ticket extends BaseEntity {
  @Column({ name: 'booking_id' })
  bookingId: string;

  @Column()
  pnr: string;

  @Column({ name: 'ticket_number', unique: true })
  ticketNumber: string;

  @Column({ name: 'qr_code_url' })
  qrCodeUrl: string;

  @Column({ name: 'passenger_details', type: 'jsonb' })
  passengerDetails: any;

  @Column({ name: 'trip_details', type: 'jsonb' })
  tripDetails: any;

  @Column({ name: 'is_cancelled', default: false })
  isCancelled: boolean;

  @Column({ name: 'cancelled_at', nullable: true })
  cancelledAt: Date;

  // Relationships
  @ManyToOne(() => Booking, (booking) => booking.tickets)
  booking: Booking;
}
