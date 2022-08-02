import { IsString, IsNumber } from 'class-validator';
import { CurrentUserEntity } from 'src/current/models/current.users.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Episode')
export class EpisodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  kind: string;

  @Column()
  @IsString()
  description: string;

  @Column()
  @IsString()
  imageSrc: string;

  @Column()
  @IsNumber()
  age: number;

  @Column()
  @IsString()
  gender: string;

  @Column()
  @IsString()
  job: string;

  @OneToMany(() => CurrentUserEntity, (currentusers) => currentusers.episode)
  episodes: CurrentUserEntity;
}
