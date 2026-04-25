const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');
const QRCode = require('qrcode');

const generateReceipt = async (order, user, items) => {
  const doc = new PDFDocument({ margin: 50 });
  const stream = new PassThrough();
  doc.pipe(stream);

  // Header
  doc.fontSize(24).font('Helvetica-Bold').fillColor('#8B4513').text('BestLady Beauty', { align: 'center' });
  doc.fontSize(10).font('Helvetica').fillColor('gray').text('AI-Powered Beauty Supply Chain Platform', { align: 'center' });
  doc.moveDown();
  doc.strokeColor('#8B4513').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();
  
  doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text(`Receipt No: ${order.order_number}`);
  doc.fontSize(10).font('Helvetica').text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
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

  // List all commodities with details
  items.forEach(item => {
    doc.text(item.Product?.name || 'Unknown', 50, y, { width: 180, ellipsis: true });
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

  // Payment Status
  doc.fontSize(10).font('Helvetica-Bold');
  const paymentStatus = order.payment_status === 'paid' ? 'PAID ✓' : 'PENDING PAYMENT';
  const statusColor = order.payment_status === 'paid' ? 'green' : 'red';
  doc.fillColor(statusColor).text(`Payment Status: ${paymentStatus}`, 50, y);
  doc.fillColor('black');
  y += 30;

  // Enhanced QR Code with payment link
  if (order.id) {
    try {
      // Create a direct link to the order payment page
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const orderUrl = `${frontendUrl}/payment/${order.id}`;
      
      const qrBuffer = await QRCode.toBuffer(orderUrl);
      doc.image(qrBuffer, 50, y, { width: 120 });
      
      // QR Code instructions
      doc.fontSize(10).font('Helvetica-Bold').text('Scan to View & Pay', 180, y);
      doc.fontSize(8).font('Helvetica').text('Scan this QR code with your phone camera', 180, y + 15);
      doc.text('to see full itemized details and complete', 180, y + 25);
      doc.text('your M-Pesa payment securely.', 180, y + 35);
      
      if (order.payment_status === 'paid') {
        doc.fillColor('green').text('Order already paid. Keep this for your records.', 180, y + 55);
        doc.fillColor('black');
      }
    } catch (err) {
      console.error('QR generation error:', err);
    }
  }

  doc.end();
  return stream;
};

module.exports = { generateReceipt };