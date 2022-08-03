import { UserEntity } from 'src/users/models/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('auth')
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('int', { name: 'userId', nullable: true })
  userId: number | null;

  @Column({ nullable: true })
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.auth)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: UserEntity;
}
