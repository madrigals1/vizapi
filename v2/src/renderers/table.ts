import type { TableData } from '../types';

const ROW_HEIGHT = 36;
const HEADER_HEIGHT = 40;
const PADDING = 12;
const FONT_FAMILY = 'Arial, sans-serif';

function escapeXml(s: unknown): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderTableSvg(data: TableData): string {
  if (data.length === 0) {
    throw new Error('Table data is empty');
  }

  const columns = Object.keys(data[0]);

  const colWidth = Math.floor(860 / columns.length);

  const totalHeight = HEADER_HEIGHT + data.length * ROW_HEIGHT + PADDING * 2;

  let rows = '';

  // Header
  rows += `  <rect x="0" y="0" width="${860}" height="${HEADER_HEIGHT}" fill="#f5f5f5" stroke="#ddd" stroke-width="1"/>\n`;
  columns.forEach((col, i) => {
    const x = i * colWidth;
    rows += `  <text x="${x + 8}" y="${HEADER_HEIGHT / 2 + 5}" font-family="${FONT_FAMILY}" font-size="14" font-weight="bold" fill="#333">${escapeXml(col)}</text>\n`;
    if (i > 0) {
      rows += `  <line x1="${x}" y1="0" x2="${x}" y2="${HEADER_HEIGHT}" stroke="#ddd" stroke-width="1"/>\n`;
    }
  });

  // Data rows
  data.forEach((row, ri) => {
    const y = HEADER_HEIGHT + ri * ROW_HEIGHT;
    const bg = ri % 2 === 0 ? '#ffffff' : '#f0f0f0';
    rows += `  <rect x="0" y="${y}" width="${860}" height="${ROW_HEIGHT}" fill="${bg}" stroke="#ddd" stroke-width="1"/>\n`;
    columns.forEach((col, ci) => {
      const x = ci * colWidth;
      rows += `  <text x="${x + 8}" y="${y + ROW_HEIGHT / 2 + 5}" font-family="${FONT_FAMILY}" font-size="13" fill="#333">${escapeXml(row[col])}</text>\n`;
      if (ci > 0) {
        rows += `  <line x1="${x}" y1="${y}" x2="${x}" y2="${y + ROW_HEIGHT}" stroke="#ddd" stroke-width="1"/>\n`;
      }
    });
  });

  return `<svg width="860" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="860" height="${totalHeight}" fill="#fff"/>
${rows}
</svg>`;
}
