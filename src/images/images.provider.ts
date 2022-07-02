import { DataSource } from 'typeorm';
import { ImageEntity } from './images.entity';

export const userProviders = [
  {
    provide: 'IMAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ImageEntity),
    inject: ['DATA_SOURCE'],
  },
];
