import { EpisodeEntity } from 'src/episode/episode.entity';
import { ImageEntity } from 'src/images/images.entity';
import { RoomEntity } from 'src/rooms/models/rooms.entity';
import { UserEntity } from 'src/users/models/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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
  episodeId: number;

  @Column('int', { name: 'imageUrlId', nullable: true })
  imageUrlId: number;

  @Column({ default: false })
  readyState: boolean;

  @Column({ default: false })
  hintReady: boolean;

  @Column({ nullable: true })
  hintLists: string;

  @Column({ default: 0 })
  vote: number;

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
