import { DataSource } from 'typeorm';
import { ImageEntity } from './images.entity';

export const ImageProvider = [
  {
    provide: 'IMAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ImageEntity),
    inject: ['DATA_SOURCE'],
  },
];
