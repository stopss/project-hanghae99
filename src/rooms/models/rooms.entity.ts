import { CurrentUserEntity } from 'src/current/current.users.entity';
import { UserEntity } from 'src/users/models/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
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

  @Column()
  roomState: string;

  @Column({ nullable: true })
  roomUniqueId: string;

  @Column({nullable: true})
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.rooms)
  @JoinColumn([{name: 'userId', referencedColumnName: 'id'}])
  user: UserEntity;

  @OneToMany(() => CurrentUserEntity, (currentusers) => currentusers.room)
  rooms: CurrentUserEntity;
}
