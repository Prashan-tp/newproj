import ticketRepository from '../repositories/ticketRepository.js';
import { AppError } from '../middleware/errorHandler.js';

export class TicketService {
  async createTicket(data) {
    try {
      return ticketRepository.create(data);
    } catch (error) {
      throw new AppError('Failed to create ticket', 500);
    }
  }

  async getTicketById(id) {
    const ticket = ticketRepository.findById(id);
    
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }
    
    return ticket;
  }

  async getTickets(filters) {
    try {
      return ticketRepository.findAll(filters);
    } catch (error) {
      throw new AppError('Failed to retrieve tickets', 500);
    }
  }

  async updateTicket(id, updates) {
    const ticket = ticketRepository.findById(id);
    
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    try {
      return ticketRepository.update(id, updates);
    } catch (error) {
      throw new AppError('Failed to update ticket', 500);
    }
  }

  async deleteTicket(id) {
    const ticket = ticketRepository.findById(id);
    
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    try {
      const deleted = ticketRepository.delete(id);
      return { success: deleted };
    } catch (error) {
      throw new AppError('Failed to delete ticket', 500);
    }
  }
}

export default new TicketService();
