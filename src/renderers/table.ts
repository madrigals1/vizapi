import { renderSvg } from './satori';
import type { TableData } from '../types';

const SVG_WIDTH = 900;
const PADDING = 16;
const CHAR_W = 8;
const LINE_H = 20;
const CELL_PAD = 16;
const MIN_ROW_H = 36 + 9;
const HEADER_H = LINE_H + CELL_PAD * 2;
const MAX_COL_W = 180;

function colWidths(columns: string[], data: TableData): number[] {
  const available = SVG_WIDTH - PADDING * 2;
  const natural = columns.map((col) => {
    const headerW = col.length * CHAR_W + CELL_PAD * 2;
    const maxCellW = Math.max(...data.map((r) => String(r[col]).length * CHAR_W + CELL_PAD * 2));
    return Math.min(MAX_COL_W, Math.max(headerW, maxCellW));
  });
  const total = natural.reduce((a, b) => a + b, 0);
  return natural.map((w) => Math.floor((w / total) * available));
}

function rowHeight(cells: string[], colWidths: number[]): number {
  const lines = cells
    .map((text, i) => Math.ceil((text.length * CHAR_W + CELL_PAD * 2) / colWidths[i]));
  return Math.max(MIN_ROW_H, Math.max(...lines) * LINE_H + 9);
}

export async function renderTableSvg(data: TableData): Promise<string> {
  if (!data.length) {
    throw new Error('Table data is empty');
  }

  const columns = Object.keys(data[0]);
  const widths = colWidths(columns, data);

  let height = PADDING + HEADER_H;
  for (const row of data) {
    height += rowHeight(columns.map((c) => String(row[c])), widths);
  }
  height += PADDING;

  const cell = (text: string, i: number, bold = false) => ({
    type: 'div',
    props: {
      style: {
        width: widths[i],
        minWidth: widths[i],
        paddingTop: 8,
        paddingBottom: 1,
        paddingLeft: CELL_PAD,
        paddingRight: CELL_PAD,
        fontSize: bold ? 14 : 13,
        fontWeight: bold ? 'bold' : 'normal',
        color: '#333333',
      },
      children: text,
    },
  });

  return renderSvg({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        padding: PADDING,
        backgroundColor: '#ffffff',
        fontFamily: 'DejaVu Sans',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: '#f5f5f5',
              borderBottom: '1px solid #ddd',
              height: HEADER_H,
            },
            children: columns.map((col, i) => cell(col, i, true)),
          },
        },
        ...data.map((row, ri) => ({
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: ri % 2 === 0 ? '#fff' : '#f0f0f0',
              borderBottom: '1px solid #ddd',
              height: rowHeight(columns.map((c) => String(row[c])), widths),
            },
            children: columns.map((col, i) => cell(String(row[col]), i)),
          },
        })),
      ],
    },
  }, SVG_WIDTH, height);
}
