import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import type { PieData } from '../types';

const MARGIN = 8;

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
        },
      },
      cutout: data.pieHole !== undefined ? `${data.pieHole * 100}%` : '40%',
    },
  };

  return await canvas.renderToBuffer(config);
}
