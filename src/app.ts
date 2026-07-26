import Fastify from 'fastify';
import sharp from 'sharp';

import { PORT, IS_DOCKER } from './constants';
import { getUniquePath, savePng, ensureStaticFolder } from './utils';
import { log, error, debug } from './helpers';
import type { TableData, CompareData, PieData, BarData } from './types';
import { renderTableSvg, renderCompareSvg, renderPie, renderBar } from './renderers';

const app = Fastify();

ensureStaticFolder();

app.get('/', async () => ({ detail: 'Visualize API is running!' }));

app.get('/health', async () => ({
  status: 'ok',
  uptime: Math.floor(process.uptime()),
}));

async function svgToPng(svg: string): Promise<Buffer> {
  return sharp(Buffer.from(svg)).png().toBuffer();
}

app.post<{ Body: { table: TableData } }>('/table', async (req) => {
  const { table } = req.body;
  log('POST /table', { rows: table?.length, columns: table?.[0] ? Object.keys(table[0]).length : 0 });

  if (!table || table.length === 0) {
    log('POST /table - empty table');
    return { failure: 'Please, provide non-empty \'table\' in request body' };
  }

  try {
    const svg = renderTableSvg(table);
    debug('Table SVG generated', { svgLength: svg.length });
    const buf = await svgToPng(svg);
    debug('Table PNG generated', { bufLength: buf.length });
    const path = getUniquePath('table');
    await savePng(buf, path.absolute);
    log('POST /table - saved', { path: path.link });
    return { link: path.link };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    error('Table render failed', { error: msg, stack: err instanceof Error ? err.stack : undefined });
    return { failure: 'Error on the server!' };
  }
});

app.post<{ Body: CompareData }>('/compare', async (req) => {
  log('POST /compare', { hasLeft: !!req.body.left, hasRight: !!req.body.right });
  try {
    const svg = await renderCompareSvg(req.body);
    debug('Compare SVG generated', { svgLength: svg.length });
    const buf = await svgToPng(svg);
    debug('Compare PNG generated', { bufLength: buf.length });
    const path = getUniquePath('compare');
    await savePng(buf, path.absolute);
    log('POST /compare - saved', { path: path.link });
    return { link: path.link };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    error('Compare render failed', { error: msg, stack: err instanceof Error ? err.stack : undefined });
    return { failure: 'Error on the server!' };
  }
});

app.post<{ Body: PieData }>('/pie', async (req) => {
  log('POST /pie', { title: req.body.title, slices: req.body.sliceData?.length });
  try {
    const buf = await renderPie(req.body);
    debug('Pie PNG generated', { bufLength: buf.length });
    const path = getUniquePath('pie');
    await savePng(buf, path.absolute);
    log('POST /pie - saved', { path: path.link });
    return { link: path.link };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    error('Pie render failed', { error: msg, stack: err instanceof Error ? err.stack : undefined });
    return { failure: 'Error on the server!' };
  }
});

app.post<{ Body: BarData }>('/bar', async (req) => {
  log('POST /bar', { rows: req.body.data?.length, series: req.body.data?.[0]?.length });
  try {
    const buf = await renderBar(req.body);
    debug('Bar PNG generated', { bufLength: buf.length });
    const path = getUniquePath('bar');
    await savePng(buf, path.absolute);
    log('POST /bar - saved', { path: path.link });
    return { link: path.link };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    error('Bar render failed', { error: msg, stack: err instanceof Error ? err.stack : undefined });
    return { failure: 'Error on the server!' };
  }
});

app.listen({ port: PORT, host: IS_DOCKER ? '0.0.0.0' : '127.0.0.1' }, (err, address) => {
  if (err) {
    error(err);
    process.exit(1);
  }
  log(`VizAPI server is listening at ${address}`);
});
