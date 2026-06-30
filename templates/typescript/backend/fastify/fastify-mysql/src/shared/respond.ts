import { FastifyReply } from 'fastify';
import { ApiResponse } from '@appTypes';

export const respond = <T>(
  reply: FastifyReply,
  status: number,
  message: string,
  data?: T
): FastifyReply => {
  const body: ApiResponse<T> = { success: status < 400, message, ...(data !== undefined && { data }) };
  return reply.status(status).send(body);
};
