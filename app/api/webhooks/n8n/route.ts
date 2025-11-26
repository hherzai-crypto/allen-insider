import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
  time: z.string().optional(),
  location: z.string().optional(),
  category: z.enum([
    'Music',
    'Food',
    'Family',
    'Sports',
    'Arts',
    'Shopping',
    'Fitness',
    'Entertainment',
  ]),
  source: z.string(),
  source_url: z.string().optional(),
  cost: z.string().optional(),
  score: z.number().min(1).max(10).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (optional but recommended)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const events = Array.isArray(body) ? body : [body];

    const supabase = createClient();
    let inserted = 0;
    let updated = 0;

    for (const eventData of events) {
      const validated = eventSchema.parse(eventData);

      // Check for duplicate (same title, date, location)
      const { data: existing } = await supabase
        .from('events')
        .select('id')
        .eq('title', validated.title)
        .eq('date', validated.date)
        .eq('location', validated.location || '')
        .single();

      if (existing) {
        // Update existing event
        await supabase
          .from('events')
          .update({
            ...validated,
            scraped_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        updated++;
      } else {
        // Insert new event
        await supabase.from('events').insert({
          ...validated,
          scraped_at: new Date().toISOString(),
        });
        inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      updated,
      total: events.length,
    });
  } catch (error) {
    console.error('Webhook error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid event data', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
