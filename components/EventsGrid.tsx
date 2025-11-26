'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/lib/types';
import { EventCard } from './EventCard';

// Helper function to get next occurrence of a day of week (0=Sunday, 6=Saturday)
function getNextDayOfWeek(dayOfWeek: number): Date {
  const today = new Date();
  const currentDay = today.getDay();
  const daysUntilTarget = (dayOfWeek + 7 - currentDay) % 7 || 7;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntilTarget);
  return targetDate;
}

// Helper to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Generate mock events with dynamic dates
function generateMockEvents(): Event[] {
  const friday = getNextDayOfWeek(5);
  const saturday = getNextDayOfWeek(6);
  const sunday = getNextDayOfWeek(0);
  const nextSaturday = new Date(saturday);
  nextSaturday.setDate(saturday.getDate() + 7);

  return [
    {
      id: '1',
      title: 'Allen Farmers Market',
      description: 'Fresh produce, local vendors, live music, and family fun every Saturday morning. Support local businesses and enjoy the freshest ingredients Allen has to offer.',
      date: formatDate(saturday),
      time: '8:00 AM - 12:00 PM',
      end_date: null,
      location: 'Watters Creek',
      address: '970 Garden Park Dr, Allen, TX',
      category: 'Food',
      source: 'Community Events',
      source_url: null,
      image_url: null,
      cost: 'Free',
      score: 9,
      featured: true,
      created_at: new Date().toISOString(),
      scraped_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Live Music Friday',
      description: 'Enjoy live local bands every Friday night on the outdoor stage. Bring your friends and family for a night of great music and good vibes.',
      date: formatDate(friday),
      time: '7:00 PM - 10:00 PM',
      end_date: null,
      location: 'The Yard Allen',
      address: '107 N Greenville Ave, Allen, TX',
      category: 'Music',
      source: 'Community Events',
      source_url: null,
      image_url: null,
      cost: 'Free',
      score: 8,
      featured: true,
      created_at: new Date().toISOString(),
      scraped_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Kids Art Workshop',
      description: 'Creative painting session for children ages 5-12. All materials provided. Let your kids explore their artistic side in a fun, supportive environment.',
      date: formatDate(nextSaturday),
      time: '2:00 PM - 4:00 PM',
      end_date: null,
      location: 'Allen Arts Alliance',
      address: '301 Century Pkwy, Allen, TX',
      category: 'Family',
      source: 'Eventbrite',
      source_url: 'https://www.eventbrite.com/d/tx--allen/events/',
      image_url: null,
      cost: '$15 per child',
      score: 8,
      featured: false,
      created_at: new Date().toISOString(),
      scraped_at: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Allen Eagles Basketball',
      description: 'Cheer on the Allen Eagles in this exciting home game. Experience the energy and school spirit as our team takes on district rivals.',
      date: formatDate(saturday),
      time: '7:00 PM',
      end_date: null,
      location: 'Allen High School',
      address: '300 Rivercrest Blvd, Allen, TX',
      category: 'Sports',
      source: 'Allen ISD',
      source_url: 'https://www.eventbrite.com/d/tx--allen/sports/',
      image_url: null,
      cost: '$8 adults, $5 students',
      score: 7,
      featured: false,
      created_at: new Date().toISOString(),
      scraped_at: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Food Truck Friday',
      description: 'Over 15 food trucks featuring diverse cuisines. From tacos to BBQ to desserts, there\'s something for everyone at this weekly favorite.',
      date: formatDate(friday),
      time: '5:00 PM - 9:00 PM',
      end_date: null,
      location: 'Celebration Park',
      address: '701 Angel Pkwy, Allen, TX',
      category: 'Food',
      source: 'City of Allen',
      source_url: null,
      image_url: null,
      cost: 'Free entry',
      score: 9,
      featured: true,
      created_at: new Date().toISOString(),
      scraped_at: new Date().toISOString(),
    },
    {
      id: '6',
      title: 'Yoga in the Park',
      description: 'Free outdoor yoga session for all levels. Bring your own mat. Start your weekend with mindfulness and movement in beautiful Bethany Lakes Park.',
      date: formatDate(sunday),
      time: '9:00 AM - 10:00 AM',
      end_date: null,
      location: 'Bethany Lakes Park',
      address: '701 S Greenville Ave, Allen, TX',
      category: 'Fitness',
      source: 'Allen Parks & Recreation',
      source_url: null,
      image_url: null,
      cost: 'Free',
      score: 7,
      featured: false,
      created_at: new Date().toISOString(),
      scraped_at: new Date().toISOString(),
    },
  ];
}

export function EventsGrid() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  // Fetch events on mount
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const response = await fetch('/api/events?upcoming=true&limit=20');
        const data = await response.json();

        if (data.success && data.events && data.events.length > 0) {
          // Real data from API
          setEvents(data.events);
          setFilteredEvents(data.events);
          setUsingMockData(false);
        } else {
          // Fallback to mock data with dynamic dates
          console.info('Using mock data - configure backend to see real events');
          const mockEvents = generateMockEvents();
          setEvents(mockEvents);
          setFilteredEvents(mockEvents);
          setUsingMockData(true);
        }
      } catch (err) {
        // Fallback to mock data on error
        console.info('API error - using mock data:', err);
        const mockEvents = generateMockEvents();
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Filter events by category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter((event) => event.category === selectedCategory)
      );
    }
  }, [selectedCategory, events]);

  return (
    <section id="events" className="py-16 bg-bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            This Week in <span className="text-primary-teal">Allen</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            The best events happening in Allen this weekend, curated just for you.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {['All', 'Music', 'Food', 'Family', 'Sports', 'Arts', 'Fitness', 'Entertainment'].map(
            (category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === selectedCategory
                    ? 'bg-primary-teal text-white'
                    : 'bg-white text-text-secondary border border-gray-200 hover:border-primary-teal hover:text-primary-teal'
                }`}
              >
                {category}
              </button>
            )
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary-teal border-t-transparent rounded-full animate-spin"></div>
            <p className="text-text-secondary mt-4">Loading events...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg mb-2">No events found</p>
            <p className="text-text-secondary text-sm">
              {selectedCategory === 'All'
                ? 'Check back soon for upcoming events!'
                : `No ${selectedCategory} events this week.`}
            </p>
          </div>
        )}

        {/* Events grid */}
        {!loading && filteredEvents.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-text-secondary mb-4">
            Want more events? Subscribe to get the full list every Thursday.
          </p>
          <a
            href="#subscribe"
            className="inline-block bg-gradient-to-br from-primary-teal to-teal-light text-white px-8 py-3 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            Subscribe for Free
          </a>
        </div>
      </div>
    </section>
  );
}
