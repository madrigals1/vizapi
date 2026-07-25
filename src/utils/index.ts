import { existsSync, mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';

import { randomUUID } from 'node:crypto';

import { STATIC_FOLDER, STATIC_URL } from '../constants';
import type { PathInfo, UniquePathOptions } from '../types';

export function getUniquePath(options: UniquePathOptions): PathInfo {
  const { prefix, suffix, extension } = options;

  let fileName = '';

  if (prefix) {
    fileName += `${prefix}_`;
  }

  const id = randomUUID();

  fileName += id;

  if (suffix) {
    fileName += `_${suffix}`;
  }

  if (extension) {
    fileName += `.${extension}`;
  }

  return {
    absolute: `${STATIC_FOLDER}/${fileName}`,
    relative: fileName,
    link: `${STATIC_URL}/${fileName}`,
  };
}

export async function createFile(path: string, buffer: Buffer): Promise<void> {
  await writeFile(path, buffer);
}

export function createStaticFolder(): void {
  if (!existsSync(STATIC_FOLDER)) {
    mkdirSync(STATIC_FOLDER, null);
  }
}
