import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@/types';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values((error as any).errors).map((err: any) => err.message);
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: errors.join(', '),
    });
    return;
  }

  // Mongoose duplicate key error
  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    const field = Object.keys((error as any).keyValue)[0];
    res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
    return;
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
    return;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired',
    });
    return;
  }

  // Default error
  const statusCode = (error as any).statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: error.stack }),
  });
};

export const notFound = (req: Request, res: Response<ApiResponse>) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};