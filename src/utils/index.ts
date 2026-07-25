import * as fs from 'fs';

import uuid4 from 'uuid4';

import { STATIC_FOLDER, STATIC_URL } from '../constants';
import type { PathInfo, UniquePathOptions } from '../types';
import { log } from './helper';

export function getUniquePath(options: UniquePathOptions): PathInfo {
  const { prefix, suffix, extension } = options;

  let fileName = '';

  if (prefix) {
    fileName += `${prefix}_`;
  }

  const id = uuid4();

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

export function createFile(path: string, buffer: Buffer): void {
  fs.writeFile(path, buffer, (err) => {
    if (err) {
      throw err;
    }
    log('Image was created');
  });
}

export function createStaticFolder(): void {
  if (!fs.existsSync(STATIC_FOLDER)) {
    fs.mkdirSync(STATIC_FOLDER, null);
  }
}
