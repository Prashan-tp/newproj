import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class CommentRepository {
  create(ticketId, { authorName, message }) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO comments (id, ticket_id, author_name, message)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(id, ticketId, authorName, message);
    
    return this.findById(id);
  }

  findById(id) {
    const stmt = db.prepare(`
      SELECT 
        id,
        ticket_id as ticketId,
        author_name as authorName,
        message,
        created_at as createdAt
      FROM comments
      WHERE id = ?
    `);
    
    return stmt.get(id);
  }

  findByTicketId(ticketId, { page, limit }) {
    const offset = (page - 1) * limit;

    // Get total count
    const countStmt = db.prepare(`
      SELECT COUNT(*) as total
      FROM comments
      WHERE ticket_id = ?
    `);
    const { total } = countStmt.get(ticketId);

    // Get paginated comments
    const stmt = db.prepare(`
      SELECT 
        id,
        ticket_id as ticketId,
        author_name as authorName,
        message,
        created_at as createdAt
      FROM comments
      WHERE ticket_id = ?
      ORDER BY created_at ASC
      LIMIT ? OFFSET ?
    `);
    
    const comments = stmt.all(ticketId, limit, offset);

    return {
      comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

export default new CommentRepository();
