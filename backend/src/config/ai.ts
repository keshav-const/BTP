export const aiConfig = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '2048'),
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
  },
  prompts: {
    searchIntent: {
      systemPrompt: 'You are a search intent analyzer for an e-commerce platform. Parse user search queries and extract structured filters.',
      userTemplate: (query: string) => `
Analyze this search query and extract relevant filters for product search: "${query}"

Return a JSON object with these fields (all optional):
{
  "category": "string",
  "brand": "string",
  "minPrice": number,
  "maxPrice": number,
  "tags": ["string"],
  "searchTerms": "string",
  "intent": "specific_product|category_browse|brand_specific|price_range|general"
}

Only include fields that can be confidently extracted from the query.
If it's a simple search, just include searchTerms.
`,
    },
    generateDescription: {
      systemPrompt: 'You are an SEO expert and product copywriter. Generate compelling, SEO-optimized product descriptions.',
      userTemplate: (productName: string, productInfo?: Record<string, any>) => `
Generate an SEO-optimized product description for: "${productName}"

${productInfo ? `Product details:
${Object.entries(productInfo)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}
` : ''}

Return a JSON object with:
{
  "shortDescription": "2-3 sentences, max 160 characters",
  "longDescription": "3-4 paragraphs with features, benefits, and use cases",
  "seoKeywords": ["keyword1", "keyword2", ...],
  "highlights": ["feature1", "feature2", ...]
}
`,
    },
    extractHighlights: {
      systemPrompt: 'You are a product analyst. Extract key features and highlights from product information.',
      userTemplate: (productData: Record<string, any>) => `
Extract key product highlights from this information:

${Object.entries(productData)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

Return a JSON object with:
{
  "highlights": ["highlight1", "highlight2", ...],
  "tags": ["tag1", "tag2", ...],
  "category": "suggested_category",
  "targetAudience": "description"
}
`,
    },
  },
};

export const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  folder: process.env.CLOUDINARY_FOLDER || 'products',
};

export const uploadConfig = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  allowedMimeTypes: (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(','),
  maxFiles: parseInt(process.env.MAX_FILES || '5'),
};
