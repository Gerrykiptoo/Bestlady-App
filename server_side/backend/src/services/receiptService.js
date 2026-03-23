const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');
const QRCode = require('qrcode');

const generateReceipt = async (order, user, items) => {
  const doc = new PDFDocument({ margin: 50 });
  const stream = new PassThrough();
  doc.pipe(stream);

  // Header
  doc.fontSize(20).font('Helvetica-Bold').text('BestLady Company Ltd', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).font('Helvetica').text(`Receipt No: ${order.orderNumber}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.text(`Customer: ${user.business_name} (${user.tier})`);
  doc.moveDown();

  // Items table header
  const startY = doc.y;
  doc.font('Helvetica-Bold').fontSize(10);
  doc.text('Item', 50, startY);
  doc.text('Qty', 250, startY);
  doc.text('Price', 300, startY);
  doc.text('Total', 400, startY);
  doc.font('Helvetica');
  let y = startY + 20;

  items.forEach(item => {
    doc.text(item.product?.name || 'Unknown', 50, y, { width: 180, ellipsis: true });
    doc.text(item.quantity.toString(), 250, y);
    doc.text(`KES ${item.unit_price}`, 300, y);
    doc.text(`KES ${item.subtotal}`, 400, y);
    y += 20;
  });

  // Totals
  y += 10;
  doc.font('Helvetica-Bold');
  doc.text(`Subtotal: KES ${order.subtotal}`, 350, y, { align: 'right' });
  y += 20;
  doc.text(`Tax: KES ${order.tax}`, 350, y, { align: 'right' });
  y += 20;
  doc.text(`Delivery: KES ${order.delivery_fee}`, 350, y, { align: 'right' });
  y += 20;
  doc.fontSize(12).text(`Total: KES ${order.total_amount}`, 350, y, { align: 'right' });
  y += 30;

  // QR Code if available
  if (order.qr_code) {
    try {
      const qrBuffer = await QRCode.toBuffer(order.qr_code);
      doc.image(qrBuffer, 50, y, { width: 100 });
    } catch (err) {
      console.error('QR generation error:', err);
    }
  }

  doc.end();
  return stream;
};

module.exports = { generateReceipt };