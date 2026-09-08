import { NextFunction, Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { successResponse } from '../../Utils/response/success.response';

export class NotificationController {
  private readonly _notificationService = new NotificationService();

  getUserNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, sort } = req.query;

      const data = await this._notificationService.getUserNotifications({
        userId: req.user._id,
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        sort: (sort as string) || '-createdAt',
      });

      successResponse({
        res,
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
