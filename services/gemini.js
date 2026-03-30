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
    .map(a => `${a.transitPlanet} ${a.aspect} natal ${a.natalPlanet}${a.exact ? ' (exact)' : ''}`)
    .join(', ');

  const prompt = `You are a warm, insightful astrologer writing a personalised daily transit reading for ${name}.

Current active transits: ${aspectDescriptions}

Write a ~300-word daily reading that:
1. Mentions the most impactful transit(s) by name in accessible language
2. Explains how this energy affects the person's day practically
3. Gives one specific, actionable suggestion
4. Uses a warm, encouraging tone — not doom-and-gloom even for challenging aspects

Also identify exactly 3 focus areas from this list: Communication, Career, Relationships, Health, Finances, Creativity, Personal Growth. For each, assign a level: "positive", "neutral", or "caution".

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "reading": "your 300-word reading here",
  "focusAreas": [
    {"label": "Communication", "icon": "chat", "level": "positive"},
    {"label": "Career", "icon": "work", "level": "neutral"},
    {"label": "Relationships", "icon": "heart", "level": "caution"}
  ],
  "transitSummary": "Mars square Mercury, Venus trine Jupiter"
}

Use these icon mappings: Communication=chat, Career=work, Relationships=heart, Health=health, Finances=money, Creativity=star, Personal Growth=star`;

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
