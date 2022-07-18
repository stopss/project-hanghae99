import { CurrentUserEntity } from 'src/current/models/current.users.entity';
import { UserEntity } from 'src/users/models/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Room')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  count: number;

  @Column()
  hintTime: string;

  @Column()
  reasoningTime: string;

  @Column()
  master: string;

  @Column()
  isRandom: string;

  @Column({ default: 'standby' })
  roomState: string;

  @Column({ nullable: true })
  roomUniqueId: string;

  @Column({ nullable: true })
  userId: number;

  @Column({ default: 0 })
  hintReady: number;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.rooms)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: UserEntity;

  @OneToMany(() => CurrentUserEntity, (currentusers) => currentusers.room)
  rooms: CurrentUserEntity;
}
