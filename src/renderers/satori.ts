import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';

const fontDir = '/usr/share/fonts/truetype/dejavu';

const fonts = [
  {
    name: 'DejaVu Sans',
    data: readFileSync(resolve(fontDir, 'DejaVuSans.ttf')),
    style: 'normal' as const,
    weight: 400 as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
  },
  {
    name: 'DejaVu Sans',
    data: readFileSync(resolve(fontDir, 'DejaVuSans-Bold.ttf')),
    style: 'normal' as const,
    weight: 700 as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
  },
];

export function renderSvg(
  element: unknown,
  width: number,
  height: number,
): Promise<string> {
  return satori(element, { width, height, fonts });
}
