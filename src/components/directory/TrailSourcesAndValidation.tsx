'use client';

import React from 'react';
import {
  AlertTriangle,
  ExternalLink,
  BookOpen,
  MapPin,
  ShieldAlert,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';
import {
  TRAIL_REFERENCES,
  VALIDATION_PRIORITY_NOTE,
  type TrailReference,
} from '@/data/naujanTrailData';

export default function TrailSourcesAndValidation() {
  const boardwalkJurisdictionNote =
    'The Boardwalk listing places Batong Dalig in Socorro, although the project centers on Naujan. Confirm municipal jurisdiction and exact map coordinates with the Municipal Tourism Offices of Naujan and Socorro before official publication.';

  return (
    <div
      className="space-y-6 pt-6 border-t border-slate-200/90"
      id="trail-sources-and-validation"
    >
      {/* ── 1. Validation Priority Notice Callout Box ── */}
      <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50/95 via-orange-50/40 to-amber-50/70 p-5 sm:p-6 shadow-xs text-amber-950 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-200/80 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-xs">
            <ShieldAlert size={22} className="text-amber-700" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                Pre-Deployment Checklist
              </span>
              <span className="text-xs font-bold text-amber-700">
                Official Validation Notice
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-[family-name:var(--font-display)] text-amber-950 leading-tight">
              Validation Priority Guidelines
            </h3>
          </div>
        </div>

        {/* Priority Note Body */}
        <p className="text-xs sm:text-sm font-medium text-amber-900 leading-relaxed bg-white/70 rounded-2xl p-3.5 border border-amber-200/80 shadow-2xs">
          <strong>Mandatory Verification: </strong>
          {VALIDATION_PRIORITY_NOTE}
        </p>

        {/* Boardwalk Jurisdiction Check Note */}
        <div className="flex items-start gap-2.5 rounded-2xl bg-amber-100/70 p-3.5 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <MapPin size={16} className="text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-amber-950">
              Boardwalk Jurisdiction Check:{' '}
            </strong>
            <span>{boardwalkJurisdictionNote}</span>
          </div>
        </div>
      </div>

      {/* ── 2. Official Reference Sources ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <BookOpen size={15} />
            </div>
            <h3 className="text-sm sm:text-base font-bold font-[family-name:var(--font-display)] text-slate-900">
              Official Reference Sources &amp; Citations
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            {TRAIL_REFERENCES.length} Documented Sources
          </span>
        </div>

        {/* References Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TRAIL_REFERENCES.map((ref: TrailReference) => {
            // Clean host display
            let host = '';
            try {
              host = new URL(ref.url).hostname.replace('www.', '');
            } catch {
              host = ref.url;
            }

            return (
              <a
                key={ref.id}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-3.5 hover:border-emerald-300 hover:ring-2 hover:ring-emerald-500/20 transition-all duration-200 group flex items-start gap-3 bg-white"
                id={`ref-link-${ref.id}`}
                title={`Open ${ref.title}`}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0 border border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {ref.id}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {ref.title}
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <ExternalLink size={10} className="shrink-0 text-slate-400 group-hover:text-emerald-600" />
                    <span>{host}</span>
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer Attribution Disclaimer */}
        <div className="pt-2 text-center text-[11px] text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Digital Tourism Trail Data • Municipality of Naujan, Oriental Mindoro</span>
          </p>
          <p className="text-[10px] text-slate-400">
            All registered data is maintained in accordance with provincial planning and DOT tourism directories.
          </p>
        </div>
      </div>
    </div>
  );
}
