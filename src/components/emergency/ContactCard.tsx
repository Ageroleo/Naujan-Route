'use client';

import { Phone } from 'lucide-react';
import { EMERGENCY_CONFIG, type EmergencyContact } from '@/lib/types/database';
import { EMERGENCY_ICONS } from '@/components/icons/EmergencyIcons';

interface ContactCardProps {
  contact: EmergencyContact;
  index?: number;
}

export default function ContactCard({ contact, index = 0 }: ContactCardProps) {
  const config = EMERGENCY_CONFIG[contact.category];
  const EmergencyIcon = EMERGENCY_ICONS[contact.category];

  return (
    <article
      className="card-emergency rounded-2xl p-4 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${index * 0.06}s`, animationFillMode: 'forwards' }}
      id={`emergency-${contact.id}`}
    >
      <div className="flex items-start gap-3">
        {/* Category Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${config.color}12` }}
        >
          {EmergencyIcon
            ? <EmergencyIcon size={22} style={{ color: config.color }} />
            : <span className="text-lg">{config.emoji}</span>
          }
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {contact.organization_name}
              </h3>
              <span
                className="badge mt-1 text-[10px]"
                style={{ backgroundColor: `${config.color}10`, color: config.color }}
              >
                {config.label}
              </span>
            </div>
          </div>

          {contact.address && (
            <p className="text-[11px] text-slate-500 leading-snug">
              📍 {contact.address}
            </p>
          )}
        </div>
      </div>

      {/* Click-to-Call Button */}
      <a
        href={`tel:${contact.phone_number.replace(/[^\d+]/g, '')}`}
        className="mt-3 w-full flex items-center justify-center gap-2 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold py-3 px-4 rounded-xl transition-all duration-200"
        id={`call-${contact.id}`}
      >
        <Phone size={16} strokeWidth={2.5} />
        <span>{contact.phone_number}</span>
      </a>
    </article>
  );
}
