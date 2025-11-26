import Link from 'next/link';

export default function VerifiedPage() {
  return (
    <div className="min-h-screen bg-bg-offwhite flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="font-heading font-bold text-3xl text-primary-teal mb-4">
            You&apos;re All Set!
          </h1>

          <p className="text-text-secondary text-lg mb-6">
            Your email has been verified. You&apos;ll start receiving the best Allen
            events every Thursday at 4 PM.
          </p>

          {/* What's Next */}
          <div className="bg-teal-light/10 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-heading font-semibold text-primary-teal mb-3">
              What&apos;s Next?
            </h2>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start">
                <span className="text-secondary-gold mr-2">📅</span>
                <span>Your first newsletter arrives this Thursday</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-gold mr-2">🎉</span>
                <span>Discover 8-12 curated weekend events</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-gold mr-2">💬</span>
                <span>Chat with our AI for instant recommendations</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-primary-teal text-white px-6 py-3 rounded-lg font-heading font-semibold hover:bg-teal-light transition-colors"
            >
              Browse Events
            </Link>
            <Link
              href="/#about"
              className="block w-full border-2 border-primary-teal text-primary-teal px-6 py-3 rounded-lg font-heading font-semibold hover:bg-primary-teal/5 transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-text-secondary text-sm mt-6">
            Questions?{' '}
            <a
              href="mailto:hello@allen-insider.com"
              className="text-primary-teal hover:underline"
            >
              Email us
            </a>
          </p>
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
