import { UserEntity } from 'src/users/models/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('GameLog')
export class GameLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  roomTitle: string;

  @Column()
  role: string;

  @ManyToOne(() => UserEntity, (user) => user.logs)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: UserEntity;
}
