# Allen Insider - Complete Setup Guide

This guide will walk you through setting up Allen Insider from scratch to deployment.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Testing Locally](#testing-locally)
4. [Adding Content](#adding-content)
5. [Deployment](#deployment)
6. [Automation Setup](#automation-setup)

---

## Prerequisites

### Required Accounts (All Free Tier Available)

- **Supabase** - Database hosting
  - Sign up: https://supabase.com
  - Free tier: Unlimited API requests, 500MB database

- **SendGrid** - Email delivery
  - Sign up: https://sendgrid.com
  - Free tier: 100 emails/day forever

- **Anthropic** - AI chatbot
  - Sign up: https://console.anthropic.com
  - Pay-as-you-go: ~$0.003 per chat message

- **n8n** (Optional) - Automation
  - Cloud: https://n8n.io (free tier)
  - Self-hosted: Docker/VPS

### Required Tools

- Node.js 18+ ([Download](https://nodejs.org))
- Git ([Download](https://git-scm.com))
- Code editor (VS Code recommended)

---

## Backend Setup

### Step 1: Supabase Database

#### 1.1 Create Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in details:
   - Name: `allen-insider`
   - Database Password: (save this!)
   - Region: Choose closest to Allen, TX (US East recommended)
4. Wait 2-3 minutes for project to provision

#### 1.2 Get API Keys

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_KEY` (keep secret!)

#### 1.3 Run Database Migrations

1. In Supabase, go to SQL Editor
2. Click "New Query"
3. Open `supabase/migrations/001_initial_schema.sql` from your project
4. Copy and paste the entire file
5. Click "Run" (bottom-right)
6. Repeat for `002_add_verification.sql`

**Verify:** Check "Table Editor" - you should see 4 tables:
- events
- subscribers
- newsletters
- chat_conversations

---

### Step 2: SendGrid Email

#### 2.1 Create Account

1. Go to https://app.sendgrid.com/signup
2. Complete registration (may require phone verification)
3. Choose "Free" plan (100 emails/day)

#### 2.2 Verify Sender Email

1. Go to Settings → Sender Authentication
2. Click "Get Started" under "Single Sender Verification"
3. Fill in form:
   - From Name: `Allen Insider`
   - From Email: Your email (e.g., `hello@yourdomain.com`)
   - Reply To: Same email
4. Check your email and click verification link
5. **Important:** Wait for "Verified" status (may take 5-10 minutes)

#### 2.3 Create API Key

1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name: `Allen Insider Production`
4. Permissions: "Restricted Access"
   - Enable: **Mail Send** → Full Access
5. Click "Create & View"
6. **COPY THE KEY NOW** (you can't see it again!)
7. Save to `.env.local` as `SENDGRID_API_KEY`

---

### Step 3: Anthropic Claude API

#### 3.1 Get API Key

1. Go to https://console.anthropic.com
2. Sign up/login
3. Go to "API Keys" section
4. Click "Create Key"
5. Name: `Allen Insider`
6. Copy the key (starts with `sk-ant-`)
7. Save to `.env.local` as `ANTHROPIC_API_KEY`

#### 3.2 Add Credits (Optional)

- Anthropic is pay-as-you-go
- Add $5-$10 to start
- Chatbot costs: ~$0.003 per conversation
- Newsletter generation: ~$0.01 per newsletter

---

### Step 4: Configure Environment Variables

#### 4.1 Create `.env.local` File

In your project root:

```bash
copy .env.local.example .env.local
```

#### 4.2 Fill In Values

Open `.env.local` and replace with your actual keys:

```env
# Supabase (from Step 1.2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (different from anon)

# SendGrid (from Step 2.3)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxx

# Anthropic Claude (from Step 3.1)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxx

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# n8n Webhook Security (generate a random string)
N8N_WEBHOOK_SECRET=my-super-secret-webhook-key-123
```

**Security Note:** Never commit `.env.local` to git!

---

## Testing Locally

### Step 1: Install & Run

```bash
npm install
npm run dev
```

Visit http://localhost:3000

### Step 2: Test Email Signup

1. Go to homepage
2. Enter your email in signup form
3. Click "Sign Up Free"
4. **Check your email** for verification link
5. Click link → should redirect to `/verified`

**Troubleshooting:**
- No email? Check SendGrid sender is verified
- Error in console? Check `SENDGRID_API_KEY` is correct
- 401 error? API key doesn't have "Mail Send" permission

### Step 3: Test Events Display

**Currently:** Events grid will show "No events found" because database is empty.

**To test:** Add a sample event via Supabase:

1. Go to Supabase → Table Editor → `events`
2. Click "Insert" → "Insert row"
3. Fill in:
   - title: `Test Event`
   - description: `This is a test event`
   - date: `2025-12-31` (use future date)
   - time: `7:00 PM`
   - location: `Test Venue`
   - category: `Music` (dropdown)
   - cost: `Free`
   - score: `8`
   - featured: `true` (checkbox)
4. Click "Save"
5. Refresh homepage → event should appear!

### Step 4: Test Chatbot

1. Click chat widget (bottom-right corner)
2. Type: "What events are happening?"
3. AI should respond with event recommendations

**Troubleshooting:**
- No response? Check `ANTHROPIC_API_KEY`
- "No events" response? Add events to database first
- API error? Check Anthropic account has credits

---

## Adding Content

### Option 1: Manual Event Entry

Use Supabase Table Editor (see Step 3 above)

**Best for:**
- Testing
- One-off special events
- Small newsletters

### Option 2: Bulk Import (CSV)

1. Create CSV with columns:
   ```
   title,description,date,time,location,category,cost,score,featured
   ```
2. In Supabase Table Editor, click "Import CSV"
3. Upload file

### Option 3: n8n Automation (See Automation Setup below)

**Best for:**
- Daily scraping
- Ongoing automation
- Multiple event sources

---

## Deployment

### Option A: Vercel (Recommended - Free)

#### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/allen-insider.git
git push -u origin main
```

#### 2. Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add all variables from `.env.local`
   - **IMPORTANT:** Change `NEXT_PUBLIC_SITE_URL` to your Vercel URL
6. Click "Deploy"

#### 3. Configure Custom Domain (Optional)

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel project → Settings → Domains
3. Add your domain
4. Update DNS records as instructed
5. Update `NEXT_PUBLIC_SITE_URL` in env variables

### Option B: Manual Server

```bash
# Build
npm run build

# Start
npm start
```

Set up nginx/caddy reverse proxy for HTTPS.

---

## Automation Setup

### n8n Event Scraping Workflow

#### 1. Set Up n8n

**Option A: Cloud (Easiest)**
1. Go to https://n8n.io
2. Sign up for free tier
3. Create new workflow

**Option B: Self-Hosted**
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

#### 2. Import Workflow

1. In n8n, click "New Workflow"
2. Click "..." menu → "Import from File"
3. Select `n8n-workflows/scrape-events.json`
4. Workflow will load with 6 nodes:
   - Schedule Trigger (daily 6 AM)
   - HTTP Request (fetch events)
   - Parse HTML/JSON
   - Claude AI (categorize & score)
   - HTTP Request (POST to webhook)
   - Google Sheets Logger

#### 3. Configure Nodes

**Node 1: HTTP Request**
- URL: `https://www.cityofallen.org/events` (or your source)
- Method: GET

**Node 4: Claude AI**
- API Key: Your Anthropic key
- Prompt: Pre-configured to score events

**Node 5: Webhook**
- URL: `https://yourdomain.com/api/webhooks/n8n`
- Method: POST
- Headers: `Authorization: Bearer {your_N8N_WEBHOOK_SECRET}`

**Node 6: Google Sheets (Optional)**
- For monitoring scraped events

#### 4. Test Workflow

1. Click "Execute Workflow"
2. Check if events appear in Supabase
3. Fix any errors in nodes

#### 5. Activate Schedule

1. Enable the workflow (toggle at top)
2. Scraping will run daily at 6 AM CST

---

### Newsletter Sending Workflow

#### 1. Create New Workflow

Import `n8n-workflows/send-newsletter.json`

#### 2. Schedule

- Trigger: Every Thursday at 2 PM CST
- Queries database for weekend events
- Generates newsletter with Claude
- Sends via SendGrid to all active subscribers

#### 3. Test First!

Before activating:
1. Test with your email only
2. Check formatting
3. Verify unsubscribe link works

---

## Maintenance Tasks

### Weekly

- Review subscriber growth
- Check email deliverability rates
- Monitor SendGrid for bounces

### Monthly

- Clean up old events (30+ days)
- Review top-performing event categories
- Update n8n scrapers if sources change

### As Needed

- Add new event sources
- Update newsletter template
- Respond to subscriber feedback

---

## Common Issues

### "Database connection failed"
- Check Supabase URL and keys
- Verify migrations ran successfully
- Check Supabase project isn't paused (free tier)

### "Email not sending"
- Verify SendGrid sender email
- Check API key permissions
- Look for SendGrid account suspension

### "Events not loading"
- Add events to database first
- Check browser console for errors
- Verify `/api/events` returns data

### "Chat not working"
- Add credits to Anthropic account
- Check API key is valid
- Ensure events exist in database

---

## Next Steps

1. ✅ Complete backend setup
2. ✅ Test subscription flow
3. ✅ Add 10-20 real events manually
4. ✅ Send test newsletter to yourself
5. ✅ Deploy to Vercel
6. ✅ Set up custom domain
7. ✅ Configure n8n automation
8. ✅ Soft launch to 20 friends/family
9. ✅ Collect feedback
10. ✅ Scale to wider audience

---

## Support

- **Documentation:** See [META_PROMPT.md](META_PROMPT.md) for full vision
- **Security:** See [SECURITY.md](SECURITY.md) for security details
- **Issues:** Report bugs on GitHub
- **Email:** hello@allen-insider.com

---

Good luck building your community newsletter! 🎉
