'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  DollarSign,
  Navigation,
  Phone,
  PhoneOff,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CATEGORY_CONFIG, type Attraction } from '@/lib/types/database';
import { CATEGORY_ICONS } from '@/components/icons/CategoryIcons';
import NawiReminderBanner from '@/components/mascot/NawiReminderBanner';

interface AttractionCardProps {
  attraction: Attraction;
  index?: number;
}

export default function AttractionCard({ attraction, index = 0 }: AttractionCardProps) {
  const config = CATEGORY_CONFIG[attraction.category];
  const IconComponent = CATEGORY_ICONS[attraction.category];

  // Activities array handling
  const activitiesList: string[] = Array.isArray(attraction.activities)
    ? (attraction.activities as (string | { name: string })[]).map((a) =>
        typeof a === 'string' ? a : a.name
      )
    : [];

  // Determine if published contact is a phone number
  const rawContact = attraction.publishedContact || attraction.contact_number;
  const isPhoneNumber =
    rawContact &&
    rawContact !== 'For verification' &&
    /[0-9]/.test(rawContact);

  return (
    <article
      className="card animate-fade-in-up opacity-0 transition-all duration-300 hover:ring-2 hover:ring-emerald-500/30 flex flex-col justify-between"
      style={{ animationDelay: `${index * 0.07}s`, animationFillMode: 'forwards' }}
      id={`attraction-${attraction.slug}`}
    >
      <div>
        {/* Cover Image & Category Badges */}
        <Link
          href={`/map?attraction=${attraction.slug}`}
          className="relative h-48 block overflow-hidden bg-slate-100 group"
          aria-label={`View ${attraction.name} on map`}
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: attraction.cover_image
                ? `url(${encodeURI(attraction.cover_image)})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badges Top Bar */}
          <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-2">
            {/* Category badge */}
            <div className="badge flex items-center gap-1 bg-white/95 backdrop-blur-md text-slate-800 shadow-xs">
              {IconComponent && <IconComponent size={13} style={{ color: config?.color || '#059669' }} />}
              <span className="text-xs font-semibold">{config?.label || 'Attraction'}</span>
            </div>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold font-[family-name:var(--font-display)] leading-tight text-white drop-shadow-md group-hover:text-emerald-300 transition-colors">
              {attraction.name}
            </h3>
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-4 space-y-3.5">
          {/* Description */}
          {attraction.description && (
            <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">
              {attraction.description}
            </p>
          )}

          {/* Location & Contact Details */}
          <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/80 rounded-xl p-3 border border-slate-200/70">
            {/* Published / Barangay Location */}
            <div className="flex items-start gap-1.5">
              <MapPin size={14} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="font-semibold text-slate-800">Location: </span>
                <span className="text-slate-700">
                  {attraction.publishedLocation || (attraction.barangay ? `Brgy. ${attraction.barangay}, Naujan` : 'Naujan, Oriental Mindoro')}
                </span>
              </div>
            </div>

            {/* Visitor Info & Fees */}
            <div className="flex items-start gap-1.5">
              <Info size={14} className="text-sky-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="font-semibold text-slate-800">Visitor Info: </span>
                <span className="text-slate-700">
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
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="font-semibold text-slate-800">Contact:</span>
              {isPhoneNumber ? (
                <a
                  href={`tel:${rawContact!.replace(/[^\d+]/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-2xs active:scale-95"
                  id={`call-${attraction.slug}`}
                >
                  <Phone size={11} strokeWidth={2.5} />
                  <span>{rawContact}</span>
                </a>
              ) : rawContact === 'For verification' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-200/80 text-slate-600">
                  <PhoneOff size={11} />
                  For verification
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">Contact MTO</span>
              )}

              {/* Admission Pill */}
              {(attraction.admissionStatus || attraction.entrance_fee) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100/70 text-emerald-800 ml-auto">
                  <DollarSign size={11} className="text-emerald-700" />
                  {attraction.admissionStatus || attraction.entrance_fee}
                </span>
              )}
            </div>
          </div>

          {/* Available Activities Chips */}
          {activitiesList.length > 0 && (
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <Sparkles size={11} className="text-emerald-600" />
                <span>Available Activities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
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

          {/* Nawi's Reminder Callout Banner */}
          {attraction.nawiReminder && (
            <div
              className="pt-1 cursor-pointer"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('nawi-select-attraction', { detail: attraction })
                );
              }}
            >
              <NawiReminderBanner
                reminder={attraction.nawiReminder}
                attractionName={attraction.name}
                pose={attraction.nawiPose}
              />
            </div>
          )}

          {/* Official Listing Source Link */}
          {attraction.sourceUrl && (
            <div className="pt-0.5">
              <a
                href={attraction.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                id={`source-${attraction.slug}`}
              >
                <ExternalLink size={12} className="shrink-0" />
                <span>Official Listing (Travel Oriental Mindoro)</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="p-4 pt-1 border-t border-slate-100 mt-2">
        <Link
          href={`/map?attraction=${attraction.slug}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-[0.98]"
          id={`directions-${attraction.slug}`}
        >
          <Navigation size={13} strokeWidth={2.5} />
          <span>Get Directions &amp; Fare Estimate</span>
        </Link>
      </div>
    </article>
  );
}
