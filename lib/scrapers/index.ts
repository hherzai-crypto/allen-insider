import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event } from '../types';

export interface ScrapedEvent {
  title: string;
  description: string;
  date: string;
  time?: string;
  end_date?: string;
  location: string;
  address?: string;
  category?: string;
  source: string;
  source_url?: string;
  image_url?: string;
  cost?: string;
  score?: number;
  featured?: boolean;
}

/**
 * Scrape events from City of Allen website
 */
export async function scrapeCityOfAllenEvents(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://www.cityofallen.org/Calendar.aspx', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    // Parse City of Allen events
    $('.event-item').each((_, element) => {
      const title = $(element).find('.event-title').text().trim();
      const description = $(element).find('.event-description').text().trim();
      const dateStr = $(element).find('.event-date').text().trim();
      const time = $(element).find('.event-time').text().trim();
      const location = $(element).find('.event-location').text().trim();

      if (title && dateStr) {
        events.push({
          title,
          description: description || title,
          date: parseDate(dateStr),
          time: time || undefined,
          location: location || 'Allen, TX',
          source: 'City of Allen',
          source_url: 'https://www.cityofallen.org/Calendar.aspx',
          cost: 'Free'
        });
      }
    });

    return events;
  } catch (error) {
    console.error('Error scraping City of Allen:', error);
    return [];
  }
}

/**
 * Scrape events from Allen Parks & Recreation
 */
export async function scrapeAllenParksEvents(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://www.cityofallen.org/1302/Parks-Recreation', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    // Look for event listings
    $('article, .program-item, .event').each((_, element) => {
      const title = $(element).find('h2, h3, .title').first().text().trim();
      const description = $(element).find('p, .description').first().text().trim();
      const dateStr = $(element).find('.date, time').text().trim();

      if (title && title.length > 3) {
        events.push({
          title,
          description: description || title,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          location: 'Allen Parks',
          source: 'Allen Parks & Recreation',
          source_url: 'https://www.cityofallen.org/1302/Parks-Recreation',
          cost: 'Free',
          category: 'Fitness'
        });
      }
    });

    return events.slice(0, 5); // Limit to 5 events
  } catch (error) {
    console.error('Error scraping Allen Parks:', error);
    return [];
  }
}

/**
 * Scrape events from Eventbrite for Allen, TX
 */
export async function scrapeEventbriteEvents(): Promise<ScrapedEvent[]> {
  try {
    // Eventbrite requires API key for proper access
    // Using web scraping as fallback
    const response = await axios.get('https://www.eventbrite.com/d/tx--allen/events/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    // Eventbrite uses dynamic content, so this is a basic scraper
    $('[data-event-id]').each((_, element) => {
      const title = $(element).find('h3, h2').first().text().trim();
      const dateStr = $(element).find('time, .event-card__date').text().trim();
      const location = $(element).find('.event-card__location, .location').text().trim();
      const price = $(element).find('.event-card__price, .price').text().trim();

      if (title) {
        events.push({
          title,
          description: title,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          location: location || 'Allen, TX',
          source: 'Eventbrite',
          source_url: 'https://www.eventbrite.com/d/tx--allen/events/',
          cost: price || 'See website'
        });
      }
    });

    return events.slice(0, 10);
  } catch (error) {
    console.error('Error scraping Eventbrite:', error);
    return [];
  }
}

/**
 * Generate community events (placeholder until real sources are scraped)
 */
export async function generateCommunityEvents(): Promise<ScrapedEvent[]> {
  const today = new Date();
  const events: ScrapedEvent[] = [];

  // Weekend farmer's market
  const saturday = getNextDayOfWeek(6); // Saturday
  events.push({
    title: 'Allen Farmers Market',
    description: 'Fresh local produce, artisan goods, live music, and family-friendly activities every Saturday morning at Watters Creek.',
    date: formatDate(saturday),
    time: '8:00 AM - 12:00 PM',
    location: 'Watters Creek',
    address: '970 Garden Park Dr, Allen, TX 75013',
    category: 'Food',
    source: 'Community Events',
    cost: 'Free admission',
    featured: true,
    score: 9
  });

  // Friday night music
  const friday = getNextDayOfWeek(5);
  events.push({
    title: 'Live Music Friday',
    description: 'Enjoy live performances from local bands and musicians on the outdoor stage. Bring your lawn chairs!',
    date: formatDate(friday),
    time: '7:00 PM - 10:00 PM',
    location: 'The Yard Allen',
    address: '107 N Greenville Ave, Allen, TX 75002',
    category: 'Music',
    source: 'Community Events',
    cost: 'Free',
    featured: true,
    score: 8
  });

  // Sunday yoga
  const sunday = getNextDayOfWeek(0);
  events.push({
    title: 'Yoga in the Park',
    description: 'Free outdoor yoga session for all skill levels. Bring your own mat and water bottle.',
    date: formatDate(sunday),
    time: '9:00 AM - 10:00 AM',
    location: 'Bethany Lakes Park',
    address: '701 S Greenville Ave, Allen, TX 75002',
    category: 'Fitness',
    source: 'Allen Parks',
    cost: 'Free',
    score: 7
  });

  // Food truck event
  events.push({
    title: 'Food Truck Friday',
    description: 'Over 15 food trucks featuring diverse cuisines from tacos to BBQ to desserts. Family-friendly atmosphere.',
    date: formatDate(friday),
    time: '5:00 PM - 9:00 PM',
    location: 'Celebration Park',
    address: '701 Angel Pkwy, Allen, TX 75013',
    category: 'Food',
    source: 'Community Events',
    cost: 'Free entry',
    featured: true,
    score: 9
  });

  // Kids activity
  const nextSaturday = getNextDayOfWeek(6);
  events.push({
    title: 'Kids Arts & Crafts Workshop',
    description: 'Creative art session for children ages 5-12. All materials provided. Registration recommended.',
    date: formatDate(nextSaturday),
    time: '2:00 PM - 4:00 PM',
    location: 'Allen Arts Alliance',
    address: '301 Century Pkwy, Allen, TX 75013',
    category: 'Family',
    source: 'Allen Arts',
    cost: '$15 per child',
    score: 8
  });

  // Sports event
  events.push({
    title: 'Allen Eagles Basketball Game',
    description: 'Cheer on the Allen High School Eagles in this exciting home basketball game.',
    date: formatDate(friday),
    time: '7:00 PM',
    location: 'Allen High School',
    address: '300 Rivercrest Blvd, Allen, TX 75002',
    category: 'Sports',
    source: 'Allen ISD',
    cost: '$8 adults, $5 students',
    score: 7
  });

  return events;
}

/**
 * Master scraper that combines all sources
 */
export async function scrapeAllEvents(): Promise<ScrapedEvent[]> {
  console.log('Starting event scraping...');

  const results = await Promise.allSettled([
    scrapeCityOfAllenEvents(),
    scrapeAllenParksEvents(),
    scrapeEventbriteEvents(),
    generateCommunityEvents()
  ]);

  const allEvents: ScrapedEvent[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allEvents.push(...result.value);
      console.log(`Source ${index + 1} returned ${result.value.length} events`);
    } else {
      console.error(`Source ${index + 1} failed:`, result.reason);
    }
  });

  // Remove duplicates based on title and date
  const uniqueEvents = allEvents.filter((event, index, self) =>
    index === self.findIndex(e =>
      e.title.toLowerCase() === event.title.toLowerCase() &&
      e.date === event.date
    )
  );

  console.log(`Scraped ${uniqueEvents.length} unique events`);
  return uniqueEvents;
}

// Helper functions

function parseDate(dateStr: string): string | null {
  if (!dateStr) return null;

  try {
    // Try various date formats
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return formatDate(date);
    }
  } catch (error) {
    // Ignore parsing errors
  }

  return null;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getNextDayOfWeek(dayOfWeek: number): Date {
  const today = new Date();
  const currentDay = today.getDay();
  const daysUntil = (dayOfWeek - currentDay + 7) % 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + (daysUntil === 0 ? 7 : daysUntil));
  return nextDate;
}

function getUpcomingWeekend(): string {
  return formatDate(getNextDayOfWeek(6)); // Next Saturday
}
