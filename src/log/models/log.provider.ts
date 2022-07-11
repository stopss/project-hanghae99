import { DataSource } from 'typeorm';
import { GameLogEntity } from './logs.entity';

export const logProviders = [
  {
    provide: 'LOG_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(GameLogEntity),
    inject: ['DATA_SOURCE'],
  },
];
