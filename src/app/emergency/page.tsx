'use client';

import { useState, useEffect } from 'react';
import { Shield, WifiOff, Database } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FALLBACK_EMERGENCY } from '@/lib/data/fallback';
import { saveToOffline, getFromOffline } from '@/lib/offline/indexeddb';
import ContactCard from '@/components/emergency/ContactCard';
import type { EmergencyContact } from '@/lib/types/database';

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(FALLBACK_EMERGENCY);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchContacts() {
      try {
        // First try Supabase
        const supabase = createClient();
        const { data, error } = await supabase
          .from('emergency_contacts')
          .select('*')
          .order('category')
          .order('organization_name');

        if (!error && data && data.length > 0) {
          setContacts(data as EmergencyContact[]);
          // Cache to IndexedDB for offline use
          await saveToOffline('emergencyContacts', data as EmergencyContact[]);
          setIsOfflineData(false);
        } else {
          throw new Error('No data from Supabase');
        }
      } catch {
        // Try IndexedDB cache
        try {
          const cached = await getFromOffline('emergencyContacts');
          if (cached.length > 0) {
            setContacts(cached);
            setIsOfflineData(true);
          } else {
            // Use hardcoded fallback
            setContacts(FALLBACK_EMERGENCY);
            setIsOfflineData(true);
          }
        } catch {
          // Final fallback
          setContacts(FALLBACK_EMERGENCY);
          setIsOfflineData(true);
        }
      } finally {
        setIsLoaded(true);
      }
    }
    fetchContacts();
  }, []);

  return (
    <div className="px-4 py-6 md:py-8 max-w-7xl mx-auto space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-red-600" />
            <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-slate-900">
              Emergency Hotlines &amp; Contacts
            </h2>
          </div>
          <p className="text-xs text-slate-600">
            One-tap calling to emergency services. Operates over cellular voice networks offline.
          </p>
        </div>

        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-emergency-modal'))}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
          id="open-modal-from-page"
        >
          <Shield size={14} className="animate-pulse" />
          <span>Quick Assistance Dialog (911 / 143)</span>
        </button>
      </div>

      {/* Offline indicator */}
      {isOfflineData && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200/60 animate-fade-in">
          <WifiOff size={14} className="text-amber-600 shrink-0" />
          <p className="text-[10px] text-amber-700 font-medium">
            Showing cached data — contacts are available offline
          </p>
        </div>
      )}

      {/* Available Offline Badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200/60 animate-fade-in-up">
        <Database size={14} className="text-emerald-600 shrink-0" />
        <p className="text-[10px] text-emerald-700 font-medium">
          📱 These contacts work even without internet connection
        </p>
      </div>

      {/* Emergency Hotline Highlight */}
      <div className="rounded-2xl overflow-hidden shadow-md animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-4">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold text-white/80 uppercase tracking-widest">
              National Emergency
            </p>
            <a
              href="tel:911"
              className="block text-4xl font-extrabold font-[family-name:var(--font-display)] text-white tracking-wider hover:scale-105 transition-transform"
              id="call-911"
            >
              📞 911
            </a>
            <p className="text-[10px] text-white/70">Tap to call — Available 24/7 nationwide</p>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      {!isLoaded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card-emergency rounded-2xl p-4 space-y-3">
              <div className="flex gap-3">
                <div className="skeleton w-11 h-11 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-16" />
                </div>
              </div>
              <div className="skeleton h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {contacts
            .filter((c) => c.phone_number !== '911')
            .map((contact, index) => (
              <ContactCard key={contact.id} contact={contact} index={index} />
            ))}
        </div>
      )}
    </div>
  );
}
