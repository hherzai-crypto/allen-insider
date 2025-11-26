import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timeString: string | null): string {
  if (!timeString) return 'TBD';
  return timeString;
}

export function isUpcoming(dateString: string): boolean {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
}

export function getWeekendDates(): { start: string; end: string } {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Find this Friday
  const friday = new Date(today);
  friday.setDate(today.getDate() + (5 - dayOfWeek + 7) % 7);

  // Find this Sunday
  const sunday = new Date(friday);
  sunday.setDate(friday.getDate() + 2);

  return {
    start: friday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
}
