import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { BadAuthentication, InvalidAuthenticationCode } from '@libs/errors';
import Settings from '@configs/settings';
import UserLoginHistoryModel from '@models/userLoginHistories';

class VerificationController {
  public async create(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.scope([
        { method: ['byEmail', email] },
      ]).findOne();
      if (!user || !(await user.validPassword(password))) {
        return sendError(res, 404, BadAuthentication);
      }
      if (!user.verificationAt) user.sendVerificationEmail();
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async verify(req: Request, res: Response) {
    try {
      const { code } = req.body;
      const user = await UserModel.scope([
        { method: ['byVerificationCode', code] },
      ]).findOne();
      if (!user) return sendError(res, 404, InvalidAuthenticationCode);
      await user.update({ verificationCode: null, verificationAt: dayjs() });
      const accessToken: string = await user.generateAccessToken();
      await user.update({ lastLoginAt: dayjs() });
      await UserLoginHistoryModel.create({ id: undefined, userId: user.id });
      sendSuccess(res, { accessToken, tokenExpireAt: dayjs().add(Settings.jwt.ttl, 'seconds') });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new VerificationController();
