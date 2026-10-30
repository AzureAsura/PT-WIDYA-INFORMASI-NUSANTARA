import { readFileSync } from 'node:fs';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { parse } from 'yaml';
import { env } from './config/env.js';
import authRoutes from './features/auth/auth.routes.js';
import usersRoutes from './features/users/users.routes.js';
import { errorHandler, notFound } from './middlewares/error.js';

const app = express();
const openapi = parse(readFileSync(new URL('../docs/openapi.yaml', import.meta.url), 'utf8'));

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server listening on port ${env.port}`);
});
