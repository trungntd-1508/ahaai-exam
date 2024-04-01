import { Passport } from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as GoogleStrategy, StrategyOptionsWithRequest } from 'passport-google-oauth2';
import dotenv from 'dotenv';
import { Request } from 'express';
import UserModel from '@models/users';
import dayjs from 'dayjs';
import Settings from '@configs/settings';

dotenv.config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: Settings.jwt.secret,
  passReqToCallback: true,
};

const googleOptions: StrategyOptionsWithRequest = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: `${process.env.GOOGLE_OAUTH_CALLBACK_URL}`,
  passReqToCallback: true,
  scope: ['id', 'profileUrl', 'emails', 'name', 'photos', 'gender'],
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (req: Request, payload: { id: number }, next: any) => {
  try {
    const user = await UserModel.scope([
      { method: ['byId', payload.id] },
    ]).findOne();
    if (user && user.verificationAt) {
      req.currentUser = user;
      await user.update({ lastActiveAt: dayjs() });
      next(null, user);
    } else {
      next(null, false);
    }
  } catch (error) {
    console.log(error);
  }
});

const googleStrategy = new GoogleStrategy(googleOptions, async (req: Request, accessToken: any, refreshToken: any, profile: any, next: any) => {
  try {
    console.log(accessToken);
    const userDefaultAttributes: any = {
      googleUserId: profile.id,
      fullName: `${profile.name.familyName || 'User'} ${profile.name.givenName || Math.floor(100000 + Math.random() * 900000)}`,
      verificationAt: dayjs(),
      email: profile.email,
    };
    const user = (await UserModel.findOrCreate({
      where: { email: profile.email },
      defaults: userDefaultAttributes,
    }))[0];
    await user.update({ googleUserId: profile.id, verificationAt: user.verificationAt || dayjs() });
    req.currentUser = user;
    if (user) return next(null, user);
    next(null, false);
  } catch (error) {
    console.log(error);
  }
});

const passport = new Passport();

passport.use(jwtStrategy);
passport.use(googleStrategy);

export {
  passport,
};
