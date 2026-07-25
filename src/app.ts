import Fastify from 'fastify';
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { PORT, IS_DOCKER } from './constants';
import { createStaticFolder } from './utils';
import { log, error } from './utils/helper';
import type { TableData, CompareData, PieData, BarData } from './types';
import {
  createTable, createCompare, createPie, createBar,
} from './visuals';

const app = Fastify();

createStaticFolder();

app.setErrorHandler((
  err: FastifyError,
  _req: FastifyRequest,
  reply: FastifyReply,
) => {
  const statusCode = err.statusCode ?? 500;
  error(`[${statusCode}] ${err.message}`);
  reply.status(statusCode).send({ failure: err.message });
});

app.setNotFoundHandler((_req: FastifyRequest, reply: FastifyReply) => {
  reply.status(404).send({ failure: 'Route not found' });
});

app.get('/', async () => ({ detail: 'Visualize API is running!' }));

app.post<{ Body: { table: TableData } }>('/table', async (req) => {
  const { table } = req.body;

  if (!table || table.length === 0) {
    return {
      failure: 'Please, provide non-empty \'table\' in request body',
    };
  }

  const link = await createTable(table);

  return link ? { link } : { failure: 'Error on the server!' };
});

app.post<{ Body: CompareData }>('/compare', async (req) => {
  const compare = req.body;

  const link = await createCompare(compare);

  return link ? { link } : { failure: 'Error on the server!' };
});

app.post<{ Body: PieData }>('/pie', async (req) => {
  const pieData = req.body;

  const link = await createPie(pieData);

  return link ? { link } : { failure: 'Error on the server!' };
});

app.post<{ Body: BarData }>('/bar', async (req, _reply) => {
  const barData = req.body;

  const link = await createBar(barData);

  return link ? { link } : { failure: 'Error on the server!' };
});

app.listen(
  {
    port: PORT,
    host: IS_DOCKER ? '0.0.0.0' : '127.0.0.1',
  },
  (err, address) => {
    if (err) {
      error(err);
      process.exit(1);
    }
    log(`Server listening at ${address}`);
  },
);
