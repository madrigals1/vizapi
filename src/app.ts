import Fastify from 'fastify';
import type { FastifyRequest } from 'fastify';

import { PORT, IS_DOCKER } from './constants';
import { createStaticFolder } from './utils';
import { log, error } from './utils/helper';
import type { TableData, CompareData, PieData, BarData } from './types';
import {
  createTable, createCompare, createPie, createBar,
} from './visuals';

const app = Fastify();

createStaticFolder();

app.get('/', async () => ({ detail: 'Visualize API is running!' }));

app.post('/table', async (req: FastifyRequest<{ Body: { table: TableData } }>) => {
  const { table } = req.body;

  if (!table || table.length === 0) {
    return {
      failure: 'Please, provide non-empty \'table\' in request body',
    };
  }

  const link = await createTable(table);

  return link ? { link } : { failure: 'Error on the server!' };
});

app.post('/compare', async (req: FastifyRequest<{ Body: CompareData }>) => {
  const compare = req.body;

  const link = await createCompare(compare);

  return link ? { link } : { failure: 'Error on the server!' };
});

app.post('/pie', async (req: FastifyRequest<{ Body: PieData }>) => {
  const pieData = req.body;

  const link = await createPie(pieData);

  return link ? { link } : { failure: 'Error on the server!' };
});

app.post('/bar', async (req: FastifyRequest<{ Body: BarData }>, _reply) => {
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
