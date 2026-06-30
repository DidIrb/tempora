import { FastifyInstance } from 'fastify';
import { signup, login } from '@controllers';

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/signup', {
    schema: {
      tags: ['Auth'],
      summary: 'Register a new user',
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', example: 'jane@example.com' },
          password: { type: 'string', example: 'secret123' },
        },
      },
    },
    handler: signup,
  });

  fastify.post('/login', {
    schema: {
      tags: ['Auth'],
      summary: 'Login with email and password',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'jane@example.com' },
          password: { type: 'string', example: 'secret123' },
        },
      },
    },
    handler: login,
  });
};
