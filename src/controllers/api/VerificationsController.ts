import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { InvalidAuthenticationCode } from '@libs/errors';
import Settings from '@configs/settings';

class VerificationController {
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
      sendSuccess(res, { accessToken, tokenExpireAt: dayjs().add(Settings.jwt.ttl, 'seconds') });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new VerificationController();
