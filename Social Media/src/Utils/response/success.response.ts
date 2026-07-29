import { Response } from 'express';

interface SuccessResponseParams {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: unknown;
}

export const successResponse = ({
  res,
  statusCode = 200,
  message = 'Done',
  data = {},
}: SuccessResponseParams): Response => {
  return res.status(statusCode).json({ message, data });
};
