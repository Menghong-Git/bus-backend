import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { Seat } from '../../seats/entities/seat.entity';

@Entity('booking_seats')
export class BookingSeat extends BaseEntity {
  @Column({ name: 'booking_id' })
  bookingId: string;

  @Column({ name: 'seat_id', nullable: true })
  seatId: string;

  @Column({ name: 'seat_number' })
  seatNumber: string;

  @Column({ name: 'passenger_name', nullable: true }) // Make passenger_name nullable
  passengerName?: string;

  // Relationships
  @ManyToOne(() => Booking, (booking) => booking.bookingSeats)
  booking: Booking;

  @ManyToOne(() => Seat, (seat) => seat.bookingSeats)
  seat: Seat;
}
