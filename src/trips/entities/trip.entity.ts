import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { TripStatus } from '../../common/enums/trip-status.enum';
import { Route } from '../../routes/entities/route.entity';
import { Bus } from '../../buses/entities/bus.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('trips')
export class Trip extends BaseEntity {
  @Column({ name: 'route_id', nullable: true })
  routeId: string;

  @Column({ name: 'bus_id', nullable: true })
  busId: string;

  @Column({ name: 'departure_date', type: 'date' })
  departureDate: Date;

  @Column({ name: 'departure_time', type: 'time' })
  departureTime: string;

  @Column({ name: 'arrival_time', type: 'time' })
  arrivalTime: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  capacity: number;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.SCHEDULED,
  })
  status: TripStatus;

  // Relationships
  @ManyToOne(() => Route, (route) => route.trips)
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @ManyToOne(() => Bus, (bus) => bus.trips)
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;

  @OneToMany(() => Booking, (booking) => booking.trip)
  bookings: Booking[];
}
