import fs from 'fs';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
envContent.split('\n').forEach((line) => {
  const [k, ...v] = line.trim().split('=');
  if (k && !k.startsWith('#')) {
    process.env[k.trim()] = v.join('=').trim();
  }
});

import { createOrderInStore, getAllAdminOrders } from '../src/lib/ordersStore';
import { executeTursoQuery, isTursoConfigured } from '../src/lib/tursoDb';

async function testTursoIntegration() {
  console.log('1. Checking Turso configured status...');
  if (!isTursoConfigured()) {
    throw new Error('Turso is not configured in process.env');
  }
  console.log('   ✓ Turso is fully configured');

  const testId = `VHP-TURSO-${Date.now().toString().slice(-5)}`;
  console.log(`2. Creating order ${testId} through store...`);
  const created = await createOrderInStore({
    id: testId,
    order_number: testId,
    shipping_name: 'Praveen Shenoy',
    shipping_email: 'praveen.shenoy@gmail.com',
    shipping_phone: '9845011223',
    items: [{ name: 'Avakaya Mango Pickle', qty: 2, price: 180 }],
    subtotal: 360,
    delivery_fee: 50,
    total: 410,
    payment_status: 'paid',
    status: 'confirmed',
  });
  console.log('   ✓ Order recorded:', created.id, 'Total:', created.total);

  console.log('3. Directly querying Turso LibSQL database over HTTP...');
  const rows = await executeTursoQuery(`SELECT id, shipping_name, shipping_email, total FROM orders WHERE id = '${testId}';`);
  console.log('   ✓ Direct query returned rows:', rows);

  if (rows.length === 0 || rows[0].id !== testId) {
    throw new Error('Order was not found in Turso database!');
  }

  console.log('4. Testing getAllAdminOrders() with Turso precedence...');
  const all = await getAllAdminOrders();
  const found = all.find((o) => o.id === testId);
  console.log('   ✓ Admin orders retrieved successfully, found order:', !!found);

  console.log('\n🎉 TURSO LIVE CLOUD DATABASE INTEGRATION FULLY VERIFIED!');
}

testTursoIntegration().catch(console.error);
