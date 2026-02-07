import { z } from 'zod';

// Ticket schemas
export const createTicketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(80, 'Title must be at most 80 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be at most 2000 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, or HIGH' })
  })
});

export const updateTicketSchema = z.object({
  title: z.string().min(5).max(80).optional(),
  description: z.string().min(20).max(2000).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

export const ticketQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  sort: z.enum(['newest', 'oldest']).optional().default('newest'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10)
});

// Comment schemas
export const createCommentSchema = z.object({
  authorName: z.string().min(1, 'Author name is required').max(100, 'Author name must be at most 100 characters'),
  message: z.string().min(1, 'Message is required').max(500, 'Message must be at most 500 characters')
});

export const commentQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(20)
});

// UUID validation
export const uuidSchema = z.string().uuid('Invalid ticket ID format');
