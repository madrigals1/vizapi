import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { STATIC_FOLDER, STATIC_URL } from './constants';
import type { PathInfo } from './types';

export function getUniquePath(prefix: string): PathInfo {
  const fileName = `${prefix}_${randomUUID()}.png`;

  return {
    absolute: `${STATIC_FOLDER}/${fileName}`,
    relative: fileName,
    link: `${STATIC_URL}/${fileName}`,
  };
}

export async function savePng(buffer: Buffer, path: string): Promise<void> {
  await writeFile(path, buffer);
}

export function ensureStaticFolder(): void {
  if (!existsSync(STATIC_FOLDER)) {
    mkdirSync(STATIC_FOLDER, { recursive: true });
  }
}
