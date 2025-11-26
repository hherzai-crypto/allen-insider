import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unsubscribe token is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Find subscriber with this unsubscribe token
    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .select('id, email, status')
      .eq('unsubscribe_token', token)
      .single();

    if (error || !subscriber) {
      return NextResponse.json(
        { success: false, message: 'Invalid unsubscribe link' },
        { status: 400 }
      );
    }

    // Check if already unsubscribed
    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json({
        success: true,
        message: 'You are already unsubscribed.',
      });
    }

    // Unsubscribe the user
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({
        status: 'unsubscribed',
      })
      .eq('id', subscriber.id);

    if (updateError) throw updateError;

    // Redirect to unsubscribe confirmation page
    return NextResponse.redirect(
      new URL('/unsubscribed?success=true', request.url)
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { success: false, message: 'Unsubscribe failed' },
      { status: 500 }
    );
  }
}
