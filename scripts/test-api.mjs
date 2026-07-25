import { request } from 'node:http';

const BASE = 'http://localhost:3122';

function fetch(method, path, body) {
  return new Promise((resolve, reject) => {
    const opts = { method, path, hostname: 'localhost', port: 3122 };
    if (body) {
      opts.headers = { 'Content-Type': 'application/json' };
    }
    const req = request(opts, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
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
    table: [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }],
  }));

  console.log('\n=== POST /pie ===');
  console.log(await fetch('POST', '/pie', {
    title: 'Sales', sliceName: 'Category', sliceValue: 'Amount',
    sliceData: [
      { sliceName: 'Food', sliceValue: 400, sliceColor: '#e2431e' },
      { sliceName: 'Tech', sliceValue: 600, sliceColor: '#6f9654' },
    ],
    chartArea: {}, width: 600, height: 400,
  }));

  console.log('\n=== POST /compare ===');
  console.log(await fetch('POST', '/compare', {
    left: {
      image: 'https://placehold.co/250',
      bio_fields: [{ name: 'Name', value: 'Product A' }],
      compare_fields: [{ name: 'Speed', value: 85 }, { name: 'Price', value: 50 }],
    },
    right: {
      image: 'https://placehold.co/250',
      bio_fields: [{ name: 'Name', value: 'Product B' }],
      compare_fields: [{ name: 'Speed', value: 70 }, { name: 'Price', value: 80 }],
    },
  }));

  console.log('\n=== POST /bar ===');
  console.log(await fetch('POST', '/bar', {
    data: [['Year', 'Sales'], ['2023', 100], ['2024', 150], ['2025', 200]],
    options: { width: 600, height: 400 },
  }));
}

main().catch(console.error);
