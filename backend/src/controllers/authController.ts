import { Request, Response } from 'express';
import { User } from '@/models';
import { generateTokens } from '@/services/authService';
import { IAuthRequest, ApiResponse } from '@/types';

export const authController = {
  async signup(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { firstName, lastName, email, password, role = 'user' } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User with this email already exists',
        });
        return;
      }

      // Create new user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      // Generate tokens
      const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
          ...tokens,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating user',
        error: (error as Error).message,
      });
    }
  },

  async login(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user with password
      const user = await User.findOne({ email }).select('+password');
      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
        return;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
        return;
      }

      // Generate tokens
      const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
          ...tokens,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error during login',
        error: (error as Error).message,
      });
    }
  },

  async refreshToken(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
        return;
      }

      // Verify refresh token
      const { verifyRefreshToken, generateAccessToken } = await import('@/services/authService');
      const decoded = verifyRefreshToken(refreshToken);

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
        });
        return;
      }

      // Generate new access token
      const accessToken = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: { accessToken },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        error: (error as Error).message,
      });
    }
  },

  async getProfile(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const user = req.user;

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving profile',
        error: (error as Error).message,
      });
    }
  },

  async getCurrentUser(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const user = req.user;

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  },
};