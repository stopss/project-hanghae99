import { DatabaseModule } from './../common/database/database.module';
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { userProviders } from './models/users.provider';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/constants';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1y' },
    }),
  ],
  providers: [UsersService, ...userProviders],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
