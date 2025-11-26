import { Calendar, MapPin, DollarSign } from 'lucide-react';
import { Event, categoryColors } from '@/lib/types';

export function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      {/* Category Tag */}
      <div className="p-4 pb-0">
        <span
          className="inline-block px-3 py-1 text-xs font-semibold text-white rounded"
          style={{ backgroundColor: categoryColors[event.category] || '#6B6B6B' }}
        >
          {event.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-xl text-primary-teal mb-3">
          {event.title}
        </h3>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar size={16} />
            <span>
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
              {event.time && ` • ${event.time}`}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <MapPin size={16} />
              <span>{event.location}</span>
            </div>
          )}

          {event.cost && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <DollarSign size={16} />
              <span>{event.cost}</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-text-primary leading-relaxed mb-4 line-clamp-3">
            {event.description}
          </p>
        )}

        {event.source_url && (
          <a
            href={event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-teal text-sm font-semibold hover:text-teal-light inline-flex items-center gap-1"
          >
            Learn More →
          </a>
        )}
      </div>
    </div>
  );
}
