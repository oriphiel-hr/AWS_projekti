/**
 * Invoice Routes - API za fakture
 */

import { Router } from 'express';
import { auth } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';
import {
  createInvoice,
  generateInvoicePDF,
  generateAndSendInvoice,
  markInvoiceAsPaid
} from '../services/invoice-service.js';

const r = Router();

/**
 * GET /api/invoices
 * Dohvati sve fakture korisnika
 */
r.get('/', auth(true, ['PROVIDER', 'ADMIN', 'USER']), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, type } = req.query;

    const where = { userId };
    if (status) where.status = status;
    if (type) where.type = type;

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        subscription: {
          select: {
            plan: true
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
      },
      orderBy: {
        issueDate: 'desc'
      }
    });

    res.json({
      success: true,
      invoices,
      total: invoices.length
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/invoices/:invoiceId
 * Dohvati pojedinačnu fakturu
 */
r.get('/:invoiceId', auth(true, ['PROVIDER', 'ADMIN', 'USER']), async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const userId = req.user.id;

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
        subscription: {
          select: {
            plan: true
          }
        },
        leadPurchase: {
          include: {
            job: {
              select: {
                title: true,
                city: true
              }
            }
          }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Faktura nije pronađena' });
    }

    // Provjeri autorizaciju (korisnik može vidjeti samo svoje fakture, admin može sve)
    if (invoice.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Nemate pristup ovoj fakturi' });
    }

    res.json({
      success: true,
      invoice
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/invoices/:invoiceId/pdf
 * Preuzmi PDF fakture
 */
r.get('/:invoiceId/pdf', auth(true, ['PROVIDER', 'ADMIN', 'USER']), async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const userId = req.user.id;

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
        subscription: {
          select: {
            plan: true
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

    if (!invoice) {
      return res.status(404).json({ error: 'Faktura nije pronađena' });
    }

    // Provjeri autorizaciju
    if (invoice.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Nemate pristup ovoj fakturi' });
    }

    // Generiraj PDF
    const pdfBuffer = await generateInvoicePDF(invoice);

    // Postavi headers za PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="faktura-${invoice.invoiceNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Ažuriraj fakturu da je PDF generiran
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        pdfGeneratedAt: new Date()
      }
    });

    res.send(pdfBuffer);
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/invoices/:invoiceId/send
 * Pošalji fakturu emailom
 */
r.post('/:invoiceId/send', auth(true, ['PROVIDER', 'ADMIN', 'USER']), async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const userId = req.user.id;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Faktura nije pronađena' });
    }

    // Provjeri autorizaciju
    if (invoice.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Nemate pristup ovoj fakturi' });
    }

    // Generiraj i pošalji
    await generateAndSendInvoice(invoiceId);

    res.json({
      success: true,
      message: 'Faktura je uspješno poslana na email'
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/invoices/:invoiceId/mark-paid
 * Označi fakturu kao plaćenu (samo admin)
 */
r.post('/:invoiceId/mark-paid', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await markInvoiceAsPaid(invoiceId);

    res.json({
      success: true,
      invoice,
      message: 'Faktura je označena kao plaćena'
    });
  } catch (e) {
    next(e);
  }
});

export default r;

