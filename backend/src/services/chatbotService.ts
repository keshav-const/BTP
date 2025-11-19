import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '@/config';
import { Product } from '@/models/Product';

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

const FAQ_CONTEXT = `
You are a helpful shopping assistant for a luxury e-commerce store. 
You help customers with:
1. Finding products (recommendations based on preferences, budget, category)
2. Answering customer support questions
3. Adding items to cart or comparing products

FAQ:
- Return Policy: 30 days no questions asked, items must be unused and in original packaging
- Shipping: Free shipping on orders over ₹5,000, standard delivery in 5-7 days
- Payment Methods: Credit card, debit card, UPI, net banking
- Refunds: Processed within 5-7 business days to original payment method
- Track Order: Use the tracking link in your order confirmation email
- Customer Support: Available 24/7 via chat or email at support@premiumstore.com

Always be friendly, helpful, and professional. If user asks for product recommendations, search our database.
When suggesting products, be specific about their features and benefits.
`;

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

interface ChatIntent {
  type: 'product_search' | 'customer_support' | 'add_to_cart' | 'compare' | 'general';
  query?: string;
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
  };
  productName?: string;
  productNames?: string[];
}

export async function chatWithBot(
  userMessage: string,
  chatHistory: ChatMessage[] = []
): Promise<{ 
  response: string; 
  suggestedProducts?: any[]; 
  actions?: any[] 
}> {
  try {
    // Detect intent and extract entities
    const intent = await detectIntent(userMessage);
    let suggestedProducts: any[] = [];
    let actions: any[] = [];

    // If product search/recommendation, query database
    if (intent.type === 'product_search') {
      suggestedProducts = await searchProducts(userMessage, intent.filters);
    }

    // If add to cart action
    if (intent.type === 'add_to_cart' && intent.productName) {
      const product = await Product.findOne({ 
        name: new RegExp(intent.productName, 'i'),
        isActive: true 
      });
      if (product && product._id) {
        actions.push({ 
          type: 'addToCart', 
          productId: String(product._id), 
          qty: 1 
        });
      }
    }

    // If compare products
    if (intent.type === 'compare' && intent.productNames && intent.productNames.length > 0) {
      const products = await Product.find({
        name: { $in: intent.productNames.map(name => new RegExp(name, 'i')) },
        isActive: true
      }).limit(5).lean();
      suggestedProducts = products;
    }

    // Build chat context
    const conversationHistory = chatHistory
      .slice(-5) // Only use last 5 messages for context
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const productContext = suggestedProducts.length > 0
      ? `\n\nFound products:\n${suggestedProducts.map(p => `- ${p.name} (₹${p.price.toLocaleString('en-IN')}) - ${p.category}`).join('\n')}`
      : '';

    // Call Gemini API
    const ai = initializeGemini();
    const model = ai.getGenerativeModel({ 
      model: config.ai.gemini.model,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    const prompt = `${FAQ_CONTEXT}

${conversationHistory ? `Conversation history:\n${conversationHistory}\n` : ''}
${productContext}

User: ${userMessage}
Assistant: Please provide a helpful and natural response based on the context above. Keep it concise and conversational.`;

    const result = await model.generateContent(prompt);
    const botResponse = result.response.text();

    return {
      response: botResponse,
      suggestedProducts: suggestedProducts.length > 0 ? suggestedProducts : undefined,
      actions: actions.length > 0 ? actions : undefined,
    };
  } catch (error: any) {
    console.error('Chatbot error:', error);
    throw new Error('Failed to process message');
  }
}

async function detectIntent(message: string): Promise<ChatIntent> {
  const lower = message.toLowerCase();

  // Product search patterns
  if (
    lower.includes('show') ||
    lower.includes('find') ||
    lower.includes('recommend') ||
    lower.includes('looking for') ||
    lower.includes('want') ||
    lower.includes('search') ||
    lower.includes('need')
  ) {
    // Extract price range
    const priceMatch = lower.match(/under ₹?(\d+)/i) || lower.match(/below ₹?(\d+)/i);
    const maxPrice = priceMatch ? parseInt(priceMatch[1]) : undefined;

    const filters: ChatIntent['filters'] = {};
    if (maxPrice) {
      filters.maxPrice = maxPrice;
    }

    return { type: 'product_search', query: message, filters };
  }

  // Add to cart patterns
  if (lower.includes('add to cart') || lower.includes('add this') || lower.includes('add the')) {
    return { type: 'add_to_cart', productName: extractProductName(message) };
  }

  // Compare products
  if (lower.includes('compare')) {
    return { type: 'compare', productNames: extractProductNames(message) };
  }

  // Customer support patterns
  if (
    lower.includes('policy') ||
    lower.includes('shipping') ||
    lower.includes('return') ||
    lower.includes('refund') ||
    lower.includes('track') ||
    lower.includes('support') ||
    lower.includes('help') ||
    lower.includes('how do i') ||
    lower.includes('payment')
  ) {
    return { type: 'customer_support' };
  }

  return { type: 'general' };
}

async function searchProducts(query: string, filters: ChatIntent['filters'] = {}): Promise<any[]> {
  try {
    const searchTerms = query
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(term => term.length > 2 && !['show', 'find', 'recommend', 'looking', 'want', 'need', 'under', 'below', 'the', 'for'].includes(term));

    const searchQuery: any = {
      isActive: true,
    };

    if (searchTerms.length > 0) {
      const searchRegex = new RegExp(searchTerms.join('|'), 'i');
      searchQuery.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { brand: searchRegex },
        { tags: { $in: searchTerms.map(term => new RegExp(term, 'i')) } },
      ];
    }

    if (filters.maxPrice) {
      searchQuery.price = { $lte: filters.maxPrice };
    }

    if (filters.minPrice) {
      searchQuery.price = { ...searchQuery.price, $gte: filters.minPrice };
    }

    if (filters.category) {
      searchQuery.category = new RegExp(filters.category, 'i');
    }

    if (filters.brand) {
      searchQuery.brand = new RegExp(filters.brand, 'i');
    }

    const products = await Product.find(searchQuery)
      .limit(5)
      .sort({ createdAt: -1 })
      .lean();

    return products;
  } catch (error) {
    console.error('Product search error:', error);
    return [];
  }
}

function extractProductName(message: string): string {
  const lower = message.toLowerCase();
  
  // Try to extract product name after "add" or "add to cart"
  const addMatch = message.match(/add (?:to cart )?(?:the )?([^.!?]+)/i);
  if (addMatch) {
    return addMatch[1].trim();
  }
  
  // Fallback: take last few words
  const words = message.split(' ');
  return words.slice(-3).join(' ');
}

function extractProductNames(message: string): string[] {
  // Simple extraction: split by "and" or "vs"
  const parts = message.split(/\s+(?:and|vs|versus)\s+/i);
  return parts
    .map(part => part.replace(/compare|the|a|an/gi, '').trim())
    .filter(part => part.length > 0);
}
