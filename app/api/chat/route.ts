import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { generateChatResponse } from '@/lib/claude';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string().min(1).max(500),
  conversationId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationId } = chatSchema.parse(body);

    let events: any[] = [];

    // Try to fetch events from database first
    try {
      const supabase = createClient();
      const today = new Date().toISOString().split('T')[0];

      const { data: dbEvents, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('score', { ascending: false })
        .limit(20);

      if (!error && dbEvents && dbEvents.length > 0) {
        events = dbEvents;
        console.log(`Loaded ${events.length} events from database for chat`);
      }
    } catch (dbError) {
      console.warn('Database unavailable for chat, will try API fallback');
    }

    // Fallback: fetch from API endpoint if no database events
    if (events.length === 0) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
        const eventsResponse = await fetch(`${baseUrl}/api/events?upcoming=true&limit=20`);
        const eventsData = await eventsResponse.json();

        if (eventsData.success && eventsData.events) {
          events = eventsData.events;
          console.log(`Loaded ${events.length} events from API for chat`);
        }
      } catch (apiError) {
        console.warn('API events fetch failed:', apiError);
      }
    }

    // Generate AI response
    const { response, recommendedEvents } = await generateChatResponse(
      message,
      events
    );

    // Try to store conversation (optional - don't fail if table doesn't exist)
    let conversationRecord = null;
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: conversationId || null,
          message,
          response,
          events_recommended: recommendedEvents,
        })
        .select()
        .single();

      conversationRecord = data;
    } catch (convError) {
      console.warn('Could not store conversation (table may not exist):', convError);
    }

    return NextResponse.json({
      success: true,
      response,
      events: recommendedEvents,
      conversationId: conversationRecord?.id,
    });
  } catch (error) {
    console.error('Chat error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid message' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Chat failed. Please try again.' },
      { status: 500 }
    );
  }
}
