import Link from 'next/link';

export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen bg-bg-offwhite flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h1 className="font-heading font-bold text-3xl text-text-primary mb-4">
            You&apos;ve Been Unsubscribed
          </h1>

          <p className="text-text-secondary text-lg mb-6">
            You won&apos;t receive any more emails from Allen Insider. We&apos;re sorry
            to see you go!
          </p>

          {/* Feedback Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-heading font-semibold text-text-primary mb-3">
              Help us improve
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              We&apos;d love to know why you unsubscribed so we can make Allen Insider
              better for everyone.
            </p>
            <a
              href="mailto:hello@allen-insider.com?subject=Unsubscribe Feedback"
              className="text-primary-teal hover:underline text-sm font-semibold"
            >
              Send us feedback →
            </a>
          </div>

          {/* Changed your mind? */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-heading font-semibold text-text-primary mb-3">
              Changed your mind?
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              You can always resubscribe to start getting weekend event updates again.
            </p>
            <Link
              href="/"
              className="inline-block bg-primary-teal text-white px-8 py-3 rounded-lg font-heading font-semibold hover:bg-teal-light transition-colors"
            >
              Resubscribe
            </Link>
          </div>

          {/* Alternative */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-text-secondary text-sm">
              You can still browse events anytime at{' '}
              <Link href="/" className="text-primary-teal hover:underline font-semibold">
                allen-insider.com
              </Link>
            </p>
          </div>
        </div>

        {/* Branding */}
        <p className="text-center text-text-secondary text-sm mt-6">
          Brought to you by{' '}
          <span className="text-secondary-gold font-semibold">4Ever Young</span>
          <br />
          Opening in Allen, June 2026
        </p>
      </div>
    </div>
  );
}
