import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import { Request, Response } from 'express';
import Settings from '@configs/settings';

class UserController {
  public async index(req: Request, res: Response) {
    try {
      const { freeWord } = req.query;
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(Settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySorting', sortBy, sortOrder] },
        'withTotalLogin',
      ];
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      const { count, rows } = await UserModel.scope(scopes).findAndCountAll({ limit, offset });
      const users = rows;
      users.forEach((user) => user.setDataValue('password', undefined));
      sendSuccess(res, { users, pagination: { total: count, page, perPage: limit, offset } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new UserController();
