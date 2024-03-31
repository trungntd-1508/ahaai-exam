import { BadAuthentication, NewPasswordCannotBeTheSame } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';

class PasswordController {
  public async update(req: Request, res: Response) {
    try {
      const { password, passwordConfirmation, currentPassword } = req.body;
      const currentUser = await UserModel.findByPk(req.currentUser.id);
      if (!(await currentUser.validPassword(currentPassword))) return sendError(res, 404, BadAuthentication);
      if (await currentUser.validPassword(password)) return sendError(res, 400, NewPasswordCannotBeTheSame);
      await currentUser.update({ password, passwordConfirmation });
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new PasswordController();
