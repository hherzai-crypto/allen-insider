'use client';

import { useState, FormEvent } from 'react';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot trap
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // If honeypot is filled, it's a bot - silently reject
    if (honeypot) {
      setStatus('success');
      setMessage('Thanks for subscribing!');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage', honeypot }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setMessage(data.message);
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg text-center">
        ✓ {message}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
    >
      {/* Honeypot field - hidden from users, visible to bots */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none h-0 w-0"
        style={{ position: 'absolute', left: '-9999px' }}
      />

      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === 'loading'}
        className="flex-1 px-5 py-3.5 text-base border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 rounded-lg outline-none focus:border-secondary-gold focus:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-secondary-gold text-text-primary px-8 py-3.5 rounded-lg font-heading font-semibold whitespace-nowrap transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {status === 'loading' ? 'Signing Up...' : 'Sign Up Free'}
      </button>

      {status === 'error' && (
        <p className="text-red-300 text-sm text-center sm:col-span-2 mt-2">
          {message}
        </p>
      )}
    </form>
  );
}
