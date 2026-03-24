import Anthropic from '@anthropic-ai/sdk'

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment variables')
  }
  return new Anthropic({ apiKey })
}

const MODEL = 'claude-haiku-4-5-20251001'

export async function generateReservationMessage({
  restaurantNameJa,
  date,
  time,
  partySize,
  specialRequests,
  allergies,
  userName,
}: {
  restaurantNameJa: string
  date: string
  time: string
  partySize: number
  specialRequests?: string
  allergies?: string
  userName: string
}): Promise<{ message_ja: string; message_en: string }> {
  const client = getAnthropicClient()

  const prompt = `You are a Japanese restaurant reservation assistant. Generate a polite, formal Japanese reservation request email based on the following details. The message should follow Japanese business email conventions (丁寧語/敬語).

Restaurant: ${restaurantNameJa}
Date: ${date}
Time: ${time}
Number of guests: ${partySize}
Special requests: ${specialRequests || 'None'}
Dietary restrictions/Allergies: ${allergies || 'None'}
Guest name: ${userName}

Generate:
1. A Japanese reservation email (subject line + body)
2. An English translation of the same email

The Japanese message must be natural and appropriate — as if written by a Japanese person making a reservation. Use proper keigo (敬語). Include all provided details.

Format the response as JSON:
{
  "message_ja": "件名: ...\\n\\n本文...",
  "message_en": "Subject: ...\\n\\nBody..."
}`

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const text =
    response.content[0].type === 'text' ? response.content[0].text : ''

  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }
    return JSON.parse(jsonMatch[0])
  } catch {
    // Fallback if JSON parsing fails
    return {
      message_ja: text,
      message_en: 'Translation unavailable. Please see the Japanese message above.',
    }
  }
}

export async function generateRecommendations({
  restaurants,
  area,
  cuisine,
  budgetMax,
  preferences,
}: {
  restaurants: { id: string; name_en: string; name_ja: string; cuisine: string; area: string; budget_min: number | null; budget_max: number | null; description_en: string | null }[]
  area?: string
  cuisine?: string
  budgetMax?: number
  preferences?: string
}): Promise<{ restaurant_id: string; reason: string }[]> {
  const client = getAnthropicClient()

  const restaurantList = restaurants
    .map(
      (r) =>
        `- ID: ${r.id} | Name: ${r.name_en} (${r.name_ja}) | Cuisine: ${r.cuisine} | Area: ${r.area} | Budget: ¥${r.budget_min ?? '?'}-¥${r.budget_max ?? '?'} | ${r.description_en || 'No description'}`
    )
    .join('\n')

  const prompt = `You are a Tokyo restaurant recommendation assistant. Based on the user's preferences, select the top 5 best restaurants from the list below and explain why each one is recommended.

User preferences:
- Area: ${area || 'Any'}
- Cuisine: ${cuisine || 'Any'}
- Max budget: ${budgetMax ? `¥${budgetMax}` : 'No limit'}
- Other preferences: ${preferences || 'None'}

Available restaurants:
${restaurantList}

Return a JSON array of exactly 5 recommendations (or fewer if fewer restaurants are available):
[
  { "restaurant_id": "uuid", "reason": "Brief explanation of why this restaurant matches the user's needs" }
]

Only return the JSON array, no other text.`

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const text =
    response.content[0].type === 'text' ? response.content[0].text : ''

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No JSON array found in response')
    }
    return JSON.parse(jsonMatch[0])
  } catch {
    return []
  }
}
