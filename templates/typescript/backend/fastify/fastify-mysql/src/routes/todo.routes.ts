import { FastifyInstance } from 'fastify';
import { getTodos, createTodo, updateTodo, deleteTodo } from '@controllers';

export const todoRoutes = async (fastify: FastifyInstance) => {
  // All todo routes require JWT — applied via onRequest hook
  const secured = { onRequest: [fastify.authenticate] };

  fastify.get('/', {
    ...secured,
    schema: { tags: ['Todos'], summary: 'Get all todos', security: [{ bearerAuth: [] }] },
    handler: getTodos,
  });

  fastify.post('/', {
    ...secured,
    schema: {
      tags: ['Todos'],
      summary: 'Create a todo',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title'],
        properties: { title: { type: 'string', example: 'Buy groceries' } },
      },
    },
    handler: createTodo,
  });

  fastify.put('/:id', {
    ...secured,
    schema: {
      tags: ['Todos'],
      summary: 'Update a todo',
      security: [{ bearerAuth: [] }],
      params: { type: 'object', properties: { id: { type: 'string' } } },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          completed: { type: 'boolean' },
        },
      },
    },
    handler: updateTodo,
  });

  fastify.delete('/:id', {
    ...secured,
    schema: {
      tags: ['Todos'],
      summary: 'Delete a todo',
      security: [{ bearerAuth: [] }],
      params: { type: 'object', properties: { id: { type: 'string' } } },
    },
    handler: deleteTodo,
  });
};
