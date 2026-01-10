import * as fs from 'fs';

import * as Handlebars from 'handlebars';

export function render(filename, data) {
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

export async function chartsWrapper(content, opts) {
  return render(
    'src/visuals/handlebars/templates/charts.html',
    { opts, content },
  );
}
