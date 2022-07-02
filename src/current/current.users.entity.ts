import { RoomEntity } from 'src/rooms/models/rooms.entity';
import { UserEntity } from 'src/users/models/users.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('CurrentUser')
export class CurrentUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.users)
  user: UserEntity;

  @ManyToOne(() => RoomEntity, (room) => room.rooms)
  room: RoomEntity;
}
