import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', today)
      .gte('score', 8)
      .order('score', { ascending: false })
      .limit(5);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      events: data,
    });
  } catch (error) {
    console.error('Featured events error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch featured events' },
      { status: 500 }
    );
  }
}
