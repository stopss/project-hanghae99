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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    RoomsModule,
    ChatsModule,
    CurrentUsersModule,
    EpisodeModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
