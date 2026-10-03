'use client';

import Link from 'next/link';
import { MapPin, Clock, DollarSign, Navigation } from 'lucide-react';
import { CATEGORY_CONFIG, type Attraction } from '@/lib/types/database';
import { CATEGORY_ICONS } from '@/components/icons/CategoryIcons';

interface AttractionCardProps {
  attraction: Attraction;
  index?: number;
}

export default function AttractionCard({ attraction, index = 0 }: AttractionCardProps) {
  const config = CATEGORY_CONFIG[attraction.category];
  const IconComponent = CATEGORY_ICONS[attraction.category];

  return (
    <Link
      href={`/map?attraction=${attraction.slug}`}
      className="block"
      id={`attraction-${attraction.slug}`}
    >
      <article
        className={`card animate-fade-in-up opacity-0 cursor-pointer hover:ring-2 hover:ring-emerald-500/30 transition-all duration-300`}
        style={{ animationDelay: `${index * 0.07}s`, animationFillMode: 'forwards' }}
      >
        {/* Cover Image */}
        <div className="relative h-44 overflow-hidden bg-slate-100">
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
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />


          {/* Category badge */}
          <div
            className="absolute top-3 right-3 badge flex items-center gap-1 bg-white/90 backdrop-blur-sm text-slate-800 shadow-xs"
          >
            {IconComponent && <IconComponent size={13} style={{ color: config.color }} />}
            <span className="text-xs font-semibold">{config.label}</span>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold font-[family-name:var(--font-display)] leading-tight text-white drop-shadow-lg">
              {attraction.name}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Description */}
          <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">
            {attraction.description}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            {attraction.barangay && (
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-emerald-600" />
                Brgy. {attraction.barangay}
              </span>
            )}
            <span className="flex items-center gap-1">
              <DollarSign size={12} className="text-amber-600" />
              {attraction.entrance_fee}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-sky-600" />
              {attraction.opening_hours}
            </span>
          </div>

          {/* View on Map CTA */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 pt-1">
            <Navigation size={12} />
            <span>Get Directions &amp; Fare Estimate</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
