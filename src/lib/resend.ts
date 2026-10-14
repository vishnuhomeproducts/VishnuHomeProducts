export async function sendOrderConfirmationEmail({
  to,
  orderId,
  amount,
  items,
  name,
}: {
  to: string;
  orderId: string;
  amount: number;
  items: Array<{ name: string; qty: number; price: number; size: string }>;
  name: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith('re_placeholder')) {
    console.log(`[Email Simulation] Order confirmation sent to ${to} for Order #${orderId}`);
    return { success: true, simulated: true };
  }

  try {
    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #eeece8;">${item.name} (${item.size})</td>
            <td style="padding: 8px; border-bottom: 1px solid #eeece8;">x${item.qty}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eeece8; text-align: right;">₹${item.price * item.qty}</td>
          </tr>`
      )
      .join('');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Vishnu Home Products <orders@vishnuhomeproducts.in>',
        to: [to],
        subject: `Order Confirmed! #${orderId.slice(0, 8).toUpperCase()} - Vishnu Home Products`,
        html: `
          <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; color: #1c1c1c;">
            <div style="background-color: #1c1c1c; color: #ffffff; padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #f59e0b; font-size: 24px;">VISHNU HOME PRODUCTS</h1>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #eeece8;">Authentic Homemade Flavours from Mangalore</p>
            </div>
            <div style="padding: 24px; background-color: #ffffff; border: 1px solid #eeece8;">
              <h2 style="color: #d97706; margin-top: 0;">Thank you for your order, ${name}!</h2>
              <p>Your order <strong>#${orderId}</strong> has been confirmed and will be dispatched within 24–48 hours.</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr style="background: #fafaf8; border-bottom: 2px solid #eeece8;">
                    <th style="padding: 8px; text-align: left;">Item</th>
                    <th style="padding: 8px; text-align: left;">Qty</th>
                    <th style="padding: 8px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 12px 8px; font-weight: bold; text-align: right;">Total Paid:</td>
                    <td style="padding: 12px 8px; font-weight: bold; text-align: right; color: #d97706; font-size: 16px;">₹${amount}</td>
                  </tr>
                </tfoot>
              </table>

              <p style="font-size: 13px; color: #5a5a5a;">Need help with your order? Reply directly to this email or WhatsApp us at +91 98450 12345.</p>
            </div>
          </div>
        `,
      }),
    });

    return await res.json();
  } catch (error) {
    console.error('Failed to send confirmation email via Resend:', error);
    return { error: 'Failed to send email' };
  }
}
