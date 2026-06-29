import { Response } from 'express';
import { ApiResponse } from '@appTypes';

export const respond = <T>(
  res: Response,
  status: number,
  message: string,
  data?: T
): void => {
  const body: ApiResponse<T> = { success: status < 400, message, ...(data !== undefined && { data }) };
  res.status(status).json(body);
};
