import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';

class CurrentUserController {
  public async update(req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const params = req.parameters.permit(UserModel.UPDATABLE_PARAMETERS).value();
      await currentUser.update(params);
      currentUser.setDataValue('password', null);
      sendSuccess(res, { currentUser });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new CurrentUserController();
