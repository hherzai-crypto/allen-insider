'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-teal to-teal-light rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div>
              <span className="font-heading font-bold text-xl text-primary-teal">
                ALLEN INSIDER
              </span>
              <span className="hidden sm:block text-xs text-secondary-gold font-semibold">
                Your Weekly Guide to Allen, TX
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#events"
              className="text-text-secondary hover:text-primary-teal transition-colors font-medium"
            >
              Events
            </Link>
            <Link
              href="#about"
              className="text-text-secondary hover:text-primary-teal transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="#subscribe"
              className="bg-gradient-to-br from-primary-teal to-teal-light text-white px-6 py-2 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Subscribe
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-text-secondary hover:text-primary-teal">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
