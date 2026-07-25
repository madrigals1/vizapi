import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import type { BarData } from '../types';

export async function renderBar(data: BarData): Promise<Buffer> {
  const canvas = new ChartJSNodeCanvas({
    width: data.options.width,
    height: data.options.height,
  });

  const header = data.data[0] as string[];
  const rows = data.data.slice(1) as unknown[];

  const labels = rows.map((r) => (r as unknown[])[0]);
  const datasets = header.slice(1).map((label, i) => ({
    label,
    data: rows.map((r) => Number((r as unknown[])[i + 1])),
    backgroundColor: `hsl(${i * 60}, 60%, 50%)`,
  }));

  const config = {
    type: 'bar' as const,
    data: { labels, datasets },
    options: {
      plugins: {
        legend: {
          display: datasets.length > 1,
          position: 'bottom' as const,
        },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  };

  return await canvas.renderToBuffer(config);
}
