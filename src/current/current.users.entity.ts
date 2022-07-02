import { EpisodeEntity } from 'src/episode/episode.entity';
import { ImageEntity } from 'src/images/images.entity';
import { RoomEntity } from 'src/rooms/models/rooms.entity';
import { UserEntity } from 'src/users/models/users.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('CurrentUser')
export class CurrentUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.users)
  user: UserEntity;

  @ManyToOne(() => RoomEntity, (room) => room.rooms)
  room: RoomEntity;

  @OneToOne(() => EpisodeEntity)
  @JoinColumn()
  episode: EpisodeEntity;

  @OneToOne(() => ImageEntity)
  @JoinColumn()
  imageUrl: ImageEntity;
}
