'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Compass, Map, Calculator, Phone } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Explore', icon: Compass },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/fare-calculator', label: 'Fare', icon: Calculator },
  { href: '/emergency', label: 'Emergency', icon: Phone },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav bg-white/90 backdrop-blur-md border-t border-slate-200/80 md:hidden" aria-label="Main navigation">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isEmergency = item.href === '/emergency';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl
                transition-all duration-200 relative min-w-[56px]
                ${isActive
                  ? isEmergency
                    ? 'text-red-600 bg-red-50/80'
                    : 'text-emerald-600 bg-emerald-50/80'
                  : 'text-slate-400 hover:text-slate-600'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
              id={`nav-${item.label.toLowerCase()}`}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span
                  className={`
                    absolute -top-0.5 w-5 h-1 rounded-full
                    ${isEmergency ? 'bg-red-500' : 'bg-emerald-600'}
                  `}
                />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className="transition-all duration-200"
              />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
