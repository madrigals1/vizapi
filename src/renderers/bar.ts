import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import type { BarData } from '../types';

const colors = ['#4CAF50', '#FFC107', '#F44336'];

const totalLabelPlugin = {
  id: 'totalLabel',
  afterDraw(chart: unknown) {
    const c = chart as {
      scales: Record<string, { getPixelForValue: (v: number) => number }>;
      data: { datasets: { data: number[] }[] };
      ctx: CanvasRenderingContext2D;
    };
    const xScale = c.scales.x;
    const yScale = c.scales.y;
    if (!xScale || !yScale || !c.ctx) {
      return;
    }

    const n = c.data.datasets[0].data.length;
    c.ctx.font = 'bold 13px Arial';
    c.ctx.fillStyle = '#333';
    c.ctx.textAlign = 'left';
    c.ctx.textBaseline = 'middle';

    for (let i = 0; i < n; i++) {
      const total = c.data.datasets.reduce((sum, ds) => sum + (ds.data[i] || 0), 0);
      const x = xScale.getPixelForValue(total) + 6;
      const y = yScale.getPixelForValue(i);
      c.ctx.fillText(`${total}`, x, y);
    }
  },
};

export async function renderBar(data: BarData): Promise<Buffer> {
  const canvas = new ChartJSNodeCanvas({
    width: data.options.width,
    height: data.options.height,
  });

  const header = data.data[0] as string[];
  const rows = data.data.slice(1) as unknown[];

  const withTotal = rows.map((r) => {
    const vals = (r as unknown[]).slice(1).map(Number);
    const total = vals.reduce((a, b) => a + b, 0);
    return { label: (r as unknown[])[0] as string, vals, total };
  });
  withTotal.sort((a, b) => b.total - a.total);

  const labels = withTotal.map((r) => r.label);
  const datasets = header.slice(1).map((label, i) => ({
    label,
    data: withTotal.map((r) => r.vals[i]),
    backgroundColor: colors[i % colors.length],
  }));

  const maxTotal = Math.max(...withTotal.map((r) => r.total));
  const xMax = Math.ceil(maxTotal * 1.2 / 10000) * 10000;

  const config = {
    type: 'bar' as const,
    data: { labels, datasets },
    options: {
      indexAxis: 'y' as const,
      plugins: {
        legend: {
          display: datasets.length > 1,
          position: 'bottom' as const,
        },
      },
      scales: {
        x: { beginAtZero: true, stacked: true, max: xMax },
        y: { stacked: true },
      },
    },
    plugins: [totalLabelPlugin],
  };

  return await canvas.renderToBuffer(config);
}
