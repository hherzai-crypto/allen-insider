import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/sendgrid';
import { rateLimit, getClientIP } from '@/lib/rate-limit';
import { z } from 'zod';
import { EventCategory } from '@/lib/types';

const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
  honeypot: z.string().optional(),
  preferred_categories: z.array(z.string()).nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(`subscribe:${clientIP}`, {
      maxRequests: 3,
      windowMs: 60 * 60 * 1000, // 3 requests per hour
    });

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.resetAt);
      return NextResponse.json(
        {
          success: false,
          message: `Too many signup attempts. Please try again after ${resetDate.toLocaleTimeString()}.`,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { email, source, honeypot, preferred_categories } = subscribeSchema.parse(body);

    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      console.warn(`Bot detected: ${clientIP} - honeypot filled`);
      // Return success to fool the bot, but don't actually subscribe
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed! Check your inbox.',
      });
    }

    const supabase = createClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { success: false, message: 'Already subscribed' },
          { status: 400 }
        );
      } else {
        // Reactivate unsubscribed user
        await supabase
          .from('subscribers')
          .update({
            status: 'active',
            subscribed_at: new Date().toISOString(),
            preferred_categories: preferred_categories || null
          })
          .eq('id', existing.id);

        return NextResponse.json({
          success: true,
          message: "Welcome back! You're resubscribed.",
        });
      }
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // 24 hour expiry

    // Insert new subscriber with pending status
    const { error } = await supabase.from('subscribers').insert({
      email,
      source: source || 'website',
      status: 'pending',
      verification_token: verificationToken,
      verification_token_expires: tokenExpires.toISOString(),
      preferred_categories: preferred_categories || null,
    });

    if (error) throw error;

    // Send verification email (optional in development)
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify?token=${verificationToken}`;
      await sendWelcomeEmail(email, verificationUrl);

      return NextResponse.json({
        success: true,
        message: 'Almost there! Please check your email to verify your subscription.',
      });
    } catch (emailError: any) {
      // If SendGrid is not configured (development), still return success
      if (emailError?.code === 401 || process.env.SENDGRID_API_KEY === 'SG.placeholder') {
        console.warn('SendGrid not configured - skipping verification email in development');
        return NextResponse.json({
          success: true,
          message: 'Successfully subscribed! (Email verification skipped in development)',
        });
      }
      // Re-throw other email errors
      throw emailError;
    }
  } catch (error) {
    console.error('Subscribe error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Subscription failed. Please try again.' },
      { status: 500 }
    );
  }
}
