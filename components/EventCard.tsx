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
        className="group relative bg-white rounded-2xl border-2 border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary-teal/10 hover:-translate-y-2 hover:border-primary-teal/30 cursor-pointer"
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-teal/0 to-teal-light/0 group-hover:from-primary-teal/5 group-hover:to-teal-light/5 transition-all duration-300" />

        {/* Featured badge */}
        {event.featured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-secondary-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              FEATURED
            </div>
          </div>
        )}

        {/* Category Tag */}
        <div className="relative p-5 pb-0">
          <span
            className="inline-block px-4 py-1.5 text-xs font-bold text-white rounded-lg shadow-md"
            style={{ backgroundColor: categoryColors[event.category] || '#6B6B6B' }}
          >
            {event.category}
          </span>
        </div>

        {/* Content */}
        <div className="relative p-6 pt-4">
          <h3 className="font-heading font-bold text-xl lg:text-2xl text-primary-teal mb-4 group-hover:text-teal-light transition-colors">
            {event.title}
          </h3>

          <div className="space-y-2.5 mb-4">
            <div className="flex items-center gap-2.5 text-sm text-text-secondary">
              <div className="flex-shrink-0 w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                <Calendar size={16} className="text-primary-teal" />
              </div>
              <span className="font-medium">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
                {event.time && ` • ${event.time}`}
              </span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                  <MapPin size={16} className="text-primary-teal" />
                </div>
                <span className="font-medium truncate">{event.location}</span>
              </div>
            )}

            {event.cost && (
              <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                  <DollarSign size={16} className="text-primary-teal" />
                </div>
                <span className="font-semibold text-primary-teal">{event.cost}</span>
              </div>
            )}
          </div>

          {event.description && (
            <p className="text-sm text-text-primary leading-relaxed mb-5 line-clamp-3">
              {event.description}
            </p>
          )}

          <button className="inline-flex items-center gap-2 text-primary-teal text-sm font-bold group-hover:gap-3 transition-all">
            <span>View Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-start">
              <div className="flex-1 pr-2 sm:pr-4">
                <span
                  className="inline-block px-3 py-1 text-xs font-semibold text-white rounded mb-3 cursor-default"
                  style={{ backgroundColor: categoryColors[event.category] || '#6B6B6B' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {event.category}
                </span>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-primary-teal">
                  {event.title}
                </h2>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-2 -mr-2 sm:mr-0 sm:p-0"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Event Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-text-primary">
                  <Calendar size={20} className="text-primary-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">
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
                      <p className="font-semibold text-sm sm:text-base">{event.location}</p>
                      {event.address && <p className="text-sm text-text-secondary">{event.address}</p>}
                    </div>
                  </div>
                )}

                {event.cost && (
                  <div className="flex items-start gap-3 text-text-primary">
                    <DollarSign size={20} className="text-primary-teal flex-shrink-0 mt-0.5" />
                    <p className="font-semibold text-sm sm:text-base">{event.cost}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {event.description && (
                <div>
                  <h3 className="font-heading font-semibold text-base sm:text-lg text-primary-teal mb-2">
                    About This Event
                  </h3>
                  <p className="text-text-primary text-sm sm:text-base leading-relaxed whitespace-pre-line">
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
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {event.source_url && (
                  <a
                    href={event.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-primary-teal text-white px-6 py-4 sm:py-3 rounded-xl font-semibold hover:bg-teal-light transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <ExternalLink size={18} />
                    Get Tickets / More Info
                  </a>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-4 sm:py-3 rounded-xl font-semibold border-2 border-gray-300 text-text-primary hover:bg-gray-50 transition-colors text-sm sm:text-base"
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
