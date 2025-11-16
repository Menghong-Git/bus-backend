import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Station } from '../../stations/entities/station.entity';
import { Trip } from '../../trips/entities/trip.entity';

@Entity('routes')
export class Route extends BaseEntity {
  @Column({ name: 'origin_id' })
  originId: string;

  @Column({ name: 'destination_id' })
  destinationId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance: number;

  @Column({ name: 'estimated_duration', nullable: true })
  estimatedDuration: number;

  // Relationships
  @ManyToOne(() => Station, (station) => station.originatingRoutes)
  @JoinColumn({ name: 'origin_id' })
  origin: Station;

  @ManyToOne(() => Station, (station) => station.destinationRoutes)
  @JoinColumn({ name: 'destination_id' })
  destination: Station;

  @OneToMany(() => Trip, (trip) => trip.route)
  trips: Trip[];
}
