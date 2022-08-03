import { IsString, IsNumber } from 'class-validator';
import { CurrentUserEntity } from 'src/current/models/current.users.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Image')
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsString()
  imageUrlLists: string;

  @Column({ nullable: true })
  @IsNumber()
  roomId: number;

  @Column({ nullable: true })
  @IsNumber()
  userId: number;

  @OneToMany(() => CurrentUserEntity, (currentusers) => currentusers.imageUrl)
  images: CurrentUserEntity;
}
