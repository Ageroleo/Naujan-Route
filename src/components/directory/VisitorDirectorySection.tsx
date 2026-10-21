'use client';

import { useState, useMemo } from 'react';
import {
  Building2,
  Landmark,
  Compass,
  Phone,
  MapPin,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  Share2,
} from 'lucide-react';
import {
  GOVERNMENT_TOURISM_OFFICES,
  TRAVEL_AGENCIES,
  type TourismOffice,
  type TravelAgency,
} from '@/data/naujanTrailData';
import NawiTipCard from '@/components/mascot/NawiTipCard';
import NawiMascot from '@/components/NawiMascot';
import TrailSourcesAndValidation from './TrailSourcesAndValidation';

export default function VisitorDirectorySection() {
  const [filterMode, setFilterMode] = useState<'all' | 'naujan'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Total counts
  const totalAgencies = TRAVEL_AGENCIES.length;
  const localNaujanCount = TRAVEL_AGENCIES.filter((a) => a.isLocalNaujan).length;

  // Filter and search logic for travel agencies
  const filteredAgencies = useMemo(() => {
    let result = [...TRAVEL_AGENCIES];

    // Filter by locality toggle
    if (filterMode === 'naujan') {
      result = result.filter((agency) => agency.isLocalNaujan);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (agency) =>
          agency.agency.toLowerCase().includes(q) ||
          agency.publishedLocation.toLowerCase().includes(q)
      );
    }

    // Ensure Naujan-local agencies are sorted to the top
    result.sort((a, b) => {
      if (a.isLocalNaujan && !b.isLocalNaujan) return -1;
      if (!a.isLocalNaujan && b.isLocalNaujan) return 1;
      return a.agency.localeCompare(b.agency);
    });

    return result;
  }, [filterMode, searchQuery]);

  return (
    <section className="space-y-10" id="visitor-directory">
      {/* ── Section Title & Intro with Full-Body Nawi (pose="phone") ── */}
      <div className="card p-5 sm:p-6 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-center md:items-start justify-between gap-5">
        <div className="space-y-2 flex-1 min-w-0 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <Compass size={13} className="text-emerald-700" />
            Plan Your Visit
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-[family-name:var(--font-display)] tracking-tight text-slate-900">
            Visitor &amp; Tourism Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Official contact points for destination verification, authorized trail guides, municipal regulations, and accredited Oriental Mindoro travel agencies. Always confirm rates, guides, and operating hours prior to traveling.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-2xs">
              <Phone size={11} />
              Tap to call direct
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              <ShieldCheck size={11} />
              Municipal Validation Priority
            </span>
          </div>
        </div>

        {/* Full-Body Nawi holding smartphone with speech bubble */}
        <div className="shrink-0 flex flex-col items-center">
          <NawiMascot
            pose="phone"
            size="lg"
            animate={true}
            removeWhiteBg={true}
            speechBubble="Need a local guide, boat operator, or destination confirmation? Reach out to our tourism offices and accredited travel agencies below!"
            className="drop-shadow-md"
          />
        </div>
      </div>

      {/* ── Part 1: Government Tourism Offices (Table 3A) ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Landmark size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-[family-name:var(--font-display)]">
                Government Tourism Offices
              </h3>
              <p className="text-xs text-slate-500">
                Municipal &amp; Provincial agencies providing official guidance and travel advisories
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 self-start sm:self-auto border border-slate-200">
            3 Active Offices
          </span>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {GOVERNMENT_TOURISM_OFFICES.map((office: TourismOffice) => {
            const isNaujanMTO = office.id === 'mto-naujan';

            return (
              <article
                key={office.id}
                className={`card p-5 flex flex-col justify-between transition-all duration-300 ${
                  isNaujanMTO
                    ? 'border-emerald-500/60 ring-2 ring-emerald-500/10 shadow-sm bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30'
                    : 'bg-white'
                }`}
                id={`office-${office.id}`}
              >
                <div className="space-y-3.5">
                  {/* Top Bar with Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isNaujanMTO
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Building2 size={12} />
                      {isNaujanMTO ? 'Host Municipality' : 'Regional Tourism'}
                    </span>
                  </div>

                  {/* Office Name */}
                  <h4 className="text-base font-bold font-[family-name:var(--font-display)] text-slate-900 leading-snug">
                    {office.office}
                  </h4>

                  {/* Location */}
                  <div className="flex items-start gap-1.5 text-xs text-slate-600">
                    <MapPin size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{office.location}</span>
                  </div>

                  {/* Purpose Badge */}
                  <div className="pt-0.5">
                    <div className="inline-flex items-start gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed">
                      <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 font-semibold">Purpose: </strong>
                        {office.purpose}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Published Contacts */}
                <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Published Contact
                  </p>

                  {isNaujanMTO ? (
                    <div className="space-y-2">
                      <a
                        href={office.facebookUrl || 'https://www.facebook.com/NaujanTourism'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/60 hover:from-blue-100 hover:to-indigo-100/80 border border-blue-200/90 text-xs text-blue-950 transition-all duration-200 group shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
                        id="naujan-mto-facebook-link"
                        title="Visit Naujan Tourism Official Facebook Page"
                      >
                        <span className="font-bold flex items-center gap-2 text-blue-900 group-hover:text-blue-950">
                          <ExternalLink size={14} className="text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
                          <span>facebook.com/NaujanTourism</span>
                        </span>
                        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-200/70 group-hover:bg-blue-600 group-hover:text-white px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1">
                          Official Page ↗
                        </span>
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {office.publishedContact.map((phone, idx) => (
                        <a
                          key={idx}
                          href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs active:scale-95"
                          id={`call-office-${office.id}-${idx}`}
                        >
                          <Phone size={12} strokeWidth={2.5} />
                          <span>{phone}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ── Mascot Advisory Banner ── */}
      <NawiTipCard message="Planning an itinerary or renting a private van? Booking with local accredited agencies ensures verified drivers, standard provincial rates, and authentic Naujan trail experiences!" />

      {/* ── Part 2: Accredited Travel Agencies (Table 3B) ── */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Compass size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-[family-name:var(--font-display)]">
                Accredited Travel Agencies &amp; Tour Operators
              </h3>
              <p className="text-xs text-slate-500">
                Licensed tour operators in Naujan and Oriental Mindoro
              </p>
            </div>
          </div>

          {/* Quick Locality Filter Toggle */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                filterMode === 'all'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="filter-all-agencies"
            >
              All Oriental Mindoro ({totalAgencies})
            </button>
            <button
              onClick={() => setFilterMode('naujan')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                filterMode === 'naujan'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="filter-naujan-agencies"
            >
              <Sparkles size={12} />
              Naujan Local ({localNaujanCount})
            </button>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agencies by name or location (e.g. Tigkan, Calapan, Bonifacio)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
            id="agency-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Agencies Grid */}
        {filteredAgencies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredAgencies.map((agency: TravelAgency) => {
              const isNaujan = agency.isLocalNaujan;

              return (
                <article
                  key={agency.id}
                  className={`card p-4 flex flex-col justify-between transition-all duration-300 ${
                    isNaujan
                      ? 'border-2 border-emerald-500 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 shadow-md ring-2 ring-emerald-500/10'
                      : 'bg-white'
                  }`}
                  id={`agency-${agency.id}`}
                >
                  <div className="space-y-2.5">
                    {/* Badge */}
                    <div className="flex items-center justify-between gap-1">
                      {isNaujan ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow-2xs">
                          <CheckCircle2 size={11} />
                          Based in Naujan
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          Oriental Mindoro
                        </span>
                      )}
                    </div>

                    {/* Agency Name */}
                    <h4
                      className={`text-sm font-bold leading-snug font-[family-name:var(--font-display)] ${
                        isNaujan ? 'text-emerald-950 font-extrabold' : 'text-slate-900'
                      }`}
                    >
                      {agency.agency}
                    </h4>

                    {/* Nawi Thumbs-up Endorsement for R and A Travel */}
                    {isNaujan && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-100/90 border border-emerald-300 text-emerald-950 shadow-2xs">
                        <div className="shrink-0 -my-1">
                          <NawiMascot
                            pose="thumbs-up"
                            size="sm"
                            animate={true}
                            removeWhiteBg={true}
                            className="w-11 h-11"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                            Nawi&apos;s Local Choice 👍
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-900 leading-tight block">
                            Primary verified Naujan operator
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    <div className="flex items-start gap-1.5 text-xs text-slate-600">
                      <MapPin
                        size={13}
                        className={`shrink-0 mt-0.5 ${
                          isNaujan ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                      <span className="line-clamp-2">{agency.publishedLocation}</span>
                    </div>
                  </div>

                  {/* Tap-to-Call Contact Chips */}
                  <div className="pt-3 mt-3 border-t border-slate-100 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Tap to Call
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {agency.publishedContacts.map((contact, idx) => (
                        <a
                          key={idx}
                          href={`tel:${contact.replace(/[^\d+]/g, '')}`}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shadow-2xs active:scale-95 ${
                            isNaujan
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-300'
                          }`}
                          id={`call-agency-${agency.id}-${idx}`}
                          title={`Call ${agency.agency}: ${contact}`}
                        >
                          <Phone size={11} strokeWidth={2} />
                          <span>{contact}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="card p-8 text-center space-y-2 bg-slate-50">
            <p className="text-sm font-bold text-slate-700">No agencies match your search</p>
            <p className="text-xs text-slate-500">
              Try adjusting your query or resetting to &quot;All Oriental Mindoro&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterMode('all');
              }}
              className="mt-2 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ── Official Trail Sources & Validation Priority Guidelines ── */}
      <TrailSourcesAndValidation />
    </section>
  );
}
