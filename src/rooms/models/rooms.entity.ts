import { CurrentUserEntity } from 'src/current/current.users.entity';
import { UserEntity } from 'src/users/models/users.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @ManyToOne(() => UserEntity, (user) => user.rooms)
  user: UserEntity;

  @OneToMany(() => CurrentUserEntity, (currentusers) => currentusers.room)
  rooms: CurrentUserEntity;
}
