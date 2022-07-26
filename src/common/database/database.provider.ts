import { ImageEntity } from './../../images/images.entity';
import { CurrentUserEntity } from 'src/current/models/current.users.entity';
import { EpisodeEntity } from 'src/episode/episode.entity';
import { RoomEntity } from 'src/rooms/models/rooms.entity';
import { UserEntity } from 'src/users/models/users.entity';
import { DataSource } from 'typeorm';
import { GameLogEntity } from 'src/log/models/logs.entity';
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: 3306,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
          UserEntity,
          RoomEntity,
          CurrentUserEntity,
          EpisodeEntity,
          ImageEntity,
          GameLogEntity,
        ],
        synchronize: true,
      });
      return dataSource.initialize();
    },
  },
];
