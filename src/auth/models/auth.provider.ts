import { DataSource } from 'typeorm';
import { AuthEntity } from './auth.entity';

export const AuthProviders = [
  {
    provide: 'AUTH_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(AuthEntity),
    inject: ['DATA_SOURCE'],
  },
];
