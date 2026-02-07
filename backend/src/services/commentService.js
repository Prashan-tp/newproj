import commentRepository from '../repositories/commentRepository.js';
import ticketRepository from '../repositories/ticketRepository.js';
import { AppError } from '../middleware/errorHandler.js';

export class CommentService {
  async createComment(ticketId, data) {
    // Verify ticket exists
    const ticket = ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    try {
      return commentRepository.create(ticketId, data);
    } catch (error) {
      throw new AppError('Failed to create comment', 500);
    }
  }

  async getCommentsByTicketId(ticketId, pagination) {
    // Verify ticket exists
    const ticket = ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    try {
      return commentRepository.findByTicketId(ticketId, pagination);
    } catch (error) {
      throw new AppError('Failed to retrieve comments', 500);
    }
  }
}

export default new CommentService();
