'use client';

import React, { useState } from 'react';
import NawiMascot, { type NawiPose, getPoseForAttraction } from '@/components/NawiMascot';
import { Sparkles, ShieldCheck, ArrowRightLeft } from 'lucide-react';

export interface NawiReminderBannerProps {
  reminder?: string | null;
  className?: string;
  variant?: 'emerald' | 'amber';
  pose?: NawiPose;
  attractionName?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * NawiReminderBanner:
 * Full-body "Nawi's Trail Reminder" speech-style callout card.
 *
 * - Never crops Nawi into a small circle.
 * - Renders full-body <NawiMascot pose={attraction.nawiPose} size="md" animate />
 *   standing beside or overlapping the edge of a warm amber/emerald speech-style reminder card.
 * - Features a secondary pose toggle & hover state that dynamically switches Nawi
 *   to `pose="salute"` when hovering over or tapping the safety reminder.
 */
export default function NawiReminderBanner({
  reminder,
  className = '',
  variant = 'emerald',
  pose,
  attractionName,
  size = 'md',
}: NawiReminderBannerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaluteToggled, setIsSaluteToggled] = useState(false);

  if (!reminder) return null;

  const isAmber = variant === 'amber';
  // Base pose derived from destination or explicit prop
  const activePose: NawiPose =
    pose || (attractionName ? getPoseForAttraction(attractionName) : 'salute');

  // Secondary pose switch: turns to "salute" on hover or toggle
  const isSaluting = isHovered || isSaluteToggled;
  const currentPose: NawiPose = isSaluting ? 'salute' : activePose;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group rounded-2xl border transition-all duration-300 relative overflow-visible ${
        isAmber
          ? 'bg-gradient-to-br from-amber-50/95 via-orange-50/40 to-amber-50/90 border-amber-300/90 text-amber-950 shadow-xs hover:border-amber-400 hover:shadow-sm'
          : 'bg-gradient-to-br from-emerald-50/95 via-teal-50/40 to-emerald-50/90 border-emerald-300/90 text-emerald-950 shadow-xs hover:border-emerald-400 hover:shadow-sm'
      } pt-4 pb-3.5 px-3.5 sm:px-4 mt-5 cursor-default ${className}`}
      id="nawi-reminder-banner"
      role="region"
      aria-label="Nawi's Trail Reminder"
    >
      {/* Speech notch pointer pointing towards Nawi */}
      <div
        className="absolute -top-2 left-6 w-0 h-0 hidden sm:block pointer-events-none"
        style={{
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderBottom: isAmber ? '8px solid #fcd34d' : '8px solid #6ee7b7',
        }}
      />

      <div className="flex items-start gap-3 sm:gap-4">
        {/* Full-Body Nawi Mascot overlapping top/left edge (NEVER CROPPED) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsSaluteToggled((prev) => !prev);
          }}
          className="shrink-0 -mt-8 -ml-2 sm:-ml-3 relative z-10 cursor-pointer"
          title={isSaluting ? 'Saluting! (Tap to switch back)' : 'Tap to salute!'}
        >
          <NawiMascot
            pose={currentPose}
            size={size}
            animate={true}
            removeWhiteBg={true}
            className="drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />

          {/* Quick pose indicator badge */}
          <div
            className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase shadow-xs flex items-center gap-0.5 transition-colors ${
              isSaluting
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-white/90 text-slate-700 border border-slate-200'
            }`}
          >
            {isSaluting ? (
              <span>🫡 Salute</span>
            ) : (
              <>
                <ArrowRightLeft size={8} />
                <span>Hover</span>
              </>
            )}
          </div>
        </div>

        {/* Reminder Speech Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <h4
                className={`text-xs font-extrabold uppercase tracking-wider font-[family-name:var(--font-display)] flex items-center gap-1 ${
                  isAmber ? 'text-amber-900' : 'text-emerald-900'
                }`}
              >
                <Sparkles size={13} className={isAmber ? 'text-amber-600' : 'text-emerald-600'} />
                Nawi&apos;s Trail Reminder
              </h4>
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  isAmber
                    ? 'bg-amber-200/80 text-amber-900'
                    : 'bg-emerald-200/80 text-emerald-900'
                }`}
              >
                <ShieldCheck size={10} />
                Safety &amp; Etiquette
              </span>
            </div>

            {/* Hover tip badge */}
            <span className="text-[10px] text-slate-500 font-semibold hidden sm:inline">
              {isSaluting ? '🫡 Scout salute active' : 'Hover for salute'}
            </span>
          </div>

          <p className="text-xs font-medium text-slate-800 leading-relaxed">
            &ldquo;{reminder}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
