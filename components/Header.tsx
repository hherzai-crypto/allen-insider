'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-primary-teal transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link
                href="#events"
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-secondary hover:text-primary-teal transition-colors font-medium py-2 px-2 rounded-lg hover:bg-teal-50"
              >
                Events
              </Link>
              <Link
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-secondary hover:text-primary-teal transition-colors font-medium py-2 px-2 rounded-lg hover:bg-teal-50"
              >
                About
              </Link>
              <Link
                href="#subscribe"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-gradient-to-br from-primary-teal to-teal-light text-white px-6 py-3 rounded-lg font-semibold text-center hover:shadow-lg transition-all"
              >
                Subscribe
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
