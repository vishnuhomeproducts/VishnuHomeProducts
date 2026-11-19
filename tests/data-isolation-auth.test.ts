import { createOrderInStore, getOrdersForUser, getAllAdminOrders } from '../src/lib/ordersStore';

async function runTests() {
  console.log('======================================================');
  console.log('🧪 TESTING CUSTOMER AUTH & DATA ISOLATION (TENANT ISOLATION)');
  console.log('======================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, msg: string) {
    total++;
    if (condition) {
      console.log(`  ✓ ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      process.exitCode = 1;
    }
  }

  // Stage 1: Brand new customer has ZERO orders (no fake demo orders leakage)
  console.log('--- Stage 1: New Customer Data Isolation ---');
  const newCustomerEmail = 'brand.new.user@gmail.com';
  const newCustomerOrders = await getOrdersForUser(newCustomerEmail);
  assert(Array.isArray(newCustomerOrders), 'Returns array of orders');
  assert(newCustomerOrders.length === 0, 'New customer has 0 orders (no fake demo order leakage)');

  // Stage 2: Admin seed orders are completely shielded from customer accounts
  console.log('\n--- Stage 2: Admin Seed Orders Shielding ---');
  const poojaCustomerOrders = await getOrdersForUser('pooja.hegde@gmail.com');
  const containsDemoOrder = poojaCustomerOrders.some(o => o.id === 'VHP-261044300001');
  assert(!containsDemoOrder, 'Admin seed orders (Pooja Hegde VHP-261044300001) are shielded from customer user account');

  const arjunCustomerOrders = await getOrdersForUser('arjun.kamath@outlook.com');
  const containsArjunSeed = arjunCustomerOrders.some(o => o.id === 'VHP-261044300002');
  assert(!containsArjunSeed, 'Admin seed orders (Arjun Kamath VHP-261044300002) are shielded from customer user account');

  // Stage 3: User 1 places an order -> strictly isolated to User 1
  console.log('\n--- Stage 3: User 1 Creates an Order ---');
  const user1Email = 'customer.alpha@gmail.com';
  const user2Email = 'customer.beta@gmail.com';

  const user1Order = await createOrderInStore({
    shipping_name: 'Customer Alpha',
    shipping_email: user1Email,
    shipping_phone: '9876543210',
    shipping_address: {
      name: 'Customer Alpha',
      email: user1Email,
      phone: '9876543210',
      line1: 'Flat 101, Test Residency',
      city: 'Mangaluru',
      state: 'Karnataka',
      pincode: '575001',
    },
    items: [
      { product_id: '1', name: 'Avakaya Mango Pickle', slug: 'avakaya-mango-pickle', size: '500g', qty: 1, unit_price: 180, emoji: '🥭' }
    ],
    subtotal: 180,
    delivery_fee: 50,
    discount: 0,
    total: 230,
    payment_method: 'razorpay',
    payment_status: 'paid',
  });

  assert(Boolean(user1Order.id), `User 1 order created successfully: ${user1Order.id}`);

  // Stage 4: Verify User 1 can see their order
  console.log('\n--- Stage 4: User 1 Query Verification ---');
  const fetchedUser1Orders = await getOrdersForUser(user1Email);
  assert(fetchedUser1Orders.length >= 1, 'User 1 retrieved their orders');
  assert(fetchedUser1Orders.some(o => o.id === user1Order.id), 'User 1 order matches created ID');
  assert(fetchedUser1Orders.every(o => o.shipping_email.toLowerCase() === user1Email.toLowerCase()), 'All returned orders strictly belong to User 1');

  // Case-insensitivity check (Customer.Alpha@GMAIL.com vs customer.alpha@gmail.com)
  const caseInsensitiveOrders = await getOrdersForUser('Customer.ALPHA@GMAIL.com');
  assert(caseInsensitiveOrders.some(o => o.id === user1Order.id), 'Email matching is case-insensitive');

  // Stage 5: Verify User 2 CANNOT see User 1's order (Cross-Account Leakage Defense)
  console.log('\n--- Stage 5: Cross-Account Data Leakage Defense ---');
  const fetchedUser2Orders = await getOrdersForUser(user2Email);
  assert(fetchedUser2Orders.length === 0, 'User 2 sees 0 orders (User 1 order is NOT leaked to User 2)');
  assert(!fetchedUser2Orders.some(o => o.id === user1Order.id), 'User 2 cannot access User 1 order ID');

  console.log('\n======================================================');
  console.log(`🎉 ALL ${passed}/${total} DATA ISOLATION TESTS PASSED!`);
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
