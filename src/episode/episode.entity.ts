import { IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
