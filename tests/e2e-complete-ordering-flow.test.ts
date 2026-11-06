/**
 * Complete End-to-End Ordering, Dynamic Catalog & Payment Verification Test Suite
 * Vishnu Home Products E-Commerce Hub
 * 
 * Tests:
 * 1. Pincode Evaluation & Delivery Classification (Bengaluru Primary Local Delivery)
 * 2. Dynamic Product Catalog & Bulk Excel/CSV Import API
 * 3. Authoritative Order Creation & Razorpay Gateway Simulation
 * 4. Price Tampering Security Defense
 * 5. Forged Payment Signature Rejection
 * 6. Valid HMAC Payment Verification & Admin Hub Reflection
 */

import crypto from 'crypto';
import { calculateDeliveryFee } from '../src/lib/delivery';
import { POST as razorpayRoute } from '../src/app/api/razorpay/[...slug]/route';

const createOrderRoute = (req: Request) =>
  razorpayRoute(req, { params: { slug: ['create-order'] } });

const verifyPaymentRoute = (req: Request) =>
  razorpayRoute(req, { params: { slug: ['verify'] } });

import { getAllAdminOrders } from '../src/lib/ordersStore';
import { getAllProducts, createProduct, bulkImportProducts } from '../src/lib/productsStore';
import { SAMPLE_PRODUCTS } from '../src/lib/data/sampleProducts';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  }
  passedTests++;
  console.log(`  ✓ ${message}`);
}

async function runE2ETests() {
  console.log('\n======================================================');
  console.log('🚀 RUNNING END-TO-END ORDERING FLOW TEST SUITE');
  console.log('======================================================\n');

  // -----------------------------------------------------------------
  // STAGE 1: Pincode Evaluation & Delivery Classification (Bengaluru Primary)
  // -----------------------------------------------------------------
  console.log('--- Stage 1: Pincode Evaluation & Delivery Classification ---');
  
  // Bengaluru Urban (Primary Local Delivery)
  const bengaluru = calculateDeliveryFee('560054', 400);
  assert(bengaluru.isLocal === true, 'Pincode 560054 resolves to isLocal: true (Bengaluru Primary)');
  assert(bengaluru.deliveryType === 'BENGALURU_LOCAL', 'Pincode 560054 deliveryType is BENGALURU_LOCAL');
  assert(bengaluru.fee === 50, 'Bengaluru local delivery fee is ₹50');

  // Coastal / Regional Karnataka
  const regionalMangaluru = calculateDeliveryFee('575002', 400);
  assert(regionalMangaluru.deliveryType === 'MANGALURU_REGIONAL', 'Pincode 575002 resolves to MANGALURU_REGIONAL');
  assert(regionalMangaluru.fee === 50, 'Regional delivery fee is ₹50');

  // Pan-India Courier (Mumbai / Delhi / Kolkata)
  const panIndia = calculateDeliveryFee('400001', 400);
  assert(panIndia.deliveryType === 'PAN_INDIA_COURIER', 'Pincode 400001 resolves to PAN_INDIA_COURIER');
  assert(panIndia.fee === 50, 'Pan-India courier fee is ₹50');

  // Dynamic Shiprocket delivery fee override
  const shiprocketOverride = calculateDeliveryFee('560001', 400, 45);
  assert(shiprocketOverride.fee === 45, 'Explicit Shiprocket delivery fee (₹45) respected dynamically');

  // Free delivery qualification
  const freeShipping = calculateDeliveryFee('400001', 1200);
  assert(freeShipping.fee === 0, 'Orders of ₹999+ qualify for Free Delivery (₹0 fee)');

  // Invalid pincode rejection via API route
  const invalidPincodeReq = new Request('http://localhost:3000/api/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 400,
      items: [{ product_id: 'prod-1', name: 'Tomato Thokku', size: '500g', price: 190, qty: 1 }],
      shipping: { pincode: '9999' }, // invalid 4 digits
    }),
  });
  const invalidPincodeRes = await createOrderRoute(invalidPincodeReq);
  const invalidPincodeJson = await invalidPincodeRes.json();
  assert(invalidPincodeRes.status === 400, 'Invalid short pincode (9999) rejected with HTTP 400');
  assert(invalidPincodeJson.error.includes('Must be a 6-digit Indian postal code'), 'Clean pincode validation error returned');

  // -----------------------------------------------------------------
  // STAGE 2: Dynamic Product Catalog & Bulk Excel Import
  // -----------------------------------------------------------------
  console.log('\n--- Stage 2: Dynamic Product Catalog & Excel Bulk Import ---');
  const allProducts = await getAllProducts();
  assert(allProducts.length >= 10, `Catalog loaded with ${allProducts.length} dynamic products`);

  // Test dynamic single product creation
  const testNewProduct = await createProduct({
    name: 'Special Bitter Gourd Thokku',
    category: 'Pickles & Thokkus',
    description: 'Fresh bitter gourd slow-cooked with jaggery and mustard',
    sizes: [{ label: '500g', price: 210, mrp: 260 }],
    badge: 'NEW',
  });
  assert(testNewProduct.id !== undefined, `New product created dynamically with ID: ${testNewProduct.id}`);

  // Test bulk import capability (Excel/CSV simulation)
  const bulkResult = await bulkImportProducts([
    {
      name: 'Kundapura Ghee Roast Paste',
      category: 'Spices & Masalas',
      description: 'Stone-ground Byadagi chilli and pure ghee roast masala paste',
      sizes: [
        { label: '250g', price: 220, mrp: 260 },
        { label: '500g', price: 390, mrp: 460 },
      ],
      emoji: '🥘',
    },
    {
      name: 'Organic Wild Forest Honey',
      category: 'Wellness & Oils',
      sizes: [{ label: '500g', price: 340, mrp: 420 }],
      emoji: '🍯',
    },
  ]);
  assert(bulkResult.importedCount >= 2, `Bulk imported ${bulkResult.importedCount} products successfully`);

  // -----------------------------------------------------------------
  // STAGE 3: Authoritative Order Creation & Pricing
  // -----------------------------------------------------------------
  console.log('\n--- Stage 3: Authoritative Order Creation ---');
  // Order items: 2x Tomato Thokku (500g @ ₹190) with volume discount, 1x Mango Pickle (500g @ ₹190)
  // Subtotal = ₹552. Free shipping applies (>= ₹499).
  // Total = ₹552
  const validOrderReq = new Request('http://localhost:3000/api/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 552,
      items: [
        { product_id: 'prod-1', slug: 'tomato-thokku', name: 'Tomato Thokku', size: '500g', price: 190, qty: 2 },
        { product_id: 'prod-2', slug: 'avakaya-mango-pickle', name: 'Avakaya Mango Pickle', size: '500g', price: 190, qty: 1 },
      ],
      shipping: {
        name: 'Santhosh Rao',
        phone: '9845099887',
        email: 'santhosh.rao@gmail.com',
        city: 'Bengaluru',
        pincode: '560054',
      },
    }),
  });

  const validOrderRes = await createOrderRoute(validOrderReq);
  const validOrderJson = await validOrderRes.json();
  if (validOrderRes.status !== 200) {
    console.error('validOrderRes status:', validOrderRes.status, 'body:', validOrderJson);
  }

  assert(validOrderRes.status === 200, 'POST /api/razorpay/create-order succeeded with HTTP 200');
  assert(validOrderJson.order_id !== undefined, `Gateway order ID generated: ${validOrderJson.order_id}`);
  assert(validOrderJson.verifiedTotal === 552, 'Verified total accurately calculated as ₹552 (qualifies for Free Delivery)');
  assert(validOrderJson.amount === 55200, 'Gateway amount formatted correctly as 55,200 paise');

  // -----------------------------------------------------------------
  // STAGE 4: Security Check - Price Tampering Defense
  // -----------------------------------------------------------------
  console.log('\n--- Stage 4: Security Check - Price Tampering Defense ---');
  // Attacker intercepts and modifies item price to ₹50 and total to ₹140
  const tamperedReq = new Request('http://localhost:3000/api/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 140, // TAMPERED TOTAL
      items: [
        { product_id: 'prod-1', slug: 'tomato-thokku', name: 'Tomato Thokku', size: '500g', price: 50, qty: 2 }, // Tampered price
        { product_id: 'prod-2', slug: 'avakaya-mango-pickle', name: 'Avakaya Mango Pickle', size: '500g', price: 40, qty: 1 },
      ],
      shipping: {
        name: 'Malicious Actor',
        phone: '9845099887',
        email: 'malicious@test.com',
        city: 'Bengaluru',
        pincode: '560054',
      },
    }),
  });

  const tamperedRes = await createOrderRoute(tamperedReq);
  const tamperedJson = await tamperedRes.json();

  assert(tamperedRes.status === 400, 'Price tampering attempt rejected with HTTP 400');
  assert(tamperedJson.error.includes('Order total mismatch: Screen total was ₹140, but verified server total is ₹552'),
    'Server successfully detected tampering and enforced authoritative catalog price');

  // -----------------------------------------------------------------
  // STAGE 5: Security Check - Forged Payment Signature Defense
  // -----------------------------------------------------------------
  console.log('\n--- Stage 5: Security Check - Forged Payment Signature Defense ---');
  const testSecret = 'secret_test_key_vhp_9988';
  process.env.RAZORPAY_KEY_SECRET = testSecret;

  const forgedVerifyReq = new Request('http://localhost:3000/api/razorpay/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: 'order_test_998877',
      razorpay_payment_id: 'pay_test_554433',
      razorpay_signature: 'deadbeef_invalid_forged_signature_12345',
      order_id: 'VHP-TEST-ORDER-001',
      total: 620,
      items: [{ name: 'Tomato Thokku', qty: 2, price: 190, size: '500g' }],
      shipping: { name: 'Santhosh Rao', email: 'santhosh.rao@gmail.com', phone: '9845099887' },
    }),
  });

  const forgedVerifyRes = await verifyPaymentRoute(forgedVerifyReq);
  const forgedVerifyJson = await forgedVerifyRes.json();

  assert(forgedVerifyRes.status === 400, 'Forged payment signature rejected with HTTP 400');
  assert(forgedVerifyJson.error === 'Invalid payment signature', 'Clean rejection message returned for forged signature');

  // -----------------------------------------------------------------
  // STAGE 6: Valid HMAC Signature Verification & Admin Hub Reflection
  // -----------------------------------------------------------------
  console.log('\n--- Stage 6: Valid Payment Verification & Admin Hub Reflection ---');
  const validOrderId = 'order_vhp_' + Date.now();
  const validPaymentId = 'pay_vhp_' + Date.now();
  
  // Compute authentic HMAC-SHA256 signature
  const authenticPayload = `${validOrderId}|${validPaymentId}`;
  const authenticSignature = crypto
    .createHmac('sha256', testSecret)
    .update(authenticPayload)
    .digest('hex');

  const validAppOrderId = `VHP-${Date.now().toString().slice(-8)}`;

  const validVerifyReq = new Request('http://localhost:3000/api/razorpay/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: validOrderId,
      razorpay_payment_id: validPaymentId,
      razorpay_signature: authenticSignature,
      order_id: validAppOrderId,
      total: 620,
      items: [
        { product_id: 'prod-1', name: 'Tomato Thokku', size: '500g', price: 190, qty: 2 },
        { product_id: 'prod-2', name: 'Avakaya Mango Pickle', size: '500g', price: 190, qty: 1 },
      ],
      shipping: {
        name: 'Santhosh Rao',
        email: 'santhosh.rao@gmail.com',
        phone: '9845099887',
        line1: 'No 45, Indiranagar 100ft Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560054',
      },
    }),
  });

  const validVerifyRes = await verifyPaymentRoute(validVerifyReq);
  const validVerifyJson = await validVerifyRes.json();

  assert(validVerifyRes.status === 200, 'Valid payment verification succeeded with HTTP 200');
  assert(validVerifyJson.success === true, 'Response confirmed payment success: true');
  assert(validVerifyJson.app_order_id === validAppOrderId, `App order ID preserved: ${validAppOrderId}`);

  // Query order repository / Admin store to verify persistence
  const allOrders = await getAllAdminOrders();
  const storedOrder = allOrders.find(o => o.id === validAppOrderId || o.razorpay_order_id === validOrderId);

  assert(storedOrder !== undefined, `Newly verified order ${validAppOrderId} exists in Admin Orders Repository`);
  assert(storedOrder?.payment_status === 'paid', 'Order payment_status is confirmed "paid"');
  assert(storedOrder?.status === 'confirmed', 'Order status is "confirmed"');
  assert(storedOrder?.total === 620, 'Order total is preserved as ₹620');
  assert(storedOrder?.shipping_name === 'Santhosh Rao', 'Customer shipping name matches "Santhosh Rao"');

  console.log('\n======================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log('======================================================\n');
}

runE2ETests().catch((err) => {
  console.error('\n❌ TEST RUN FAILED:\n', err);
  process.exit(1);
});
