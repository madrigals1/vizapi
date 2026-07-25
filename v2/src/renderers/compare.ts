import { render } from '../render';
import type { CompareData, CompareSide } from '../types';

const WIDTH = 1255;
const CARD_W = 600;
const CARD_H = 680;

function buildCard(sideData: CompareSide, cx: number): Record<string, unknown> {
  const bioFields = sideData.bio_fields.map((field, i) => ({
    name: String(field.name),
    value: String(field.value),
    bx: cx + 290,
    bvx: cx + 440,
    by: 30 + i * 30 + 15,
  }));

  const dividerY = 290;

  const compareFields = sideData.compare_fields.map((field, i) => {
    const fy = dividerY + 15 + i * 50;
    const dotColor = field.bigger ? '#449d44' : '#e91e63';
    const isLeft = cx === 15;

    return {
      cx: cx + 20,
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

  return {
    cx,
    ix: cx + 25,
    cx2: cx + CARD_W - 10,
    cardW: CARD_W,
    cardH: CARD_H,
    image: sideData.image,
    bioFields,
    dividerY,
    compareFields,
  };
}

export function renderCompareSvg(data: CompareData): string {
  const { left, right } = data;

  left.compare_fields.forEach(({ name, value: leftValue }) => {
    const rightField = right.compare_fields.find((f) => f.name === name)!;
    const rightValue = rightField.value;
    left.compare_fields.find((f) => f.name === name)!.bigger = leftValue >= rightValue;
    rightField.bigger = rightValue >= leftValue;
  });

  const cards = [
    buildCard(left, 15),
    buildCard(right, 15 + CARD_W + 25),
  ];

  return render('compare', {
    width: WIDTH,
    height: 710,
    cards,
  });
}
