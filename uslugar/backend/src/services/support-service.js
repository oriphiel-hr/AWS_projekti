// Support Ticket Service - USLUGAR EXCLUSIVE
import { prisma } from '../lib/prisma.js';

/**
 * Kreiraj support ticket
 * @param {String} userId - ID korisnika
 * @param {String} subject - Naslov
 * @param {String} message - Poruka
 * @param {String} priority - NORMAL, HIGH, URGENT (premium/PRO dobiva HIGH/URGENT)
 * @param {String} category - BILLING, TECHNICAL, REFUND, OTHER
 * @returns {Object} - Kreirani ticket
 */
export async function createSupportTicket(userId, subject, message, priority = 'NORMAL', category = 'OTHER') {
  try {
    // Provjeri plan korisnika za prioritet
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    });
    
    // Automatski povišaj prioritet za PREMIUM/PRO
    if (subscription?.plan === 'PRO') {
      priority = 'URGENT'; // VIP podrška
    } else if (subscription?.plan === 'PREMIUM') {
      priority = 'HIGH'; // Prioritetna podrška
    }
    
    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject,
        message,
        priority,
        category,
        status: 'OPEN'
      }
    });
    
    console.log(`📧 Support ticket kreiran: ${ticket.id}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   User: ${userId}`);
    console.log(`   Priority: ${priority} (plan: ${subscription?.plan || 'NONE'})`);
    
    // TODO: Send email to support team
    // await sendTicketToSupportTeam(ticket);
    
    return ticket;
    
  } catch (error) {
    console.error('❌ Error creating support ticket:', error);
    throw new Error('Failed to create support ticket');
  }
}

/**
 * Dohvati support ticket-e za korisnika
 * @param {String} userId - ID korisnika
 * @returns {Array} - Lista ticket-a
 */
export async function getMySupportTickets(userId) {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    return tickets;
  } catch (error) {
    console.error('❌ Error fetching support tickets:', error);
    return [];
  }
}

/**
 * Dohvati support ticket
 * @param {String} ticketId - ID ticket-a
 * @returns {Object} - Ticket
 */
export async function getSupportTicket(ticketId, userId) {
  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId }
    });
    
    if (!ticket || ticket.userId !== userId) {
      throw new Error('Ticket not found');
    }
    
    return ticket;
  } catch (error) {
    console.error('❌ Error fetching support ticket:', error);
    throw new Error('Failed to get support ticket');
  }
}

/**
 * Označi ticket kao resolved
 * @param {String} ticketId - ID ticket-a
 * @param {String} userId - ID korisnika (verification)
 * @returns {Object} - Ažurirani ticket
 */
export async function resolveTicket(ticketId, userId) {
  try {
    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date()
      }
    });
    
    console.log(`✅ Support ticket resolved: ${ticketId}`);
    
    return ticket;
  } catch (error) {
    throw new Error('Failed to resolve ticket');
  }
}

/**
 * Dodaj napomenu na ticket (samo za admin)
 * @param {String} ticketId - ID ticket-a
 * @param {String} notes - Napomena
 * @returns {Object} - Ažurirani ticket
 */
export async function addTicketNote(ticketId, notes) {
  try {
    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        notes: notes
      }
    });
    
    return ticket;
  } catch (error) {
    throw new Error('Failed to add note');
  }
}

export default {
  createSupportTicket,
  getMySupportTickets,
  getSupportTicket,
  resolveTicket,
  addTicketNote
};

