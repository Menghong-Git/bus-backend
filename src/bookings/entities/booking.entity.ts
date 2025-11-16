import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { User } from '../../users/entities/user.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { BookingSeat } from '../../booking-seats/entities/booking-seat.entity';
import { BookingStatus } from '../../common/enums/booking-status.enum';

@Entity('bookings')
export class Booking extends BaseEntity {
  @Column({ name: 'trip_id', nullable: true })
  tripId: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column()
  pnr: string;

  @Column({ name: 'seat_count' })
  seatCount: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => (value ? parseFloat(value) : null),
    },
  })
  totalAmount: number | null;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ name: 'passenger_details', type: 'jsonb' })
  passengerDetails: any;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  // Relationships
  @ManyToOne(() => Trip, (trip) => trip.bookings)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];

  @OneToMany(() => BookingSeat, (bookingSeat) => bookingSeat.booking)
  bookingSeats: BookingSeat[];

  @OneToMany(() => Ticket, (ticket) => ticket.booking)
  tickets: Ticket[];
}
