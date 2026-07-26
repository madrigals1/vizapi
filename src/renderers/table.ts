import { render } from '../render';
import type { TableData } from '../types';

const ROW_HEIGHT = 36;
const HEADER_HEIGHT = 40;
const TABLE_WIDTH = 860;
const MARGIN = 8;

export function renderTableSvg(data: TableData): string {
  if (data.length === 0) {
    throw new Error('Table data is empty');
  }

  const columns = Object.keys(data[0]);
  const colWidth = Math.floor(TABLE_WIDTH / columns.length);
  const tableHeight = HEADER_HEIGHT + data.length * ROW_HEIGHT;
  const svgWidth = TABLE_WIDTH + MARGIN * 2;
  const svgHeight = tableHeight + MARGIN * 2;

  const headers = columns.map((col, i) => ({
    text: col,
    x: MARGIN + i * colWidth + 8,
    y: MARGIN + HEADER_HEIGHT / 2 + 5,
  }));

  const rows = data.map((row, ri) => {
    const y = MARGIN + HEADER_HEIGHT + ri * ROW_HEIGHT;
    const y2 = y + ROW_HEIGHT;
    return {
      y,
      y2,
      rowH: ROW_HEIGHT,
      bg: ri % 2 === 0 ? '#ffffff' : '#f0f0f0',
      showBorder: true,
      cells: columns.map((col, ci) => ({
        text: String(row[col]),
        x: MARGIN + ci * colWidth + 8,
        ty: y + ROW_HEIGHT / 2 + 5,
      })),
    };
  });

  return render('table', {
    width: svgWidth,
    height: svgHeight,
    tableX: MARGIN,
    tableY: MARGIN,
    tableW: TABLE_WIDTH,
    tableXPlusW: MARGIN + TABLE_WIDTH,
    tableH: tableHeight,
    headerH: HEADER_HEIGHT,
    headerY: MARGIN,
    headers,
    rows,
  });
}
