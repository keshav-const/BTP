import { Request, Response } from 'express';
import { ApiResponse } from '@/types';

export const healthCheck = (req: Request, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    message: 'Server is running',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    },
  });
};