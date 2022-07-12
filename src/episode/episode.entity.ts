import { IsString } from 'class-validator';
import { CurrentUserEntity } from 'src/current/models/current.users.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Episode')
export class EpisodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  role: string;

  @Column()
  @IsString()
  description: string;

  @OneToMany(() => CurrentUserEntity, (currentusers) => currentusers.episode)
  episodes: CurrentUserEntity;
}
