import type { TableData, CompareData, PieData, BarData } from '../../types';
import { render, chartsWrapper } from './utils';

export async function tableToHtml(data: TableData): Promise<string> {
  const firstRow = data[0];
  const columns = Object.keys(firstRow);
  const values = data.map((row) => columns.map((column) => row[column]));

  return render(
    './src/visuals/handlebars/templates/table.html',
    { columns, table: values },
  );
}

export function compareToHtml(data: CompareData): Promise<string> {
  const { left, right } = data;

  left.compare_fields.forEach(({ name, value: leftValue }) => {
    const rightValue = (
      right.compare_fields.find((field) => field.name === name)!.value
    );
    left.compare_fields.find((field) => field.name === name)!.bigger = (
      leftValue >= rightValue
    );
    right.compare_fields.find((field) => field.name === name)!.bigger = (
      rightValue >= leftValue
    );
  });

  return render('src/visuals/handlebars/templates/compare.html', data);
}

export async function pieToHtml(data: PieData): Promise<string> {
  const updatedData = {
    ...data,
    chartArea: JSON.stringify(data.chartArea),
    pieHole: data.pieHole || 0,
    is3D: data.is3D || false,
  };
  const rendered = render(
    './src/visuals/handlebars/templates/pie.html',
    updatedData,
  );
  return rendered;
}

export function barToHtml(barData: BarData): Promise<string> {
  const { data, options } = barData;

  const htmlContent = `
  const data = google.visualization.arrayToDataTable(${JSON.stringify(data)});
  const options = ${JSON.stringify(options)};
  const chart = new google.visualization.BarChart(container);
  chart.draw(data, options)`;

  const renderOptions = {
    packages: '\'corechart\',',
    mapsApiKey: '',
    width: options.width,
    height: options.height,
  };

  return chartsWrapper(htmlContent, renderOptions);
}
