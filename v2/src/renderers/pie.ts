import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import type { PieData } from '../types';

export async function renderPie(data: PieData): Promise<Buffer> {
  const canvas = new ChartJSNodeCanvas({
    width: data.width,
    height: data.height,
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
      plugins: {
        title: {
          display: true,
          text: data.title,
          font: { size: data.fontSize || 14, weight: 'bold' as const },
        },
        legend: {
          position: 'bottom' as const,
        },
      },
      cutout: data.pieHole ? `${data.pieHole * 100}%` : undefined,
    },
  };

  return await canvas.renderToBuffer(config);
}
