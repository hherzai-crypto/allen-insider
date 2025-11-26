'use client';

import { useState } from 'react';
import { Calendar, MapPin, DollarSign, X, ExternalLink } from 'lucide-react';
import { Event, categoryColors } from '@/lib/types';

export function EventCard({ event }: { event: Event }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      >
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

          <button className="text-primary-teal text-sm font-semibold hover:text-teal-light inline-flex items-center gap-1">
            View Details →
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <div className="flex-1 pr-4">
                <span
                  className="inline-block px-3 py-1 text-xs font-semibold text-white rounded mb-3 cursor-default"
                  style={{ backgroundColor: categoryColors[event.category] || '#6B6B6B' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {event.category}
                </span>
                <h2 className="font-heading font-bold text-2xl text-primary-teal">
                  {event.title}
                </h2>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Event Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-text-primary">
                  <Calendar size={20} className="text-primary-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    {event.time && <p className="text-sm text-text-secondary">{event.time}</p>}
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-start gap-3 text-text-primary">
                    <MapPin size={20} className="text-primary-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{event.location}</p>
                      {event.address && <p className="text-sm text-text-secondary">{event.address}</p>}
                    </div>
                  </div>
                )}

                {event.cost && (
                  <div className="flex items-start gap-3 text-text-primary">
                    <DollarSign size={20} className="text-primary-teal flex-shrink-0 mt-0.5" />
                    <p className="font-semibold">{event.cost}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {event.description && (
                <div>
                  <h3 className="font-heading font-semibold text-lg text-primary-teal mb-2">
                    About This Event
                  </h3>
                  <p className="text-text-primary leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              )}

              {/* Source Attribution */}
              {event.source && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-text-secondary">
                    Source: <span className="font-semibold">{event.source}</span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {event.source_url && (
                  <a
                    href={event.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-primary-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-light transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={18} />
                    Get Tickets / More Info
                  </a>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-xl font-semibold border-2 border-gray-300 text-text-primary hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
