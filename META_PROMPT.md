# META PROMPT: Allen Insider - Hyper-Local Newsletter Platform

## Project Context & Vision

Allen Insider is a **hyper-local weekly newsletter** that serves residents of Allen, Texas by curating and delivering the best local events happening each weekend. The goal is to solve the "What's happening this weekend?" problem by becoming the single trusted source for community events.

This is a **community-building passion project** sponsored by 4Ever Young (a medical spa opening in Allen, June 2026) as a way to establish brand presence and goodwill before the business launches. The philosophy: "Build community before building business."

---

## Core Problem Statement

**Problem:** Allen, TX residents don't have a centralized, curated source for local weekend events. Information is scattered across Facebook groups, city websites, venue calendars, and word-of-mouth.

**Solution:** A weekly email newsletter (sent every Thursday at 4 PM) featuring 8-12 hand-picked events for the upcoming weekend, with an AI-powered chatbot for personalized recommendations.

**Target Audience:**
- Young families (30-45 years old)
- New Allen residents seeking community connection
- Active locals who want to support local businesses
- People who prefer curated content over endless scrolling

---

## User Journey & Experience

### 1. Discovery Phase (Website)
- User visits allen-insider.com
- Sees hero section explaining the value proposition
- Views sample events (current weekend's highlights)
- Learns about the newsletter schedule (Thursdays at 4 PM)
- Reads "About" section explaining the 4Ever Young sponsorship
- Signs up with email address

### 2. Verification Phase (Email Security)
- User receives verification email within 60 seconds
- Email contains branded header, clear CTA button, and 24-hour expiry notice
- User clicks "Confirm My Subscription" button
- Redirects to success page confirming active subscription

### 3. Weekly Engagement (Newsletter)
- Every Thursday at 4 PM, user receives curated newsletter
- Newsletter contains:
  - Personal greeting from founder (Hamid)
  - 8-12 events for Friday-Sunday
  - Each event includes: title, date/time, location, category, cost, description
  - Events are scored/ranked by relevance and appeal
  - Visual hierarchy (featured events highlighted)
  - One-click unsubscribe link (legal requirement)

### 4. On-Demand Interaction (Chatbot)
- User visits website between newsletters
- Uses AI chatbot to ask: "What's happening this Saturday?" or "Any family-friendly events?"
- Chatbot queries event database and provides personalized recommendations
- Responses are conversational, helpful, and Allen-specific

---

## Business Logic & Rules

### Event Curation Strategy
1. **Automated Scraping:** Use n8n workflows to scrape events from:
   - City of Allen official calendar
   - Local venue websites (Allen Event Center, TopGolf, etc.)
   - Facebook events tagged in Allen
   - Eventbrite listings for Allen zip code (75013, 75002)

2. **AI Scoring:** Each event receives a 1-10 score based on:
   - Relevance to families and young professionals
   - Uniqueness/novelty (prioritize one-time events over recurring)
   - Community impact (local businesses > chains)
   - Accessibility (free/low-cost events ranked higher)
   - User engagement history (opens, clicks on similar events)

3. **Manual Review:** Founder reviews top 20 scored events and selects final 8-12 for newsletter

4. **Categories:** Music, Food, Family, Sports, Arts, Shopping, Fitness, Entertainment

### Newsletter Cadence
- **Send Time:** Every Thursday at 4:00 PM CST
- **Frequency:** Weekly (52 newsletters per year)
- **Scope:** Events from Friday-Sunday of the current week
- **Blackout Dates:** None (consistent schedule builds habit)

### Growth Strategy
1. **Month 1-3:** Organic growth through word-of-mouth, local Facebook groups
2. **Month 4-6:** Partnerships with local businesses (cross-promotion)
3. **Month 7-12:** Paid social ads targeting Allen zip codes
4. **Goal:** 5,000 active subscribers by June 2026 (4Ever Young opening)

---

## Technical Requirements & Architecture

### Frontend Experience
**Website (Public-Facing):**
- **Homepage:**
  - Hero section with email signup form
  - Live feed of upcoming events (pulled from database)
  - Category filters (Music, Food, Family, etc.)
  - "About" section explaining mission and sponsorship
  - Subscribe CTA section
  - Footer with unsubscribe and privacy policy links

- **Responsive Design:**
  - Mobile-first approach (60%+ of traffic expected on mobile)
  - Fast load times (<2 seconds)
  - Accessible (WCAG AA compliance)

- **AI Chat Widget:**
  - Floating button in bottom-right corner
  - Opens conversational interface
  - Uses LLM to understand natural language queries
  - Returns event recommendations from database
  - Maintains conversation context

**Email Templates:**
- Branded header with Allen Insider logo
- Clean, scannable layout (avoid image-heavy designs for deliverability)
- Each event in a card format: title, emoji icon, date, location, 2-sentence description
- Featured event highlighted at top
- Unsubscribe link in footer (legal requirement)
- Mobile-responsive HTML

### Backend Architecture

**Database Schema:**
1. **Events Table:**
   - Basic info: title, description, date, time, end_date, location, address
   - Metadata: category, source, source_url, image_url, cost
   - Scoring: score (1-10), featured (boolean)
   - Tracking: scraped_at, created_at

2. **Subscribers Table:**
   - Contact: email, phone (optional)
   - Status: pending, active, unsubscribed, bounced
   - Security: verification_token, unsubscribe_token
   - Analytics: email_opens, email_clicks, last_email_sent
   - Source tracking: source (website, referral, etc.)

3. **Newsletters Table:**
   - Content: subject, content (HTML), send_date
   - Status: draft, scheduled, sent
   - Analytics: recipients_count, open_rate, click_rate

4. **Chat Conversations Table:**
   - Interaction: user_id, message, response
   - Recommendations: events_recommended (JSON array)
   - Timestamp: created_at

**API Endpoints:**

1. **POST /api/subscribe**
   - Accepts: { email, source }
   - Validates email format
   - Checks for duplicates
   - Generates verification token (24-hour expiry)
   - Creates subscriber with status='pending'
   - Sends verification email
   - Rate limited: 3 attempts per IP per hour
   - Honeypot bot protection

2. **GET /api/verify?token={uuid}**
   - Validates verification token
   - Checks expiry (24 hours)
   - Updates subscriber status to 'active'
   - Clears verification token
   - Redirects to success page

3. **GET /api/unsubscribe?token={uuid}**
   - Validates unsubscribe token
   - Updates subscriber status to 'unsubscribed'
   - Redirects to confirmation page
   - One-click (no login required) - CAN-SPAM compliant

4. **GET /api/events**
   - Query params: category, date_start, date_end, featured
   - Returns paginated event list
   - Filters by upcoming dates only
   - Sorted by score (desc) then date (asc)

5. **GET /api/events/featured**
   - Returns top 3-5 featured events for homepage
   - Cached for 1 hour

6. **POST /api/chat**
   - Accepts: { message, conversation_id }
   - Sends message to LLM with system prompt
   - LLM queries event database based on user intent
   - Returns: { response, events_recommended }
   - Logs conversation for analytics

7. **POST /api/webhooks/n8n**
   - Authenticated with Bearer token (webhook secret)
   - Accepts: array of event objects
   - Validates schema (category, date, title required)
   - Checks for duplicates (title + date + location)
   - Inserts new events or updates existing
   - Returns: { success, inserted, updated }

**Automation Workflows (n8n):**

1. **Event Scraping Workflow:**
   - Trigger: Daily at 6:00 AM CST
   - Steps:
     1. HTTP Request to City of Allen events API
     2. Parse JSON/HTML response
     3. Extract: title, date, location, description, category
     4. Use LLM to:
        - Categorize event (if category missing)
        - Generate 2-sentence summary
        - Score event (1-10 based on relevance)
        - Extract structured data from unstructured text
     5. POST to /api/webhooks/n8n
     6. Log results to Google Sheets (for monitoring)

2. **Newsletter Generation Workflow:**
   - Trigger: Every Thursday at 2:00 PM CST
   - Steps:
     1. Query database: events for Friday-Sunday, score >= 6
     2. Fetch top 12 events (sorted by score)
     3. Use LLM to generate newsletter intro (personalized greeting)
     4. Build HTML email from template
     5. Fetch active subscribers (status='active')
     6. Send batch emails (via SendGrid API)
     7. Log newsletter to database (status='sent')
     8. Track send count and timestamp

3. **Cleanup Workflow:**
   - Trigger: Daily at 2:00 AM CST
   - Steps:
     1. Delete events older than 30 days
     2. Remove expired verification tokens
     3. Update bounced subscribers (status='bounced')
     4. Archive old newsletters

**External Integrations:**

1. **Email Service (SendGrid):**
   - Send verification emails
   - Send weekly newsletters (batch sending)
   - Track opens and clicks (pixel tracking)
   - Handle bounces and spam reports
   - Maintain sender reputation

2. **LLM API (Claude/OpenAI):**
   - Chatbot conversations
   - Event categorization and scoring
   - Newsletter intro generation
   - Sentiment analysis on feedback

3. **Database (Supabase/PostgreSQL):**
   - Row-level security (RLS) policies
   - Real-time subscriptions (for chat)
   - Automatic backups
   - Connection pooling

---

## Security & Compliance

### Data Protection
- **Honeypot Fields:** Hidden form fields to catch bots
- **Rate Limiting:** Max 3 signups per IP per hour (prevent abuse)
- **Email Verification:** Double opt-in (GDPR compliant)
- **Unique Tokens:** UUID-based verification and unsubscribe tokens
- **Input Validation:** Zod schema validation on all API inputs
- **SQL Injection Prevention:** Use parameterized queries/ORM
- **XSS Prevention:** Sanitize all user inputs

### Legal Compliance
1. **CAN-SPAM Act (US Law):**
   - Include physical address in email footer
   - Provide one-click unsubscribe
   - Honor unsubscribe requests within 10 days
   - No deceptive subject lines
   - Identify message as advertisement (not applicable here)

2. **GDPR (if targeting EU residents):**
   - Explicit consent (double opt-in)
   - Right to access data
   - Right to deletion
   - Right to data portability
   - Privacy policy explaining data usage

3. **Security Headers:**
   - X-Frame-Options: DENY (prevent clickjacking)
   - Strict-Transport-Security (force HTTPS)
   - Content-Security-Policy (XSS protection)
   - X-Content-Type-Options: nosniff

### Monitoring & Logging
- Log all subscription events (timestamp, IP, source)
- Track email delivery rates (sent, delivered, opened, clicked)
- Monitor API error rates
- Alert on suspicious activity (rate limit hits, bot attempts)
- Weekly analytics report (subscriber growth, engagement rates)

---

## Success Metrics

### Phase 1 (Months 1-3): Validation
- **Goal:** 250 active subscribers
- **Metric:** >35% email open rate
- **Metric:** >5% click-through rate
- **Validation:** At least 10 positive replies/testimonials

### Phase 2 (Months 4-6): Growth
- **Goal:** 1,000 active subscribers
- **Metric:** <5% unsubscribe rate
- **Metric:** 20+ weekly chatbot conversations
- **Metric:** 1+ local business partnership (cross-promotion)

### Phase 3 (Months 7-12): Scale
- **Goal:** 5,000 active subscribers by 4Ever Young opening
- **Metric:** Featured in local media (Allen American, Community Impact)
- **Metric:** 50+ events curated per month
- **Metric:** 85%+ email deliverability rate

### North Star Metric
**"Active engaged subscribers"** = subscribers who opened at least 3 of the last 5 newsletters

---

## Content Strategy

### Newsletter Voice & Tone
- **Friendly and Local:** "Hey Allen!" not "Dear Subscriber"
- **Personal Touch:** Written by Hamid (founder), not a faceless brand
- **Conversational:** "Here's what's happening this weekend" not "Upcoming events:"
- **Enthusiastic but Not Salesy:** Genuine excitement for community, not promotional
- **Inclusive:** "Whether you're new to Allen or been here for years..."

### Event Descriptions
- **2 sentences max per event**
- **Answer:** What is it? Why should I care?
- **Example:** "TopGolf is hosting a family game night with half-price food and games. Great way to get the kids active without breaking the bank."

### Newsletter Structure (Template)
```
Subject: This Weekend in Allen: [Theme] 🎉

---

Hey Allen!

[Personal intro - 2-3 sentences about the weekend theme or seasonal note]

Here's what's happening this Friday-Sunday:

🎵 FEATURED: [Top Event]
[Image]
[Description - 2 sentences]
[Date, Time, Location]
[Free/Cost]
[Learn More button]

---

🎨 MORE EVENTS:

[Event 2 - same format]
[Event 3]
[Event 4]
...

---

💬 What are you doing this weekend? Reply and let me know!

See you out there,
Hamid
Your Allen Insider

---

P.S. Allen Insider is brought to you by 4Ever Young, a medical spa opening in Allen in June 2026. We believe in building community before building business.

[Unsubscribe] | [Privacy Policy]
© 2026 Allen Insider • Made in Allen, TX
```

---

## Future Enhancements (Post-MVP)

1. **User Preferences:**
   - Allow subscribers to choose favorite categories
   - Personalized newsletters based on interests
   - Preferred frequency (weekly, biweekly)

2. **Community Features:**
   - "Submit an Event" form (user-generated content)
   - Photo gallery of past events (Instagram integration)
   - Testimonials section (social proof)

3. **Monetization (Optional):**
   - Sponsored event listings ($50/event)
   - Premium tier ($5/month) with exclusive invites
   - Local business directory ($20/month per listing)

4. **Mobile App:**
   - Push notifications for last-minute events
   - In-app RSVP tracking
   - Share events to social media

5. **Analytics Dashboard:**
   - Subscriber growth chart
   - Most popular event categories
   - Geographic heatmap (which neighborhoods engage most)
   - A/B testing for newsletter subject lines

---

## Key Design Principles

1. **Simplicity Over Features:** Do one thing exceptionally well (curated events) rather than many things poorly
2. **Trust Through Consistency:** Same day, same time, same quality every week
3. **Human, Not Robotic:** Personal voice, founder-led, community-focused
4. **Mobile-First:** Most users will read on phones while commuting or relaxing
5. **Privacy-Respecting:** Only collect email, no tracking pixels (unless user opts in)
6. **Locally Rooted:** This is FOR Allen residents BY someone who lives in Allen
7. **Value Before Promotion:** Provide 10x value before mentioning 4Ever Young

---

## Anti-Patterns to Avoid

❌ **Don't:** Send more than once per week (respect inbox)
❌ **Don't:** Include clickbait or misleading subject lines
❌ **Don't:** Prioritize chain restaurants/events over local businesses
❌ **Don't:** Make it hard to unsubscribe (kills trust)
❌ **Don't:** Sell or share email list (ever)
❌ **Don't:** Use aggressive sales language for 4Ever Young
❌ **Don't:** Automate without human review (AI assists, human decides)

---

## Open Questions for Implementation

1. **Scraping Ethics:** Should we ask venues for permission before scraping their calendars?
2. **Event Submission:** Allow public submissions from day 1, or wait until we have moderation bandwidth?
3. **Sponsorship Disclosure:** How prominently should 4Ever Young be mentioned? (Footer only, or in intro too?)
4. **Geographic Scope:** Strictly Allen city limits, or include neighboring cities like McKinney/Plano?
5. **Accessibility:** Should we offer a text-only version of the newsletter?

---

## Success Looks Like...

6 months from now:
- A Thursday afternoon ritual for 1,000+ Allen residents
- Local businesses asking to partner with us
- New residents discovering Allen through our recommendations
- Hamid recognized at events: "You're the Allen Insider guy!"
- 4Ever Young associated with community goodwill before doors open

**Ultimate Vision:** When someone moves to Allen and asks "What should I do this weekend?", the answer is always: "Check Allen Insider."

---

*This is a community service first, marketing vehicle second. The newsletter only works if it genuinely helps people discover their city.*
