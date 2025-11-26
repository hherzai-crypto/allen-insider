import Anthropic from '@anthropic-ai/sdk';
import { Event } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateChatResponse(
  userMessage: string,
  events: Event[]
) {
  const eventsContext = events
    .map(
      (e) =>
        `- ${e.title} (${e.category}) on ${e.date} at ${e.time || 'TBD'} in ${e.location}. ${e.cost}. ${e.description}`
    )
    .join('\n');

  const prompt = `You are "Allen Insider Bot" - a helpful assistant who knows all events in Allen, TX.

When users ask about events:
1. Search the provided events data for relevant matches
2. Respond conversationally (not robotic)
3. Recommend 2-3 specific events with dates/times
4. Ask if they want more suggestions

Tone: Friendly local, not corporate. Max 3 sentences + event list.

Available events:
${eventsContext}

User question: ${userMessage}

Respond with your recommendation and return the event IDs you're recommending.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const response =
    message.content[0].type === 'text' ? message.content[0].text : '';

  // Simple matching to find recommended events
  const recommendedEvents = events.filter((event) =>
    response.toLowerCase().includes(event.title.toLowerCase())
  );

  return {
    response,
    recommendedEvents: recommendedEvents.slice(0, 3),
  };
}

export async function generateNewsletterContent(events: Event[]) {
  const eventsContext = events
    .map(
      (e) =>
        `- ${e.title} (${e.category}) on ${e.date} at ${e.time || 'TBD'} in ${e.location}. ${e.cost}. ${e.description}`
    )
    .join('\n');

  const prompt = `You are "Allen Insider" - a friendly local who loves Allen, TX.

Write a weekly newsletter with:
1. Catchy subject line (7 words max)
2. Warm greeting
3. Top 5 events this weekend (Friday-Sunday)
4. 1-2 hidden gems (less obvious events)
5. Closing with personality

Tone: Friendly neighbor, not corporate. Use contractions. Occasional emoji (1-2 max).

Events data:
${eventsContext}

Format:
- Short paragraphs (2-3 sentences max)
- Bullet points for event details
- Include day/time/location/cost for each

Word count: 300-400 words

Return as JSON:
{
  "subject": "subject line here",
  "content": "newsletter body here"
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const response =
    message.content[0].type === 'text' ? message.content[0].text : '';

  try {
    const parsed = JSON.parse(response);
    return {
      subject: parsed.subject,
      content: parsed.content,
    };
  } catch {
    return {
      subject: 'This Weekend in Allen',
      content: response,
    };
  }
}
