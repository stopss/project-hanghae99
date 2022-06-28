import { jwtConstants } from './jwt/constants';
import { UsersModule } from './../users/users.module';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.request.dto';
import { KaKaoStrategy } from './strategy/kakao.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { NaverStrategy } from './strategy/naver.strategy';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    KaKaoStrategy,
    FacebookStrategy,
    NaverStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService, LoginUserDto],
})
export class AuthModule {}
