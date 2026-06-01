const nodemailer = require('nodemailer');

const IS_PROD_EMAIL = process.env.EMAIL_USER && process.env.EMAIL_PASS &&
  process.env.EMAIL_PASS !== 'your_16_char_app_password_here';

// Production transporter (Gmail SMTP with App Password)
const prodTransporter = IS_PROD_EMAIL
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      family: 4, // force IPv4 — Render can't reach Gmail over IPv6
    })
  : null;

// Dev transporter — auto-created Ethereal account (free test SMTP, shows preview URL)
let devTransporter = null;
const getDevTransporter = async () => {
  if (devTransporter) return devTransporter;
  try {
    const testAccount = await nodemailer.createTestAccount();
    devTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log('📧 Dev email ready (Ethereal) — credentials:', testAccount.user);
  } catch {
    devTransporter = null;
  }
  return devTransporter;
};

const getTransporter = async () => IS_PROD_EMAIL ? prodTransporter : getDevTransporter();

const BRAND_COLOR = '#7e22ce';
const BRAND_GRADIENT = 'linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)';
const FRONT = process.env.FRONTEND_URL || 'http://localhost:5173';

const header = `
  <div style="background:${BRAND_COLOR};padding:20px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-family:Arial,sans-serif;font-size:24px;">BestLady Beauty</h1>
    <p style="color:#f0d9c8;margin:4px 0 0;font-size:13px;">Your Beauty Supply Chain Partner</p>
  </div>`;

const footer = `
  <div style="background:#f9f4f0;padding:16px;text-align:center;font-family:Arial,sans-serif;font-size:11px;color:#888;border-top:1px solid #eee;">
    <p style="margin:0;">BestLady Beauty &bull; Nairobi, Kenya &bull; info@bestlady.co.ke</p>
    <p style="margin:4px 0 0;">You are receiving this because you have an account with BestLady.</p>
  </div>`;

const wrap = (body) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
    ${header}
    <div style="padding:28px 32px;background:#fff;">${body}</div>
    ${footer}
  </div>`;

const btn = (text, url, accent = BRAND_COLOR) =>
  `<a href="${url}" style="display:inline-block;background:${accent};color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px;margin-top:20px;">${text}</a>`;

// Verify SMTP connection on startup (non-blocking)
if (IS_PROD_EMAIL) {
  prodTransporter.verify((error) => {
    if (error) {
      console.error('❌ Email SMTP auth failed:', error.message);
      console.error('   Ensure EMAIL_PASS is a Gmail App Password (not your Gmail password)');
      console.error('   Generate one at: myaccount.google.com/apppasswords');
    } else {
      console.log('✅ Email SMTP connected — ready to send from', process.env.EMAIL_USER);
    }
  });
} else {
  console.warn('⚠️  Gmail not configured. Running in dev mode — emails will use Ethereal preview links.');
  console.warn('   To enable real email: set EMAIL_USER=gerrykiptoo@gmail.com and EMAIL_PASS=<your-app-password> in .env');
}

const sendEmail = async ({ to, subject, html }) => {
  const transport = await getTransporter();
  if (!transport) {
    console.warn('📧 Email transport unavailable — skipping send to', to);
    return null;
  }
  const from = IS_PROD_EMAIL
    ? `"BestLady Beauty" <${process.env.EMAIL_USER}>`
    : '"BestLady Beauty [DEV]" <noreply@bestlady.dev>';
  try {
    const info = await transport.sendMail({ from, to, subject, html });
    if (!IS_PROD_EMAIL) {
      // Ethereal preview URL — open this in browser to read the email
      console.log(`📧 Dev email to ${to} — preview: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    }
    return info;
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return null;
  }
};

// ─── 1. Login Notification ────────────────────────────────────────────────
const sendLoginNotification = async (user) => {
  const now = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });
  const html = wrap(`
    <h2 style="color:${BRAND_COLOR};margin-top:0;">Welcome back, ${user.business_name || user.username}!</h2>
    <p style="color:#555;">A new login was recorded on your BestLady account.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px;background:#f9f4f0;font-weight:bold;width:140px;">Time</td><td style="padding:8px;background:#fff;">${now}</td></tr>
      <tr><td style="padding:8px;background:#f9f4f0;font-weight:bold;">Account</td><td style="padding:8px;background:#fff;">${user.email}</td></tr>
      <tr><td style="padding:8px;background:#f9f4f0;font-weight:bold;">Role</td><td style="padding:8px;background:#fff;text-transform:capitalize;">${user.role}</td></tr>
    </table>
    <p style="color:#888;font-size:13px;">If this wasn't you, please contact us immediately at info@bestlady.co.ke.</p>
    ${btn('Go to Dashboard', `${FRONT}/dashboard`)}
  `);
  return sendEmail({ to: user.email, subject: 'Login Alert – BestLady Beauty', html });
};

// ─── 2. Order Confirmation ────────────────────────────────────────────────
const sendOrderConfirmation = async (user, order, items = []) => {
  const itemRows = items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.Product?.name || 'Product'}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">KES ${parseFloat(item.subtotal).toLocaleString()}</td>
    </tr>`).join('');

  const html = wrap(`
    <h2 style="color:${BRAND_COLOR};margin-top:0;">Order Confirmed!</h2>
    <p style="color:#555;">Hi ${user.business_name || user.username}, your order has been successfully placed.</p>

    <div style="background:#f9f4f0;border-radius:6px;padding:16px;margin:16px 0;">
      <p style="margin:0;font-size:18px;font-weight:bold;color:${BRAND_COLOR};">#${order.order_number}</p>
      <p style="margin:4px 0 0;font-size:13px;color:#888;">Placed on ${new Date(order.createdAt).toLocaleString('en-KE')}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="padding:8px;text-align:left;">Product</th>
          <th style="padding:8px;text-align:center;">Qty</th>
          <th style="padding:8px;text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <table style="width:100%;border-collapse:collapse;margin-top:8px;">
      <tr><td style="padding:4px 8px;color:#555;">Subtotal</td><td style="padding:4px 8px;text-align:right;">KES ${parseFloat(order.subtotal || 0).toLocaleString()}</td></tr>
      <tr><td style="padding:4px 8px;color:#555;">VAT (16%)</td><td style="padding:4px 8px;text-align:right;">KES ${parseFloat(order.tax || 0).toLocaleString()}</td></tr>
      <tr><td style="padding:4px 8px;color:#555;">Delivery</td><td style="padding:4px 8px;text-align:right;">KES ${parseFloat(order.delivery_fee || 0).toLocaleString()}</td></tr>
      <tr style="font-weight:bold;background:${BRAND_COLOR};color:#fff;">
        <td style="padding:8px;">Total</td>
        <td style="padding:8px;text-align:right;">KES ${parseFloat(order.total_amount).toLocaleString()}</td>
      </tr>
    </table>

    <p style="margin-top:20px;color:#555;"><strong>Delivery:</strong> ${order.delivery_channel === 'pickup' ? 'Pickup Station' : 'Private Rider'}</p>
    <p style="color:#555;"><strong>Payment:</strong> ${order.payment_method?.toUpperCase()} &bull; Status: <span style="color:${order.payment_status === 'pending' ? '#d97706' : '#059669'};">${order.payment_status?.toUpperCase()}</span></p>
    ${btn('View Order', `${FRONT}/orders/${order.id}`)}
  `);
  return sendEmail({ to: user.email, subject: `Order #${order.order_number} Confirmed – BestLady`, html });
};

// ─── 3. Payment Confirmation ──────────────────────────────────────────────
const sendPaymentConfirmation = async (user, order, method = 'wallet') => {
  const methodLabel = method === 'mpesa' ? 'M-Pesa' : 'Wallet';
  const html = wrap(`
    <h2 style="color:#059669;margin-top:0;">Payment Received!</h2>
    <p style="color:#555;">Hi ${user.business_name || user.username}, your payment for order <strong>#${order.order_number}</strong> has been confirmed.</p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:20px;text-align:center;margin:20px 0;">
      <p style="font-size:32px;font-weight:bold;color:#059669;margin:0;">KES ${parseFloat(order.total_amount).toLocaleString()}</p>
      <p style="color:#6b7280;margin:4px 0 0;">Paid via ${methodLabel}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px;background:#f9f4f0;font-weight:bold;width:140px;">Order #</td><td style="padding:8px;">${order.order_number}</td></tr>
      <tr><td style="padding:8px;background:#f9f4f0;font-weight:bold;">Status</td><td style="padding:8px;color:#059669;font-weight:bold;">PAID</td></tr>
      <tr><td style="padding:8px;background:#f9f4f0;font-weight:bold;">Method</td><td style="padding:8px;">${methodLabel}</td></tr>
      <tr><td style="padding:8px;background:#f9f4f0;font-weight:bold;">Date</td><td style="padding:8px;">${new Date().toLocaleString('en-KE')}</td></tr>
      ${order.mpesa_code ? `<tr><td style="padding:8px;background:#f9f4f0;font-weight:bold;">M-Pesa Ref</td><td style="padding:8px;">${order.mpesa_code}</td></tr>` : ''}
    </table>

    <p style="margin-top:16px;color:#555;">Your order is now being processed and you'll receive updates as it progresses.</p>
    ${btn('Track Order', `${FRONT}/orders/${order.id}`)}
    ${btn('Download Receipt', `${FRONT}/orders/${order.id}`)}
  `);
  return sendEmail({ to: user.email, subject: `Payment Confirmed – Order #${order.order_number}`, html });
};

// ─── 4. Order Status Update ───────────────────────────────────────────────
const sendOrderStatusUpdate = async (user, order) => {
  const statusMessages = {
    processing: { label: 'Being Processed', color: '#3b82f6', message: 'Your order is being packed and prepared for delivery.' },
    ready: { label: 'Ready for Pickup', color: '#f59e0b', message: 'Your order is packed and ready! Head to your pickup station.' },
    dispatched: { label: 'Dispatched', color: '#8b5cf6', message: 'Your order is on its way to you.' },
    delivered: { label: 'Delivered', color: '#059669', message: 'Your order has been delivered. Thank you for shopping with BestLady!' },
    cancelled: { label: 'Cancelled', color: '#ef4444', message: 'Your order has been cancelled. If you paid via wallet, your balance has been refunded.' },
  };
  const info = statusMessages[order.status] || { label: order.status, color: BRAND_COLOR, message: 'Your order status has been updated.' };

  const html = wrap(`
    <h2 style="color:${info.color};margin-top:0;">Order Update: ${info.label}</h2>
    <p style="color:#555;">Hi ${user.business_name || user.username},</p>
    <p style="color:#555;">${info.message}</p>
    <div style="background:#f9f4f0;border-radius:6px;padding:16px;margin:16px 0;">
      <p style="margin:0;font-weight:bold;">Order #${order.order_number}</p>
      <p style="margin:4px 0 0;font-size:13px;color:#888;">Amount: KES ${parseFloat(order.total_amount).toLocaleString()}</p>
    </div>
    ${btn('View Order', `${FRONT}/orders/${order.id}`)}
  `);
  return sendEmail({ to: user.email, subject: `Order #${order.order_number}: ${info.label} – BestLady`, html });
};

// ─── 5. Instant Order Placed Notification ─────────────────────────────────
const sendOrderPlacedNotification = async (user, order, items = []) => {
  const isPending = order.payment_status === 'pending';
  const methodLabel = order.payment_method === 'mpesa' ? 'M-Pesa' : order.payment_method === 'wallet' ? 'Wallet' : (order.payment_method || 'N/A').toUpperCase();
  const deliveryLabel = order.delivery_channel === 'pickup' ? 'Pickup Station' : 'Private Rider (Home Delivery)';
  const ctaUrl = isPending ? `${FRONT}/payment/${order.id}` : `${FRONT}/orders/${order.id}`;
  const ctaLabel = isPending ? 'Complete Payment' : 'Track My Order';
  const ctaColor = isPending ? '#d97706' : '#059669';

  const itemRows = items.map(item => {
    const unitPrice = parseFloat(item.unit_price || 0);
    const originalPrice = parseFloat(item.original_price || 0);
    const discountPct = item.discount_percent || 0;
    const subtotal = parseFloat(item.subtotal || 0);
    const name = item.Product?.name || 'Product';
    const priceCell = discountPct > 0
      ? `<span style="text-decoration:line-through;color:#aaa;font-size:11px;">KES ${originalPrice.toLocaleString()}</span><br><span style="color:#7e22ce;font-weight:bold;">KES ${unitPrice.toLocaleString()}</span> <span style="background:#f3e8ff;color:#7e22ce;font-size:10px;padding:1px 4px;border-radius:3px;">${discountPct}% off</span>`
      : `KES ${unitPrice.toLocaleString()}`;
    return `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;">${name}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;text-align:right;">${priceCell}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:bold;">KES ${subtotal.toLocaleString()}</td>
      </tr>`;
  }).join('');

  const statusBadge = isPending
    ? `<span style="background:#fef3c7;color:#d97706;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:bold;">AWAITING PAYMENT</span>`
    : `<span style="background:#d1fae5;color:#059669;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:bold;">PAID</span>`;

  const pendingNote = isPending ? `
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="margin:0;font-weight:bold;color:#d97706;">Action Required: Complete your payment</p>
      <p style="margin:6px 0 0;font-size:13px;color:#92400e;">Your order has been reserved. Please complete your ${methodLabel} payment within 30 minutes to confirm it.</p>
    </div>` : '';

  const html = wrap(`
    <h2 style="color:${BRAND_COLOR};margin-top:0;">Order Placed! ${statusBadge}</h2>
    <p style="color:#555;">Hi <strong>${user.business_name || user.username}</strong>, your order has been received.</p>

    <div style="background:#f5f3ff;border-left:4px solid ${BRAND_COLOR};border-radius:6px;padding:16px;margin:16px 0;">
      <p style="margin:0;font-size:20px;font-weight:bold;color:${BRAND_COLOR};">#${order.order_number}</p>
      <p style="margin:4px 0 0;font-size:13px;color:#888;">Placed on ${new Date(order.createdAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</p>
    </div>

    ${pendingNote}

    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <thead>
        <tr style="background:#f5f3ff;">
          <th style="padding:10px 8px;text-align:left;font-size:12px;color:#7e22ce;">PRODUCT</th>
          <th style="padding:10px 8px;text-align:center;font-size:12px;color:#7e22ce;">QTY</th>
          <th style="padding:10px 8px;text-align:right;font-size:12px;color:#7e22ce;">UNIT PRICE</th>
          <th style="padding:10px 8px;text-align:right;font-size:12px;color:#7e22ce;">SUBTOTAL</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <table style="width:100%;border-collapse:collapse;margin-top:8px;max-width:320px;margin-left:auto;">
      <tr><td style="padding:5px 8px;color:#666;font-size:13px;">Subtotal</td><td style="padding:5px 8px;text-align:right;font-size:13px;">KES ${parseFloat(order.subtotal || 0).toLocaleString()}</td></tr>
      <tr><td style="padding:5px 8px;color:#666;font-size:13px;">VAT (16%)</td><td style="padding:5px 8px;text-align:right;font-size:13px;">KES ${parseFloat(order.tax || 0).toLocaleString()}</td></tr>
      <tr><td style="padding:5px 8px;color:#666;font-size:13px;">Delivery</td><td style="padding:5px 8px;text-align:right;font-size:13px;">${order.delivery_fee > 0 ? 'KES ' + parseFloat(order.delivery_fee).toLocaleString() : 'FREE (Pickup)'}</td></tr>
      <tr style="background:${BRAND_COLOR};color:#fff;">
        <td style="padding:10px 8px;font-weight:bold;font-size:15px;">TOTAL</td>
        <td style="padding:10px 8px;text-align:right;font-weight:bold;font-size:15px;">KES ${parseFloat(order.total_amount).toLocaleString()}</td>
      </tr>
    </table>

    <table style="width:100%;border-collapse:collapse;margin:20px 0 4px;">
      <tr><td style="padding:8px;background:#f9f4f0;font-weight:bold;width:140px;font-size:13px;">Delivery</td><td style="padding:8px;font-size:13px;">${deliveryLabel}</td></tr>
      <tr><td style="padding:8px;background:#f9f4f0;font-weight:bold;font-size:13px;">Payment</td><td style="padding:8px;font-size:13px;">${methodLabel}</td></tr>
    </table>

    ${btn(ctaLabel, ctaUrl, ctaColor)}
  `);

  const subject = isPending
    ? `Order #${order.order_number} Received – Complete Payment | BestLady`
    : `Order #${order.order_number} Confirmed & Paid – BestLady`;

  return sendEmail({ to: user.email, subject, html });
};

module.exports = {
  sendEmail,
  sendLoginNotification,
  sendOrderConfirmation,
  sendOrderPlacedNotification,
  sendPaymentConfirmation,
  sendOrderStatusUpdate,
};
