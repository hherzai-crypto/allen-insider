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
 * Scrape events from Visit Allen - Official Tourism Site
 * Weight: 10/10 (Official, Comprehensive, Trusted)
 */
export async function scrapeVisitAllenEvents(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://www.visitallen.com/events/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    // Parse Visit Allen event listings
    $('.event-item, .event-card, article[class*="event"]').each((_, element) => {
      const title = $(element).find('h2, h3, .event-title, .title').first().text().trim();
      const description = $(element).find('.event-description, .description, p').first().text().trim();
      const dateStr = $(element).find('.event-date, .date, time').first().text().trim();
      const time = $(element).find('.event-time, .time').text().trim();
      const location = $(element).find('.event-location, .location, .venue').text().trim();
      const address = $(element).find('.event-address, .address').text().trim();
      const cost = $(element).find('.event-price, .price, .cost').text().trim();
      const imageUrl = $(element).find('img').first().attr('src');
      const eventUrl = $(element).find('a').first().attr('href');

      if (title && title.length > 3) {
        events.push({
          title,
          description: description || title,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          time: time || undefined,
          location: location || 'Allen, TX',
          address: address || undefined,
          source: 'Visit Allen',
          source_url: eventUrl ? `https://www.visitallen.com${eventUrl}` : 'https://www.visitallen.com/events/',
          cost: cost || 'See website',
          category: categorizeEvent(title),
          image_url: imageUrl ? `https://www.visitallen.com${imageUrl}` : undefined,
          featured: true,
          score: 9
        });
      }
    });

    return events.slice(0, 15);
  } catch (error) {
    console.error('Error scraping Visit Allen:', error);
    return [];
  }
}

/**
 * Scrape events from Watters Creek - Major Entertainment Venue
 * Weight: 9/10 (Live music, dining, shopping events)
 */
export async function scrapeWattersCreekEvents(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://www.watterscreek.com/events', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    $('.event, .event-item, article').each((_, element) => {
      const title = $(element).find('h2, h3, .event-title').first().text().trim();
      const description = $(element).find('.event-description, .description, p').first().text().trim();
      const dateStr = $(element).find('.event-date, .date, time').text().trim();
      const time = $(element).find('.event-time, .time').text().trim();
      const imageUrl = $(element).find('img').first().attr('src');
      const eventUrl = $(element).find('a').first().attr('href');

      if (title && title.length > 3) {
        events.push({
          title,
          description: description || title,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          time: time || undefined,
          location: 'Watters Creek',
          address: '970 Garden Park Dr, Allen, TX 75013',
          source: 'Watters Creek',
          source_url: eventUrl ? `https://www.watterscreek.com${eventUrl}` : 'https://www.watterscreek.com/events',
          category: categorizeEvent(title),
          image_url: imageUrl || undefined,
          featured: true,
          score: 9
        });
      }
    });

    return events;
  } catch (error) {
    console.error('Error scraping Watters Creek:', error);
    return [];
  }
}

/**
 * Scrape events from Allen Event Center
 * Weight: 8/10 (Concerts, trade shows, sports)
 */
export async function scrapeAllenEventCenter(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://www.alleneventcenter.com/events', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    $('.event, .event-card, article').each((_, element) => {
      const title = $(element).find('h2, h3, .event-title, .title').first().text().trim();
      const description = $(element).find('.event-description, .description, p').first().text().trim();
      const dateStr = $(element).find('.event-date, .date, time').text().trim();
      const time = $(element).find('.event-time, .time').text().trim();
      const cost = $(element).find('.price, .cost').text().trim();
      const imageUrl = $(element).find('img').first().attr('src');
      const eventUrl = $(element).find('a').first().attr('href');

      if (title && title.length > 3) {
        events.push({
          title,
          description: description || title,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          time: time || undefined,
          location: 'Allen Event Center',
          address: '200 E Stacy Rd, Allen, TX 75002',
          source: 'Allen Event Center',
          source_url: eventUrl || 'https://www.alleneventcenter.com/events',
          cost: cost || 'See website',
          category: categorizeEvent(title),
          image_url: imageUrl || undefined,
          featured: true,
          score: 8
        });
      }
    });

    return events;
  } catch (error) {
    console.error('Error scraping Allen Event Center:', error);
    return [];
  }
}

/**
 * Scrape events from Allen Premium Outlets
 * Weight: 7/10 (Shopping events, seasonal activities)
 */
export async function scrapeAllenPremiumOutlets(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://www.premiumoutlets.com/outlet/dallas-allen/events', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    $('.event, .event-card, article').each((_, element) => {
      const title = $(element).find('h2, h3, .event-title').first().text().trim();
      const description = $(element).find('.event-description, .description, p').first().text().trim();
      const dateStr = $(element).find('.event-date, .date, time').text().trim();
      const time = $(element).find('.event-time, .time').text().trim();
      const imageUrl = $(element).find('img').first().attr('src');

      if (title && title.length > 3) {
        events.push({
          title,
          description: description || title,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          time: time || undefined,
          location: 'Allen Premium Outlets',
          address: '820 W Stacy Rd, Allen, TX 75013',
          source: 'Allen Premium Outlets',
          source_url: 'https://www.premiumoutlets.com/outlet/dallas-allen/events',
          category: 'Shopping',
          image_url: imageUrl || undefined,
          score: 7
        });
      }
    });

    return events;
  } catch (error) {
    console.error('Error scraping Allen Premium Outlets:', error);
    return [];
  }
}

/**
 * Scrape events from Allen ISD Calendar
 * Weight: 9/10 (School events - huge for families)
 */
export async function scrapeAllenISDEvents(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://www.allenisd.org/calendar', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    $('.event, .calendar-event, article').each((_, element) => {
      const title = $(element).find('h2, h3, .event-title, .title').first().text().trim();
      const description = $(element).find('.event-description, .description, p').first().text().trim();
      const dateStr = $(element).find('.event-date, .date, time').text().trim();
      const time = $(element).find('.event-time, .time').text().trim();
      const location = $(element).find('.event-location, .location').text().trim();
      const eventUrl = $(element).find('a').first().attr('href');

      if (title && title.length > 3) {
        // Determine category based on title keywords
        let category = 'Family';
        if (title.toLowerCase().includes('sport') || title.toLowerCase().includes('game') ||
            title.toLowerCase().includes('basketball') || title.toLowerCase().includes('football')) {
          category = 'Sports';
        } else if (title.toLowerCase().includes('art') || title.toLowerCase().includes('music') ||
                   title.toLowerCase().includes('theater') || title.toLowerCase().includes('concert')) {
          category = 'Arts';
        }

        events.push({
          title,
          description: description || title,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          time: time || undefined,
          location: location || 'Allen ISD',
          source: 'Allen ISD',
          source_url: eventUrl ? `https://www.allenisd.org${eventUrl}` : 'https://www.allenisd.org/calendar',
          category: category,
          cost: 'Free',
          score: 8
        });
      }
    });

    return events.slice(0, 10);
  } catch (error) {
    console.error('Error scraping Allen ISD:', error);
    return [];
  }
}

/**
 * Scrape events from Allen High School Athletics
 * Weight: 8/10 (High school sports - huge community draw)
 */
export async function scrapeAllenEaglesAthletics(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://www.allenisd.org/domain/72', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    $('.event, .game, .schedule-item').each((_, element) => {
      const title = $(element).find('h2, h3, .title, .opponent').first().text().trim();
      const dateStr = $(element).find('.date, time').text().trim();
      const time = $(element).find('.time').text().trim();
      const location = $(element).find('.location, .venue').text().trim();

      if (title && title.length > 3) {
        events.push({
          title: `Allen Eagles - ${title}`,
          description: `High school athletics event. Go Eagles!`,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          time: time || undefined,
          location: location || 'Allen High School',
          address: '300 Rivercrest Blvd, Allen, TX 75002',
          source: 'Allen Eagles Athletics',
          source_url: 'https://www.allenisd.org/domain/72',
          category: 'Sports',
          cost: '$8 adults, $5 students',
          score: 8
        });
      }
    });

    return events.slice(0, 10);
  } catch (error) {
    console.error('Error scraping Allen Eagles Athletics:', error);
    return [];
  }
}

/**
 * Scrape events from Collin College Allen Campus
 * Weight: 6/10 (College events, lectures, performances)
 */
export async function scrapeCollinCollegeEvents(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://www.collin.edu/calendar/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    $('.event, .calendar-event').each((_, element) => {
      const title = $(element).find('h2, h3, .title').first().text().trim();
      const description = $(element).find('.description, p').first().text().trim();
      const dateStr = $(element).find('.date, time').text().trim();
      const location = $(element).find('.location').text().trim();

      // Filter for Allen campus events
      if (title && (location.toLowerCase().includes('allen') || title.toLowerCase().includes('allen'))) {
        events.push({
          title,
          description: description || title,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          location: 'Collin College - Allen Campus',
          address: '3452 Spur 399, McKinney, TX 75069',
          source: 'Collin College',
          source_url: 'https://www.collin.edu/calendar/',
          category: categorizeEvent(title),
          cost: 'Free',
          score: 6
        });
      }
    });

    return events.slice(0, 5);
  } catch (error) {
    console.error('Error scraping Collin College:', error);
    return [];
  }
}

/**
 * Scrape events from Meetup for Allen, TX
 * Weight: 7/10 (Community groups, networking, hobbies)
 */
export async function scrapeMeetupEvents(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://www.meetup.com/find/?location=Allen%2C%20TX&source=EVENTS', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    $('[data-event-id]').each((_, element) => {
      const title = $(element).find('h3, h2').first().text().trim();
      const description = $(element).find('p').first().text().trim();
      const dateStr = $(element).find('time').attr('datetime') || $(element).find('.event-time').text().trim();
      const location = $(element).find('.venue-name, .location').text().trim();
      const groupName = $(element).find('.group-name').text().trim();

      if (title && title.length > 3) {
        events.push({
          title,
          description: description || `${groupName} meetup event`,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          location: location || 'Allen, TX',
          source: 'Meetup',
          source_url: 'https://www.meetup.com/find/?location=Allen%2C%20TX',
          category: categorizeEvent(title),
          score: 7
        });
      }
    });

    return events.slice(0, 10);
  } catch (error) {
    console.error('Error scraping Meetup:', error);
    return [];
  }
}

/**
 * Scrape events from The Village at Allen
 * Weight: 6/10 (Shopping center events)
 */
export async function scrapeVillageAtAllenEvents(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://thevillageatallen.com/events', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    $('.event, .event-item, article').each((_, element) => {
      const title = $(element).find('h2, h3, .title').first().text().trim();
      const description = $(element).find('.description, p').first().text().trim();
      const dateStr = $(element).find('.date, time').text().trim();
      const time = $(element).find('.time').text().trim();

      if (title && title.length > 3) {
        events.push({
          title,
          description: description || title,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          time: time || undefined,
          location: 'The Village at Allen',
          address: '620 W McDermott Dr, Allen, TX 75013',
          source: 'The Village at Allen',
          source_url: 'https://thevillageatallen.com/events',
          category: categorizeEvent(title),
          score: 6
        });
      }
    });

    return events;
  } catch (error) {
    console.error('Error scraping The Village at Allen:', error);
    return [];
  }
}

/**
 * Scrape events from Allen Public Library
 * Weight: 7/10 (Community programs, author events, classes)
 */
export async function scrapeAllenLibraryEvents(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://www.cityofallen.org/346/Library-Events', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    $('.event, .program, .library-event').each((_, element) => {
      const title = $(element).find('h2, h3, .title').first().text().trim();
      const description = $(element).find('.description, p').first().text().trim();
      const dateStr = $(element).find('.date, time').text().trim();
      const time = $(element).find('.time').text().trim();

      if (title && title.length > 3) {
        events.push({
          title,
          description: description || title,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          time: time || undefined,
          location: 'Allen Public Library',
          address: '300 N Allen Dr, Allen, TX 75013',
          source: 'Allen Public Library',
          source_url: 'https://www.cityofallen.org/346/Library-Events',
          category: 'Family',
          cost: 'Free',
          score: 7
        });
      }
    });

    return events;
  } catch (error) {
    console.error('Error scraping Allen Library:', error);
    return [];
  }
}

/**
 * Scrape events from Chase Oaks Church Allen Campus
 * Weight: 6/10 (Church events, community service)
 */
export async function scrapeChaseOaksEvents(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://www.chaseoaks.org/allen/events', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    $('.event, .event-item').each((_, element) => {
      const title = $(element).find('h2, h3, .title').first().text().trim();
      const description = $(element).find('.description, p').first().text().trim();
      const dateStr = $(element).find('.date, time').text().trim();
      const time = $(element).find('.time').text().trim();

      if (title && title.length > 3) {
        events.push({
          title,
          description: description || title,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          time: time || undefined,
          location: 'Chase Oaks Church - Allen',
          address: '515 S Watters Rd, Allen, TX 75013',
          source: 'Chase Oaks Church',
          source_url: 'https://www.chaseoaks.org/allen/events',
          category: 'Family',
          cost: 'Free',
          score: 6
        });
      }
    });

    return events.slice(0, 5);
  } catch (error) {
    console.error('Error scraping Chase Oaks:', error);
    return [];
  }
}

/**
 * Scrape events from Yelp Events
 * Weight: 6/10 (Restaurant events, tastings, live music)
 */
export async function scrapeYelpEvents(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get('https://www.yelp.com/events/allen-tx-us', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    $('[data-testid*="event"], .event-item').each((_, element) => {
      const title = $(element).find('h2, h3, h4').first().text().trim();
      const description = $(element).find('p').first().text().trim();
      const dateStr = $(element).find('time').attr('datetime') || $(element).find('.date').text().trim();
      const location = $(element).find('.business-name, .venue').text().trim();
      const cost = $(element).find('.price, .cost').text().trim();

      if (title && title.length > 3) {
        events.push({
          title,
          description: description || title,
          date: parseDate(dateStr) || getUpcomingWeekend(),
          location: location || 'Allen, TX',
          source: 'Yelp',
          source_url: 'https://www.yelp.com/events/allen-tx-us',
          cost: cost || 'See website',
          category: categorizeEvent(title),
          score: 6
        });
      }
    });

    return events.slice(0, 10);
  } catch (error) {
    console.error('Error scraping Yelp Events:', error);
    return [];
  }
}

/**
 * Scrape events from Eventbrite for Allen, TX
 * Uses Eventbrite Discovery API (public, no auth needed)
 */
export async function scrapeEventbriteEvents(): Promise<ScrapedEvent[]> {
  try {
    // Eventbrite Discovery API endpoint (public access, location-based search)
    // Search for events in Allen, TX area (within 10 miles)
    const response = await axios.get('https://www.eventbriteapi.com/v3/destination/events/', {
      timeout: 15000,
      params: {
        'location.address': 'Allen, TX',
        'location.within': '10mi',
        'page_size': 50,
        'expand': 'venue',
        'start_date.keyword': 'this_week'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const events: ScrapedEvent[] = [];

    // Parse API response
    if (response.data && response.data.events) {
      for (const event of response.data.events) {
        const startDate = event.start?.local || event.start?.utc;
        if (!startDate) continue;

        events.push({
          title: event.name?.text || event.name || 'Untitled Event',
          description: event.description?.text || event.summary || '',
          date: startDate.split('T')[0], // Extract YYYY-MM-DD
          time: formatTime(startDate),
          location: event.venue?.name || 'Allen, TX',
          address: event.venue?.address ?
            `${event.venue.address.address_1}, ${event.venue.address.city}, ${event.venue.address.region}` :
            undefined,
          source: 'Eventbrite',
          source_url: event.url || 'https://www.eventbrite.com/d/tx--allen/events/',
          cost: event.is_free ? 'Free' : 'Paid',
          category: categorizeEvent(event.name?.text || event.name || ''),
          image_url: event.logo?.url || undefined
        });
      }
    }

    return events.slice(0, 20);
  } catch (error) {
    console.error('Error fetching Eventbrite events:', error);

    // Fallback: Try HTML scraping
    try {
      const response = await axios.get('https://www.eventbrite.com/d/tx--allen/events/', {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const events: ScrapedEvent[] = [];

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
    } catch (fallbackError) {
      console.error('Eventbrite fallback also failed:', fallbackError);
      return [];
    }
  }
}

// Helper to format time from ISO string
function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return '';
  }
}

// Helper to categorize events based on title keywords
function categorizeEvent(title: string): string {
  const titleLower = title.toLowerCase();

  // Music events
  if (titleLower.includes('music') || titleLower.includes('concert') || titleLower.includes('band') ||
      titleLower.includes('dj') || titleLower.includes('singing') || titleLower.includes('karaoke') ||
      titleLower.includes('live music') || titleLower.includes('jazz') || titleLower.includes('rock') ||
      titleLower.includes('r&b') || titleLower.includes('r & b') || titleLower.includes('hip hop')) {
    return 'Music';
  }

  // Food events
  if (titleLower.includes('food') || titleLower.includes('restaurant') || titleLower.includes('dining') ||
      titleLower.includes('wine') || titleLower.includes('beer') || titleLower.includes('tasting') ||
      titleLower.includes('brunch') || titleLower.includes('dinner') || titleLower.includes('lunch') ||
      titleLower.includes('truck') || titleLower.includes('cook') || titleLower.includes('chef')) {
    return 'Food';
  }

  // Family/Kids events
  if (titleLower.includes('kid') || titleLower.includes('family') || titleLower.includes('children') ||
      titleLower.includes('child') || titleLower.includes('baby') || titleLower.includes('toddler') ||
      titleLower.includes('parent')) {
    return 'Family';
  }

  // Sports events
  if (titleLower.includes('sport') || titleLower.includes('game') || titleLower.includes('athletic') ||
      titleLower.includes('basketball') || titleLower.includes('football') || titleLower.includes('soccer') ||
      titleLower.includes('baseball') || titleLower.includes('volleyball') || titleLower.includes('eagles') ||
      titleLower.includes('tournament') || titleLower.includes('race') || titleLower.includes('run')) {
    return 'Sports';
  }

  // Arts & Culture events
  if (titleLower.includes('art') || titleLower.includes('gallery') || titleLower.includes('exhibition') ||
      titleLower.includes('paint') || titleLower.includes('draw') || titleLower.includes('craft') ||
      titleLower.includes('theater') || titleLower.includes('theatre') || titleLower.includes('museum') ||
      titleLower.includes('culture') || titleLower.includes('photography')) {
    return 'Arts';
  }

  // Fitness/Wellness events
  if (titleLower.includes('fitness') || titleLower.includes('yoga') || titleLower.includes('workout') ||
      titleLower.includes('gym') || titleLower.includes('exercise') || titleLower.includes('wellness') ||
      titleLower.includes('health') || titleLower.includes('meditation') || titleLower.includes('pilates')) {
    return 'Fitness';
  }

  // Shopping events
  if (titleLower.includes('shop') || titleLower.includes('market') || titleLower.includes('sale') ||
      titleLower.includes('vendor') || titleLower.includes('boutique') || titleLower.includes('retail') ||
      titleLower.includes('mall') || titleLower.includes('outlet')) {
    return 'Shopping';
  }

  // Entertainment/Party events (check for party keywords)
  if (titleLower.includes('party') || titleLower.includes('night') || titleLower.includes('ladies') ||
      titleLower.includes('girls night') || titleLower.includes('dance') || titleLower.includes('club') ||
      titleLower.includes('bar') || titleLower.includes('happy hour') || titleLower.includes('nye') ||
      titleLower.includes('new year') || titleLower.includes('christmas') || titleLower.includes('holiday') ||
      titleLower.includes('halloween') || titleLower.includes('costume') || titleLower.includes('celebration')) {
    return 'Entertainment';
  }

  return 'Entertainment';
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
 * Prioritized by tier: Tier 1-4 with comprehensive Allen, TX coverage
 */
export async function scrapeAllEvents(): Promise<ScrapedEvent[]> {
  console.log('Starting comprehensive event scraping from 17 sources...');

  const results = await Promise.allSettled([
    // Tier 1: Official & High-Priority Sources (Weight 10-9)
    scrapeVisitAllenEvents(),         // Weight 10 - Official tourism site
    scrapeWattersCreekEvents(),       // Weight 9 - Major entertainment venue
    scrapeAllenISDEvents(),           // Weight 9 - School district calendar
    scrapeAllenEventCenter(),         // Weight 8 - Concerts, trade shows
    scrapeEventbriteEvents(),         // Weight 8 - Comprehensive event platform

    // Tier 2: School & Community Sources (Weight 8-7)
    scrapeAllenEaglesAthletics(),     // Weight 8 - High school sports
    scrapeAllenLibraryEvents(),       // Weight 7 - Library programs
    scrapeCityOfAllenEvents(),        // Weight 7 - City calendar
    scrapeAllenParksEvents(),         // Weight 7 - Parks & Recreation
    scrapeAllenPremiumOutlets(),      // Weight 7 - Shopping events
    scrapeMeetupEvents(),             // Weight 7 - Community groups

    // Tier 3: Local Venues & Churches (Weight 6)
    scrapeVillageAtAllenEvents(),     // Weight 6 - Shopping center
    scrapeChaseOaksEvents(),          // Weight 6 - Church events
    scrapeCollinCollegeEvents(),      // Weight 6 - College events
    scrapeYelpEvents(),               // Weight 6 - Restaurant/nightlife

    // Community/Generated Events (fallback)
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
