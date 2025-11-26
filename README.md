# Allen Insider

A hyper-local newsletter and events platform for Allen, TX residents. Get curated weekend events delivered to your inbox every Thursday.

## Features

- **Automated Event Scraping** - Daily scraping from multiple Allen, TX sources
- **AI-Powered Curation** - Claude AI categorizes and scores events
- **Email Newsletter** - Weekly digest via SendGrid
- **Interactive Chatbot** - AI assistant for event discovery
- **Mobile-First Design** - Beautiful, responsive UI
- **Email Verification** - Double opt-in for GDPR compliance

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Setup

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete setup instructions including:
- Supabase database configuration
- SendGrid email setup
- Anthropic Claude API
- Deployment to Vercel

## Automated Event System

### How It Works

1. **Daily Scraping** (6 AM daily)
   - Scrapes events from Allen, TX sources
   - City of Allen calendar
   - Allen Parks & Recreation
   - Eventbrite listings
   - Community events

2. **AI Enrichment**
   - Claude AI categorizes events (Music, Food, Sports, etc.)
   - Scores events 1-10 for local appeal
   - Flags featured events

3. **Storage**
   - Events stored in Supabase PostgreSQL
   - Automatic deduplication
   - Tracks scrape history

4. **Display**
   - Homepage shows upcoming events
   - Category filtering
   - Featured event highlights

### Manual Scraping

Visit `/admin` to manually trigger the event scraper:

```
http://localhost:3000/admin
```

### API Endpoints

```bash
# Scrape events (protected)
POST /api/scrape
Authorization: Bearer <SCRAPE_SECRET>

# Get events
GET /api/events?upcoming=true&limit=20

# Cron job endpoint
GET /api/cron/scrape-events
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Email**: SendGrid
- **AI**: Anthropic Claude
- **Scraping**: Axios + Cheerio
- **Deployment**: Vercel
- **Automation**: Vercel Cron Jobs

## Project Structure

```
allen-insider/
├── app/
│   ├── api/
│   │   ├── events/          # Event API endpoints
│   │   ├── chat/            # AI chatbot
│   │   ├── subscribe/       # Email signup
│   │   ├── scrape/          # Event scraper
│   │   └── cron/            # Scheduled tasks
│   ├── admin/               # Admin dashboard
│   ├── verified/            # Email confirmation
│   └── page.tsx             # Homepage
├── components/
│   ├── EventsGrid.tsx       # Events display
│   ├── EventCard.tsx        # Event card
│   └── ChatWidget.tsx       # AI chatbot
├── lib/
│   ├── scrapers/            # Event scrapers
│   ├── supabase.ts          # DB client
│   └── claude.ts            # AI integration
└── supabase/
    └── migrations/          # Database schema
```

## Environment Variables

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Email
SENDGRID_API_KEY=

# AI
ANTHROPIC_API_KEY=

# Security
SCRAPE_SECRET=
CRON_SECRET=
```

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Trigger scraper manually
curl -X POST http://localhost:3000/api/scrape \
  -H "Authorization: Bearer dev-secret-key-12345"
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

The `vercel.json` configuration enables automatic daily scraping via Vercel Cron Jobs.

### Other Platforms

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for alternative deployment options.

## Contributing

This is a local community project. Issues and PRs welcome!

## License

MIT

## Support

- Documentation: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Issues: GitHub Issues
- Email: hello@allen-insider.com
