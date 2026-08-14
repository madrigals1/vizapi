import { renderHtml, jsString } from '../browser';
import type { PieData } from '../types';
import { ECHARTS_SOURCE } from './echarts';
import { compileTemplate } from './templates/template';

const MARGIN = 8;

const template = compileTemplate<{
  width: number;
  height: number;
  echartsSource: string;
  title: string;
  fontSize: number;
  inner: number;
  slices: string;
}>('pie.hbs');

export async function renderPie(data: PieData): Promise<Buffer> {
  const width = data.width + MARGIN * 2;
  const height = data.height + MARGIN * 2;
  const fontSize = data.fontSize || 14;
  const inner = data.pieHole !== undefined ? Math.round(data.pieHole * 100) : 40;

  const slicesSource =
    '[\n' +
    data.sliceData
      .map((s) => {
        const name = jsString(s.sliceName);
        const value = Number(s.sliceValue) || 0;
        const color = jsString(s.sliceColor);
        return `  { name: ${name}, value: ${value}, itemStyle: { color: ${color} } }`;
      })
      .join(',\n') +
    '\n]';

  const html = template({
    width,
    height,
    echartsSource: ECHARTS_SOURCE,
    title: jsString(data.title),
    fontSize,
    inner,
    slices: slicesSource,
  });

  return renderHtml(html, { width, height, waitRaf: true });
}
