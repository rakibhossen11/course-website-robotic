'use client';

import { useState, useRef, useEffect } from 'react';
import { useInvoice } from '@/app/contexts/InvoiceContext';
import { 
  FaDownload, 
  FaPrint, 
  FaShareAlt, 
  FaFilePdf, 
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCopy,
  FaReceipt,
  FaSpinner,
  FaBuilding,
  FaUser,
  FaBook,
  FaCalendar,
  FaCreditCard,
//   FaShield,
  FaFileInvoice,
  FaTag,
  FaPercentage
} from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function InvoiceGenerator({ invoice, onClose }) {
  const invoiceRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);

  // Calculate totals
  const subtotal = invoice.amount;
  const discount = invoice.discount;
  const tax = invoice.tax || 0;
  const total = invoice.totalAmount;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { 
        color: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
        icon: FaCheckCircle,
        label: 'PAID'
      },
      pending: { 
        color: 'bg-amber-100 text-amber-800 border border-amber-200',
        icon: FaClock,
        label: 'PENDING'
      },
      cancelled: { 
        color: 'bg-rose-100 text-rose-800 border border-rose-200',
        icon: FaTimesCircle,
        label: 'CANCELLED'
      }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <div className={`px-4 py-2 rounded-lg ${config.color} flex items-center gap-2`}>
        <Icon className="w-4 h-4" />
        <span className="font-semibold text-sm">{config.label}</span>
      </div>
    );
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        removeContainer: true,
        allowTaint: true,
        foreignObjectRendering: false,
        onclone: (clonedDoc) => {
          // Remove interactive elements for PDF
          const buttons = clonedDoc.querySelectorAll('button');
          buttons.forEach(btn => btn.style.display = 'none');
          
          // Enhance contrast for print
          const textElements = clonedDoc.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
          textElements.forEach(el => {
            el.style.color = '#000000';
            el.style.textShadow = 'none';
          });
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions
      const imgWidth = pageWidth - 20; // 10mm margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add watermark
      pdf.setFontSize(40);
      pdf.setTextColor(240, 240, 240);
      pdf.text('LEARNINGBD', 35, 140, { angle: 45 });
      pdf.setTextColor(0, 0, 0);
      
      // Add invoice
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Add footer with page numbers
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.text('This is a computer-generated invoice. No signature required.', pageWidth / 2, pageHeight - 5, { align: 'center' });
      }

      pdf.save(`Invoice-${invoice.id}.pdf`);
      
      // Success notification
      alert('✅ Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to simple PDF
      createSimplePDF();
    } finally {
      setDownloading(false);
    }
  };

  const createSimplePDF = () => {
    try {
      const pdf = new jsPDF();
      
      // Set document properties
      pdf.setProperties({
        title: `Invoice ${invoice.id}`,
        subject: `Invoice for ${invoice.courseName}`,
        author: 'LearningBD Academy',
        keywords: 'invoice, education, course, payment',
        creator: 'LearningBD Invoice System'
      });
      
      // Add header with logo
      pdf.setFontSize(24);
      pdf.setTextColor(59, 130, 246); // Blue
      pdf.text('LEARNINGBD', 105, 20, { align: 'center' });
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Professional Education Platform', 105, 27, { align: 'center' });
      
      // Invoice header
      pdf.setFontSize(16);
      pdf.text('TAX INVOICE', 20, 40);
      pdf.setFontSize(10);
      pdf.text(`Invoice #: ${invoice.id}`, 20, 48);
      pdf.text(`Date: ${formatDate(invoice.createdAt)}`, 20, 53);
      pdf.text(`Due Date: ${formatDate(invoice.dueDate)}`, 20, 58);
      
      // Status badge - FIXED SYNTAX
      const statusColor = invoice.status === 'paid' ? [34, 197, 94] : 
                         invoice.status === 'pending' ? [245, 158, 11] : 
                         [239, 68, 68];
      pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      pdf.roundedRect(160, 40, 40, 20, 3, 3, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text(invoice.status.toUpperCase(), 180, 52, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
      
      // Company info
      pdf.setFontSize(10);
      pdf.text('LearningBD Academy', 160, 70);
      pdf.text('123 Education Street', 160, 75);
      pdf.text('Dhaka 1212, Bangladesh', 160, 80);
      pdf.text('support@learningbd.com', 160, 85);
      pdf.text('+880 123 456 789', 160, 90);
      
      // Billing information
      pdf.setFontSize(12);
      pdf.text('Bill To:', 20, 70);
      pdf.setFontSize(10);
      pdf.text(invoice.billingAddress.name, 20, 76);
      pdf.text(invoice.billingAddress.email, 20, 81);
      if (invoice.billingAddress.phone) {
        pdf.text(invoice.billingAddress.phone, 20, 86);
      }
      
      // Course details
      pdf.setFontSize(12);
      pdf.text('Course Details:', 20, 96);
      pdf.setFontSize(10);
      pdf.text(invoice.courseName, 20, 102);
      
      // Invoice table
      pdf.setFontSize(11);
      pdf.text('Description', 20, 115);
      pdf.text('Quantity', 120, 115);
      pdf.text('Unit Price', 140, 115);
      pdf.text('Discount', 160, 115);
      pdf.text('Total', 180, 115);
      
      // Table line
      pdf.line(20, 117, 190, 117);
      
      let yPos = 125;
      invoice.items.forEach(item => {
        pdf.text(item.name.substring(0, 35), 20, yPos);
        pdf.text(item.quantity.toString(), 120, yPos);
        pdf.text(formatCurrency(item.unitPrice), 140, yPos);
        pdf.text(`-${formatCurrency(item.discount)}`, 160, yPos);
        pdf.text(formatCurrency(item.total), 180, yPos);
        yPos += 10;
      });
      
      // Summary
      yPos += 10;
      pdf.line(20, yPos, 190, yPos);
      yPos += 10;
      
      pdf.text('Subtotal:', 140, yPos);
      pdf.text(formatCurrency(subtotal), 180, yPos);
      yPos += 8;
      
      pdf.text('Discount:', 140, yPos);
      pdf.text(`-${formatCurrency(discount)}`, 180, yPos);
      yPos += 8;
      
      if (tax > 0) {
        pdf.text(`Tax (${invoice.taxRate || 0}%):`, 140, yPos);
        pdf.text(formatCurrency(tax), 180, yPos);
        yPos += 8;
      }
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total Amount:', 140, yPos);
      pdf.text(formatCurrency(total), 180, yPos);
      
      // Payment information
      yPos += 15;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      if (invoice.paymentMethod) {
        pdf.text(`Payment Method: ${invoice.paymentMethod}`, 20, yPos);
        yPos += 7;
      }
      if (invoice.transactionId) {
        pdf.text(`Transaction ID: ${invoice.transactionId}`, 20, yPos);
        yPos += 7;
      }
      if (invoice.paidAt) {
        pdf.text(`Payment Date: ${formatDate(invoice.paidAt)}`, 20, yPos);
      }
      
      // Footer
      pdf.setFontSize(9);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Thank you for choosing LearningBD Academy!', 105, 250, { align: 'center' });
      pdf.text('This is an official tax invoice. Please retain for your records.', 105, 255, { align: 'center' });
      pdf.text('For any questions, contact: support@learningbd.com', 105, 260, { align: 'center' });
      
      pdf.save(`Invoice-${invoice.id}-Professional.pdf`);
      alert('✅ Professional PDF version downloaded!');
    } catch (error) {
      console.error('Error creating PDF:', error);
      alert('⚠️ Failed to generate PDF. Please try the print option.');
    }
  };

  const handlePrint = async () => {
    if (!invoiceRef.current) return;
    
    setPrinting(true);
    try {
      const printContent = invoiceRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoice.id} - LearningBD</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: #ffffff;
                color: #111827;
                line-height: 1.6;
                padding: 40px;
                max-width: 1000px;
                margin: 0 auto;
              }
              
              .invoice-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 40px;
                padding-bottom: 30px;
                border-bottom: 2px solid #e5e7eb;
              }
              
              .company-info {
                text-align: right;
              }
              
              .company-name {
                font-size: 28px;
                font-weight: 800;
                color: #1d4ed8;
                margin-bottom: 5px;
                letter-spacing: -0.5px;
              }
              
              .invoice-title {
                font-size: 36px;
                font-weight: 900;
                color: #111827;
                margin-bottom: 10px;
                letter-spacing: -1px;
              }
              
              .invoice-meta {
                display: flex;
                gap: 30px;
                margin-bottom: 40px;
              }
              
              .meta-box {
                flex: 1;
                background: #f8fafc;
                padding: 20px;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
              }
              
              .meta-label {
                font-size: 12px;
                font-weight: 600;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
              }
              
              .meta-value {
                font-size: 16px;
                font-weight: 600;
                color: #111827;
              }
              
              .grid-2col {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 40px;
              }
              
              .info-card {
                background: #f8fafc;
                padding: 25px;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
              }
              
              .info-title {
                font-size: 14px;
                font-weight: 600;
                color: #475569;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              
              .info-content p {
                margin-bottom: 8px;
                color: #334155;
              }
              
              .info-content strong {
                color: #111827;
                font-weight: 600;
              }
              
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 40px 0;
              }
              
              thead {
                background: #1d4ed8;
                color: white;
              }
              
              th {
                padding: 16px 20px;
                text-align: left;
                font-weight: 600;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              
              tbody tr {
                border-bottom: 1px solid #e5e7eb;
              }
              
              tbody tr:hover {
                background: #f8fafc;
              }
              
              td {
                padding: 20px;
                color: #475569;
              }
              
              .amount-cell {
                font-weight: 600;
                color: #111827;
              }
              
              .discount-cell {
                color: #ef4444;
                font-weight: 600;
              }
              
              .summary {
                background: #f8fafc;
                padding: 30px;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                margin: 40px 0;
              }
              
              .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              
              .summary-row.total {
                border-bottom: none;
                border-top: 2px solid #1d4ed8;
                margin-top: 10px;
                padding-top: 20px;
              }
              
              .total-amount {
                font-size: 28px;
                font-weight: 800;
                color: #1d4ed8;
              }
              
              .footer {
                margin-top: 60px;
                padding-top: 30px;
                border-top: 2px solid #e5e7eb;
                text-align: center;
                color: #64748b;
                font-size: 14px;
              }
              
              .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              
              .status-paid {
                background: #dcfce7;
                color: #166534;
                border: 1px solid #bbf7d0;
              }
              
              @media print {
                body {
                  padding: 20px;
                }
                
                .no-print {
                  display: none !important;
                }
                
                @page {
                  margin: 20mm;
                  size: A4;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice-header">
              <div>
                <h1 class="invoice-title">INVOICE</h1>
                <p style="color: #64748b; font-size: 14px;">Professional Tax Invoice</p>
              </div>
              <div class="company-info">
                <div class="company-name">LEARNINGBD</div>
                <p style="color: #64748b; font-size: 14px;">Professional Education Platform</p>
                <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Dhaka, Bangladesh</p>
              </div>
            </div>
            
            <div class="invoice-meta">
              <div class="meta-box">
                <div class="meta-label">Invoice Number</div>
                <div class="meta-value">${invoice.id}</div>
              </div>
              <div class="meta-box">
                <div class="meta-label">Invoice Date</div>
                <div class="meta-value">${formatDate(invoice.createdAt)}</div>
              </div>
              <div class="meta-box">
                <div class="meta-label">Due Date</div>
                <div class="meta-value">${formatDate(invoice.dueDate)}</div>
              </div>
              <div class="meta-box">
                <div class="meta-label">Status</div>
                <div>
                  ${invoice.status === 'paid' ? 
                    '<div class="status-badge status-paid"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> PAID</div>' : 
                    invoice.status === 'pending' ? 
                    '<div class="status-badge" style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a;">PENDING</div>' :
                    '<div class="status-badge" style="background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;">CANCELLED</div>'
                  }
                </div>
              </div>
            </div>
            
            <div class="grid-2col">
              <div class="info-card">
                <div class="info-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  BILL TO
                </div>
                <div class="info-content">
                  <p><strong>${invoice.billingAddress.name}</strong></p>
                  <p>${invoice.billingAddress.email}</p>
                  ${invoice.billingAddress.phone ? `<p>${invoice.billingAddress.phone}</p>` : ''}
                  ${invoice.billingAddress.address ? `<p>${invoice.billingAddress.address}</p>` : ''}
                </div>
              </div>
              
              <div class="info-card">
                <div class="info-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>
                  COURSE DETAILS
                </div>
                <div class="info-content">
                  <p><strong>${invoice.courseName}</strong></p>
                  <p style="color: #64748b; font-size: 14px; margin-top: 8px;">${invoice.items[0]?.description || 'Professional Course Enrollment'}</p>
                </div>
              </div>
            </div>
            
            ${invoice.paymentMethod || invoice.transactionId ? `
            <div class="info-card">
              <div class="info-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                PAYMENT INFORMATION
              </div>
              <div class="info-content">
                <div style="display: flex; gap: 40px;">
                  ${invoice.paymentMethod ? `<div><p style="color: #64748b; font-size: 13px;">Payment Method</p><p><strong>${invoice.paymentMethod}</strong></p></div>` : ''}
                  ${invoice.transactionId ? `<div><p style="color: #64748b; font-size: 13px;">Transaction ID</p><p><strong>${invoice.transactionId}</strong></p></div>` : ''}
                  ${invoice.paidAt ? `<div><p style="color: #64748b; font-size: 13px;">Paid On</p><p><strong>${formatDate(invoice.paidAt)}</strong></p></div>` : ''}
                </div>
              </div>
            </div>
            ` : ''}
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Discount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>
                      <div>
                        <strong>${item.name}</strong>
                        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">${item.description}</p>
                      </div>
                    </td>
                    <td>${item.quantity}</td>
                    <td class="amount-cell">${formatCurrency(item.unitPrice)}</td>
                    <td class="discount-cell">-${formatCurrency(item.discount)}</td>
                    <td class="amount-cell">${formatCurrency(item.total)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="summary">
              <div class="summary-row">
                <span>Subtotal</span>
                <strong>${formatCurrency(subtotal)}</strong>
              </div>
              <div class="summary-row">
                <span>Discount</span>
                <strong style="color: #ef4444;">-${formatCurrency(discount)}</strong>
              </div>
              ${tax > 0 ? `
              <div class="summary-row">
                <span>Tax (${invoice.taxRate || 0}%)</span>
                <strong>${formatCurrency(tax)}</strong>
              </div>
              ` : ''}
              <div class="summary-row total">
                <span style="font-size: 18px; font-weight: 700;">TOTAL AMOUNT</span>
                <span class="total-amount">${formatCurrency(total)}</span>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin-bottom: 10px;"><strong>Thank you for choosing LearningBD Academy!</strong></p>
              <p style="margin-bottom: 5px;">This is an official tax invoice. Please retain for your records.</p>
              <p style="color: #94a3b8; font-size: 13px;">For questions, contact support@learningbd.com | +880 123 456 789</p>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">Invoice ID: ${invoice.id} | Generated: ${formatDate(invoice.createdAt)}</p>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 1000);
              };
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
    } catch (error) {
      console.error('Error printing:', error);
      alert('⚠️ Failed to open print dialog. Please try downloading the PDF instead.');
    } finally {
      setPrinting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoice.id}`,
          text: `Invoice for ${invoice.courseName} - ${formatCurrency(total)}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      copyToClipboard(window.location.href);
      alert('✅ Invoice link copied to clipboard!');
    }
  };

  const handleSendEmail = () => {
    const subject = `Invoice ${invoice.id} - ${invoice.courseName}`;
    const body = `Dear ${invoice.billingAddress.name},

Thank you for your purchase! Please find your invoice details below:

INVOICE: ${invoice.id}
DATE: ${formatDate(invoice.createdAt)}
COURSE: ${invoice.courseName}
AMOUNT: ${formatCurrency(total)}
STATUS: ${invoice.status.toUpperCase()}

Payment Method: ${invoice.paymentMethod || 'Not specified'}
Transaction ID: ${invoice.transactionId || 'Not specified'}

You can view and download your invoice at: ${window.location.href}

Thank you for choosing LearningBD Academy!

Best regards,
LearningBD Support Team
support@learningbd.com
+880 123 456 789`;
    
    window.location.href = `mailto:${invoice.billingAddress.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border border-gray-200">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <FaFileInvoice className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Invoice Details</h2>
                <p className="text-blue-100 mt-1">Professional Tax Invoice</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">#{invoice.id}</div>
                <div className="text-blue-100 text-sm">{getStatusBadge(invoice.status)}</div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/20 rounded-xl transition-colors"
              >
                <FaTimesCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 p-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <>
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FaDownload className="w-5 h-5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
            
            <button
              onClick={handlePrint}
              disabled={printing}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {printing ? (
                <>
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  <span>Preparing Print...</span>
                </>
              ) : (
                <>
                  <FaPrint className="w-5 h-5" />
                  <span>Print Invoice</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <FaShareAlt className="w-5 h-5" />
              <span>Share Invoice</span>
            </button>
            
            <button
              onClick={handleSendEmail}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <FaEnvelope className="w-5 h-5" />
              <span>Email Invoice</span>
            </button>
          </div>
          
          {copied && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg animate-fade-in">
              <FaCheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Invoice link copied to clipboard!</span>
            </div>
          )}
        </div>

        {/* Invoice Preview */}
        <div className="p-8 overflow-auto max-h-[calc(95vh-300px)]" ref={invoiceRef}>
          {/* Modern Invoice Design */}
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-12 pb-8 border-b border-gray-200">
              <div>
                <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">INVOICE</h1>
                <div className="space-y-1">
                  <p className="text-gray-600">
                    <span className="font-semibold">Invoice #:</span> {invoice.id}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Date:</span> {formatDate(invoice.createdAt)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Due Date:</span> {formatDate(invoice.dueDate)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-blue-600 mb-2">LEARNINGBD</div>
                <p className="text-gray-600 font-medium">Professional Education Platform</p>
                <p className="text-gray-500 text-sm">Dhaka, Bangladesh</p>
                <p className="text-gray-500 text-sm">support@learningbd.com</p>
                <p className="text-gray-500 text-sm">+880 123 456 789</p>
              </div>
            </div>

            {/* Status and Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaUser className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Bill To</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900 text-lg">{invoice.billingAddress.name}</p>
                    <p className="text-gray-600">{invoice.billingAddress.email}</p>
                    {invoice.billingAddress.phone && (
                      <p className="text-gray-600">{invoice.billingAddress.phone}</p>
                    )}
                    {invoice.billingAddress.address && (
                      <p className="text-gray-600">{invoice.billingAddress.address}</p>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FaBook className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Course Details</h3>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{invoice.courseName}</p>
                    <p className="text-gray-600 text-sm mt-2">{invoice.items[0]?.description || 'Professional course enrollment with lifetime access'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FaCalendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Invoice Status</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(invoice.status)}
                    {invoice.paidAt && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600">Paid On</p>
                        <p className="text-gray-900 font-semibold">{formatDate(invoice.paidAt)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {(invoice.paymentMethod || invoice.transactionId) && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FaCreditCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
                    </div>
                    <div className="space-y-3">
                      {invoice.paymentMethod && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Payment Method</p>
                          <p className="text-gray-900 font-semibold">{invoice.paymentMethod}</p>
                        </div>
                      )}
                      {invoice.transactionId && (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Transaction ID</p>
                            <p className="text-gray-900 font-semibold">{invoice.transactionId}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(invoice.transactionId)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FaCopy className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Items Table */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Invoice Items</h3>
                <div className="text-sm text-gray-500">
                  {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="text-left p-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Description</th>
                      <th className="text-left p-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Qty</th>
                      <th className="text-left p-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Unit Price</th>
                      <th className="text-left p-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Discount</th>
                      <th className="text-left p-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-6">
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">{item.name}</p>
                            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                          </div>
                        </td>
                        <td className="p-6 text-gray-700 font-medium">{item.quantity}</td>
                        <td className="p-6 text-gray-700 font-medium">{formatCurrency(item.unitPrice)}</td>
                        <td className="p-6 text-red-600 font-semibold">-{formatCurrency(item.discount)}</td>
                        <td className="p-6 text-gray-900 font-bold text-lg">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex justify-end">
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="font-semibold text-gray-900 text-lg">{formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <FaTag className="w-4 h-4 text-red-500" />
                      <span className="text-gray-600 font-medium">Discount</span>
                    </div>
                    <span className="font-semibold text-red-600 text-lg">-{formatCurrency(discount)}</span>
                  </div>
                  
                  {tax > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <FaPercentage className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600 font-medium">Tax ({invoice.taxRate || 0}%)</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-lg">{formatCurrency(tax)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-6 mt-4 border-t-2 border-gray-300">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">Total Amount</span>
                      <p className="text-gray-500 text-sm mt-1">USD - United States Dollar</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-blue-600">{formatCurrency(total)}</div>
                      <p className="text-gray-500 text-sm mt-1">Due upon receipt</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {/* <FaShield className="w-5 h-5 text-blue-600" /> */}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Payment Instructions</h4>
                  </div>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li>Payment is due within 24 hours of invoice date</li>
                    <li>Make payment using bKash, Nagad, or Rocket</li>
                    <li>Include invoice number in payment reference</li>
                    <li>Send payment confirmation to support@learningbd.com</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <FaBuilding className="w-5 h-5 text-gray-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Company Information</h4>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>LearningBD Academy</strong></p>
                    <p>123 Education Street, Dhaka 1212</p>
                    <p>Bangladesh</p>
                    <p>VAT Registration: BD123456789</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Footer */}
            <div className="mt-12 pt-8 border-t border-gray-300 text-center">
              <div className="mb-4">
                <p className="text-gray-900 font-semibold text-lg">Thank you for choosing LearningBD Academy!</p>
                <p className="text-gray-600 mt-2">This is an official tax invoice. Please retain for your records.</p>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p>For any questions, contact our support team at support@learningbd.com</p>
                <p>Invoice ID: {invoice.id} | Generated: {formatDate(invoice.createdAt)}</p>
                <p className="text-xs mt-4">© {new Date().getFullYear()} LearningBD Academy. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}