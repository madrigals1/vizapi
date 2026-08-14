import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import Handlebars from 'handlebars';

function resolveTemplate(name: string): string {
  const candidates = [
    path.join(__dirname, name),
    path.join(process.cwd(), 'src', 'renderers', 'templates', name),
  ];
  const file = candidates.find((candidate) => existsSync(candidate));
  if (!file) {
    throw new Error(`Template not found: ${name}`);
  }
  return file;
}

export function compileTemplate<T = Record<string, unknown>>(
  name: string,
): Handlebars.TemplateDelegate<T> {
  return Handlebars.compile(readFileSync(resolveTemplate(name), 'utf8'));
}
