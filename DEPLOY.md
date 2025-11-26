# Quick Deploy Guide

Get Allen Insider live in 30 minutes!

## Prerequisites

- GitHub account
- Vercel account (free)
- Supabase account (free)
- SendGrid account (free - 100 emails/day)
- Anthropic account ($5-10 credit)

---

## Step 1: Database Setup (10 minutes)

### Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project → **Name**: `allen-insider`
3. Wait 2 minutes for provisioning
4. Go to **SQL Editor** → New Query
5. Copy/paste content from `supabase/migrations/001_initial_schema.sql`
6. Click **Run**
7. Repeat for `002_add_verification.sql`
8. Go to **Settings** → **API**:
   - Copy `Project URL` → save as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon/public key` → save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role key` → save as `SUPABASE_SERVICE_KEY`

---

## Step 2: Email Setup (5 minutes)

### SendGrid

1. Go to [sendgrid.com](https://sendgrid.com) → Sign up
2. Choose **Free plan** (100 emails/day)
3. Go to **Settings** → **Sender Authentication**
4. Click **Verify Single Sender**
5. Fill in your email → Check inbox → Click verification link
6. Go to **Settings** → **API Keys** → **Create API Key**
7. Name: `Allen Insider Production`
8. Permissions: **Restricted Access** → Enable **Mail Send** (Full Access)
9. Copy API key → save as `SENDGRID_API_KEY`

---

## Step 3: AI Setup (2 minutes)

### Anthropic Claude

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up → Add $5-10 credit
3. Go to **API Keys** → **Create Key**
4. Name: `Allen Insider`
5. Copy key → save as `ANTHROPIC_API_KEY`

---

## Step 4: Deploy to Vercel (10 minutes)

### Push to GitHub

```bash
cd allen-insider
git init
git add .
git commit -m "Initial commit: Allen Insider"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/allen-insider.git
git push -u origin main
```

### Deploy

1. Go to [vercel.com](https://vercel.com) → Sign up/Login
2. Click **Add New** → **Project**
3. Import your `allen-insider` repository
4. Click **Deploy** (don't add env vars yet)
5. Wait for deployment to fail (expected - no env vars)

### Add Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add these variables (use values from Steps 1-3):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
SENDGRID_API_KEY=SG.xxx...
ANTHROPIC_API_KEY=sk-ant-xxx...
NEXT_PUBLIC_SITE_URL=https://allen-insider.vercel.app
SCRAPE_SECRET=generate-random-32-char-string
CRON_SECRET=generate-random-32-char-string
```

3. Click **Redeploy** from **Deployments** tab

---

## Step 5: Test Everything (3 minutes)

### Test Scraper

1. Visit `https://your-site.vercel.app/admin`
2. Click **Run Scraper Now**
3. Should see "✅ Scraping Successful" with 6+ events

### Test Homepage

1. Visit `https://your-site.vercel.app`
2. Should see events grid
3. Click category filters → events update
4. Scroll to bottom → email signup form

### Test Email Signup

1. Enter your email
2. Click **Sign Up Free**
3. Check inbox → Click verification link
4. Should redirect to `/verified` page

### Test Chatbot

1. Click chat widget (bottom-right)
2. Type: "What events are this weekend?"
3. AI should respond with event suggestions

---

## Step 6: Custom Domain (Optional - 5 minutes)

1. Buy domain (e.g., `allen-insider.com`)
2. In Vercel → **Settings** → **Domains**
3. Add your domain
4. Update DNS records as instructed
5. Update `NEXT_PUBLIC_SITE_URL` env variable to your domain

---

## Automation

The scraper runs automatically every day at 6 AM via Vercel Cron Jobs (configured in `vercel.json`).

No additional setup needed!

---

## Monitoring

### Check Scraper Logs

1. Vercel → **Functions** → `/api/cron/scrape-events`
2. View logs to see scraping activity

### Check Database

1. Supabase → **Table Editor** → `events`
2. See all scraped events

### Check Email Stats

1. SendGrid → **Activity**
2. See email delivery rates

---

## Costs

- **Supabase**: Free (500MB database, unlimited API calls)
- **Vercel**: Free (100GB bandwidth, 1000 cron executions/month)
- **SendGrid**: Free (100 emails/day)
- **Anthropic**: ~$2-5/month (chatbot + AI enrichment)

**Total**: ~$5/month for AI, everything else is free!

---

## Troubleshooting

### "No events found"
- Run `/admin` scraper manually
- Check Supabase logs
- Verify `SUPABASE_SERVICE_KEY` is set

### "Email not sending"
- Verify SendGrid sender email is confirmed
- Check `SENDGRID_API_KEY` has "Mail Send" permission

### "Chat not working"
- Add credits to Anthropic account
- Check `ANTHROPIC_API_KEY` is valid

### "Scraper failing"
- Check Vercel function logs
- Verify `SCRAPE_SECRET` matches in env vars

---

## Next Steps

1. Share with 10-20 friends to test
2. Collect feedback
3. Add more event sources to scraper
4. Customize newsletter template
5. Launch to wider Allen community!

---

## Support

- Full setup: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Technical docs: [README.md](README.md)
- Issues: GitHub Issues
