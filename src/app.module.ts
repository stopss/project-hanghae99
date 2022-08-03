import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { LoggerMiddleware } from './common/middelwares/logger.middleware';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { CurrentUsersModule } from './current/current.users.module';
import { EpisodeModule } from './episode/episode.module';
import { ImagesModule } from './images/images.module';
import { LogModule } from './log/log.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/models/users.entity';
import { RoomEntity } from './rooms/models/rooms.entity';
import { CurrentUserEntity } from './current/models/current.users.entity';
import { EpisodeEntity } from './episode/episode.entity';
import { ImageEntity } from './images/images.entity';
import { GameLogEntity } from './log/models/logs.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3305,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      entities: [
        UserEntity,
        RoomEntity,
        CurrentUserEntity,
        EpisodeEntity,
        ImageEntity,
        GameLogEntity,
      ],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    RoomsModule,
    ChatsModule,
    CurrentUsersModule,
    EpisodeModule,
    ImagesModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
