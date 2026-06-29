import { Request, Response } from 'express';
import { prisma, respond } from '@shared';
import { TodoBody } from '@appTypes';

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  const todos = await prisma.todo.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: 'desc' },
  });
  respond(res, 200, 'Todos fetched', todos);
};

export const createTodo = async (req: Request<{}, {}, TodoBody>, res: Response): Promise<void> => {
  const { title } = req.body;
  const todo = await prisma.todo.create({ data: { title, userId: req.user!.userId } });
  respond(res, 201, 'Todo created', todo);
};

export const updateTodo = async (req: Request<{ id: string }, {}, TodoBody>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const existing = await prisma.todo.findFirst({ where: { id, userId: req.user!.userId } });
  if (!existing) { respond(res, 404, 'Todo not found'); return; }
  const todo = await prisma.todo.update({ where: { id }, data: req.body });
  respond(res, 200, 'Todo updated', todo);
};

export const deleteTodo = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const existing = await prisma.todo.findFirst({ where: { id, userId: req.user!.userId } });
  if (!existing) { respond(res, 404, 'Todo not found'); return; }
  await prisma.todo.delete({ where: { id } });
  respond(res, 200, 'Todo deleted');
};
