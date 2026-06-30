import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma, respond } from '@shared';
import { TodoBody, TodoParams } from '@appTypes';

export const getTodos = async (request: FastifyRequest, reply: FastifyReply) => {
  const todos = await prisma.todo.findMany({
    where: { userId: request.user.userId },
    orderBy: { createdAt: 'desc' },
  });
  return respond(reply, 200, 'Todos fetched', todos);
};

export const createTodo = async (
  request: FastifyRequest<{ Body: TodoBody }>,
  reply: FastifyReply
) => {
  const todo = await prisma.todo.create({
    data: { title: request.body.title, userId: request.user.userId },
  });
  return respond(reply, 201, 'Todo created', todo);
};

export const updateTodo = async (
  request: FastifyRequest<{ Params: TodoParams; Body: Partial<TodoBody> }>,
  reply: FastifyReply
) => {
  const id = Number(request.params.id);
  const existing = await prisma.todo.findFirst({ where: { id, userId: request.user.userId } });
  if (!existing) return respond(reply, 404, 'Todo not found');
  const todo = await prisma.todo.update({ where: { id }, data: request.body });
  return respond(reply, 200, 'Todo updated', todo);
};

export const deleteTodo = async (
  request: FastifyRequest<{ Params: TodoParams }>,
  reply: FastifyReply
) => {
  const id = Number(request.params.id);
  const existing = await prisma.todo.findFirst({ where: { id, userId: request.user.userId } });
  if (!existing) return respond(reply, 404, 'Todo not found');
  await prisma.todo.delete({ where: { id } });
  return respond(reply, 200, 'Todo deleted');
};
