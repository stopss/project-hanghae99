import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
