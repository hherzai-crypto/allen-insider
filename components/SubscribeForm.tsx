'use client';

import { useState, FormEvent } from 'react';
import { EventCategory, categoryColors } from '@/lib/types';

const categories: EventCategory[] = [
  'Music',
  'Food',
  'Family',
  'Sports',
  'Arts',
  'Fitness',
  'Shopping',
  'Entertainment',
  'Community',
  'Education'
];

export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const toggleCategory = (category: EventCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          preferred_categories: selectedCategories.length > 0 ? selectedCategories : null
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Successfully subscribed! Check your email to confirm.' });
        setEmail('');
        setSelectedCategories([]);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to subscribe. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-5 py-3.5 rounded-lg outline-none focus:ring-2 focus:ring-secondary-gold bg-white text-gray-900 placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-secondary-gold text-text-primary px-8 py-3.5 rounded-lg font-heading font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        {/* Category Selection */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-white font-semibold text-lg mb-3">
            Personalize Your Newsletter (Optional)
          </h3>
          <p className="text-white/80 text-sm mb-4">
            Select the event categories you're interested in. Leave blank to receive all events.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedCategories.includes(category)
                    ? 'bg-white text-primary-teal shadow-md scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {selectedCategories.length > 0 && (
            <p className="text-white/70 text-sm mt-3">
              {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
            </p>
          )}
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
