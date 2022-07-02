import { IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Image')
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  imageUrl: string;
}
