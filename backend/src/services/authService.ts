import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { config } from '@/config';
import { IJwtPayload } from '@/types';

export const generateAccessToken = (payload: IJwtPayload): string => {
  const expiresIn = config.jwt.expire as StringValue | number;
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, config.jwt.secret, options);
};

export const generateRefreshToken = (payload: IJwtPayload): string => {
  const expiresIn = config.jwt.refreshExpire as StringValue | number;
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, config.jwt.refreshSecret, options);
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