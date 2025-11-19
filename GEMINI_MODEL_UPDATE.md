# Gemini Model Update - Fix for 404 Error

## Issue
The chatbot was attempting to use `gemini-1.5-flash` which is not available or not supported for the current API setup, resulting in a 404 error:
```
models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent
```

## Solution
Changed the default Gemini model from `gemini-1.5-flash` to `gemini-pro` throughout the codebase.

### Rationale
- `gemini-pro` is the most widely available and stable model across all API tiers
- It is fully supported with the `generateContent` API
- It works well for the chatbot's use case (product recommendations, customer support, shopping assistant)
- The model can be overridden via environment variable if needed

## Files Changed

1. **backend/src/config/ai.ts**
   - Changed default model from `gemini-1.5-flash` to `gemini-pro`
   - This automatically applies to all services using the AI config

2. **backend/.env.example**
   - Updated `GEMINI_MODEL` default to `gemini-pro`

3. **backend/README.md** (3 locations)
   - Updated environment variables table
   - Updated Google Gemini setup instructions
   - Updated rate limits documentation

4. **README.md** (2 locations)
   - Updated prerequisites table
   - Updated backend `.env` example

## Services Affected
All services that use the Gemini AI are now using the updated configuration:

1. **chatbotService.ts** - Customer support chatbot
2. **geminiService.ts** - AI features:
   - Search intent parsing
   - Product description generation
   - Product highlight extraction
   - Image enhancement analysis

## Configuration
The model can be configured via environment variable:
```bash
GEMINI_MODEL=gemini-pro  # Default, most compatible
# OR
GEMINI_MODEL=gemini-1.5-pro  # If available for your API key
```

## Testing Recommendations
1. Test chatbot functionality:
   - Send messages to `/api/chatbot/message`
   - Verify responses are generated successfully
   - Check product recommendations work correctly

2. Test AI features:
   - `/api/ai/search` - Natural language search
   - `/api/ai/generate-description` - Product descriptions
   - `/api/ai/enhance-image` - Image analysis

3. Verify no 404 errors in logs when calling Gemini API

## Compatibility Notes
- `gemini-pro` is compatible with all API tiers and versions
- If you have access to newer models, you can override via environment variable
- All existing functionality should work without code changes
- The chatbot uses the same system prompt and context as before

## Rollback
If needed, you can revert to `gemini-1.5-flash` by setting:
```bash
GEMINI_MODEL=gemini-1.5-flash
```
However, this will only work if your API key has access to that model.
