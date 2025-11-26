export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string; // YYYY-MM-DD format
  time: string | null;
  end_date: string | null;
  location: string | null;
  address: string | null;
  category: EventCategory;
  source: string | null;
  source_url: string | null;
  image_url: string | null;
  cost: string | null;
  score: number | null;
  featured: boolean;
  created_at: string;
  scraped_at: string;
}

export type EventCategory =
  | 'Music'
  | 'Food'
  | 'Family'
  | 'Sports'
  | 'Arts'
  | 'Shopping'
  | 'Fitness'
  | 'Entertainment';

export interface Subscriber {
  id: string;
  email: string;
  phone: string | null;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string | null;
  subscribed_at: string;
  last_email_sent: string | null;
  email_opens: number;
  email_clicks: number;
}

export interface Newsletter {
  id: string;
  subject: string;
  content: string;
  send_date: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients_count: number;
  open_rate: number | null;
  click_rate: number | null;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatConversation {
  id: string;
  user_id: string | null;
  message: string;
  response: string;
  events_recommended: Event[] | null;
  created_at: string;
}

export const categoryColors: Record<EventCategory, string> = {
  Music: '#9B59B6',
  Sports: '#E74C3C',
  Food: '#F39C12',
  Family: '#3498DB',
  Entertainment: '#1ABC9C',
  Arts: '#E91E63',
  Shopping: '#FF6B6B',
  Fitness: '#27AE60',
};
