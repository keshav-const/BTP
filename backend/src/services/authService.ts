import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { IJwtPayload } from '@/types';

export const generateAccessToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expire });
};

export const generateRefreshToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpire });
};

export const verifyAccessToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.jwt.secret) as IJwtPayload;
};

export const verifyRefreshToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as IJwtPayload;
};

export const generateTokens = (payload: IJwtPayload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  return { accessToken, refreshToken };
};