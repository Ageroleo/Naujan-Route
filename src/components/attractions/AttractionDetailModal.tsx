'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  MapPin,
  Info,
  Phone,
  PhoneOff,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  DollarSign,
  Navigation,
} from 'lucide-react';
import { CATEGORY_CONFIG, type Attraction } from '@/lib/types/database';
import { CATEGORY_ICONS } from '@/components/icons/CategoryIcons';
import NawiReminderBanner from '@/components/mascot/NawiReminderBanner';

interface AttractionDetailModalProps {
  attraction: Attraction | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AttractionDetailModal({
  attraction,
  isOpen,
  onClose,
}: AttractionDetailModalProps) {
  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !attraction) return null;

  const config = CATEGORY_CONFIG[attraction.category];
  const IconComponent = CATEGORY_ICONS[attraction.category];

  const activitiesList: string[] = Array.isArray(attraction.activities)
    ? (attraction.activities as (string | { name: string })[]).map((a) =>
        typeof a === 'string' ? a : a.name
      )
    : [];

  const rawContact = attraction.publishedContact || attraction.contact_number;
  const isPhoneNumber =
    rawContact &&
    rawContact !== 'For verification' &&
    /[0-9]/.test(rawContact);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-attraction-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90dvh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header / Cover Image */}
        <div className="relative h-56 sm:h-64 shrink-0 overflow-hidden bg-slate-100">
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100"
            style={{
              backgroundImage: attraction.cover_image
                ? `url(${encodeURI(attraction.cover_image)})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Category Badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <div className="badge flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-slate-800 shadow-sm">
              {IconComponent && <IconComponent size={13} style={{ color: config?.color || '#059669' }} />}
              <span className="text-xs font-semibold">{config?.label || 'Attraction'}</span>
            </div>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2
              id="modal-attraction-title"
              className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-display)] leading-tight text-white drop-shadow-md"
            >
              {attraction.name}
            </h2>
            <p className="text-xs text-white/90 mt-1 flex items-center gap-1">
              <MapPin size={12} className="text-emerald-400 shrink-0" />
              <span>{attraction.publishedLocation || `Brgy. ${attraction.barangay}, Naujan`}</span>
            </p>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Description */}
          {attraction.description && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                About this Destination
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {attraction.description}
              </p>
            </div>
          )}

          {/* Location & Visitor Info Card */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2.5 text-xs">
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Published Location: </span>
                <span>{attraction.publishedLocation || (attraction.barangay ? `Brgy. ${attraction.barangay}, Naujan` : 'Naujan')}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-700">
              <Info size={15} className="text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Visitor Info: </span>
                <span>
                  {attraction.visitorInfo || (
                    <>
                      <span>{attraction.admissionStatus || attraction.entrance_fee}</span>
                      {attraction.opening_hours && ` • ${attraction.opening_hours}`}
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Contact row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
              <span className="font-semibold text-slate-900">Official Contact:</span>
              {isPhoneNumber ? (
                <a
                  href={`tel:${rawContact!.replace(/[^\d+]/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-2xs"
                >
                  <Phone size={12} strokeWidth={2.5} />
                  <span>{rawContact}</span>
                </a>
              ) : rawContact === 'For verification' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-600">
                  <PhoneOff size={12} />
                  For verification
                </span>
              ) : (
                <span className="text-xs text-slate-500">Contact Municipal Tourism Office</span>
              )}

              {(attraction.admissionStatus || attraction.entrance_fee) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 ml-auto">
                  <DollarSign size={12} className="text-emerald-700" />
                  {attraction.admissionStatus || attraction.entrance_fee}
                </span>
              )}
            </div>
          </div>

          {/* Available Activities Chips */}
          {activitiesList.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles size={13} className="text-emerald-600" />
                Available Activities
              </h4>
              <div className="flex flex-wrap gap-2">
                {activitiesList.map((activity, idx) => (
                  <span
                    key={idx}
                    className="rounded-full px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition-colors shadow-2xs"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nawi's Reminder Callout Card */}
          {attraction.nawiReminder && (
            <NawiReminderBanner
              reminder={attraction.nawiReminder}
              attractionName={attraction.name}
              pose={attraction.nawiPose}
            />
          )}

          {/* Official Listing Source Link */}
          {attraction.sourceUrl && (
            <div className="pt-1">
              <a
                href={attraction.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                <ExternalLink size={13} className="shrink-0" />
                <span>Official Listing (Travel Oriental Mindoro)</span>
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/60 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <Link
            href={`/map?attraction=${attraction.slug}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Navigation size={13} strokeWidth={2.5} />
            <span>View on Map &amp; Routes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
