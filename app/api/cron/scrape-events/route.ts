import { NextRequest, NextResponse } from 'next/server';

/**
 * Cron job endpoint for automated event scraping
 *
 * Can be triggered by:
 * - Vercel Cron Jobs (add to vercel.json)
 * - External cron services (cron-job.org, EasyCron)
 * - Manual trigger for testing
 *
 * Example vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/scrape-events",
 *     "schedule": "0 6 * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify this is coming from a trusted source
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || process.env.SCRAPE_SECRET || 'dev-secret-key';

    // Vercel Cron Jobs send a special header
    const isVercelCron = request.headers.get('user-agent')?.includes('vercel-cron');

    if (!isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[CRON] Starting scheduled event scraping...');

    // Call the scrape API endpoint
    const scrapeUrl = new URL('/api/scrape', request.url);
    const scrapeResponse = await fetch(scrapeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await scrapeResponse.json();

    console.log('[CRON] Scraping completed:', result);

    return NextResponse.json({
      success: true,
      message: 'Cron job executed successfully',
      result
    });

  } catch (error) {
    console.error('[CRON] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Cron job failed'
      },
      { status: 500 }
    );
  }
}

// Also allow POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
