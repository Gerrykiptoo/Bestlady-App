const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

/**
 * Generate a PDF report for financial data
 */
const generateFinancialReportPDF = async (data, reportType, startDate, endDate) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
  const stream = new PassThrough();
  doc.pipe(stream);

  // Header
  doc.fontSize(24).font('Helvetica-Bold').fillColor('#8B4513').text('BestLady Beauty', { align: 'center' });
  doc.fontSize(14).font('Helvetica').fillColor('gray').text('Financial Report', { align: 'center' });
  doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown();
  doc.strokeColor('#8B4513').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text(`Report Type: ${reportType.toUpperCase()}`);
  doc.fontSize(10).font('Helvetica').text(`Period: ${startDate || 'All Time'} to ${endDate || 'Now'}`);
  doc.moveDown();

  if (reportType === 'orders') {
    // Table Header
    const startY = doc.y;
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('Order #', 50, startY);
    doc.text('Date', 150, startY);
    doc.text('Customer ID', 250, startY);
    doc.text('Method', 380, startY);
    doc.text('Amount (KES)', 480, startY);
    doc.moveDown();
    doc.strokeColor('#EEEEEE').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    doc.font('Helvetica').fontSize(9);
    let totalRevenue = 0;
    
    data.forEach(order => {
      if (doc.y > 750) doc.addPage();
      const currentY = doc.y;
      doc.text(order.order_number, 50, currentY);
      doc.text(new Date(order.createdAt).toLocaleDateString(), 150, currentY);
      doc.text(order.user_id.substring(0, 13) + '...', 250, currentY);
      doc.text(order.payment_method, 380, currentY);
      doc.text(parseFloat(order.total_amount).toLocaleString(), 480, currentY, { align: 'right' });
      totalRevenue += parseFloat(order.total_amount);
      doc.moveDown();
    });

    doc.moveDown();
    doc.strokeColor('#8B4513').lineWidth(1).moveTo(350, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica-Bold').text(`Total Revenue: KES ${totalRevenue.toLocaleString()}`, 350, doc.y, { align: 'right' });
  } 
  else if (reportType === 'products_sold') {
    const startY = doc.y;
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('Product Name', 50, startY);
    doc.text('SKU', 250, startY);
    doc.text('Qty Sold', 350, startY);
    doc.text('Revenue (KES)', 450, startY);
    doc.moveDown();
    doc.strokeColor('#EEEEEE').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    doc.font('Helvetica').fontSize(9);
    data.forEach(item => {
      if (doc.y > 750) doc.addPage();
      const currentY = doc.y;
      doc.text(item.product_name, 50, currentY, { width: 190 });
      doc.text(item.sku || '-', 250, currentY);
      doc.text(item.total_quantity.toString(), 350, currentY);
      doc.text(parseFloat(item.total_revenue).toLocaleString(), 450, currentY, { align: 'right' });
      doc.moveDown();
    });
  }
  else if (reportType === 'stock') {
    const startY = doc.y;
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('Product Name', 50, startY);
    doc.text('SKU', 250, startY);
    doc.text('Current Stock', 350, startY);
    doc.text('Reorder Point', 450, startY);
    doc.moveDown();
    doc.strokeColor('#EEEEEE').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    doc.font('Helvetica').fontSize(9);
    data.forEach(p => {
      if (doc.y > 750) doc.addPage();
      const currentY = doc.y;
      doc.text(p.name, 50, currentY, { width: 190 });
      doc.text(p.sku || '-', 250, currentY);
      
      const isLow = parseInt(p.current_stock) <= parseInt(p.reorder_point);
      if (isLow) doc.fillColor('red').font('Helvetica-Bold');
      doc.text(p.current_stock.toString(), 350, currentY);
      doc.fillColor('black').font('Helvetica');
      
      doc.text(p.reorder_point.toString(), 450, currentY);
      doc.moveDown();
    });
  }

  // Footer
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).fillColor('gray').text(
      `Page ${i + 1} of ${pages.count} - BestLady Beauty Supply Chain Optimizer`,
      50,
      doc.page.height - 50,
      { align: 'center' }
    );
  }

  doc.end();
  return stream;
};

const BRAND = '#8B4513';

const pdfHeader = (doc, title, subtitle) => {
  doc.rect(0, 0, doc.page.width, 12).fill(BRAND);
  doc.moveDown(1.5);
  doc.fontSize(22).font('Helvetica-Bold').fillColor(BRAND).text('BestLady Beauty', { align: 'center' });
  doc.fontSize(13).font('Helvetica').fillColor('#555').text(title, { align: 'center' });
  if (subtitle) doc.fontSize(9).fillColor('#888').text(subtitle, { align: 'center' });
  doc.moveDown(0.5);
  doc.strokeColor(BRAND).lineWidth(1.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();
};

const generateOrderHistoryPDF = async (orders, user) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
  const stream = new PassThrough();
  doc.pipe(stream);

  pdfHeader(doc, 'Order History', `${user.business_name || user.username} · Generated ${new Date().toLocaleString('en-KE')}`);

  // Summary
  const total = orders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);
  doc.fontSize(10).font('Helvetica').fillColor('#333');
  doc.text(`Total Orders: ${orders.length}     Total Spent: KES ${total.toLocaleString()}`, { align: 'left' });
  doc.moveDown();

  // Table header
  const hY = doc.y;
  doc.rect(50, hY - 4, 500, 18).fill('#F3F4F6');
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#374151');
  doc.text('Order #', 55, hY);
  doc.text('Date', 155, hY);
  doc.text('Items', 265, hY);
  doc.text('Method', 325, hY);
  doc.text('Status', 400, hY);
  doc.text('Total (KES)', 465, hY, { width: 75, align: 'right' });

  doc.font('Helvetica').fontSize(9).fillColor('#333');
  let y = hY + 22;

  orders.forEach(order => {
    if (y > 720) { doc.addPage(); y = 50; }
    const itemCount = order.OrderItems?.length ?? 0;
    const statusColors = { pending: '#d97706', paid: '#059669', processing: '#3b82f6', dispatched: '#8b5cf6', delivered: '#059669', cancelled: '#ef4444' };
    doc.text(order.order_number, 55, y, { width: 95 });
    doc.text(new Date(order.createdAt).toLocaleDateString('en-KE'), 155, y);
    doc.text(itemCount.toString(), 270, y);
    doc.text((order.payment_method || '-').toUpperCase(), 325, y);
    doc.fillColor(statusColors[order.status] || '#333').text((order.status || '-').toUpperCase(), 400, y);
    doc.fillColor('#333').text(parseFloat(order.total_amount).toLocaleString(), 465, y, { width: 75, align: 'right' });
    y += 20;
    doc.strokeColor('#EEEEEE').lineWidth(0.5).moveTo(50, y - 4).lineTo(550, y - 4).stroke();
  });

  // Footer
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).fillColor('#9ca3af').text(`Page ${i + 1} of ${pages.count} — BestLady Beauty`, 50, doc.page.height - 40, { align: 'center' });
  }

  doc.end();
  return stream;
};

const generateWalletTransactionsPDF = async (transactions, user) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
  const stream = new PassThrough();
  doc.pipe(stream);

  pdfHeader(doc, 'Wallet Transactions', `${user.business_name || user.username} · Generated ${new Date().toLocaleString('en-KE')}`);

  const totalIn = transactions.filter(t => t.transaction_type === 'deposit').reduce((s, t) => s + parseFloat(t.amount || 0), 0);
  const totalOut = transactions.filter(t => t.transaction_type !== 'deposit').reduce((s, t) => s + parseFloat(t.amount || 0), 0);
  doc.fontSize(10).font('Helvetica').fillColor('#333');
  doc.text(`Total In: KES ${totalIn.toLocaleString()}     Total Out: KES ${totalOut.toLocaleString()}     Net: KES ${(totalIn - totalOut).toLocaleString()}`);
  doc.moveDown();

  const hY = doc.y;
  doc.rect(50, hY - 4, 500, 18).fill('#F3F4F6');
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#374151');
  doc.text('Date', 55, hY);
  doc.text('Type', 175, hY);
  doc.text('Reference', 255, hY);
  doc.text('Notes', 375, hY);
  doc.text('Amount (KES)', 465, hY, { width: 75, align: 'right' });

  doc.font('Helvetica').fontSize(9).fillColor('#333');
  let y = hY + 22;

  transactions.forEach(tx => {
    if (y > 720) { doc.addPage(); y = 50; }
    const isIn = tx.transaction_type === 'deposit';
    doc.fillColor('#333').text(new Date(tx.createdAt).toLocaleString('en-KE'), 55, y, { width: 115 });
    doc.text((tx.transaction_type || '-').toUpperCase(), 175, y, { width: 75 });
    doc.text(tx.reference_id || '-', 255, y, { width: 115 });
    doc.text(tx.notes || '-', 375, y, { width: 85 });
    doc.fillColor(isIn ? '#059669' : '#DC2626').text(`${isIn ? '+' : '-'}${parseFloat(tx.amount).toLocaleString()}`, 465, y, { width: 75, align: 'right' });
    y += 20;
    doc.fillColor('#333');
    doc.strokeColor('#EEEEEE').lineWidth(0.5).moveTo(50, y - 4).lineTo(550, y - 4).stroke();
  });

  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).fillColor('#9ca3af').text(`Page ${i + 1} of ${pages.count} — BestLady Beauty`, 50, doc.page.height - 40, { align: 'center' });
  }

  doc.end();
  return stream;
};

module.exports = { generateFinancialReportPDF, generateOrderHistoryPDF, generateWalletTransactionsPDF };
