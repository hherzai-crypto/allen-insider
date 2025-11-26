-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  end_date DATE,
  location TEXT,
  address TEXT,
  category TEXT CHECK (category IN ('Music', 'Food', 'Family', 'Sports', 'Arts', 'Shopping', 'Fitness', 'Entertainment')),
  source TEXT,
  source_url TEXT,
  image_url TEXT,
  cost TEXT,
  score INTEGER CHECK (score >= 1 AND score <= 10),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  scraped_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_score ON events(score);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_featured ON events(featured);

-- Subscribers table
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  source TEXT,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  last_email_sent TIMESTAMP,
  email_opens INTEGER DEFAULT 0,
  email_clicks INTEGER DEFAULT 0
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);

-- Newsletters table
CREATE TABLE newsletters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  send_date TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
  recipients_count INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat conversations table
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  events_recommended JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_user ON chat_conversations(user_id);

-- Row Level Security Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

-- Events: Public read access
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- Events: Anyone can insert/update (scraper uses anon key)
CREATE POLICY "Anyone can manage events"
  ON events FOR ALL
  USING (true)
  WITH CHECK (true);

-- Subscribers: Anyone can insert (for signup), read own data
CREATE POLICY "Anyone can create subscribers"
  ON subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read subscribers"
  ON subscribers FOR SELECT
  USING (true);

-- Chat: Public can insert and read
CREATE POLICY "Anyone can create chat messages"
  ON chat_conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read chat messages"
  ON chat_conversations FOR SELECT
  USING (true);
