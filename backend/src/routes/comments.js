import express from 'express';
import commentService from '../services/commentService.js';
import { validate, validateQuery, validateParams } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  createCommentSchema,
  commentQuerySchema,
  uuidSchema
} from '../validators/schemas.js';
import { z } from 'zod';

const router = express.Router({ mergeParams: true });

// GET /tickets/:id/comments - Get all comments for a ticket
router.get(
  '/',
  validateParams(z.object({ id: uuidSchema })),
  validateQuery(commentQuerySchema),
  asyncHandler(async (req, res) => {
    const result = await commentService.getCommentsByTicketId(
      req.params.id,
      req.validatedQuery
    );
    
    res.json({
      success: true,
      data: result.comments,
      pagination: result.pagination
    });
  })
);

// POST /tickets/:id/comments - Create a comment for a ticket
router.post(
  '/',
  validateParams(z.object({ id: uuidSchema })),
  validate(createCommentSchema),
  asyncHandler(async (req, res) => {
    const comment = await commentService.createComment(
      req.params.id,
      req.validatedBody
    );
    
    res.status(201).json({
      success: true,
      data: comment
    });
  })
);

export default router;
