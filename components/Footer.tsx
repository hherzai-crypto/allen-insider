import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-text-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-teal to-teal-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <span className="font-heading font-bold text-xl">
                  ALLEN INSIDER
                </span>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your weekly guide to the best events in Allen, TX. We curate local
              happenings so you never miss what&apos;s going on in our community.
            </p>
            <p className="text-secondary-gold font-semibold">
              Every Thursday at 4 PM
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#events"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="#subscribe"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Subscribe
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="mailto:hello@allen-insider.com"
                  className="hover:text-white transition-colors"
                >
                  hello@allen-insider.com
                </a>
              </li>
              <li>Allen, TX</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Allen Insider. Made with love in Allen, TX.
          </p>
          <p className="text-gray-500 text-sm">
            A community project by{' '}
            <span className="text-secondary-gold">4Ever Young</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
