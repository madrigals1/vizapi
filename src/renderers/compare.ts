import { get } from 'node:https';
import { renderSvg } from './satori';
import type { CompareData, CompareSide } from '../types';

const CARD_GAP = 10;
const CARD_PADDING = 15;
const IMAGE_SIZE = 150;

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

function buildCard(sideData: CompareSide, isLeft: boolean) {
  const bioFields = sideData.bio_fields.map((field) => ({
    name: String(field.name),
    value: field.value == null ? '' : String(field.value),
  }));

  const compareFields = sideData.compare_fields.map((field) => ({
    name: String(field.name),
    value: field.value == null ? '' : String(field.value),
    dotColor: field.bigger ? '#449d44' : '#e91e63',
    nameColor: isLeft ? '#333333' : '#666666',
    valueColor: isLeft ? '#666666' : '#333333',
    nameWeight: isLeft ? ('bold' as const) : ('normal' as const),
    nameAlign: isLeft ? ('flex-start' as const) : ('flex-end' as const),
    valueAlign: isLeft ? ('flex-end' as const) : ('flex-start' as const),
  }));

  return { bioFields, compareFields, isLeft };
}

function cardElement(card: ReturnType<typeof buildCard>, image: string) {
  const CARD_W = 600;

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: CARD_W,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        border: '1px solid #dddddd',
        overflow: 'hidden',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'row',
              padding: 15,
              gap: 15,
            },
            children: [
              {
                type: 'img',
                props: {
                  src: image,
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  style: { objectFit: 'cover', borderRadius: 4 },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flex: 1,
                  },
                  children: card.bioFields.map((f) => ({
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      },
                      children: [
                        {
                          type: 'span',
                          props: {
                            style: { fontWeight: 'bold', fontSize: 14, color: '#333333' },
                            children: f.name,
                          },
                        },
                        {
                          type: 'span',
                          props: {
                            style: { fontSize: 14, color: '#666666' },
                            children: f.value,
                          },
                        },
                      ],
                    },
                  })),
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: { style: { borderTop: '1px solid #e0e0e0', margin: '0 15px' } },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              padding: '10px 15px',
            },
            children: card.compareFields.map((f) => ({
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: f.nameAlign,
                  marginBottom: 12,
                  gap: 8,
                },
                children: [
                  ...(card.isLeft
                    ? [{
                        type: 'div',
                        props: {
                          style: {
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            backgroundColor: f.dotColor,
                            flexShrink: 0,
                          },
                        },
                      }]
                    : []),
                  {
                    type: 'span',
                    props: {
                      style: { fontWeight: f.nameWeight, fontSize: 16, color: f.nameColor },
                      children: f.name,
                    },
                  },
                  { type: 'div', props: { style: { flex: 1 } } },
                  {
                    type: 'span',
                    props: {
                      style: { fontSize: 16, color: f.valueColor },
                      children: f.value,
                    },
                  },
                  ...(card.isLeft
                    ? []
                    : [{
                        type: 'div',
                        props: {
                          style: {
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            backgroundColor: f.dotColor,
                            flexShrink: 0,
                          },
                        },
                      }]),
                ],
              },
            })),
          },
        },
      ],
    },
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

  const leftCard = buildCard(left, true);
  const rightCard = buildCard(right, false);

  const [leftImage, rightImage] = await Promise.all([
    fetchImage(left.image),
    fetchImage(right.image),
  ]);

  const CARD_W = 600;
  const topH = IMAGE_SIZE + CARD_PADDING * 2;
  const maxCompareFields = Math.max(left.compare_fields.length, right.compare_fields.length);
  const compareH = maxCompareFields * 32 + 10;
  const svgWidth = CARD_W * 2 + CARD_GAP + CARD_PADDING * 2;
  const svgHeight = topH + compareH + 35;

  return renderSvg({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'row',
        gap: CARD_GAP,
        padding: CARD_PADDING,
        backgroundColor: '#f5f5f5',
      },
      children: [
        cardElement(leftCard, leftImage),
        cardElement(rightCard, rightImage),
      ],
    },
  }, svgWidth, svgHeight);
}
