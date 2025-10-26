// Support Ticket Service - USLUGAR EXCLUSIVE
import { prisma } from '../lib/prisma.js';

/**
 * Kreiraj support ticket
 * @param {String} userId - ID korisnika
 * @param {String} subject - Naslov
 * @param {String} message - Poruka
 * @param {String} priority - NORMAL, HIGH, URGENT
 * @param {String} category - BILLING, TECHNICAL, REFUND, OTHER
 * @returns {Object} - Kreirani ticket
 */
export async function createSupportTicket(userId, subject, message, priority = 'NORMAL', category = 'OTHER') {
  try {
    // Kreiraj ticket u bazi (za sada bez SupportTicket modela - extension)
    // TODO: Add SupportTicket model to Prisma schema
    
    const ticket = {
      id: 'tkt_' + Date.now(),
      userId,
      subject,
      message,
      priority,
      category,
      status: 'OPEN',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log(`📧 Support ticket kreiran: ${ticket.id}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   User: ${userId}`);
    console.log(`   Priority: ${priority}`);
    
    // TODO: Store in database when SupportTicket model is added
    // await prisma.supportTicket.create({ data: ticket });
    
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
    // TODO: Query from database when SupportTicket model is added
    // return await prisma.supportTicket.findMany({
    //   where: { userId },
    //   orderBy: { createdAt: 'desc' }
    // });
    
    return [];
  } catch (error) {
    console.error('❌ Error fetching support tickets:', error);
    return [];
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
    // TODO: Update in database when SupportTicket model is added
    console.log(`✅ Support ticket resolved: ${ticketId}`);
    
    return { success: true, ticketId, status: 'RESOLVED' };
  } catch (error) {
    throw new Error('Failed to resolve ticket');
  }
}

export default {
  createSupportTicket,
  getMySupportTickets,
  resolveTicket
};

