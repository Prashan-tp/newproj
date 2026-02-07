import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import ticketRoutes from './routes/tickets.js';
import commentRoutes from './routes/comments.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/tickets', ticketRoutes);
app.use('/api/tickets/:id/comments', commentRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Mini Support Desk API',
    version: '1.0.0',
    endpoints: {
      tickets: {
        'GET /api/tickets': 'List all tickets (supports query params: q, status, priority, sort, page, limit)',
        'POST /api/tickets': 'Create a new ticket',
        'GET /api/tickets/:id': 'Get a specific ticket',
        'PATCH /api/tickets/:id': 'Update a ticket',
        'DELETE /api/tickets/:id': 'Delete a ticket'
      },
      comments: {
        'GET /api/tickets/:id/comments': 'List all comments for a ticket (supports page, limit)',
        'POST /api/tickets/:id/comments': 'Create a comment for a ticket'
      }
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API documentation: http://localhost:${PORT}/api`);
});

export default app;
