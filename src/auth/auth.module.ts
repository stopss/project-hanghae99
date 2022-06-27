import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './jwt/local.strategy';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
