import { jwtConstants } from './jwt/constants';
import { UsersModule } from './../users/users.module';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.request.dto';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthProviders } from './models/auth.provider';
import { DatabaseModule } from 'src/common/database/database.module';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1y' },
    }),
  ],
  providers: [
    AuthService,
    LoginUserDto,
    JwtStrategy,
    JwtAuthGuard,
    ...AuthProviders,
  ],
  exports: [AuthService, LoginUserDto],
})
export class AuthModule {}
