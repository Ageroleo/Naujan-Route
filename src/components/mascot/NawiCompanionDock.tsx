'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import NawiMascot, { type NawiPose, getPoseForAttraction } from '@/components/NawiMascot';
import {
  NAUJAN_ATTRACTIONS,
  type TrailAttraction,
} from '@/data/naujanTrailData';
import {
  X,
  Sparkles,
} from 'lucide-react';

interface NawiMessage {
  id: string;
  category: string;
  title: string;
  text: string;
  pose: NawiPose;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const DEFAULT_MESSAGES: NawiMessage[] = [
  {
    id: 'welcome',
    category: 'Trail Buddy',
    title: 'Mabuhay from Naujan!',
    text: "I'm Nawi, your Naujan field guide! Tap me anytime to discover trail tips, safety reminders, and scenic spots.",
    pose: 'salute',
  },
  {
    id: 'naujan-lake',
    category: 'Scenic Trail',
    title: 'Naujan Lake',
    text: 'Enjoy walking or cycling along scenic Naujan Lake. Always wear a life jacket when boating and stay on designated paths!',
    pose: 'lakeside',
  },
  {
    id: 'simbahang-bato',
    category: 'Heritage Ruin',
    title: 'Simbahang Bato',
    text: 'A sacred 17th-century church ruin in Bancuro. Admission is free—please maintain solemnity and preserve the historic ruins.',
    pose: 'sunset',
  },
  {
    id: '333-steps',
    category: 'Viewpoint Trail',
    title: '333 Steps',
    text: '333 stairs to a scenic viewpoint and altar in Melgar A! Bring drinking water and wear comfortable walking shoes.',
    pose: 'walking',
  },
  {
    id: 'arangin-falls',
    category: 'Nature Adventure',
    title: 'Arangin Falls',
    text: 'Mountain trekking and cool river wading in Brgy. Arangin! Always hire an accredited local guide and check weather advisories.',
    pose: 'map',
  },
  {
    id: 'montelago',
    category: 'Hot Springs',
    title: 'Montelago Hot Springs',
    text: 'Natural mineral thermal springs averaging 38–42°C. Stay hydrated, take breaks, and limit soaking to 15–20 minutes at a time.',
    pose: 'coconut',
  },
  {
    id: 'plaza',
    category: 'Town Center',
    title: 'Naujan Town Plaza',
    text: "Also known as Liwasang Bonifacio. Keep our surroundings clean and practice 'Leave No Trace' across Naujan!",
    pose: 'walking',
  },
  {
    id: 'emergency',
    category: 'Emergency Hotline',
    title: 'Need Help in Naujan?',
    text: 'Naujan Police: (043) 289-2088 • Naujan District Hospital: (043) 289-2134 • National Hotline: 911.',
    pose: 'phone',
  },
  {
    id: 'local-tours',
    category: 'Accredited Tours',
    title: 'R & A Travel and Tours',
    text: 'Based in Tigkan, Naujan (0917-827-0870), they organize authentic guided trails and transport across Naujan.',
    pose: 'thumbs-up',
  },
  {
    id: 'eco-conservation',
    category: 'Eco-Protection',
    title: 'Protect Philippine Ducks',
    text: 'Naujan Lake is a national sanctuary for vulnerable Philippine ducks. Keep plastics out of waterways and protect nature!',
    pose: 'lakeside',
  },
];

export default function NawiCompanionDock() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);
  const [activeCustomMessage, setActiveCustomMessage] = useState<NawiMessage | null>(null);
  const [isBouncing, setIsBouncing] = useState(false);

  // Combined messages pool
  const messages = DEFAULT_MESSAGES;

  const currentMsg: NawiMessage = activeCustomMessage || messages[currentIndex];
  const currentPose: NawiPose = currentMsg.pose || 'salute';

  // Advance to next tip
  const handleNextTip = useCallback(() => {
    setActiveCustomMessage(null);
    setCurrentIndex((prev) => (prev + 1) % messages.length);
    setIsBubbleOpen(true);

    // Trigger bounce
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 300);
  }, [messages.length]);

  // Mascot click handler
  const handleMascotClick = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 300);

    if (!isBubbleOpen) {
      setIsBubbleOpen(true);
    } else {
      // If already open, cycle to the next tip
      handleNextTip();
    }
  };

  // Close bubble handler
  const handleCloseBubble = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBubbleOpen(false);
  };

  // Listen for global attraction selection events
  useEffect(() => {
    const handleAttractionSelect = (e: CustomEvent<TrailAttraction | { name: string; nawiReminder?: string }>) => {
      if (!e.detail) return;
      const match = NAUJAN_ATTRACTIONS.find(
        (a) => a.name.toLowerCase() === e.detail.name.toLowerCase() || a.id === (e.detail as any).id
      );

      const reminderText = match ? match.nawiReminder : (e.detail.nawiReminder || 'Enjoy your visit and travel safely!');
      const attrName = match ? match.name : e.detail.name;
      const pose = match ? (match.nawiPose || getPoseForAttraction(match.name)) : getPoseForAttraction(attrName);

      setActiveCustomMessage({
        id: `attraction-${Date.now()}`,
        category: 'Trail Destination',
        title: attrName,
        text: reminderText,
        pose,
      });

      setIsBubbleOpen(true);
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 300);
    };

    window.addEventListener('nawi-select-attraction' as any, handleAttractionSelect as any);
    return () => {
      window.removeEventListener('nawi-select-attraction' as any, handleAttractionSelect as any);
    };
  }, []);

  return (
    <aside
      aria-label="Nawi Mascot Companion"
      className="fixed bottom-20 md:bottom-6 left-1 sm:left-3 z-40 flex items-end justify-start gap-1.5 sm:gap-2 pointer-events-none select-none max-w-[calc(100vw-0.5rem)]"
      id="nawi-companion-dock"
    >
      {/* ── Floating Nawi Mascot Trigger (On the Left Edge) ── */}
      <div className="pointer-events-auto relative group shrink-0">
        {/* Shadow underneath */}
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-12 sm:w-14 h-2.5 bg-emerald-950/20 blur-xs rounded-full pointer-events-none" />

        {/* Mascot Button */}
        <button
          onClick={handleMascotClick}
          className={`focus:outline-none transition-transform duration-200 transform cursor-pointer flex flex-col items-center ${
            isBouncing ? 'scale-110 -translate-y-1' : 'hover:scale-105 active:scale-95'
          }`}
          aria-label="Nawi Mascot Companion. Tap to see messages and tips."
          title="Tap Nawi for tips and reminders!"
          id="nawi-mascot-trigger"
        >
          <NawiMascot
            pose={currentPose}
            size="sm"
            animate={false}
            removeWhiteBg={true}
            className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-sm"
          />
        </button>
      </div>

      {/* ── Floating Speech Bubble Pop-Up (Positioned to Nawi's Right) ── */}
      {isBubbleOpen && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-auto mb-1 max-w-[180px] xs:max-w-[210px] sm:max-w-[240px] relative group animate-in fade-in slide-in-from-left-2 zoom-in-95 duration-200"
        >
          <div
            onClick={handleNextTip}
            className="cursor-pointer bg-white/95 backdrop-blur-md border border-emerald-500 rounded-xl p-2.5 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 text-slate-800"
          >
            {/* Header row */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                <Sparkles size={9} className="text-emerald-600 animate-pulse" />
                {currentMsg.category}
              </span>

              <button
                onClick={handleCloseBubble}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close message"
                title="Dismiss message"
              >
                <X size={12} />
              </button>
            </div>

            {/* Message title */}
            <h4 className="text-[11px] font-bold text-slate-900 leading-tight mb-0.5">
              {currentMsg.title}
            </h4>

            {/* Message body */}
            <p className="text-[10px] sm:text-[11px] font-medium leading-relaxed text-slate-700">
              {currentMsg.text}
            </p>
          </div>

          {/* Speech Bubble Pointer / Arrow (Pointing LEFT to Nawi) */}
          <div
            className="absolute -left-1.5 bottom-4 sm:bottom-5 w-0 h-0"
            style={{
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderRight: '6px solid #10b981',
            }}
          />
          <div
            className="absolute -left-1 bottom-4 sm:bottom-5 w-0 h-0"
            style={{
              borderTop: '4px solid transparent',
              borderBottom: '4px solid transparent',
              borderRight: '5px solid #ffffff',
            }}
          />
        </div>
      )}
    </aside>
  );
}
