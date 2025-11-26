import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { Event } from '@/lib/types';
import { scrapeAllEvents } from '@/lib/scrapers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
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

    // Fallback: Scrape events directly
    console.log('Fetching events directly from scrapers...');
    const scrapedEvents = await scrapeAllEvents();

    // Convert scraped events to Event format
    const events: Event[] = scrapedEvents
      .filter(event => {
        if (category && event.category !== category) return false;
        if (upcoming) {
          const today = new Date().toISOString().split('T')[0];
          return event.date >= today;
        }
        return true;
      })
      .slice(0, limit)
      .map((event, index) => ({
        id: `scraped-${index}`,
        title: event.title,
        description: event.description || event.title,
        date: event.date,
        time: event.time || null,
        end_date: event.end_date || null,
        location: event.location || 'Allen, TX',
        address: event.address || null,
        category: event.category || 'Entertainment',
        source: event.source,
        source_url: event.source_url || null,
        image_url: event.image_url || null,
        cost: event.cost || 'See website',
        score: event.score || 5,
        featured: event.featured || false,
        created_at: new Date().toISOString(),
        scraped_at: new Date().toISOString(),
      }));

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
