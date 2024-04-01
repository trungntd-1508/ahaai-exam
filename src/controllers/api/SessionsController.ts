import { BadAuthentication } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';
import Settings from '@configs/settings';
import dayjs from 'dayjs';
import UserLoginHistoryModel from '@models/userLoginHistories';

class SessionController {
  public async create(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.scope([
        { method: ['byEmail', email] },
      ]).findOne();
      if (!user || !(await user.validPassword(password))) {
        return sendError(res, 404, BadAuthentication);
      }
      const accessToken: string = user.verificationAt ? await user.generateAccessToken() : undefined;
      const tokenExpireAt = accessToken ? dayjs().add(Settings.jwt.ttl, 'seconds') : undefined;
      await user.update({ lastLoginAt: dayjs() });
      await UserLoginHistoryModel.create({ id: undefined, userId: user.id });
      sendSuccess(res, { accessToken, tokenExpireAt, isVerify: !!user.verificationAt, email });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async newWithGoogle(req: Request, res: Response) {
    try {
      const user = await UserModel.findByPk(req.currentUser.id);
      const accessToken: string = user.verificationAt ? await user.generateAccessToken() : undefined;
      const tokenExpireAt = accessToken ? dayjs().add(Settings.jwt.ttl, 'seconds') : undefined;
      await user.update({ lastLoginAt: dayjs() });
      await UserLoginHistoryModel.create({ id: undefined, userId: user.id });
      sendSuccess(res, { accessToken, tokenExpireAt, isVerify: !!user.verificationAt });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async current(req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const user = await UserModel.findByPk(currentUser.id);
      user.setDataValue('password', null);
      sendSuccess(res, { user });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SessionController();
