import { DataSource } from 'typeorm';
import { EpisodeEntity } from './episode.entity';

export const userProviders = [
  {
    provide: 'EPISODE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EpisodeEntity),
    inject: ['DATA_SOURCE'],
  },
];
