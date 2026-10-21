'use client';

import React from 'react';
import {
  ExternalLink,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import {
  TRAIL_REFERENCES,
  type TrailReference,
} from '@/data/naujanTrailData';

export default function TrailSourcesAndValidation() {
  return (
    <div
      className="space-y-6 pt-6 border-t border-slate-200/90"
      id="trail-sources-and-validation"
    >
      {/* ── Official Reference Sources ── */}
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
