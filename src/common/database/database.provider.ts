import { UserEntity } from 'src/users/models/users.entity';
import { DataSource } from 'typeorm';
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: 3305,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        entities: [__dirname + '/../**/*.entity{.ts,.js}', UserEntity],
        synchronize: true,
      });
      return dataSource.initialize();
    },
  },
];
