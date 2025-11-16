import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('admin_profiles')
export class AdminProfile extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'admin_permissions', type: 'text' })
  adminPermissions: string;

  // Relationships
  @OneToOne(() => User, (user) => user.adminProfile)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
