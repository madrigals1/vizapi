import { renderHtml, jsString } from '../browser';
import type { BarData } from '../types';
import { ECHARTS_SOURCE } from './echarts';
import { compileTemplate } from './templates/template';

const colors = ['#4CAF50', '#FFC107', '#F44336'];

const template = compileTemplate<{
  width: number;
  height: number;
  echartsSource: string;
  rows: string;
  showLegend: boolean;
  gridBottom: number;
  xMax: number;
  seriesData: { name: string; color: string; isLast: boolean }[];
}>('bar.hbs');

export async function renderBar(data: BarData): Promise<Buffer> {
  const { width, height } = data.options;

  const header = data.data[0] as string[];
  const rows = data.data.slice(1) as unknown[];

  const withTotal = rows.map((r) => {
    const raw = r as unknown[];
    const vals = raw.slice(1).map(Number);
    const total = vals.reduce((a, b) => a + b, 0);
    return { label: String(raw[0]), vals, total };
  });
  withTotal.sort((a, b) => b.total - a.total);

  const seriesNames = header.slice(1);
  const maxTotal = Math.max(...withTotal.map((r) => r.total));
  const xMax = Math.ceil((maxTotal * 1.2) / 10000) * 10000;
  const showLegend = seriesNames.length > 1;

  const rowsSource =
    '[\n' +
    withTotal
      .map((r) => `  { label: ${jsString(r.label)}, vals: [${r.vals.join(', ')}], total: ${r.total} }`)
      .join(',\n') +
    '\n]';

  const html = template({
    width,
    height,
    echartsSource: ECHARTS_SOURCE,
    rows: rowsSource,
    showLegend,
    gridBottom: showLegend ? 36 : 12,
    xMax,
    seriesData: seriesNames.map((name, i) => ({
      name: jsString(name),
      color: jsString(colors[i % colors.length]),
      isLast: i === seriesNames.length - 1,
    })),
  });

  return renderHtml(html, { width, height, waitRaf: true });
}
