import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import type { Chart, ArcElement } from 'chart.js' with { 'resolution-mode': 'import' };
import type { PieData } from '../types';

const MARGIN = 8;
const LEGEND_WIDTH = 196;
const LEGEND_GAP = 24;
const LEGEND_PADDING_RIGHT = LEGEND_GAP + LEGEND_WIDTH + MARGIN;

function legendPlugin() {
  return {
    id: 'pieLegend',
    afterDatasetsDraw(chart: Chart) {
      const { ctx, chartArea } = chart;
      const dataset = chart.data.datasets[0];
      const labels = chart.data.labels as string[];
      const values = (dataset.data as number[]).map((v) => Number(v));
      const colors = (dataset.backgroundColor as string[]) || [];

      const boxSize = 12;
      const rowGap = 8;
      const fontSize = 12;
      const lineHeight = 16;
      const legendWidth = LEGEND_WIDTH;
      const startX = chartArea.right + LEGEND_GAP;
      const legendHeight = labels.length * lineHeight + (labels.length - 1) * rowGap;
      let y = chartArea.top + (chartArea.height - legendHeight) / 2 + lineHeight / 2;

      ctx.save();
      ctx.textBaseline = 'middle';

      const valueWidth = 44;
      const nameX = startX + boxSize + 8;
      const nameMaxWidth = legendWidth - valueWidth;

      const fitName = (name: string): string => {
        if (ctx.measureText(name).width <= nameMaxWidth) {
          return name;
        }
        let short = name;
        while (short.length > 0 && ctx.measureText(`${short}…`).width > nameMaxWidth) {
          short = short.slice(0, -1);
        }
        return `${short}…`;
      };

      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'left';

      labels.forEach((label, i) => {
        const displayName = fitName(label);

        ctx.fillStyle = colors[i];
        ctx.fillRect(startX, y - boxSize / 2, boxSize, boxSize);

        ctx.fillText(displayName, nameX, y);

        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(String(values[i]), startX + legendWidth, y);

        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'left';

        y += lineHeight + rowGap;
      });

      ctx.restore();
    },
  };
}

function titlePlugin(title: string, fontSize: number) {
  return {
    id: 'pieTitle',
    beforeDatasetsDraw(chart: Chart) {
      const { ctx } = chart;
      ctx.save();
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = '#111111';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, chart.width / 2, MARGIN + fontSize / 2);
      ctx.restore();
    },
  };
}

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
    plugins: [
      titlePlugin(data.title, data.fontSize || 14),
      percentLabelPlugin('#ffffff'),
      legendPlugin(),
    ],
    options: {
      layout: {
        padding: {
          top: (data.fontSize || 14) + MARGIN + 12,
          right: LEGEND_PADDING_RIGHT,
          bottom: MARGIN,
          left: MARGIN,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      cutout: data.pieHole !== undefined ? `${data.pieHole * 100}%` : '40%',
    },
  };

  return await canvas.renderToBuffer(config);
}
