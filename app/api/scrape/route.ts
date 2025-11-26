import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { scrapeAllEvents, ScrapedEvent } from '@/lib/scrapers';
import Anthropic from '@anthropic-ai/sdk';

// Protect this endpoint with a secret key
const SCRAPE_SECRET = process.env.SCRAPE_SECRET || 'dev-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    const providedSecret = authHeader?.replace('Bearer ', '');

    if (providedSecret !== SCRAPE_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting event scraping process...');

    // Scrape events from all sources
    const scrapedEvents = await scrapeAllEvents();

    if (scrapedEvents.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No events found',
        eventsAdded: 0
      });
    }

    // Enrich events with AI categorization and scoring
    const enrichedEvents = await enrichEventsWithAI(scrapedEvents);

    // Store events in database
    const supabase = createClient();
    const eventsToInsert = enrichedEvents.map(event => ({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time || null,
      end_date: event.end_date || null,
      location: event.location,
      address: event.address || null,
      category: event.category || 'Entertainment',
      source: event.source,
      source_url: event.source_url || null,
      image_url: event.image_url || null,
      cost: event.cost || 'Free',
      score: event.score || 5,
      featured: event.featured || false,
      scraped_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('events')
      .upsert(eventsToInsert, {
        onConflict: 'title,date',
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to store events', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully scraped and stored ${data?.length || 0} events`,
      eventsAdded: data?.length || 0,
      events: data
    });

  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Scraping failed'
      },
      { status: 500 }
    );
  }
}

// Allow GET requests to trigger scraping (for cron jobs)
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== SCRAPE_SECRET) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Forward to POST handler
  return POST(request);
}

/**
 * Enrich events with AI-powered categorization and scoring
 */
async function enrichEventsWithAI(events: ScrapedEvent[]): Promise<ScrapedEvent[]> {
  // Skip AI enrichment if API key not configured
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('Skipping AI enrichment - no API key configured');
    return events.map(event => ({
      ...event,
      category: event.category || guessCategory(event.title, event.description),
      score: event.score || 6,
      featured: event.featured || false
    }));
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const eventsText = events.map((e, i) =>
      `${i + 1}. ${e.title} - ${e.description}`
    ).join('\n');

    const prompt = `You are an AI that categorizes and scores local events for Allen, TX residents.

For each event below, provide:
1. Category (Music, Food, Family, Sports, Arts, Fitness, Entertainment, or Community)
2. Score (1-10, where 10 = most appealing to families/locals)
3. Featured (true/false - should this be highlighted?)

Events:
${eventsText}

Return JSON array with format:
[{"category": "Music", "score": 8, "featured": true}, ...]`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '[]';
    const enrichments = JSON.parse(responseText);

    return events.map((event, index) => ({
      ...event,
      category: enrichments[index]?.category || event.category || guessCategory(event.title, event.description),
      score: enrichments[index]?.score || event.score || 6,
      featured: enrichments[index]?.featured || event.featured || false
    }));

  } catch (error) {
    console.error('AI enrichment failed:', error);
    // Fallback to rule-based categorization
    return events.map(event => ({
      ...event,
      category: event.category || guessCategory(event.title, event.description),
      score: event.score || 6,
      featured: event.featured || false
    }));
  }
}

/**
 * Simple rule-based category guesser (fallback when AI unavailable)
 */
function guessCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes('music') || text.includes('concert') || text.includes('band')) return 'Music';
  if (text.includes('food') || text.includes('restaurant') || text.includes('dining')) return 'Food';
  if (text.includes('kid') || text.includes('family') || text.includes('children')) return 'Family';
  if (text.includes('sport') || text.includes('game') || text.includes('basketball')) return 'Sports';
  if (text.includes('art') || text.includes('gallery') || text.includes('paint')) return 'Arts';
  if (text.includes('yoga') || text.includes('fitness') || text.includes('workout')) return 'Fitness';
  if (text.includes('market') || text.includes('festival') || text.includes('community')) return 'Community';

  return 'Entertainment';
}
