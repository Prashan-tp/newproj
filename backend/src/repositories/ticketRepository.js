import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class TicketRepository {
  create({ title, description, priority }) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO tickets (id, title, description, status, priority)
      VALUES (?, ?, ?, 'OPEN', ?)
    `);
    
    stmt.run(id, title, description, priority);
    
    return this.findById(id);
  }

  findById(id) {
    const stmt = db.prepare(`
      SELECT 
        id,
        title,
        description,
        status,
        priority,
        created_at as createdAt,
        updated_at as updatedAt
      FROM tickets
      WHERE id = ?
    `);
    
    return stmt.get(id);
  }

  findAll({ q, status, priority, sort, page, limit }) {
    let query = `
      SELECT 
        id,
        title,
        description,
        status,
        priority,
        created_at as createdAt,
        updated_at as updatedAt
      FROM tickets
      WHERE 1=1
    `;
    
    const params = [];

    // Search filter
    if (q) {
      query += ` AND (title LIKE ? OR description LIKE ?)`;
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm);
    }

    // Status filter
    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    // Priority filter
    if (priority) {
      query += ` AND priority = ?`;
      params.push(priority);
    }

    // Sorting
    query += ` ORDER BY created_at ${sort === 'oldest' ? 'ASC' : 'DESC'}`;

    // Count total for pagination
    const countQuery = query.replace(/SELECT .+ FROM/, 'SELECT COUNT(*) as total FROM');
    const countStmt = db.prepare(countQuery);
    const { total } = countStmt.get(...params);

    // Pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const stmt = db.prepare(query);
    const tickets = stmt.all(...params);

    return {
      tickets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  update(id, updates) {
    const allowedFields = ['title', 'description', 'status', 'priority'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    
    const stmt = db.prepare(`
      UPDATE tickets 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(...values, id);
    
    return this.findById(id);
  }

  delete(id) {
    const stmt = db.prepare('DELETE FROM tickets WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export default new TicketRepository();
