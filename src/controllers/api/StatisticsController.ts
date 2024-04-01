import { sendError, sendSuccess } from '@libs/response';
import UserModel from '@models/users';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

class StatisticController {
  public async show(req: Request, res: Response) {
    try {
      const totalUsersCount = await UserModel.count();
      const totalUsersActiveToday = await UserModel.scope([
        { method: ['byActiveIn', dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()] },
      ])
        .count();
      const totalUsersActiveThisWeek = await UserModel.scope([
        { method: ['byActiveIn', dayjs().startOf('week').toDate(), dayjs().endOf('week').toDate()] },
      ])
        .count();
      sendSuccess(res, { totalUsersCount, totalUsersActiveToday, totalUsersActiveThisWeek });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new StatisticController();
