import { UsersService } from './../../users/services/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';
import { Payload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }
  async validate(payload: Payload) {
    //const id = payload.sub;
    //const user = await this.usersService.findUserById(parseInt(id));
    //console.log(user)
    //if (user) return user;
    //else throw new UnauthorizedException('접근 권한 없음');
    return payload;
  }
}
