import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class OperatorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  driverName?: string;

  @Column({ nullable: true })
  driverPhone?: string;

  @Column({ nullable: true })
  licensePlate?: string;

  @Column({ nullable: true })
  busType?: string;

  @Column({ nullable: true })
  route?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.operatorProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
