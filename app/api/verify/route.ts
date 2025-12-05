import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Find subscriber with this verification token
    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .select('id, email, status, verification_token_expires')
      .eq('verification_token', token)
      .single();

    if (error || !subscriber) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification link' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (subscriber.status === 'active') {
      return NextResponse.json({
        success: true,
        message: 'Email already verified! You\'re all set.',
      });
    }

    // Check if token expired
    if (
      subscriber.verification_token_expires &&
      new Date(subscriber.verification_token_expires) < new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Verification link has expired. Please sign up again.',
        },
        { status: 400 }
      );
    }

    // Activate the subscriber
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({
        status: 'active',
        verified_at: new Date().toISOString(),
        verification_token: null, // Clear the token
        verification_token_expires: null,
      })
      .eq('id', subscriber.id);

    if (updateError) throw updateError;

    // Redirect to success page (you can create this page later)
    return NextResponse.redirect(
      new URL('/verified?success=true', request.url)
    );
  } catch (error: any) {
    console.error('Verification error:', {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      stack: error?.stack
    });
    return NextResponse.json(
      { success: false, message: 'Verification failed', error: error?.message },
      { status: 500 }
    );
  }
}
