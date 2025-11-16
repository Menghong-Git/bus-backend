import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { PassengerProfile } from '../../passenger-profiles/entities/passenger-profile.entity';
import { OperatorProfile } from '../../operator-profiles/entities/operator-profile.entity';
import { AdminProfile } from '../../admin-profiles/entities/admin-profile.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column() // Make sure this column exists and is not nullable
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PASSENGER,
  })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'otp_code', nullable: true })
  otpCode: string;

  @Column({ name: 'otp_expires_at', type: 'timestamp', nullable: true })
  otpExpiresAt: Date;

  @Column({ name: 'profile_image', nullable: true })
  profileImage: string;

  // Relationships
  @OneToOne(() => PassengerProfile, (passengerProfile) => passengerProfile.user, { cascade: true })
  passengerProfile: PassengerProfile;

  @OneToOne(() => OperatorProfile, (operatorProfile) => operatorProfile.user, { cascade: true })
  operatorProfile: OperatorProfile;

  @OneToOne(() => AdminProfile, (adminProfile) => adminProfile.user, { cascade: true })
  adminProfile: AdminProfile;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}