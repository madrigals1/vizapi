import { renderHtml } from '../browser';
import type { TableData } from '../types';
import { compileTemplate } from './templates/template';

const WIDTH = 900;
const PADDING = 16;
const CHAR_W = 8;
const CELL_PAD = 16;
const MAX_COL_W = 180;

const HEADER_STYLE =
  'padding:8px ' + CELL_PAD + 'px;font-size:14px;font-weight:bold;color:#333333;' +
  'text-align:left;overflow-wrap:anywhere;word-break:break-word;';
const CELL_STYLE =
  'padding:8px ' + CELL_PAD + 'px;font-size:13px;color:#333333;' +
  'overflow-wrap:anywhere;word-break:break-word;';

const template = compileTemplate<{
  width: number;
  padding: number;
  colWidths: number[];
  columns: string[];
  headerStyle: string;
  cellStyle: string;
  rows: { bg: string; cells: unknown[] }[];
}>('table.hbs');

function colWidths(columns: string[], data: TableData): number[] {
  const available = WIDTH - PADDING * 2;
  const natural = columns.map((col) => {
    const headerW = col.length * CHAR_W + CELL_PAD * 2;
    const maxCellW = Math.max(...data.map((r) => String(r[col]).length * CHAR_W + CELL_PAD * 2));
    return Math.min(MAX_COL_W, Math.max(headerW, maxCellW));
  });
  const total = natural.reduce((a, b) => a + b, 0);
  return natural.map((w) => Math.floor((w / total) * available));
}

export async function renderTable(data: TableData): Promise<Buffer> {
  if (!data.length) {
    throw new Error('Table data is empty');
  }

  const columns = Object.keys(data[0]);
  const rows = data.map((row, ri) => ({
    bg: ri % 2 === 0 ? '#ffffff' : '#f0f0f0',
    cells: columns.map((col) => row[col]),
  }));

  const html = template({
    width: WIDTH,
    padding: PADDING,
    colWidths: colWidths(columns, data),
    columns,
    headerStyle: HEADER_STYLE,
    cellStyle: CELL_STYLE,
    rows,
  });

  return renderHtml(html, { width: WIDTH });
}
