const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');
const QRCode = require('qrcode');

const BRAND_PURPLE = '#7e22ce';
const BRAND_LIGHT  = '#f3e8ff';
const TEXT_DARK    = '#1a1614';
const TEXT_MID     = '#6b7280';
const GREEN        = '#059669';
const RED          = '#dc2626';

const generateReceipt = async (order, user, items) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const stream = new PassThrough();
  doc.pipe(stream);

  // ── Top accent bar ──────────────────────────────────────────────
  doc.rect(0, 0, doc.page.width, 8).fill(BRAND_PURPLE);

  // ── Header ─────────────────────────────────────────────────────
  doc.moveDown(1.5);
  doc.fontSize(26).font('Helvetica-Bold').fillColor(BRAND_PURPLE)
    .text('BestLady Beauty', { align: 'center' });
  doc.fontSize(9).font('Helvetica').fillColor(TEXT_MID)
    .text('Professional Beauty Supplies · Nairobi, Kenya', { align: 'center' });
  doc.text('info@bestlady.co.ke  ·  +254 700 000000', { align: 'center' });

  doc.moveDown(0.8);
  doc.strokeColor(BRAND_PURPLE).lineWidth(1.5)
    .moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.8);

  // ── Receipt meta (two columns) ─────────────────────────────────
  const metaY = doc.y;

  // Left column — receipt info
  doc.fontSize(11).font('Helvetica-Bold').fillColor(TEXT_DARK)
    .text('OFFICIAL RECEIPT', 50, metaY);
  doc.fontSize(9).font('Helvetica').fillColor(TEXT_MID);
  doc.text(`Order:    ${order.order_number}`, 50, metaY + 18);
  doc.text(`Date:     ${new Date(order.createdAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}`, 50, metaY + 30);
  doc.text(`Payment:  ${(order.payment_method || 'N/A').toUpperCase()}`, 50, metaY + 42);
  if (order.mpesa_code) {
    doc.text(`Ref:      ${order.mpesa_code}`, 50, metaY + 54);
  }

  // Right column — bill-to
  doc.fontSize(10).font('Helvetica-Bold').fillColor(TEXT_DARK)
    .text('Bill To', 360, metaY);
  doc.fontSize(9).font('Helvetica').fillColor(TEXT_MID);
  doc.text(user.business_name || user.username, 360, metaY + 18);
  doc.text(user.email, 360, metaY + 30);
  doc.text(`Phone: ${user.phone || 'N/A'}`, 360, metaY + 42);
  doc.text(`Tier:  ${(user.tier || 'retail').toUpperCase()}`, 360, metaY + 54);

  doc.moveDown(5);
  doc.strokeColor('#e5e7eb').lineWidth(0.5)
    .moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  // ── Items table header ──────────────────────────────────────────
  const tableHeaderY = doc.y;
  doc.rect(50, tableHeaderY - 4, 500, 22).fill(BRAND_LIGHT);
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor(BRAND_PURPLE);
  doc.text('PRODUCT',  60, tableHeaderY + 2, { width: 180 });
  doc.text('QTY',     248, tableHeaderY + 2, { width: 40 });
  doc.text('UNIT PRICE', 295, tableHeaderY + 2, { width: 90 });
  doc.text('DISCOUNT', 385, tableHeaderY + 2, { width: 70 });
  doc.text('SUBTOTAL', 460, tableHeaderY + 2, { width: 80, align: 'right' });

  let y = tableHeaderY + 26;
  let totalDiscountSaved = 0;

  items.forEach((item) => {
    if (y > 680) { doc.addPage(); y = 60; }

    const hasDiscount = item.discount_percent > 0 &&
      item.original_price && parseFloat(item.original_price) > parseFloat(item.unit_price);
    const rowHeight = hasDiscount ? 34 : 22;

    // Alternating row tint
    if (items.indexOf(item) % 2 === 0) {
      doc.rect(50, y - 3, 500, rowHeight).fill('#fafafa');
    }

    doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(9);
    doc.text(item.Product?.name || 'Unknown Item', 60, y, { width: 180 });
    doc.text(String(item.quantity), 248, y, { width: 40 });

    if (hasDiscount) {
      const saved = (parseFloat(item.original_price) - parseFloat(item.unit_price)) * item.quantity;
      totalDiscountSaved += saved;

      doc.fillColor(TEXT_MID).fontSize(8)
        .text(`KES ${parseFloat(item.original_price).toLocaleString()}`, 295, y);
      doc.fillColor(GREEN).fontSize(8.5)
        .text(`KES ${parseFloat(item.unit_price).toLocaleString()}`, 295, y + 13);
      doc.fillColor(RED).fontSize(8).font('Helvetica-Bold')
        .text(`-${item.discount_percent}%`, 390, y + 6);
      // Small "AI discount" label
      doc.fillColor(BRAND_PURPLE).fontSize(7).font('Helvetica')
        .text('AI Price', 390, y + 18);
    } else {
      doc.fillColor(TEXT_DARK).fontSize(9)
        .text(`KES ${parseFloat(item.unit_price).toLocaleString()}`, 295, y);
      doc.fillColor(TEXT_MID).text('—', 390, y);
    }

    doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(9)
      .text(`KES ${parseFloat(item.subtotal).toLocaleString()}`, 460, y, { width: 80, align: 'right' });

    y += rowHeight;
    doc.strokeColor('#f3f4f6').lineWidth(0.5)
      .moveTo(50, y - 2).lineTo(550, y - 2).stroke();
    doc.font('Helvetica');
  });

  // ── Totals ───────────────────────────────────────────────────────
  y += 12;
  if (y > 680) { doc.addPage(); y = 60; }

  const totX = 350;
  const valX = 540;

  const row = (label, value, opts = {}) => {
    if (y > 700) { doc.addPage(); y = 60; }
    doc.fontSize(opts.large ? 11 : 9.5)
      .font(opts.bold ? 'Helvetica-Bold' : 'Helvetica')
      .fillColor(opts.color || TEXT_MID)
      .text(label, totX, y);
    doc.font(opts.bold ? 'Helvetica-Bold' : 'Helvetica')
      .fillColor(opts.color || TEXT_DARK)
      .text(value, valX, y, { align: 'right', width: 0 });
    y += opts.large ? 22 : 18;
  };

  doc.strokeColor('#e5e7eb').lineWidth(0.5)
    .moveTo(totX - 10, y - 6).lineTo(550, y - 6).stroke();

  row('Subtotal',     `KES ${parseFloat(order.subtotal).toLocaleString()}`);
  row('VAT (16%)',    `KES ${parseFloat(order.tax).toLocaleString()}`);
  row('Delivery',    `KES ${parseFloat(order.delivery_fee).toLocaleString()}`);

  if (totalDiscountSaved > 0) {
    row('AI Savings', `- KES ${Math.round(totalDiscountSaved).toLocaleString()}`, { color: GREEN, bold: true });
  }

  y += 4;
  doc.rect(totX - 10, y - 4, 210, 32).fill(BRAND_PURPLE);
  doc.fontSize(12).font('Helvetica-Bold').fillColor('white')
    .text('TOTAL AMOUNT', totX, y + 1);
  doc.text(`KES ${parseFloat(order.total_amount).toLocaleString()}`, valX, y + 1, { align: 'right', width: 0 });
  y += 40;

  // ── Payment status + QR ─────────────────────────────────────────
  if (y > 650) { doc.addPage(); y = 60; }

  const isPaid = ['completed', 'paid'].includes(order.payment_status);
  doc.rect(50, y, 200, 28)
    .fill(isPaid ? GREEN : '#f59e0b');
  doc.fontSize(13).font('Helvetica-Bold').fillColor('white')
    .text(isPaid ? '✓  PAID IN FULL' : '⏳  PAYMENT PENDING', 58, y + 7);

  doc.fillColor(TEXT_MID).fontSize(8.5).font('Helvetica')
    .text(`Payment method: ${(order.payment_method || 'N/A').toUpperCase()}`, 50, y + 36);

  // QR code
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const qrBuffer = await QRCode.toBuffer(`${frontendUrl}/orders/${order.id}`);
    doc.image(qrBuffer, 430, y - 10, { width: 90 });
    doc.fillColor(TEXT_MID).fontSize(7.5)
      .text('Scan to track order', 437, y + 83);
  } catch (err) {
    // QR optional
  }

  // ── AI savings callout ────────────────────────────────────────
  if (totalDiscountSaved > 0) {
    y += 70;
    if (y > 700) { doc.addPage(); y = 60; }
    doc.rect(50, y, 350, 36).fill(BRAND_LIGHT);
    doc.rect(50, y, 4, 36).fill(BRAND_PURPLE);
    doc.fontSize(9).font('Helvetica-Bold').fillColor(BRAND_PURPLE)
      .text('AI Optimizer Savings', 62, y + 5);
    doc.font('Helvetica').fillColor(TEXT_MID).fontSize(8.5)
      .text(`Your loyalty tier saved you KES ${Math.round(totalDiscountSaved).toLocaleString()} on this order.`, 62, y + 18);
  }

  // ── Footer ───────────────────────────────────────────────────────
  doc.rect(0, doc.page.height - 20, doc.page.width, 20).fill(BRAND_PURPLE);
  doc.fillColor('white').fontSize(8).font('Helvetica')
    .text('Thank you for shopping with BestLady Beauty — your partner in professional beauty supplies.',
      50, doc.page.height - 15, { align: 'center', width: doc.page.width - 100 });

  doc.end();
  return stream;
};

module.exports = { generateReceipt };
