/**
 * Invoice Service - Generiranje PDF faktura
 */

import PDFDocument from 'pdfkit';
import { prisma } from '../lib/prisma.js';
import { sendInvoiceEmail } from '../lib/email.js';
import { fiscalizeInvoice, requiresFiscalization, generateQRCodeURL } from './fiscalization-service.js';

/**
 * Generira jedinstveni broj fakture
 * Format: INV-YYYY-MM-XXXX (npr. INV-2025-01-0001)
 */
export async function generateInvoiceNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  // Pronađi zadnji broj fakture za ovaj mjesec
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNumber: {
        startsWith: `INV-${year}-${month}-`
      }
    },
    orderBy: {
      invoiceNumber: 'desc'
    }
  });

  let sequence = 1;
  if (lastInvoice) {
    // Izvadi sekvenciju iz broja fakture (zadnje 4 znamenke)
    const lastSequence = parseInt(lastInvoice.invoiceNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  const sequenceStr = String(sequence).padStart(4, '0');
  return `INV-${year}-${month}-${sequenceStr}`;
}

/**
 * Kreira novu fakturu u bazi
 */
export async function createInvoice(data) {
  const {
    userId,
    type,
    amount,
    currency = 'EUR',
    subscriptionId,
    leadPurchaseId,
    stripePaymentIntentId,
    stripeInvoiceId
  } = data;

  // Izračunaj PDV (25% za Hrvatsku)
  const taxRate = 0.25;
  const taxAmount = Math.round(amount * taxRate);
  const totalAmount = amount + taxAmount;

  // Generiraj broj fakture
  const invoiceNumber = await generateInvoiceNumber();

  // Postavi due date (14 dana od issue date)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const invoice = await prisma.invoice.create({
    data: {
      userId,
      invoiceNumber,
      type,
      status: 'DRAFT',
      amount,
      currency,
      taxAmount,
      totalAmount,
      subscriptionId,
      leadPurchaseId,
      stripePaymentIntentId,
      stripeInvoiceId,
      issueDate: new Date(),
      dueDate
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          companyName: true,
          taxId: true,
          city: true
        }
      },
      subscription: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true
            }
          }
        }
      },
      leadPurchase: {
        include: {
          job: {
            select: {
              title: true
            }
          }
        }
      }
    }
  });

  return invoice;
}

/**
 * Generira PDF fakturu s Uslugar brandingom
 */
export async function generateInvoicePDF(invoice) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // ============================================
      // HEADER - Uslugar branding
      // ============================================
      doc
        .fillColor('#4CAF50') // Uslugar zelena
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('USLUGAR', 50, 50, { align: 'left' })
        .fillColor('#333333')
        .fontSize(10)
        .font('Helvetica')
        .text('Platforma za povezivanje korisnika i pružatelja usluga', 50, 80);

      // ============================================
      // COMPANY INFO (Desno)
      // ============================================
      const companyInfo = [
        'ORIPHIEL d.o.o.',
        'OIB: 88070789896',
        'Slavenskoga ulica 5',
        '10000 Zagreb',
        'Direktor: Tomislav Kranjec',
        'Email: <TREBA UNIJETI KAD SE PREBACI NA PRODUKCIJU>',
        'Web: <TREBA UNIJETI KAD SE PREBACI NA PRODUKCIJU>'
      ];

      let yPos = 50;
      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('IZDAVATELJ:', 400, yPos, { align: 'left' });
      yPos += 15;
      doc
        .font('Helvetica')
        .fontSize(8);
      companyInfo.forEach(line => {
        doc.text(line, 400, yPos, { align: 'left' });
        yPos += 12;
      });

      // ============================================
      // INVOICE DETAILS
      // ============================================
      yPos = 180;
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .fillColor('#333333')
        .text('FAKTURA', 50, yPos)
        .fontSize(12)
        .font('Helvetica')
        .text(`Broj: ${invoice.invoiceNumber}`, 50, yPos + 30)
        .text(`Datum izdavanja: ${formatDate(invoice.issueDate)}`, 50, yPos + 45)
        .text(`Rok plaćanja: ${formatDate(invoice.dueDate)}`, 50, yPos + 60);

      // ============================================
      // CUSTOMER INFO
      // ============================================
      yPos += 100;
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('KUPAC:', 50, yPos)
        .font('Helvetica')
        .fontSize(9);

      const customerInfo = [
        invoice.user.fullName,
        invoice.user.email
      ];

      if (invoice.user.companyName) {
        customerInfo.push(`Tvrtka: ${invoice.user.companyName}`);
      }
      if (invoice.user.taxId) {
        customerInfo.push(`OIB: ${invoice.user.taxId}`);
      }
      if (invoice.user.city) {
        customerInfo.push(`Grad: ${invoice.user.city}`);
      }

      yPos += 15;
      customerInfo.forEach(line => {
        doc.text(line, 50, yPos);
        yPos += 12;
      });

      // ============================================
      // INVOICE ITEMS TABLE
      // ============================================
      yPos += 40;
      doc.fontSize(10).font('Helvetica-Bold');
      
      // Table header
      doc
        .fillColor('#4CAF50')
        .rect(50, yPos, 495, 25)
        .fill()
        .fillColor('#FFFFFF')
        .text('Opis usluge', 60, yPos + 7)
        .text('Količina', 280, yPos + 7)
        .text('Cijena', 380, yPos + 7)
        .text('Ukupno', 470, yPos + 7);

      // Table row
      yPos += 25;
      const description = getInvoiceDescription(invoice);
      doc
        .fillColor('#333333')
        .font('Helvetica')
        .rect(50, yPos, 495, 35)
        .stroke();
      
      // Opis usluge - podebljano i jasno
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(description.title, 60, yPos + 8, { width: 200 });
      
      if (description.details) {
        doc
          .font('Helvetica')
          .fontSize(8)
          .fillColor('#666666')
          .text(description.details, 60, yPos + 20, { width: 200 });
      }
      
      doc
        .fillColor('#333333')
        .font('Helvetica')
        .fontSize(10)
        .text('1', 280, yPos + 10)
        .text(formatCurrency(invoice.amount / 100), 380, yPos + 10)
        .text(formatCurrency(invoice.amount / 100), 470, yPos + 10);

      // ============================================
      // TOTALS
      // ============================================
      yPos += 50;
      doc.fontSize(10);
      
      const totalsX = 380;
      doc
        .text('Osnovica:', totalsX, yPos, { align: 'right', width: 100 })
        .text(formatCurrency(invoice.amount / 100), totalsX + 110, yPos, { align: 'right', width: 60 });

      yPos += 15;
      doc
        .text('PDV (25%):', totalsX, yPos, { align: 'right', width: 100 })
        .text(formatCurrency(invoice.taxAmount / 100), totalsX + 110, yPos, { align: 'right', width: 60 });

      yPos += 20;
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#4CAF50')
        .text('UKUPNO:', totalsX, yPos, { align: 'right', width: 100 })
        .text(formatCurrency(invoice.totalAmount / 100), totalsX + 110, yPos, { align: 'right', width: 60 });

      // ============================================
      // FISCAL INFO (ZKI/JIR) - HR Fiskalizacija
      // ============================================
      let fiscalY = 720;
      if (invoice.zkiCode || invoice.jirCode) {
        doc
          .fillColor('#333333')
          .fontSize(8)
          .font('Helvetica-Bold')
          .text('FISKALIZACIJA:', 50, fiscalY)
          .font('Helvetica');
        
        fiscalY += 12;
        if (invoice.zkiCode) {
          doc.text(`ZKI: ${invoice.zkiCode}`, 50, fiscalY);
          fiscalY += 10;
        }
        if (invoice.jirCode) {
          doc.text(`JIR: ${invoice.jirCode}`, 50, fiscalY);
          fiscalY += 10;
        }
        if (invoice.qrCodeUrl) {
          doc
            .fontSize(7)
            .fillColor('#0066CC')
            .text(`Verifikacija: ${invoice.qrCodeUrl}`, 50, fiscalY, { link: invoice.qrCodeUrl });
          fiscalY += 15;
        }
        
        fiscalY += 5;
      }

      // ============================================
      // FOOTER
      // ============================================
      const footerY = fiscalY + 10;
      doc
        .fillColor('#666666')
        .fontSize(8)
        .font('Helvetica')
        .text('Hvala vam na povjerenju!', 50, footerY, { align: 'center', width: 495 })
        .text('Ova faktura je automatski generirana.', 50, footerY + 15, { align: 'center', width: 495 });

      // Payment info
      if (invoice.stripePaymentIntentId || invoice.stripeInvoiceId) {
        doc
          .text(`Stripe Payment ID: ${invoice.stripePaymentIntentId || invoice.stripeInvoiceId}`, 
            50, footerY + 35, { align: 'center', width: 495 });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Helper funkcije
 */
function formatDate(date) {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('hr-HR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function formatCurrency(amount) {
  return `${amount.toFixed(2)} €`;
}

function getInvoiceDescription(invoice) {
  if (invoice.type === 'SUBSCRIPTION' && invoice.subscription) {
    const planNames = {
      'BASIC': 'Basic Plan',
      'PREMIUM': 'Premium Plan',
      'PRO': 'Pro Plan'
    };
    const planName = planNames[invoice.subscription.plan] || invoice.subscription.plan;
    return {
      title: `Pretplata na Uslugar platformu - ${planName}`,
      details: `Mjesečna pretplata za pristup Uslugar platformi za povezivanje korisnika i pružatelja usluga. Plan: ${planName}`
    };
  } else if (invoice.type === 'LEAD_PURCHASE' && invoice.leadPurchase) {
    const jobTitle = invoice.leadPurchase.job?.title || 'Lead';
    return {
      title: `Kupovina ekskluzivnog leada: ${jobTitle}`,
      details: `Kupovina ekskluzivnog leada za posao "${jobTitle}" na Uslugar platformi. Pružatelj dobiva ekskluzivni pristup kontakt podacima klijenta.`
    };
  }
  return {
    title: 'Usluga na Uslugar platformi',
    details: 'Usluga povezivanja korisnika i pružatelja usluga'
  };
}

/**
 * Sačuvaj PDF na disk ili S3 (trenutno vraća buffer)
 * TODO: Integrirati sa AWS S3 za produkciju
 */
export async function saveInvoicePDF(invoice, pdfBuffer) {
  // TODO: Upload to S3 ili lokalno storage
  // Za sada vraćamo buffer, a URL će biti generiran na zahtjev
  return pdfBuffer;
}

/**
 * Generiraj i pošalji fakturu emailom
 */
export async function generateAndSendInvoice(invoiceId) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          companyName: true,
          taxId: true,
          city: true
        }
      },
      subscription: true,
      leadPurchase: {
        include: {
          job: {
            select: {
              title: true
            }
          }
        }
      }
    }
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  // Generiraj PDF
  const pdfBuffer = await generateInvoicePDF(invoice);

  // Sačuvaj PDF (trenutno samo u memoriji, može se proširiti sa S3)
  await saveInvoicePDF(invoice, pdfBuffer);

  // Ažuriraj status fakture
  let updated = await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: 'SENT',
      pdfGeneratedAt: new Date(),
      emailSentAt: new Date(),
      emailSentTo: invoice.user.email
    }
  });

  // Pokušaj fiskalizirati fakturu (ako je potrebno)
  try {
    if (requiresFiscalization(updated)) {
      console.log(`[INVOICE] Attempting fiscalization for invoice ${updated.invoiceNumber}`);
      const fiscalResult = await fiscalizeInvoice(invoiceId);
      updated = fiscalResult.invoice;
      
      // Generiraj QR kod URL ako postoje ZKI i JIR
      if (fiscalResult.zkiCode && fiscalResult.jirCode) {
        const qrCodeURL = generateQRCodeURL(fiscalResult.zkiCode, fiscalResult.jirCode);
        if (qrCodeURL) {
          updated = await prisma.invoice.update({
            where: { id: invoiceId },
            data: { qrCodeUrl: qrCodeURL }
          });
        }
      }
    } else {
      console.log(`[INVOICE] Fiscalization not required for invoice ${updated.invoiceNumber}`);
    }
  } catch (fiscalError) {
    console.error('[INVOICE] Fiscalization error (non-critical):', fiscalError);
    // Ne baci grešku - faktura je kreirana i poslana, fiskalizacija može biti ponovljena
  }

  // Regeneriraj PDF s ZKI/JIR ako je fiskalizirana
  if (updated.zkiCode && updated.jirCode) {
    try {
      const updatedInvoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              companyName: true,
              taxId: true,
              city: true
            }
          },
          subscription: true,
          leadPurchase: {
            include: {
              job: {
                select: {
                  title: true
                }
              }
            }
          }
        }
      });
      pdfBuffer = await generateInvoicePDF(updatedInvoice);
    } catch (pdfError) {
      console.error('[INVOICE] Error regenerating PDF with fiscal data:', pdfError);
      // Koristi originalni PDF ako regeneriranje ne uspije
    }
  }

  // Pošalji email
  await sendInvoiceEmail(invoice.user.email, invoice.user.fullName, updated, pdfBuffer);

  return { invoice: updated, pdfBuffer };
}

/**
 * Označi fakturu kao plaćenu
 */
export async function markInvoiceAsPaid(invoiceId) {
  return await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: 'PAID',
      paidAt: new Date()
    }
  });
}


