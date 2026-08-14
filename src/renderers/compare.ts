import { get } from 'node:https';
import { renderHtml } from '../browser';
import { RENDER_TIMEOUT_MS } from '../constants';
import type { CompareData } from '../types';
import { compileTemplate } from './templates/template';

const CARD_GAP = 10;
const CARD_PADDING = 15;
const IMAGE_SIZE = 150;
const CARD_W = 430;

const BIGGER_COLOR = [102, 187, 106];
const SMALLER_COLOR = [229, 57, 53];

const template = compileTemplate<{
  width: number;
  gap: number;
  padding: number;
  cardW: number;
  imageSize: number;
  cards: {
    image: string;
    bioFields: { name: string; value: unknown }[];
    compareFields: {
      name: string;
      value: unknown;
      direction: 'left' | 'right';
      r: number;
      g: number;
      b: number;
      leftSide: boolean;
    }[];
  }[];
}>('compare.hbs');

function fetchImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const type = (res.headers['content-type'] || 'image/png').split(';')[0];
        resolve(`data:${type};base64,${buf.toString('base64')}`);
      });
      res.on('error', reject);
    });
    req.setTimeout(RENDER_TIMEOUT_MS, () => {
      req.destroy(new Error(`Image fetch timed out after ${RENDER_TIMEOUT_MS}ms`));
    });
    req.on('error', reject);
  });
}

interface CompareCardModel {
  image: string;
  bioFields: { name: string; value: unknown }[];
  compareFields: {
    name: string;
    value: unknown;
    direction: 'left' | 'right';
    r: number;
    g: number;
    b: number;
    leftSide: boolean;
  }[];
}

function cardModel(
  side: CompareData['left'],
  isLeft: boolean,
  image: string,
): CompareCardModel {
  return {
    image,
    bioFields: side.bio_fields,
    compareFields: side.compare_fields.map((field) => {
      const [r, g, b] = field.bigger ? BIGGER_COLOR : SMALLER_COLOR;
      return {
        name: field.name,
        value: field.value,
        direction: isLeft ? 'left' : 'right',
        r,
        g,
        b,
        leftSide: isLeft,
      };
    }),
  };
}

export async function renderCompare(data: CompareData): Promise<Buffer> {
  const { left, right } = data;

  left.compare_fields.forEach(({ name, value: leftValue }) => {
    const rightField = right.compare_fields.find((f) => f.name === name)!;
    const rightValue = rightField.value;
    left.compare_fields.find((f) => f.name === name)!.bigger = leftValue >= rightValue;
    rightField.bigger = rightValue >= leftValue;
  });

  const [leftImage, rightImage] = await Promise.all([
    fetchImage(left.image),
    fetchImage(right.image),
  ]);

  const width = CARD_W * 2 + CARD_GAP + CARD_PADDING * 2;

  const html = template({
    width,
    gap: CARD_GAP,
    padding: CARD_PADDING,
    cardW: CARD_W,
    imageSize: IMAGE_SIZE,
    cards: [
      cardModel(left, true, leftImage),
      cardModel(right, false, rightImage),
    ],
  });

  return renderHtml(html, { width });
}
