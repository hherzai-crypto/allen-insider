'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerScrape = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer dev-secret-key-12345',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || 'Scraping failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-offwhite p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading font-bold text-4xl text-primary-teal mb-8">
          Allen Insider Admin
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="font-heading font-semibold text-2xl mb-4">
            Event Scraper
          </h2>
          <p className="text-text-secondary mb-6">
            Manually trigger the event scraper to fetch and store new events from Allen, TX sources.
          </p>

          <button
            onClick={triggerScrape}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-teal hover:bg-teal-light hover:-translate-y-0.5 hover:shadow-lg'
            }`}
          >
            {loading ? 'Scraping...' : 'Run Scraper Now'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">
              ✅ Scraping Successful
            </h3>
            <p className="text-green-800 mb-4">{result.message}</p>

            {result.eventsAdded > 0 && (
              <div className="bg-white rounded p-4">
                <h4 className="font-semibold mb-2">Scraped Events:</h4>
                <pre className="text-xs overflow-auto max-h-96 bg-gray-50 p-3 rounded">
                  {JSON.stringify(result.events, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Errors */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-2">
              ❌ Error
            </h3>
            <p className="text-red-800">{error}</p>
            <p className="text-red-700 text-sm mt-2">
              Make sure Supabase is configured in .env.local
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            📋 Setup Instructions
          </h3>
          <ol className="text-blue-800 space-y-2 list-decimal list-inside">
            <li>Set up Supabase database (see SETUP_GUIDE.md)</li>
            <li>Configure .env.local with Supabase credentials</li>
            <li>Click "Run Scraper Now" to fetch events</li>
            <li>View events on the homepage</li>
          </ol>
          <p className="text-blue-700 mt-4 text-sm">
            After deployment, the scraper runs automatically every day at 6 AM via Vercel Cron.
          </p>
        </div>
      </div>
    </div>
  );
}
