const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');
const QRCode = require('qrcode');

const generateReceipt = async (order, user, items) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const stream = new PassThrough();
  doc.pipe(stream);

  // Background Design (Subtle)
  doc.rect(0, 0, doc.page.width, 15).fill('#8B4513');

  // Header
  doc.moveDown(2);
  doc.fontSize(28).font('Helvetica-Bold').fillColor('#8B4513').text('BestLady Beauty', { align: 'center' });
  doc.fontSize(10).font('Helvetica').fillColor('#666666').text('The Ultimate Supply Chain & Beauty Partner', { align: 'center' });
  doc.text('Nairobi, Kenya | +254 700 000000 | info@bestlady.co.ke', { align: 'center' });
  doc.moveDown();
  doc.strokeColor('#8B4513').lineWidth(1.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();
  
  // Receipt Info
  const topInfoY = doc.y;
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('OFFICIAL RECEIPT');
  doc.fontSize(10).font('Helvetica').text(`Order ID: ${order.order_number}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  
  doc.font('Helvetica-Bold').text('Bill To:', 350, topInfoY);
  doc.font('Helvetica').text(user.business_name || user.username, 350, topInfoY + 15);
  doc.text(user.email, 350, topInfoY + 25);
  doc.text(`Phone: ${user.phone || 'N/A'}`, 350, topInfoY + 35);
  doc.text(`Tier: ${user.tier?.toUpperCase() || 'RETAIL'}`, 350, topInfoY + 45);
  
  doc.moveDown(4);

  // Items table header
  const tableHeaderY = doc.y;
  doc.rect(50, tableHeaderY - 5, 500, 20).fill('#F3F4F6');
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#374151');
  doc.text('Product', 60, tableHeaderY, { width: 180 });
  doc.text('Qty', 248, tableHeaderY);
  doc.text('Unit Price', 292, tableHeaderY);
  doc.text('Discount', 380, tableHeaderY);
  doc.text('Subtotal', 470, tableHeaderY, { width: 70, align: 'right' });

  doc.fillColor('#333333');
  doc.font('Helvetica').fontSize(9);
  let y = tableHeaderY + 25;

  // List items
  items.forEach((item) => {
    if (y > 680) { doc.addPage(); y = 50; }

    const hasDiscount = item.discount_percent > 0 && item.original_price && parseFloat(item.original_price) > parseFloat(item.unit_price);
    const rowHeight = hasDiscount ? 32 : 22;

    doc.text(item.Product?.name || 'Unknown Item', 60, y, { width: 180 });
    doc.text(item.quantity.toString(), 248, y);

    if (hasDiscount) {
      // Show original price struck through (approximated) above discounted price
      doc.fillColor('#9CA3AF').text(`KES ${parseFloat(item.original_price).toLocaleString()}`, 292, y);
      doc.fillColor('#059669').text(`KES ${parseFloat(item.unit_price).toLocaleString()}`, 292, y + 13);
      doc.fillColor('#DC2626').text(`-${item.discount_percent}%`, 385, y + 6);
    } else {
      doc.fillColor('#333333').text(`KES ${parseFloat(item.unit_price).toLocaleString()}`, 292, y);
      doc.text('—', 385, y);
    }

    doc.fillColor('#333333').text(`KES ${parseFloat(item.subtotal).toLocaleString()}`, 470, y, { width: 70, align: 'right' });

    y += rowHeight;
    doc.strokeColor('#EEEEEE').lineWidth(0.5).moveTo(50, y - 4).lineTo(550, y - 4).stroke();
  });

  // Totals Area
  y += 20;
  if (y > 700) { doc.addPage(); y = 50; }
  
  const totalsX = 350;
  doc.fontSize(10).font('Helvetica').text('Subtotal:', totalsX, y);
  doc.text(`KES ${parseFloat(order.subtotal).toLocaleString()}`, 480, y, { align: 'right' });
  
  y += 20;
  doc.text('VAT (16%):', totalsX, y);
  doc.text(`KES ${parseFloat(order.tax).toLocaleString()}`, 480, y, { align: 'right' });
  
  y += 20;
  doc.text('Delivery Fee:', totalsX, y);
  doc.text(`KES ${parseFloat(order.delivery_fee).toLocaleString()}`, 480, y, { align: 'right' });
  
  y += 25;
  doc.rect(totalsX - 10, y - 5, 210, 30).fill('#8B4513');
  doc.fontSize(14).font('Helvetica-Bold').fillColor('white').text('TOTAL AMOUNT:', totalsX, y);
  doc.text(`KES ${parseFloat(order.total_amount).toLocaleString()}`, 480, y, { align: 'right' });
  
  // Payment Status & QR
  y += 50;
  if (y > 650) { doc.addPage(); y = 50; }

  const statusColor = order.payment_status === 'completed' || order.payment_status === 'paid' ? '#059669' : '#DC2626';
  doc.fillColor(statusColor).fontSize(16).font('Helvetica-Bold').text(
    order.payment_status === 'completed' || order.payment_status === 'paid' ? 'PAID IN FULL' : 'PAYMENT PENDING',
    50, y
  );
  
  doc.fillColor('#6B7280').fontSize(9).font('Helvetica').text(`Payment Method: ${order.payment_method?.toUpperCase()}`, 50, y + 20);
  
  if (order.mpesa_code) {
    doc.text(`M-Pesa Ref: ${order.mpesa_code}`, 50, y + 32);
  }

  // QR Code
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const qrBuffer = await QRCode.toBuffer(`${frontendUrl}/orders/${order.id}`);
    doc.image(qrBuffer, 430, y - 20, { width: 100 });
    doc.fillColor('#374151').fontSize(8).text('Scan to Verify Order', 440, y + 85);
  } catch (err) {
    console.error('QR Error:', err);
  }

  // Footer
  doc.fillColor('#9CA3AF').fontSize(8).text(
    'Thank you for shopping with BestLady Beauty! Your partner in professional beauty supplies.',
    50, doc.page.height - 40, { align: 'center' }
  );

  doc.end();
  return stream;
};

module.exports = { generateReceipt };