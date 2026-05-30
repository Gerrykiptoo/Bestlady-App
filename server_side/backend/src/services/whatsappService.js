const twilio = require('twilio');

const FRONT = process.env.FRONTEND_URL || 'http://localhost:5173';
const SID   = process.env.TWILIO_ACCOUNT_SID;
const TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM  = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'; // Twilio sandbox default

// Only initialise when credentials are real (Twilio SIDs always start with "AC")
const client = SID && SID.startsWith('AC') && TOKEN ? twilio(SID, TOKEN) : null;

const isConfigured = () => {
  if (!client) {
    console.warn('WhatsApp not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env');
    return false;
  }
  return true;
};

// Normalise a Kenyan phone number to E.164 format for WhatsApp
const toWhatsApp = (phone) => {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, '');
  // Already in full international format (starts with country code)
  if (digits.startsWith('254') && digits.length === 12) return `whatsapp:+${digits}`;
  // Local format 07XXXXXXXX or 01XXXXXXXX
  if ((digits.startsWith('07') || digits.startsWith('01')) && digits.length === 10) {
    return `whatsapp:+254${digits.slice(1)}`;
  }
  // Already has + removed
  if (digits.length >= 11) return `whatsapp:+${digits}`;
  return null;
};

const sendWhatsApp = async ({ to, body }) => {
  const toNumber = toWhatsApp(to);
  if (!toNumber) {
    console.warn('WhatsApp: invalid phone number', to);
    return null;
  }
  // No Twilio credentials — log the full message to console so nothing is lost
  if (!client) {
    const div = '='.repeat(55);
    console.log('\n' + div);
    console.log('WhatsApp [DEV] to: ' + toNumber);
    console.log(div);
    console.log(body);
    console.log(div + '\n');
    return { sid: 'DEV_LOG', to: toNumber };
  }
  try {
    const msg = await client.messages.create({ from: FROM, to: toNumber, body });
    console.log('WhatsApp sent to ' + toNumber + ': ' + msg.sid);
    return msg;
  } catch (err) {
    console.error('WhatsApp send error:', err.message);
    console.log('Message content that failed to send:\n' + body);
    return null;
  }
};

// ── 1. Instant Order Placed ────────────────────────────────────────────────
const sendOrderPlacedWhatsApp = async (user, order, items = []) => {
  const phone = user.phone;
  if (!phone) return null;

  const name = user.business_name || user.username;
  const isPending = order.payment_status === 'pending';
  const methodLabel = order.payment_method === 'mpesa' ? 'M-Pesa' : 'Wallet';
  const deliveryLabel = order.delivery_channel === 'pickup' ? 'Pickup Station' : 'Home Delivery';

  const itemLines = items
    .slice(0, 5) // keep the message concise — WhatsApp has limits
    .map(i => `  • ${i.Product?.name || 'Product'} × ${i.quantity} — KES ${parseFloat(i.subtotal).toLocaleString()}`)
    .join('\n');
  const moreItems = items.length > 5 ? `\n  + ${items.length - 5} more item(s)` : '';

  const actionLine = isPending
    ? `*Next step:* Please complete your ${methodLabel} payment:\n${FRONT}/payment/${order.id}`
    : `*Track your order here:*\n${FRONT}/orders/${order.id}`;

  const body =
`Hello ${name}!

*Your BestLady order has been placed.*

*Order:* #${order.order_number}
*Status:* ${isPending ? 'Awaiting Payment' : 'Confirmed & Paid'}
*Payment:* ${methodLabel}
*Delivery:* ${deliveryLabel}

*Items:*
${itemLines}${moreItems}

*Subtotal:* KES ${parseFloat(order.subtotal || 0).toLocaleString()}
*VAT (16%):* KES ${parseFloat(order.tax || 0).toLocaleString()}
*Delivery:* ${order.delivery_fee > 0 ? 'KES ' + parseFloat(order.delivery_fee).toLocaleString() : 'FREE'}
*TOTAL: KES ${parseFloat(order.total_amount).toLocaleString()}*

${actionLine}

Questions? Reply to this message or email info@bestlady.co.ke`;

  return sendWhatsApp({ to: phone, body });
};

// ── 2. Payment Confirmed ───────────────────────────────────────────────────
const sendPaymentConfirmedWhatsApp = async (user, order, method = 'wallet') => {
  const phone = user.phone;
  if (!phone) return null;

  const name = user.business_name || user.username;
  const methodLabel = method === 'mpesa' ? 'M-Pesa' : 'Wallet';
  const body =
`*Payment Confirmed!*

Hi ${name}, your payment for order *#${order.order_number}* has been received.

*Amount paid:* KES ${parseFloat(order.total_amount).toLocaleString()}
*Method:* ${methodLabel}${order.mpesa_code ? `\n*M-Pesa Ref:* ${order.mpesa_code}` : ''}

Your order is now being processed. We'll notify you when it's dispatched.

Track here: ${FRONT}/orders/${order.id}

— BestLady Beauty`;

  return sendWhatsApp({ to: phone, body });
};

// ── 3. Order Status Update ─────────────────────────────────────────────────
const sendOrderStatusWhatsApp = async (user, order) => {
  const phone = user.phone;
  if (!phone) return null;

  const name = user.business_name || user.username;
  const statusMessages = {
    processing:  'Your order is being packed and prepared.',
    ready:       'Your order is ready for pickup! Bring your OTP code to collect it.',
    dispatched:  'Your order is on its way to you.',
    delivered:   'Your order has been delivered. Thank you for shopping with BestLady!',
    cancelled:   'Your order has been cancelled. A refund (if applicable) will reflect within 24 hrs.',
  };

  const statusLabel = { processing: 'Processing', ready: 'Ready for Pickup', dispatched: 'Dispatched', delivered: 'Delivered', cancelled: 'Cancelled' }[order.status] || order.status;
  const detail = statusMessages[order.status] || 'Your order status has been updated.';

  const body =
`*Order Update — ${statusLabel}*

Hi ${name},

${detail}

*Order:* #${order.order_number}
*Amount:* KES ${parseFloat(order.total_amount).toLocaleString()}

View order: ${FRONT}/orders/${order.id}

— BestLady Beauty`;

  return sendWhatsApp({ to: phone, body });
};

if (client) {
  console.log('✅ WhatsApp (Twilio) ready — sending from:', FROM);
} else {
  console.warn('⚠️  WhatsApp running in DEV mode — messages will be printed to console.');
  console.warn('   To enable real WhatsApp: sign up at twilio.com and add to .env:');
  console.warn('     TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx');
  console.warn('     TWILIO_AUTH_TOKEN=your_auth_token');
}

module.exports = {
  sendWhatsApp,
  sendOrderPlacedWhatsApp,
  sendPaymentConfirmedWhatsApp,
  sendOrderStatusWhatsApp,
};
