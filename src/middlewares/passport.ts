import { Passport } from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
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

const jwtStrategy = new JwtStrategy(jwtOptions, async (req: Request, payload: { id: number }, next: any) => {
  try {
    const user = await UserModel.scope([
      { method: ['byId', payload.id] },
    ]).findOne();
    if (user) {
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

const passport = new Passport();

passport.use(jwtStrategy);

export {
  passport,
};
