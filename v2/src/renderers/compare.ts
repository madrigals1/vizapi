import type { CompareData, CompareSide } from '../types';

const WIDTH = 1255;
const CARD_W = 600;
const CARD_H = 680;
const FONT = 'Segoe UI, Arial, sans-serif';

function escapeXml(s: unknown): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildCard(sideData: CompareSide, cardIndex: 'left' | 'right'): string {
  const cx = cardIndex === 'left' ? 15 : 15 + CARD_W + 25;

  let svg = '';

  // Card background
  svg += `  <rect x="${cx}" y="15" width="${CARD_W}" height="${CARD_H}" rx="4" fill="#fff" stroke="#ddd" stroke-width="1"/>\n`;

  // Image
  svg += `  <image x="${cx + 25}" y="25" width="250" height="250" preserveAspectRatio="xMidYMid meet" href="${escapeXml(sideData.image)}"/>\n`;

  // Bio fields table
  const bioX = cx + 290;
  let bioY = 30;
  sideData.bio_fields.forEach((field) => {
    svg += `  <text x="${bioX}" y="${bioY + 15}" font-family="${FONT}" font-size="14" font-weight="bold" fill="#333">${escapeXml(field.name)}</text>\n`;
    svg += `  <text x="${bioX + 150}" y="${bioY + 15}" font-family="${FONT}" font-size="14" fill="#666" text-anchor="end">${escapeXml(field.value)}</text>\n`;
    bioY += 30;
  });

  // Divider
  const dividerY = 290;
  svg += `  <line x1="${cx + 10}" y1="${dividerY}" x2="${cx + CARD_W - 10}" y2="${dividerY}" stroke="#e0e0e0" stroke-width="1"/>\n`;

  // Compare fields
  const fieldStartY = dividerY + 15;
  sideData.compare_fields.forEach((field, i) => {
    const fy = fieldStartY + i * 50;
    const dotColor = field.bigger ? '#449d44' : '#e91e63';

    // Dot
    svg += `  <circle cx="${cx + 20}" cy="${fy + 20}" r="8" fill="${dotColor}"/>\n`;

    // Name + value
    if (cardIndex === 'left') {
      svg += `  <text x="${cx + 40}" y="${fy + 25}" font-family="${FONT}" font-size="16" font-weight="bold" fill="#333">${escapeXml(field.name)}</text>\n`;
      svg += `  <text x="${cx + CARD_W - 15}" y="${fy + 25}" font-family="${FONT}" font-size="16" fill="#666" text-anchor="end">${escapeXml(field.value)}</text>\n`;
    } else {
      svg += `  <text x="${cx + 15}" y="${fy + 25}" font-family="${FONT}" font-size="16" fill="#666">${escapeXml(field.value)}</text>\n`;
      svg += `  <text x="${cx + CARD_W - 40}" y="${fy + 25}" font-family="${FONT}" font-size="16" font-weight="bold" fill="#333" text-anchor="end">${escapeXml(field.name)}</text>\n`;
    }
  });

  return svg;
}

export function renderCompareSvg(data: CompareData): string {
  const { left, right } = data;

  // Enrich fields with bigger flag
  left.compare_fields.forEach(({ name, value: leftValue }) => {
    const rightField = right.compare_fields.find((f) => f.name === name)!;
    const rightValue = rightField.value;
    left.compare_fields.find((f) => f.name === name)!.bigger = leftValue >= rightValue;
    rightField.bigger = rightValue >= leftValue;
  });

  const leftCard = buildCard(left, 'left');
  const rightCard = buildCard(right, 'right');

  return `<svg width="${WIDTH}" height="710" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="710" fill="#f5f5f5"/>
${leftCard}
${rightCard}
</svg>`;
}
