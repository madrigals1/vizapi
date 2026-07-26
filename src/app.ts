import Fastify from 'fastify';
import sharp from 'sharp';

import { PORT, IS_DOCKER, STATIC_FOLDER } from './constants';
import { getUniquePath, savePng, ensureStaticFolder } from './utils';
import { log, error } from './helpers';
import type { TableData, CompareData, PieData, BarData } from './types';
import { renderTableSvg, renderCompareSvg, renderPie, renderBar } from './renderers';

const app = Fastify();

ensureStaticFolder();

app.get('/', async () => ({ detail: 'Visualize API v2 is running!' }));

app.get('/health', async () => ({
  status: 'ok',
  uptime: Math.floor(process.uptime()),
}));

async function svgToPng(svg: string): Promise<Buffer> {
  return sharp(Buffer.from(svg)).png().toBuffer();
}

app.post<{ Body: { table: TableData } }>('/table', async (req) => {
  const { table } = req.body;

  if (!table || table.length === 0) {
    return { failure: 'Please, provide non-empty \'table\' in request body' };
  }

  try {
    const svg = renderTableSvg(table);
    const buf = await svgToPng(svg);
    const path = getUniquePath('table');
    await savePng(buf, path.absolute);
    return { link: path.link };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    error(`Table render failed: ${msg}`);
    return { failure: 'Error on the server!' };
  }
});

app.post<{ Body: CompareData }>('/compare', async (req) => {
  try {
    const svg = await renderCompareSvg(req.body);
    const buf = await svgToPng(svg);
    const path = getUniquePath('compare');
    await savePng(buf, path.absolute);
    return { link: path.link };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    error(`Compare render failed: ${msg}`);
    return { failure: 'Error on the server!' };
  }
});

app.post<{ Body: PieData }>('/pie', async (req) => {
  try {
    const buf = await renderPie(req.body);
    const path = getUniquePath('pie');
    await savePng(buf, path.absolute);
    return { link: path.link };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    error(`Pie render failed: ${msg}`);
    return { failure: 'Error on the server!' };
  }
});

app.post<{ Body: BarData }>('/bar', async (req) => {
  try {
    const buf = await renderBar(req.body);
    const path = getUniquePath('bar');
    await savePng(buf, path.absolute);
    return { link: path.link };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    error(`Bar render failed: ${msg}`);
    return { failure: 'Error on the server!' };
  }
});

app.listen({ port: PORT, host: IS_DOCKER ? '0.0.0.0' : '127.0.0.1' }, (err, address) => {
  if (err) {
    error(err);
    process.exit(1);
  }
  log(`v2 server listening at ${address}`);
});
