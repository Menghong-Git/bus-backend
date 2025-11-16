import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Route } from '../../routes/entities/route.entity';

@Entity('stations')
export class Station extends BaseEntity {
  @Column()
  city: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: true })
  isActive: boolean;

  // Relationships
  @OneToMany(() => Route, (route) => route.origin)
  originatingRoutes: Route[];

  @OneToMany(() => Route, (route) => route.destination)
  destinationRoutes: Route[];
}
