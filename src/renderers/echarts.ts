import { readFileSync } from 'node:fs';

export const ECHARTS_SOURCE = readFileSync(require.resolve('echarts/dist/echarts.min.js'), 'utf8');
