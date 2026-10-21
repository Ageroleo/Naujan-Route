'use client';

import React, { useEffect } from 'react';
import {
  X,
  PhoneCall,
  ShieldAlert,
  HeartPulse,
  Shield,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Phone,
  Info,
} from 'lucide-react';
import { EMERGENCY_CONTACTS, type EmergencyContact } from '@/data/naujanTrailData';
import NawiMascot from '@/components/NawiMascot';

interface EmergencyAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyAssistanceModal({
  isOpen,
  onClose,
}: EmergencyAssistanceModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is active
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

  if (!isOpen) return null;

  // Separate primary hotlines (911, 143) and local/provincial services
  const primaryContacts = EMERGENCY_CONTACTS.filter((c) => c.isPrimaryHotline);
  const localContacts = EMERGENCY_CONTACTS.filter((c) => !c.isPrimaryHotline);

  // Helper icon for local services
  const getServiceIcon = (id: string) => {
    if (id.includes('hospital')) {
      return <HeartPulse size={20} className="text-rose-600" />;
    }
    if (id.includes('police')) {
      return <Shield size={20} className="text-blue-600" />;
    }
    return <AlertTriangle size={20} className="text-amber-600" />;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[92dvh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-red-200/80 flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Full-Body Nawi Safety Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 sm:p-5 relative shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="shrink-0 -mb-2 bg-white p-1.5 rounded-2xl shadow-sm border border-red-300">
                <NawiMascot
                  pose="salute"
                  size="md"
                  animate={true}
                  removeWhiteBg={true}
                  className="drop-shadow-lg"
                />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
                  <Radio size={10} className="animate-pulse" />
                  Emergency Hotlines
                </div>
                <h2
                  id="emergency-modal-title"
                  className="text-lg sm:text-xl font-bold font-[family-name:var(--font-display)] leading-tight text-white"
                >
                  Immediate Assistance
                </h2>
                <p className="text-xs text-rose-100 font-medium leading-relaxed max-w-sm">
                  Stay safe on the trail! Verify local emergency numbers and notify authorities or guides before trekking or swimming.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer shrink-0"
              aria-label="Close emergency modal"
              id="close-emergency-modal"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-[11px] text-rose-100/90 mt-2.5 leading-relaxed bg-black/15 p-2 rounded-xl border border-white/10">
            One-tap emergency dialing for Naujan &amp; Oriental Mindoro. Calls connect directly over cellular voice networks even with zero data reception.
          </p>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          {/* ── 1. Primary Emergency Banner (911 & 143) ── */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <Radio size={13} className="text-red-600" />
                Primary National Hotlines
              </h3>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                Toll-Free / 24/7
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {primaryContacts.map((contact: EmergencyContact) => {
                const number = contact.publishedContacts[0] || '911';
                const is911 = number === '911';

                return (
                  <div
                    key={contact.id}
                    className="rounded-2xl p-3.5 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white shadow-md flex flex-col justify-between space-y-3"
                    id={`primary-card-${contact.id}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-200">
                          {is911 ? 'National Emergency' : 'Humanitarian Assistance'}
                        </span>
                        <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-full">
                          {number}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold leading-tight">
                        {contact.service}
                      </h4>
                      <p className="text-[11px] text-rose-100 mt-1 leading-snug">
                        {contact.useAndVerification}
                      </p>
                    </div>

                    <a
                      href={`tel:${number}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white text-red-700 font-black text-sm hover:bg-rose-50 shadow-sm active:scale-95 transition-all"
                      id={`call-${contact.id}`}
                    >
                      <PhoneCall size={16} strokeWidth={2.5} />
                      <span>Call {number} Now</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 2. Local Naujan & Provincial Hotlines ── */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Shield size={13} className="text-slate-600" />
                Local Naujan &amp; Provincial Hotlines
              </h3>
              <span className="text-[10px] font-semibold text-slate-500">
                Hospital · Police · DRRMO
              </span>
            </div>

            <div className="space-y-2.5">
              {localContacts.map((contact: EmergencyContact) => (
                <div
                  key={contact.id}
                  className="card p-3.5 border border-slate-200/90 hover:border-slate-300 transition-all space-y-2.5"
                  id={`local-card-${contact.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {getServiceIcon(contact.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {contact.service}
                        </h4>
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                          Verify number locally
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        {contact.useAndVerification}
                      </p>
                    </div>
                  </div>

                  {/* Tap-to-call links */}
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                    {contact.publishedContacts.map((phone, idx) => (
                      <a
                        key={idx}
                        href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                        className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-800 hover:text-red-700 font-bold text-xs border border-slate-200 hover:border-red-300 transition-colors active:scale-95 shadow-2xs"
                        id={`call-local-${contact.id}-${idx}`}
                      >
                        <Phone size={13} strokeWidth={2.5} />
                        <span>{phone}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Offline Connectivity Notice ── */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 flex items-start gap-2.5 text-xs text-slate-600">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-slate-800">Voice Network Ready:</strong> When cellular data is off or signal is weak in remote Naujan barangays, phone calls will still initiate directly through your phone carrier.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">Esc</kbd> to close
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
