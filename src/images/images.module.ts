import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/common/database/database.module';
import { ImageEntity } from './images.entity';
import { ImageProvider } from './images.provider';
import { ImageService } from './images.services';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([ImageEntity])],
  providers: [...ImageProvider, ImageService],
  exports: [ImageService],
})
export class ImagesModule {}
