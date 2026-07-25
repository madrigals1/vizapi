import * as fs from 'fs';

import * as Handlebars from 'handlebars';

export function render(filename: string, data: unknown): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const source = fs.readFileSync(filename, 'utf8').toString();
      const template = Handlebars.compile(source);
      const output = template(data);
      resolve(output);
    } catch (e) {
      reject(e);
    }
  });
}

export async function chartsWrapper(
  content: string,
  opts: Record<string, unknown>,
): Promise<string> {
  return render(
    'src/visuals/handlebars/templates/charts.html',
    { opts, content },
  );
}
