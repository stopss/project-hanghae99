import { DataSource } from 'typeorm';
import { CurrentUserEntity } from './current.users.entity';

export const CurrentUsersProviders = [
  {
    provide: 'ROOM_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CurrentUserEntity),
    inject: ['DATA_SOURCE'],
  },
];
