import Fastify from 'fastify';

import { PORT, IS_DOCKER } from './constants';
import { createStaticFolder } from './utils';
import { log, error } from './utils/helper';
import {
  createTable, createCompare, createPie, createBar,
} from './visuals';

const app = Fastify();

// Create static folder
createStaticFolder();

app.get('/', async () => ({ detail: 'Visualize API is running!' }));

app.post('/table', async (req: any) => {
  // Get table dict from request body
  const { table } = req.body;

  if (!table || table.length === 0) {
    return {
      failure: 'Please, provide non-empty \'table\' in request body',
    };;
  }

  // Get image of png table
  const link = await createTable(table);

  // Send back data
  return link ? { link } : { failure: 'Error on the server!' };
});

app.post('/compare', async (req) => {
  // Get compare dict from request body
  const compare = req.body;

  // Get image of png compare table
  const link = await createCompare(compare);

  // Send back data
  return link ? { link } : { failure: 'Error on the server!' };
});

app.post('/pie', async (req) => {
  const pieData = req.body;

  // Get image of png table
  const link = await createPie(pieData);

  // Send back data
  return link ? { link } : { failure: 'Error on the server!' };
});

app.post('/bar', async (req, res) => {
  const barData = req.body;

  // Get image of png table
  const link = await createBar(barData);

  // Send back data
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
