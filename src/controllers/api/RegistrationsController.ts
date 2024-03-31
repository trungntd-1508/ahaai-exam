import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';

class RegistrationController {
  public async create(req: Request, res: Response) {
    try {
      const params = req.parameters.permit(UserModel.CREATABLE_PARAMETERS).value();
      const user = await UserModel.create(params);
      const result: any = user.toJSON();
      ['password', 'passwordConfirmation'].forEach(element => {
        delete result[element];
      });
      sendSuccess(res, { user: result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new RegistrationController();
