'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import NawiMascot, { type NawiPose, getPoseForAttraction } from '@/components/NawiMascot';
import {
  NAUJAN_ATTRACTIONS,
  GOVERNMENT_TOURISM_OFFICES,
  TRAVEL_AGENCIES,
  EMERGENCY_CONTACTS,
  type TrailAttraction,
} from '@/data/naujanTrailData';
import {
  X,
  Sparkles,
  Phone,
  ShieldCheck,
  Compass,
  MapPin,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Send,
  MessageCircle,
  Info,
  Maximize2,
} from 'lucide-react';

interface QuickQA {
  q: string;
  a: string;
  pose: NawiPose;
}

const QUICK_QUESTIONS: QuickQA[] = [
  {
    q: 'What can I do at Naujan Lake?',
    a: "Naujan Lake is 8,100 hectares of natural beauty! You can enjoy the Boardwalk and bicycle lane, birdwatching (look out for endangered Philippine Ducks like me!), scenic lakeside photography, and educational ecotours. Remember: always wear a life jacket when boating!",
    pose: 'lakeside',
  },
  {
    q: 'How do I visit Simbahang Bato?',
    a: "Simbahang Bato is located in Brgy. Bancuro. It is a sacred 17th-century church ruin with a modern grotto inside. Admission is free! Please maintain solemnity, do not climb or carve on the coral-and-stone ruins, and take all trash with you.",
    pose: 'sunset',
  },
  {
    q: 'Where are the hot springs?',
    a: "Montelago & Pungao Hot Springs are located in Brgy. Montelago. Thermal spring baths average 38–42°C. Limit soaking to 15–20 minutes at a time, stay hydrated, and confirm current entrance fees with the Municipal Tourism Office.",
    pose: 'coconut',
  },
  {
    q: 'How do I reach Arangin Falls?',
    a: "Arangin Falls is in Brgy. Arangin! It offers trekking, river wading, and cool mountain dips. Always hire an accredited local guide, wear sturdy aqua shoes, and avoid the trail during heavy rainfall.",
    pose: 'map',
  },
  {
    q: 'Who is the accredited tour operator in Naujan?',
    a: "The primary accredited local operator in Naujan is R and A Travel and Tours, located in Tigkan, Naujan (Phone: 0917-827-0870 / (043) 289-2244). They organize authentic guided trails and transport!",
    pose: 'thumbs-up',
  },
];

export default function NawiCompanionDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reminders' | 'ask' | 'emergency'>('reminders');
  const [selectedAttraction, setSelectedAttraction] = useState<TrailAttraction | null>(null);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [customQuestion, setCustomQuestion] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'nawi'; text: string; pose: NawiPose }[]>([
    {
      sender: 'nawi',
      text: "Mabuhay! I'm Nawi, your Naujan trail guide. Ask me anything about our 11 attractions, verified guides, or travel safety!",
      pose: 'salute',
    },
  ]);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'water' | 'nature' | 'heritage'>('all');

  // Idle vs Contextual Pose
  const currentPose: NawiPose = useMemo(() => {
    if (activeTab === 'emergency') return 'phone';
    if (selectedAttraction) {
      return selectedAttraction.nawiPose || getPoseForAttraction(selectedAttraction.name);
    }
    return 'salute';
  }, [activeTab, selectedAttraction]);

  // Current Speech Bubble Message
  const currentMessage = useMemo(() => {
    if (selectedAttraction) {
      return `${selectedAttraction.name}: "${selectedAttraction.nawiReminder}"`;
    }
    return "Mabuhay! I'm Nawi, your Naujan trail buddy. Tap me for route tips, contacts, or safety reminders!";
  }, [selectedAttraction]);

  // Auto-dismiss floating speech bubble pop up after 2 seconds
  useEffect(() => {
    if (bubbleDismissed) return;

    setBubbleVisible(true);

    const fadeTimer = setTimeout(() => {
      setBubbleVisible(false);
    }, 1700);

    const removeTimer = setTimeout(() => {
      setBubbleDismissed(true);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [bubbleDismissed, currentMessage]);

  // Listen for global attraction selection events
  useEffect(() => {
    const handleAttractionSelect = (e: CustomEvent<TrailAttraction | { name: string; nawiReminder?: string }>) => {
      if (!e.detail) return;
      const match = NAUJAN_ATTRACTIONS.find(
        (a) => a.name.toLowerCase() === e.detail.name.toLowerCase() || a.id === (e.detail as any).id
      );
      if (match) {
        setSelectedAttraction(match);
      } else if (e.detail.nawiReminder) {
        setSelectedAttraction({
          id: 'custom',
          name: e.detail.name,
          nawiReminder: e.detail.nawiReminder,
          publishedLocation: '',
          publishedContact: '',
          admissionStatus: '',
          visitorInfo: '',
          activities: [],
          activitiesSummary: '',
          sourceLabel: 'Naujan Route',
          requiresVerification: false,
          nawiPose: getPoseForAttraction(e.detail.name),
        });
      }
      setBubbleDismissed(false);
      setBubbleVisible(true);
    };

    window.addEventListener('nawi-select-attraction' as any, handleAttractionSelect as any);
    return () => {
      window.removeEventListener('nawi-select-attraction' as any, handleAttractionSelect as any);
    };
  }, []);

  // Filtered attractions in drawer
  const filteredAttractions = useMemo(() => {
    if (categoryFilter === 'all') return NAUJAN_ATTRACTIONS;
    if (categoryFilter === 'water') {
      return NAUJAN_ATTRACTIONS.filter((a) =>
        ['falls', 'river', 'lake', 'spring', 'beach'].some((kw) => a.name.toLowerCase().includes(kw))
      );
    }
    if (categoryFilter === 'heritage') {
      return NAUJAN_ATTRACTIONS.filter((a) =>
        ['bato', '333', 'plaza'].some((kw) => a.name.toLowerCase().includes(kw))
      );
    }
    return NAUJAN_ATTRACTIONS;
  }, [categoryFilter]);

  // Handle asking custom question
  const handleAskQuestion = (qText: string) => {
    if (!qText.trim()) return;
    const cleanQ = qText.trim();
    setChatLog((prev) => [...prev, { sender: 'user', text: cleanQ, pose: 'salute' }]);
    setCustomQuestion('');

    // Answer logic
    setTimeout(() => {
      const lower = cleanQ.toLowerCase();
      let reply = '';
      let replyPose: NawiPose = 'salute';

      // Check quick questions first
      const quickMatch = QUICK_QUESTIONS.find((item) =>
        item.q.toLowerCase().includes(lower) || lower.includes(item.q.toLowerCase().slice(0, 15))
      );

      if (quickMatch) {
        reply = quickMatch.a;
        replyPose = quickMatch.pose;
      } else if (lower.includes('emergency') || lower.includes('hospital') || lower.includes('police') || lower.includes('911')) {
        reply = "For emergencies in Naujan: Call 911 (National), 143 (Red Cross), (043) 289-2134 (Naujan District Hospital), or (043) 289-2088 (Naujan Police). I can open the emergency panel for you right now!";
        replyPose = 'phone';
      } else if (lower.includes('agency') || lower.includes('tour') || lower.includes('operator')) {
        reply = "I recommend R and A Travel and Tours in Tigkan, Naujan (0917-827-0870) for local guided adventures. There are also 7 accredited partner agencies in Calapan City!";
        replyPose = 'thumbs-up';
      } else {
        // Try finding matching attraction
        const matchedAttr = NAUJAN_ATTRACTIONS.find((a) =>
          lower.includes(a.name.toLowerCase()) ||
          a.activities.some((act) => lower.includes(act.toLowerCase())) ||
          lower.includes(a.publishedLocation.toLowerCase())
        );

        if (matchedAttr) {
          reply = `${matchedAttr.name} (${matchedAttr.publishedLocation}): ${matchedAttr.visitorInfo}. Available activities: ${matchedAttr.activities.join(', ')}. Nawi's Reminder: "${matchedAttr.nawiReminder}". Contact: ${matchedAttr.publishedContact}.`;
          replyPose = getPoseForAttraction(matchedAttr.name);
        } else {
          reply = `I'm happy to help you explore Naujan! You can check out our 11 verified trail spots like Naujan Lake Boardwalk, Simbahang Bato, or Arangin Falls in the Reminders tab, or call the Naujan Municipal Tourism Office at (043) 289-2088.`;
          replyPose = 'thumbs-up';
        }
      }

      setChatLog((prev) => [...prev, { sender: 'nawi', text: reply, pose: replyPose }]);
    }, 450);
  };

  const handleOpenEmergencyModal = () => {
    window.dispatchEvent(new CustomEvent('open-emergency-modal'));
  };

  return (
    <>
      {/* ── Fixed Floating Dock (Bottom Right) ── */}
      <aside
        aria-label="Nawi Mascot Companion"
        className="fixed bottom-20 md:bottom-6 right-3 sm:right-5 z-50 flex flex-col items-end pointer-events-none"
        id="nawi-companion-dock"
      >
        {/* Floating Dynamic Speech Bubble */}
        {!bubbleDismissed && (
          <div
            className={`pointer-events-auto mb-2 max-w-[270px] sm:max-w-xs relative group transition-all duration-300 ease-out ${
              bubbleVisible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
            }`}
          >
            <div
              onClick={() => setIsOpen(true)}
              className="cursor-pointer bg-white/95 backdrop-blur-md border-2 border-emerald-600 rounded-2xl p-3 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 text-slate-800"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <Sparkles size={11} className="text-emerald-600 animate-pulse" />
                  Nawi Trail Buddy
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setBubbleVisible(false);
                    setBubbleDismissed(true);
                  }}
                  className="text-slate-400 hover:text-slate-700 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                  aria-label="Dismiss speech bubble"
                >
                  <X size={13} />
                </button>
              </div>

              <p className="text-xs font-semibold leading-relaxed line-clamp-3 text-slate-900">
                {currentMessage}
              </p>

              <div className="mt-1.5 flex items-center justify-between text-[10px] text-emerald-700 font-bold">
                <span>Tap to chat &amp; view reminders</span>
                <ChevronRight size={12} />
              </div>
            </div>

            {/* Bubble Tail pointing to Nawi */}
            <div
              className="absolute -bottom-2 right-10 w-0 h-0"
              style={{
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '8px solid #059669',
              }}
            />
            <div
              className="absolute -bottom-1.5 right-10 w-0 h-0"
              style={{
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '6px solid #ffffff',
              }}
            />
          </div>
        )}

        {/* Mascot Perched Trigger Button */}
        <div className="pointer-events-auto relative group">
          {/* Subtle glow / shadow ring underneath */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-emerald-950/20 blur-md rounded-full pointer-events-none" />

          {/* Full-Body Mascot Trigger */}
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="focus:outline-none transition-transform duration-300 transform group-hover:scale-105 active:scale-95 cursor-pointer flex flex-col items-center"
            aria-label="Open Nawi Trail Guide Companion"
            id="nawi-mascot-trigger"
          >
            <NawiMascot
              pose={currentPose}
              size="md"
              animate={false}
              removeWhiteBg={true}
              className="w-24 h-24 md:w-28 md:h-28"
            />
          </button>
        </div>
      </aside>

      {/* ── Interactive Nawi Trail Guide Drawer / Modal ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-out Panel */}
          <div
            className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-slate-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nawi-drawer-title"
          >
            {/* Drawer Header with Full-Body Nawi */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shrink-0 relative overflow-hidden">
              {/* Background ambient pattern */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 bg-white p-1.5 rounded-2xl shadow-sm border border-emerald-400/30">
                    <NawiMascot
                      pose={currentPose}
                      size="sm"
                      animate={false}
                      removeWhiteBg={true}
                      className="w-16 h-16"
                    />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/40 text-emerald-100 border border-emerald-400/30 uppercase tracking-wider mb-0.5">
                      <Sparkles size={10} />
                      Trail Mascot Companion
                    </div>
                    <h3 id="nawi-drawer-title" className="text-lg sm:text-xl font-extrabold font-[family-name:var(--font-display)]">
                      Nawi Trail Guide
                    </h3>
                    <p className="text-xs text-emerald-100/90 font-medium">
                      Your 2D field buddy for Naujan, Oriental Mindoro
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                  aria-label="Close Nawi panel"
                  id="close-nawi-drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 3 Navigation Tabs */}
              <div className="flex items-center gap-1.5 mt-4 bg-emerald-900/40 p-1 rounded-xl text-xs font-bold border border-emerald-500/20">
                <button
                  onClick={() => setActiveTab('reminders')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'reminders'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-emerald-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ShieldCheck size={14} />
                  <span>Trail Reminders</span>
                </button>

                <button
                  onClick={() => setActiveTab('ask')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'ask'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-emerald-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <MessageCircle size={14} />
                  <span>Ask Nawi</span>
                </button>

                <button
                  onClick={() => setActiveTab('emergency')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'emergency'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-emerald-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Phone size={14} />
                  <span>Hotlines</span>
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* ── TAB 1: DESTINATION REMINDERS ── */}
              {activeTab === 'reminders' && (
                <div className="space-y-4">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold text-slate-600">
                    <button
                      onClick={() => setCategoryFilter('all')}
                      className={`px-3 py-1.5 rounded-full transition-colors shrink-0 ${
                        categoryFilter === 'all'
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      All (11)
                    </button>
                    <button
                      onClick={() => setCategoryFilter('water')}
                      className={`px-3 py-1.5 rounded-full transition-colors shrink-0 ${
                        categoryFilter === 'water'
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      Waterfalls &amp; Lakes
                    </button>
                    <button
                      onClick={() => setCategoryFilter('heritage')}
                      className={`px-3 py-1.5 rounded-full transition-colors shrink-0 ${
                        categoryFilter === 'heritage'
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      Heritage &amp; Plaza
                    </button>
                  </div>

                  {/* Active Selected Attraction Showcase */}
                  {selectedAttraction && (
                    <div className="card p-4 border-2 border-emerald-400 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 relative">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 -mt-2">
                          <NawiMascot
                            pose={selectedAttraction.nawiPose || getPoseForAttraction(selectedAttraction.name)}
                            size="sm"
                            animate={false}
                            removeWhiteBg={true}
                            className="w-16 h-16"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                              Active Destination
                            </span>
                            <button
                              onClick={() => setSelectedAttraction(null)}
                              className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
                            >
                              Reset
                            </button>
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900">
                            {selectedAttraction.name}
                          </h4>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            &ldquo;{selectedAttraction.nawiReminder}&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Attraction Reminder Cards List */}
                  <div className="space-y-3">
                    {filteredAttractions.map((attraction) => {
                      const pose = attraction.nawiPose || getPoseForAttraction(attraction.name);
                      const isSelected = selectedAttraction?.id === attraction.id;

                      return (
                        <div
                          key={attraction.id}
                          onClick={() => setSelectedAttraction(attraction)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                              : 'border-slate-200/90 hover:border-emerald-300 hover:bg-slate-50/80'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="shrink-0">
                              <NawiMascot
                                pose={pose}
                                size="sm"
                                removeWhiteBg={true}
                                className="w-14 h-14"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <h5 className="text-xs font-bold text-slate-900 truncate">
                                  {attraction.name}
                                </h5>
                                <span className="text-[10px] font-semibold text-emerald-700 shrink-0">
                                  {attraction.publishedLocation}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mb-2">
                                {attraction.nawiReminder}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {attraction.activities.slice(0, 3).map((act, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-700"
                                  >
                                    {act}
                                  </span>
                                ))}
                                {attraction.activities.length > 3 && (
                                  <span className="text-[9px] text-slate-400 font-semibold self-center">
                                    +{attraction.activities.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── TAB 2: ASK NAWI (INTERACTIVE ASSISTANT) ── */}
              {activeTab === 'ask' && (
                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div className="space-y-3 min-h-[220px]">
                    {chatLog.map((chat, idx) => {
                      const isNawi = chat.sender === 'nawi';
                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-2.5 ${isNawi ? '' : 'justify-end'}`}
                        >
                          {isNawi && (
                            <div className="shrink-0 -mt-1">
                              <NawiMascot
                                pose={chat.pose}
                                size="sm"
                                removeWhiteBg={true}
                                className="w-12 h-12"
                              />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                              isNawi
                                ? 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                                : 'bg-emerald-600 text-white rounded-tr-xs'
                            }`}
                          >
                            {chat.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Question Chips */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Popular Questions
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_QUESTIONS.map((qa, i) => (
                        <button
                          key={i}
                          onClick={() => handleAskQuestion(qa.q)}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100 transition-colors text-left"
                        >
                          {qa.q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Question Input */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAskQuestion(customQuestion);
                    }}
                    className="flex items-center gap-2 pt-2"
                  >
                    <input
                      type="text"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      placeholder="Ask Nawi about trails, waterfalls, fares..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                    <button
                      type="submit"
                      disabled={!customQuestion.trim()}
                      className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors shrink-0"
                      aria-label="Send question"
                    >
                      <Send size={15} />
                    </button>
                  </form>
                </div>
              )}

              {/* ── TAB 3: EMERGENCY HOTLINES ── */}
              {activeTab === 'emergency' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                    <div className="shrink-0 -mt-1">
                      <NawiMascot pose="phone" size="sm" removeWhiteBg={true} className="w-14 h-14" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-rose-900 mb-0.5">
                        Emergency &amp; Rescue Hotlines
                      </h4>
                      <p className="text-[11px] text-rose-800 leading-relaxed">
                        Direct phone calls connect even in low-signal areas where mobile data is unavailable.
                      </p>
                    </div>
                  </div>

                  {/* Emergency List */}
                  <div className="space-y-2.5">
                    {EMERGENCY_CONTACTS.map((contact) => (
                      <div
                        key={contact.id}
                        className="p-3 rounded-xl border border-slate-200/90 bg-white flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              {contact.service}
                            </span>
                            {contact.isPrimaryHotline && (
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-red-100 text-red-700">
                                24/7
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500">
                            {contact.useAndVerification}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {contact.publishedContacts.map((num, i) => {
                            const raw = num.replace(/[^0-9+]/g, '');
                            return (
                              <a
                                key={i}
                                href={`tel:${raw}`}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors inline-flex items-center gap-1 shrink-0"
                              >
                                <Phone size={11} />
                                <span>{num}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Open Full Modal Button */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleOpenEmergencyModal();
                    }}
                    className="w-full py-2.5 rounded-xl border-2 border-red-600 text-red-600 font-bold text-xs hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck size={14} />
                    <span>Open Full Emergency Assistance Directory</span>
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center shrink-0">
              <p className="text-[10px] text-slate-500 font-medium">
                Naujan Digital Tourism Trail • Municipal Tourism Office &amp; DOT Accredited
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
