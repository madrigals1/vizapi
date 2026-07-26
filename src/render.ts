import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Handlebars from 'handlebars';

const templateDir = resolve(process.cwd(), 'src/templates');

const cache = new Map<string, Handlebars.TemplateDelegate>();

function load(name: string): Handlebars.TemplateDelegate {
  const cached = cache.get(name);
  if (cached) {
    return cached;
  }

  const path = resolve(templateDir, `${name}.hbs`);
  const source = readFileSync(path, 'utf8');
  const template = Handlebars.compile(source);
  cache.set(name, template);
  return template;
}

export function render(name: string, data: Record<string, unknown>): string {
  return load(name)(data);
}
