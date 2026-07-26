import { request, IncomingMessage, ClientRequest } from 'node:http';

interface ApiResponse {
  status: number;
  body: unknown;
}

function fetch(method: string, path: string, body?: unknown): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    const opts = { method, path, hostname: 'localhost', port: 3122 };
    if (body) {
      (opts as Record<string, unknown>).headers = { 'Content-Type': 'application/json' };
    }
    const req: ClientRequest = request(opts, (res: IncomingMessage) => {
      let data = '';
      res.on('data', (c: Buffer) => data += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode ?? 0, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode ?? 0, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function main() {
  console.log('\n=== GET / ===');
  console.log(await fetch('GET', '/'));

  console.log('\n=== GET /health ===');
  console.log(await fetch('GET', '/health'));

  console.log('\n=== POST /table ===');
  console.log(await fetch('POST', '/table', {
    table: [
      { Region: 'North America', Product: 'Widget Pro', Q1: 12450, Q2: 13720, Q3: 14100, Q4: 15890, Total: 56160 },
      { Region: 'Europe', Product: 'Widget Pro', Q1: 9800, Q2: 10200, Q3: 11500, Q4: 12100, Total: 43600 },
      { Region: 'Asia Pacific', Product: 'Gadget X', Q1: 7200, Q2: 8100, Q3: 9500, Q4: 10200, Total: 35000 },
      { Region: 'South America', Product: 'Widget Pro', Q1: 3100, Q2: 3600, Q3: 4200, Q4: 4800, Total: 15700 },
      { Region: 'North America', Product: 'Gadget X', Q1: 8900, Q2: 9200, Q3: 10100, Q4: 11700, Total: 39900 },
      { Region: 'Europe', Product: 'Gadget X', Q1: 6400, Q2: 7100, Q3: 7800, Q4: 8400, Total: 29700 },
      { Region: 'Africa', Product: 'Widget Pro', Q1: 1800, Q2: 2100, Q3: 2600, Q4: 3100, Total: 9600 },
      { Region: 'Australia', Product: 'Gadget X', Q1: 4100, Q2: 4600, Q3: 5100, Q4: 5700, Total: 19500 },
    ],
  }));

  console.log('\n=== POST /pie ===');
  console.log(await fetch('POST', '/pie', {
    title: 'Market Share by Category',
    sliceName: 'Segment', sliceValue: 'Revenue',
    sliceData: [
      { sliceName: 'Electronics', sliceValue: 42000, sliceColor: '#4285F4' },
      { sliceName: 'Clothing', sliceValue: 28000, sliceColor: '#EA4335' },
      { sliceName: 'Home & Garden', sliceValue: 15000, sliceColor: '#FBBC05' },
      { sliceName: 'Books', sliceValue: 12000, sliceColor: '#34A853' },
      { sliceName: 'Sports', sliceValue: 9500, sliceColor: '#FF6D01' },
      { sliceName: 'Health & Beauty', sliceValue: 7000, sliceColor: '#46BDC6' },
      { sliceName: 'Toys', sliceValue: 4500, sliceColor: '#7B1FA2' },
      { sliceName: 'Automotive', sliceValue: 3000, sliceColor: '#795548' },
    ],
    chartArea: {}, width: 600, height: 400,
  }));

  console.log('\n=== POST /compare ===');
  console.log(await fetch('POST', '/compare', {
    left: {
      image: 'https://placehold.co/250x250/4285F4/FFF?text=Nike',
      bio_fields: [
        { name: 'Name', value: 'Velocity Pro' },
        { name: 'Category', value: 'Running Shoe' },
        { name: 'Brand', value: 'Nike' },
        { name: 'Weight', value: '255 g' },
        { name: 'Release', value: 'Spring 2025' },
      ],
      compare_fields: [
        { name: 'Cushioning', value: 92 },
        { name: 'Stability', value: 78 },
        { name: 'Breathability', value: 85 },
        { name: 'Durability', value: 70 },
        { name: 'Value', value: 65 },
        { name: 'Weight Rating', value: 88 },
      ],
    },
    right: {
      image: 'https://placehold.co/250x250/EA4335/FFF?text=Adidas',
      bio_fields: [
        { name: 'Name', value: 'UltraStride' },
        { name: 'Category', value: 'Running Shoe' },
        { name: 'Brand', value: 'Adidas' },
        { name: 'Weight', value: '268 g' },
        { name: 'Release', value: 'Fall 2024' },
      ],
      compare_fields: [
        { name: 'Cushioning', value: 80 },
        { name: 'Stability', value: 91 },
        { name: 'Breathability', value: 72 },
        { name: 'Durability', value: 85 },
        { name: 'Value', value: 79 },
        { name: 'Weight Rating', value: 82 },
      ],
    },
  }));

  console.log('\n=== POST /bar ===');
  console.log(await fetch('POST', '/bar', {
    data: [
      ['Month', 'Revenue', 'Expenses', 'Profit'],
      ['Jan', 45000, 32000, 13000],
      ['Feb', 52000, 34000, 18000],
      ['Mar', 48000, 31000, 17000],
      ['Apr', 61000, 36000, 25000],
      ['May', 58000, 35000, 23000],
      ['Jun', 72000, 40000, 32000],
      ['Jul', 68000, 38000, 30000],
      ['Aug', 75000, 42000, 33000],
    ],
    options: { width: 700, height: 450 },
  }));
}

main().catch(console.error);
