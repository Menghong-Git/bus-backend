import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { Seat } from '../../seats/entities/seat.entity';

@Entity('buses')
export class Bus extends BaseEntity {
  @Column()
  name: string;

  @Column()
  licensePlate: string;

  @Column()
  capacity: number;

  @Column('simple-array')
  amenities: string[];

  @Column({ default: true })
  isActive: boolean;

  // Relationships
  @OneToMany(() => Trip, (trip) => trip.bus)
  trips: Trip[];

  @OneToMany(() => Seat, (seat) => seat.bus)
  seats: Seat[];
}
