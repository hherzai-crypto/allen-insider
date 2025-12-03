import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { Event, EventCategory } from '@/lib/types';
import { scrapeAllEvents } from '@/lib/scrapers';

// Simple in-memory cache
let cachedEvents: Event[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');
    const upcoming = searchParams.get('upcoming') === 'true';

    // Try database first
    try {
      const supabase = createClient();
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .order('score', { ascending: false })
        .limit(limit);

      if (category) {
        query = query.eq('category', category);
      }

      if (upcoming) {
        const today = new Date().toISOString().split('T')[0];
        query = query.gte('date', today);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          success: true,
          events: data as Event[],
          source: 'database'
        });
      }
    } catch (dbError) {
      console.log('Database unavailable, falling back to live scraping');
    }

    // Check cache before scraping
    const now = Date.now();
    const cacheValid = cachedEvents && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION);

    if (!cacheValid) {
      // Fallback: Scrape events directly
      console.log('Fetching events directly from scrapers...');
      const scrapedEvents = await scrapeAllEvents();

      // Update cache
      cachedEvents = scrapedEvents.map((event, index) => ({
        id: `scraped-${index}`,
        title: event.title,
        description: event.description || event.title,
        date: event.date,
        time: event.time || null,
        end_date: event.end_date || null,
        location: event.location || 'Allen, TX',
        address: event.address || null,
        category: (event.category || 'Entertainment') as EventCategory,
        source: event.source,
        source_url: event.source_url || null,
        image_url: event.image_url || null,
        cost: event.cost || 'See website',
        score: event.score || 5,
        featured: event.featured || false,
        created_at: new Date().toISOString(),
        scraped_at: new Date().toISOString(),
      }));
      cacheTimestamp = now;
      console.log(`Cached ${cachedEvents.length} events for 6 hours`);
    } else {
      console.log('Using cached events (cache hit)');
    }

    // Filter events based on query parameters
    const events: Event[] = cachedEvents!
      .filter(event => {
        if (category && event.category !== category) return false;
        if (upcoming) {
          const today = new Date().toISOString().split('T')[0];
          return event.date >= today;
        }
        return true;
      })
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      events,
      source: 'live-scraping',
      count: events.length
    });
  } catch (error) {
    console.error('Events fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch events', error: String(error) },
      { status: 500 }
    );
  }
}
