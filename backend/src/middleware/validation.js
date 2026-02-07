import { ZodError } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.body);
    req.validatedBody = validated;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

export const validateQuery = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.query);
    req.validatedQuery = validated;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

export const validateParams = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.params);
    req.validatedParams = validated;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid parameters',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};
