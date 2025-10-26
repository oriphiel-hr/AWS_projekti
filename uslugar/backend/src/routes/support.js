// Support Tickets - VIP podrška 24/7
import { Router } from 'express';
import { auth } from '../lib/auth.js';
import { requirePlan } from '../lib/subscription-auth.js';
import { 
  createSupportTicket, 
  getMySupportTickets, 
  getSupportTicket, 
  resolveTicket,
  addTicketNote 
} from '../services/support-service.js';

const r = Router();

// Kreiraj support ticket
r.post('/tickets', auth(true, ['PROVIDER', 'USER']), async (req, res, next) => {
  try {
    const { subject, message, category } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message required' });
    }
    
    const ticket = await createSupportTicket(
      req.user.id,
      subject,
      message,
      'NORMAL', // Automatski povišava na HIGH/URGENT za PREMIUM/PRO
      category || 'OTHER'
    );
    
    res.status(201).json({
      success: true,
      ticket,
      message: 'Support ticket kreiran. Odgovorit ćemo u roku od 24 sata.'
    });
  } catch (e) {
    next(e);
  }
});

// Dohvati moje ticket-e
r.get('/tickets', auth(true, ['PROVIDER', 'USER']), async (req, res, next) => {
  try {
    const tickets = await getMySupportTickets(req.user.id);
    
    res.json({
      total: tickets.length,
      tickets
    });
  } catch (e) {
    next(e);
  }
});

// Dohvati specific ticket
r.get('/tickets/:id', auth(true, ['PROVIDER', 'USER']), async (req, res, next) => {
  try {
    const ticket = await getSupportTicket(req.params.id, req.user.id);
    
    res.json(ticket);
  } catch (e) {
    next(e);
  }
});

// Označi kao resolved
r.post('/tickets/:id/resolve', auth(true, ['PROVIDER', 'USER']), async (req, res, next) => {
  try {
    const ticket = await resolveTicket(req.params.id, req.user.id);
    
    res.json({
      success: true,
      ticket,
      message: 'Ticket označen kao resolved'
    });
  } catch (e) {
    next(e);
  }
});

// Admin: Dodaj napomenu
r.post('/tickets/:id/note', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const { notes } = req.body;
    
    const ticket = await addTicketNote(req.params.id, notes);
    
    res.json({
      success: true,
      ticket
    });
  } catch (e) {
    next(e);
  }
});

export default r;

