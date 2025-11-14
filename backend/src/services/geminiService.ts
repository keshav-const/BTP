import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '@/config';

let genAI: GoogleGenerativeAI | null = null;

const initializeGemini = (): GoogleGenerativeAI => {
  if (!genAI) {
    if (!config.ai.gemini.apiKey) {
      throw new Error('Gemini API key is not configured');
    }
    genAI = new GoogleGenerativeAI(config.ai.gemini.apiKey);
  }
  return genAI;
};

interface SearchIntentResult {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  searchTerms?: string;
  intent: 'specific_product' | 'category_browse' | 'brand_specific' | 'price_range' | 'general';
}

interface DescriptionResult {
  shortDescription: string;
  longDescription: string;
  seoKeywords: string[];
  highlights: string[];
}

interface HighlightsResult {
  highlights: string[];
  tags: string[];
  category?: string;
  targetAudience?: string;
}

export const geminiService = {
  async parseSearchIntent(query: string): Promise<SearchIntentResult> {
    try {
      const ai = initializeGemini();
      const model = ai.getGenerativeModel({
        model: config.ai.gemini.model,
        generationConfig: {
          temperature: config.ai.gemini.temperature,
          maxOutputTokens: config.ai.gemini.maxOutputTokens,
        },
      });

      const prompt = `${config.ai.prompts.searchIntent.systemPrompt}\n\n${config.ai.prompts.searchIntent.userTemplate(query)}`;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          searchTerms: query,
          intent: 'general',
        };
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (error) {
      console.error('Gemini search intent parsing error:', error);
      return {
        searchTerms: query,
        intent: 'general',
      };
    }
  },

  async generateDescription(productName: string, productInfo?: Record<string, any>): Promise<DescriptionResult> {
    try {
      const ai = initializeGemini();
      const model = ai.getGenerativeModel({
        model: config.ai.gemini.model,
        generationConfig: {
          temperature: config.ai.gemini.temperature,
          maxOutputTokens: config.ai.gemini.maxOutputTokens,
        },
      });

      const prompt = `${config.ai.prompts.generateDescription.systemPrompt}\n\n${config.ai.prompts.generateDescription.userTemplate(productName, productInfo)}`;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (error) {
      console.error('Gemini description generation error:', error);
      throw new Error(`Failed to generate description: ${(error as Error).message}`);
    }
  },

  async extractHighlights(productData: Record<string, any>): Promise<HighlightsResult> {
    try {
      const ai = initializeGemini();
      const model = ai.getGenerativeModel({
        model: config.ai.gemini.model,
        generationConfig: {
          temperature: config.ai.gemini.temperature,
          maxOutputTokens: config.ai.gemini.maxOutputTokens,
        },
      });

      const prompt = `${config.ai.prompts.extractHighlights.systemPrompt}\n\n${config.ai.prompts.extractHighlights.userTemplate(productData)}`;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (error) {
      console.error('Gemini highlight extraction error:', error);
      throw new Error(`Failed to extract highlights: ${(error as Error).message}`);
    }
  },

  async enhanceImage(imageUrl: string, imageData?: Record<string, any>): Promise<{ metadata: Record<string, any>; suggestions: string[] }> {
    try {
      const ai = initializeGemini();
      const model = ai.getGenerativeModel({
        model: config.ai.gemini.model,
        generationConfig: {
          temperature: config.ai.gemini.temperature,
          maxOutputTokens: 1024,
        },
      });

      const prompt = `Analyze this product image and provide enhancement suggestions and metadata.
Image URL: ${imageUrl}
${imageData ? `Additional context:\n${JSON.stringify(imageData, null, 2)}` : ''}

Return a JSON object with:
{
  "metadata": {
    "altText": "descriptive alt text for SEO",
    "title": "image title",
    "caption": "brief caption"
  },
  "suggestions": ["suggestion1", "suggestion2", ...]
}

Suggestions should include tips for better product photography, lighting, angles, etc.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          metadata: {
            altText: 'Product image',
            title: 'Product',
            caption: '',
          },
          suggestions: [],
        };
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (error) {
      console.error('Gemini image enhancement error:', error);
      return {
        metadata: {
          altText: 'Product image',
          title: 'Product',
          caption: '',
        },
        suggestions: ['Consider using better lighting', 'Show product from multiple angles'],
      };
    }
  },
};
