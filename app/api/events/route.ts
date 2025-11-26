import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { Event } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const upcoming = searchParams.get('upcoming') === 'true';

    const supabase = createClient();
    let query = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
      .order('score', { ascending: false })
      .limit(limit);

    // Filter by category
    if (category) {
      query = query.eq('category', category);
    }

    // Filter upcoming events only
    if (upcoming) {
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('date', today);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      events: data as Event[],
    });
  } catch (error) {
    console.error('Events fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
