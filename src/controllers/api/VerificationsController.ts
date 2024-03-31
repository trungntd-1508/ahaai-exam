import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';
import dayjs from 'dayjs';

class VerificationController {
  public async verify(req: Request, res: Response) {
    try {
      const { code } = req.fields;
      const user = await UserModel.scope([
        { method: ['byVerificationCode', code] },
      ]).findOne();
      if (user) {
        await user.update({ verificationCode: null, verificationAt: dayjs() });
      }
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new VerificationController();
