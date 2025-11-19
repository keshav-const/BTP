import { Router, Request, Response } from 'express';
import { optionalAuth } from '@/middlewares/auth';
import { chatWithBot } from '@/services/chatbotService';
import { IAuthRequest } from '@/types';

const router = Router();

router.post('/chatbot/message', optionalAuth, async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { message, chatHistory } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ 
        success: false, 
        message: 'Message is required and must be a non-empty string' 
      });
      return;
    }

    if (message.length > 500) {
      res.status(400).json({ 
        success: false, 
        message: 'Message is too long (max 500 characters)' 
      });
      return;
    }

    const result = await chatWithBot(message, chatHistory);

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Chatbot route error:', error);
    res.status(500).json({ 
      success: false, 
      message: error?.message || 'Chatbot error' 
    });
  }
});

export default router;
