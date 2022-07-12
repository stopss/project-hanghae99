import { IsString } from 'class-validator';
import { CurrentUserEntity } from 'src/current/models/current.users.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Image')
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  imageUrl: string;

  @OneToMany(() => CurrentUserEntity, (currentusers) => currentusers.imageUrl)
  images: CurrentUserEntity;
}
