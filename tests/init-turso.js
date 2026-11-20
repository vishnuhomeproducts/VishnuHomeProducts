const fs = require('fs');

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
envContent.split('\n').forEach((line) => {
  const [k, ...v] = line.trim().split('=');
  if (k && !k.startsWith('#')) {
    process.env[k.trim()] = v.join('=').trim();
  }
});

const url = (process.env.TURSO_DATABASE_URL || '').replace('libsql://', 'https://') + '/v2/pipeline';
const token = process.env.TURSO_AUTH_TOKEN;

async function initTurso() {
  console.log('Connecting to Turso:', url);

  const statements = [
    `CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT,
      created_at TEXT,
      shipping_name TEXT,
      shipping_phone TEXT,
      shipping_email TEXT,
      shipping_address TEXT,
      items TEXT,
      subtotal REAL,
      delivery_fee REAL,
      discount REAL,
      total REAL,
      coupon_code TEXT,
      status TEXT,
      payment_status TEXT,
      payment_method TEXT,
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      razorpay_signature TEXT,
      delivery_type TEXT,
      courier_partner TEXT,
      tracking_awb TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      slug TEXT UNIQUE,
      category TEXT,
      description TEXT,
      sizes TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT
    );`
  ];

  for (const sql of statements) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          { type: 'execute', stmt: { sql } },
          { type: 'close' },
        ],
      }),
    });

    const json = await res.json();
    console.log('Result:', json.results?.[0]?.type);
  }

  // Check tables
  const checkRes = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        { type: 'execute', stmt: { sql: "SELECT name FROM sqlite_master WHERE type='table';" } },
        { type: 'close' },
      ],
    }),
  });

  const checkJson = await checkRes.json();
  const tables = checkJson.results?.[0]?.response?.result?.rows || [];
  console.log('Tables in Turso database:', tables.map((r) => r[0].value));
}

initTurso().catch(console.error);
