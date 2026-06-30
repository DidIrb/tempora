import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { authRouter, todoRouter } from '@routes';
import { errorHandler } from '@middleware';
import { config, swaggerSpec } from '@shared';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRouter);
app.use('/api/todos', todoRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
  console.log(`API Docs at  http://localhost:${config.port}/api/docs`);
});
