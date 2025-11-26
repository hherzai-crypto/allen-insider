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

    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    // Fetch upcoming events for context
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .gte('date', today)
      .order('score', { ascending: false })
      .limit(20);

    // Generate AI response
    const { response, recommendedEvents } = await generateChatResponse(
      message,
      events || []
    );

    // Store conversation
    const { data: conversation } = await supabase
      .from('chat_conversations')
      .insert({
        user_id: conversationId || null,
        message,
        response,
        events_recommended: recommendedEvents,
      })
      .select()
      .single();

    return NextResponse.json({
      success: true,
      response,
      events: recommendedEvents,
      conversationId: conversation?.id,
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
