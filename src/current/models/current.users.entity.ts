import { EpisodeEntity } from 'src/episode/episode.entity';
import { ImageEntity } from 'src/images/images.entity';
import { RoomEntity } from 'src/rooms/models/rooms.entity';
import { UserEntity } from 'src/users/models/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('CurrentUser')
export class CurrentUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'userId', nullable: true })
  userId: number | null;

  @Column('int', { name: 'roomId', nullable: true })
  roomId: number | null;

  @Column('int', { name: 'episodeId', nullable: true })
  episodeId;

  @Column('int', { name: 'imageUrlId', nullable: true })
  imageUrlId;

  @Column()
  readyState: boolean;

  @ManyToOne(() => UserEntity, (user) => user.users)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: UserEntity;

  @ManyToOne(() => RoomEntity, (room) => room.rooms)
  @JoinColumn([{ name: 'roomId', referencedColumnName: 'id' }])
  room: RoomEntity;

  @ManyToOne(() => EpisodeEntity, (episode) => episode.episodes)
  @JoinColumn([{ name: 'episodeId', referencedColumnName: 'id' }])
  episode: EpisodeEntity;

  @ManyToOne(() => ImageEntity, (image) => image.images)
  @JoinColumn([{ name: 'imageUrlId', referencedColumnName: 'id' }])
  imageUrl: ImageEntity;
}
