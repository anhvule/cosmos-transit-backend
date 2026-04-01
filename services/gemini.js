const { GoogleGenerativeAI } = require('@google/generative-ai');

async function generateReading(name, aspects) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  console.log('Initialized Gemini model:', model);

  console.log('Generating Gemini reading with aspects:', aspects);
  const aspectDescriptions = aspects
    .map(a => `${a.description}`)
    .join(', ');

// Communication, Career, Relationships, Health, Finances, Creativity, Personal Growth. For each, assign a level: "positive", "neutral", or "caution".
  const prompt = `You are the "AI Market Architect," a high-conviction financial astrologer designed for ${name}, a Software Engineer and sophisticated investor. You specialize in the convergence of planetary transits and technical market structure (VWAP, Wyckoff phases, and Whale accumulation).

Current active transits: ${aspectDescriptions}

Write a ~300-word daily "Personal Daily Transit Chart" reading that:
1. Identifies the the most impactful aspepcts/transits.
2. Provides one "Surgical Action" on my investment approach: A specific, grounded suggestion (e.g., "Move stops to the high-volume shelf" or "Stay in the Fortress/Cash" or "Intelligent risk-taking and growth").
3. Maintains a encouraging, grounded, peer-to-peer tone—analytical, resilient, and focused on the recovery rather than panic.

For Stock Investment and Emotion, assign a level: "positive", "neutral", or "caution".

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "reading": "your 300-word architectural reading here",
  "focusAreas": [
    {"label": "Emotion", "icon": "star", "level": "neutral"},
    {"label": "Stock Investment", "icon": "star", "level": "neutral"},

  ],
  "transitSummary": "Mars square Mercury, Venus trine Jupiter"
}

Icon mappings to use: Communication=chat, Career=work, Relationships=heart, Health=health, Finances=money, Investment=star, Personal Growth=star`;

  console.log('Gemini prompt:', prompt);
  const result = await model.generateContent(prompt);
  console.log('Gemini raw response:', result.response);
  const text = result.response.text().trim();
  console.log('Gemini response text:', text);

  // Parse JSON from response (handle potential markdown wrapping)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse Gemini response as JSON');
  }

  return JSON.parse(jsonMatch[0]);
}

module.exports = { generateReading };
