import { get } from 'node:https';
import { render } from '../render';
import type { CompareData, CompareSide } from '../types';

const WIDTH = 1240;
const CARD_W = 600;
const PADDING = 15;

function fetchImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const type = (res.headers['content-type'] || 'image/png').split(';')[0];
        resolve(`data:${type};base64,${buf.toString('base64')}`);
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function buildCard(sideData: CompareSide, cx: number): Promise<Record<string, unknown>> {
  const bioFields = sideData.bio_fields.map((field, i) => ({
    name: String(field.name),
    value: String(field.value),
    bx: cx + 270,
    bvx: cx + 590,
    by: 30 + i * 30 + 15,
  }));

  const dividerY = 285;

  const compareFields = sideData.compare_fields.map((field, i) => {
    const fy = dividerY + 15 + i * 50;
    const dotColor = field.bigger ? '#449d44' : '#e91e63';
    const isLeft = cx === 15;

    return {
      cx: isLeft ? cx + 20 : cx + CARD_W - 20,
      cy: fy + 20,
      dotColor,
      name: String(field.name),
      value: String(field.value),
      nx: isLeft ? cx + 40 : cx + CARD_W - 40,
      ny: fy + 25,
      nw: isLeft ? 'bold' : 'normal',
      nc: isLeft ? '#333' : '#666',
      na: isLeft ? 'start' : 'end',
      vx: isLeft ? cx + CARD_W - 15 : cx + 15,
      va: isLeft ? 'end' : 'start',
      vc: isLeft ? '#666' : '#333',
    };
  });

  const image = await fetchImage(sideData.image);
  const cardH = dividerY + sideData.compare_fields.length * 50;

  return {
    cx,
    ix: cx + 10,
    cx2: cx + CARD_W - 10,
    cardW: CARD_W,
    cardH,
    image,
    bioFields,
    dividerY,
    compareFields,
  };
}

export async function renderCompareSvg(data: CompareData): Promise<string> {
  const { left, right } = data;

  left.compare_fields.forEach(({ name, value: leftValue }) => {
    const rightField = right.compare_fields.find((f) => f.name === name)!;
    const rightValue = rightField.value;
    left.compare_fields.find((f) => f.name === name)!.bigger = leftValue >= rightValue;
    rightField.bigger = rightValue >= leftValue;
  });

  const cards = await Promise.all([
    buildCard(left, PADDING),
    buildCard(right, PADDING + CARD_W + 10),
  ]);

  const maxCardH = Math.max(cards[0].cardH as number, cards[1].cardH as number);
  const svgH = maxCardH + PADDING * 2;

  return render('compare', {
    width: WIDTH,
    height: svgH,
    cards,
  });
}
