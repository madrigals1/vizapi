import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import type { Chart, ArcElement } from 'chart.js' with { 'resolution-mode': 'import' };
import type { PieData } from '../types';

const MARGIN = 8;

function percentLabelPlugin(labelColor: string) {
  return {
    id: 'piePercentLabels',
    afterDatasetsDraw(chart: Chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      const dataset = chart.data.datasets[0];
      const values = (dataset.data as number[]).map((v) => Number(v));
      const total = values.reduce((sum, v) => sum + v, 0);
      if (total <= 0) {
        return;
      }

      ctx.save();
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = labelColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const arcs = meta.data as ArcElement[];
      arcs.forEach((arc, index) => {
        const midAngle = (arc.startAngle + arc.endAngle) / 2;
        const radius = (arc.innerRadius + arc.outerRadius) / 2;
        const x = arc.x + Math.cos(midAngle) * radius;
        const y = arc.y + Math.sin(midAngle) * radius;
        const pct = Math.round((values[index] / total) * 100);
        ctx.fillText(`${pct}%`, x, y);
      });

      ctx.restore();
    },
  };
}

export async function renderPie(data: PieData): Promise<Buffer> {
  const canvas = new ChartJSNodeCanvas({
    width: data.width + MARGIN * 2,
    height: data.height + MARGIN * 2,
  });

  const config = {
    type: 'pie' as const,
    data: {
      labels: data.sliceData.map((row) => row.sliceName),
      datasets: [{
        data: data.sliceData.map((row) => row.sliceValue),
        backgroundColor: data.sliceData.map((row) => row.sliceColor),
        borderColor: '#ffffff',
        borderWidth: 2,
      }],
    },
    plugins: [percentLabelPlugin('#ffffff')],
    options: {
      layout: { padding: MARGIN },
      plugins: {
        title: {
          display: true,
          text: data.title,
          font: { size: data.fontSize || 14, weight: 'bold' as const },
        },
        legend: {
          position: 'right' as const,
          labels: {
            generateLabels(chart: Chart) {
              const labels = chart.data.labels as string[];
              const dataset = chart.data.datasets[0];
              const colors = (dataset.backgroundColor as string[]) || [];
              const borderColor = dataset.borderColor as string;
              const borderWidth = dataset.borderWidth as number;
              return labels.map((label, i) => ({
                text: `${label}  ${Number(dataset.data[i])}`,
                fillStyle: colors[i],
                strokeStyle: borderColor,
                lineWidth: borderWidth,
                hidden: false,
                index: i,
              }));
            },
          },
        },
      },
      cutout: data.pieHole !== undefined ? `${data.pieHole * 100}%` : '40%',
    },
  };

  return await canvas.renderToBuffer(config);
}
