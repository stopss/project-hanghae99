import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_SECRET_CODE,
      callbackURL: 'http://localhost:8080/users/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const { emails, name } = profile;
    const user = {
      email: emails[0].value,
      nickname: name.familyName + name.givenName,
    };
    const payload = {
      user,
      accessToken,
      refreshToken,
    };
    done(null, payload);
  }
}
