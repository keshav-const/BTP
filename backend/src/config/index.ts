import dotenv from 'dotenv';
import { aiConfig, cloudinaryConfig, uploadConfig } from './ai';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key',
    expire: process.env.JWT_EXPIRE || '15m',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  ai: aiConfig,
  cloudinary: cloudinaryConfig,
  upload: uploadConfig,
};