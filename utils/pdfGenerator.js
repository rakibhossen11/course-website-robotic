import { jsPDF } from 'jspdf';

export const generateInvoicePDF = (invoice) => {
  const pdf = new jsPDF();
  
  // Set document properties
  pdf.setProperties({
    title: `Invoice ${invoice.id}`,
    subject: `Invoice for ${invoice.courseName}`,
    author: 'LearningBD',
    keywords: 'invoice, payment, receipt',
    creator: 'LearningBD Invoice System'
  });
  
  // Add watermark
  pdf.setFontSize(40);
  pdf.setTextColor(240, 240, 240);
  pdf.text('LEARNINGBD', 35, 140, { angle: 45 });
  pdf.setTextColor(0, 0, 0);
  
  // Add header
  pdf.setFontSize(20);
  pdf.text('INVOICE', 105, 20, null, null, 'center');
  
  pdf.setFontSize(12);
  pdf.text(`Invoice #: ${invoice.id}`, 20, 35);
  pdf.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 20, 40);
  pdf.text(`Status: ${invoice.status.toUpperCase()}`, 20, 45);
  
  // Add company info
  pdf.setFontSize(14);
  pdf.text('LearningBD', 160, 35);
  pdf.setFontSize(10);
  pdf.text('Online Learning Platform', 160, 40);
  pdf.text('Dhaka, Bangladesh', 160, 45);
  pdf.text('support@learningbd.com', 160, 50);
  pdf.text('+880 123 456 789', 160, 55);
  
  // Add billing info
  pdf.setFontSize(12);
  pdf.text('Bill To:', 20, 65);
  pdf.setFontSize(11);
  pdf.text(invoice.billingAddress.name, 20, 70);
  pdf.text(invoice.billingAddress.email, 20, 75);
  if (invoice.billingAddress.phone) {
    pdf.text(invoice.billingAddress.phone, 20, 80);
  }
  
  // Add course details
  pdf.setFontSize(12);
  pdf.text('Course:', 20, 90);
  pdf.setFontSize(11);
  pdf.text(invoice.courseName, 20, 95);
  
  // Add table header
  pdf.setFontSize(11);
  pdf.text('Description', 20, 110);
  pdf.text('Qty', 130, 110);
  pdf.text('Unit Price', 150, 110);
  pdf.text('Total', 180, 110);
  
  // Add line
  pdf.line(20, 112, 190, 112);
  
  let yPos = 120;
  invoice.items.forEach(item => {
    pdf.text(item.name.substring(0, 40), 20, yPos);
    pdf.text(item.quantity.toString(), 130, yPos);
    pdf.text(`৳${item.unitPrice.toLocaleString()}`, 150, yPos);
    pdf.text(`৳${item.total.toLocaleString()}`, 180, yPos);
    yPos += 10;
  });
  
  // Add totals
  yPos += 10;
  pdf.line(20, yPos, 190, yPos);
  yPos += 10;
  
  pdf.text('Subtotal:', 130, yPos);
  pdf.text(`৳${invoice.amount.toLocaleString()}`, 180, yPos);
  yPos += 8;
  
  pdf.text('Discount:', 130, yPos);
  pdf.text(`-৳${invoice.discount.toLocaleString()}`, 180, yPos);
  yPos += 8;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total:', 130, yPos);
  pdf.text(`৳${invoice.totalAmount.toLocaleString()}`, 180, yPos);
  
  // Add footer
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Thank you for choosing LearningBD!', 105, 250, null, null, 'center');
  pdf.text('This is a computer-generated invoice. No signature required.', 105, 255, null, null, 'center');
  
  // Add page number
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.text(`Page ${i} of ${pageCount}`, 105, 280, null, null, 'center');
  }
  
  return pdf;
};