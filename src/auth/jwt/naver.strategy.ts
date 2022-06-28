import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';

export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/users/naver/redirect',
    });
  }

  async validate(accessToken, refreshToken, profile, doen) {
    const profileJson = profile._json;
    const { email, nickname, id } = profileJson;
    console.log(email, nickname, id);
    const payload = { email, nickname, id, accessToken, refreshToken };
    doen(null, payload);
  }
}
