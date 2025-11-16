import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Bus } from '../../buses/entities/bus.entity';
import { BookingSeat } from '../../booking-seats/entities/booking-seat.entity';

@Entity('seats')
export class Seat extends BaseEntity {
  @Column({ name: 'bus_id' })
  busId: string;

  @Column({ name: 'seat_number' })
  seatNumber: string;

  @Column({
    type: 'enum',
    enum: ['WINDOW', 'AISLE', 'MIDDLE'],
    default: 'WINDOW',
  })
  type: string;

  @Column({ default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Bus, (bus) => bus.seats)
  bus: Bus;

  @OneToMany(() => BookingSeat, (bookingSeat) => bookingSeat.seat)
  bookingSeats: BookingSeat[];
}
