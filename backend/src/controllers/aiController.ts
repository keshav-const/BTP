import { Request, Response } from 'express';
import Joi from 'joi';
import { geminiService } from '@/services/geminiService';
import { ApiResponse } from '@/types';

const searchSchema = Joi.object({
  query: Joi.string().min(2).max(200).required(),
});

const descriptionSchema = Joi.object({
  productName: Joi.string().min(2).max(150).required(),
  productInfo: Joi.object().unknown(true).optional(),
});

const enhanceSchema = Joi.object({
  imageUrl: Joi.string().uri().required(),
  imageData: Joi.object().unknown(true).optional(),
});

export const aiController = {
  async searchIntent(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { error } = searchSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation Error',
          error: error.details.map((detail) => detail.message).join(', '),
        });
        return;
      }

      const { query } = req.body;
      const result = await geminiService.parseSearchIntent(query);

      res.json({
        success: true,
        message: 'Search intent parsed successfully',
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to parse search intent',
        error: (error as Error).message,
      });
    }
  },

  async generateDescription(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { error } = descriptionSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation Error',
          error: error.details.map((detail) => detail.message).join(', '),
        });
        return;
      }

      const { productName, productInfo } = req.body;
      const result = await geminiService.generateDescription(productName, productInfo);

      res.json({
        success: true,
        message: 'Description generated successfully',
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate description',
        error: (error as Error).message,
      });
    }
  },

  async enhanceImage(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { error } = enhanceSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation Error',
          error: error.details.map((detail) => detail.message).join(', '),
        });
        return;
      }

      const { imageUrl, imageData } = req.body;
      const result = await geminiService.enhanceImage(imageUrl, imageData);

      res.json({
        success: true,
        message: 'Image enhancement analysis completed',
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze image enhancement',
        error: (error as Error).message,
      });
    }
  },
};
