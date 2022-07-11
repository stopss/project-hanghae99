import { CurrentUsersModule } from './../current/current.users.module';
import { DatabaseModule } from './../common/database/database.module';
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { userProviders } from './models/users.provider';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/constants';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    DatabaseModule,
    CurrentUsersModule,
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1y' },
    }),
    forwardRef(() => LogModule),
  ],
  providers: [UsersService, ...userProviders],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
