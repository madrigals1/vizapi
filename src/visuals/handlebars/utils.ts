import { readFileSync } from 'node:fs';

import * as Handlebars from 'handlebars';

export function render(filename: string, data: unknown): string {
  const source = readFileSync(filename, 'utf8');
  const template = Handlebars.compile(source);
  return template(data);
}

export function chartsWrapper(
  content: string,
  opts: Record<string, unknown>,
): string {
  return render(
    'src/visuals/handlebars/templates/charts.html',
    { opts, content },
  );
}
