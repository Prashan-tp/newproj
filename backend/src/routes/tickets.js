import express from 'express';
import ticketService from '../services/ticketService.js';
import { validate, validateQuery, validateParams } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  createTicketSchema,
  updateTicketSchema,
  ticketQuerySchema,
  uuidSchema
} from '../validators/schemas.js';
import { z } from 'zod';

const router = express.Router();

// GET /tickets - List all tickets with filters
router.get(
  '/',
  validateQuery(ticketQuerySchema),
  asyncHandler(async (req, res) => {
    const result = await ticketService.getTickets(req.validatedQuery);
    
    res.json({
      success: true,
      data: result.tickets,
      pagination: result.pagination
    });
  })
);

// POST /tickets - Create a new ticket
router.post(
  '/',
  validate(createTicketSchema),
  asyncHandler(async (req, res) => {
    const ticket = await ticketService.createTicket(req.validatedBody);
    
    res.status(201).json({
      success: true,
      data: ticket
    });
  })
);

// GET /tickets/:id - Get a single ticket
router.get(
  '/:id',
  validateParams(z.object({ id: uuidSchema })),
  asyncHandler(async (req, res) => {
    const ticket = await ticketService.getTicketById(req.params.id);
    
    res.json({
      success: true,
      data: ticket
    });
  })
);

// PATCH /tickets/:id - Update a ticket
router.patch(
  '/:id',
  validateParams(z.object({ id: uuidSchema })),
  validate(updateTicketSchema),
  asyncHandler(async (req, res) => {
    const ticket = await ticketService.updateTicket(req.params.id, req.validatedBody);
    
    res.json({
      success: true,
      data: ticket
    });
  })
);

// DELETE /tickets/:id - Delete a ticket
router.delete(
  '/:id',
  validateParams(z.object({ id: uuidSchema })),
  asyncHandler(async (req, res) => {
    await ticketService.deleteTicket(req.params.id);
    
    res.json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  })
);

export default router;
