'use client';

import { useRef } from 'react';
import { CATEGORY_CONFIG, type AttractionCategory } from '@/lib/types/database';
import { CATEGORY_ICONS } from '@/components/icons/CategoryIcons';
import { Sparkles } from 'lucide-react';

interface CategoryFiltersProps {
  selected: AttractionCategory | null;
  onSelect: (category: AttractionCategory | null) => void;
}

const FILTER_CATEGORIES: (AttractionCategory | 'all')[] = [
  'all',
  'lake',
  'waterfall',
  'heritage',
  'hot-springs',
  'river',
  'viewpoint',
  'resort',
  'beach',
  'park',
];

export default function CategoryFilters({ selected, onSelect }: CategoryFiltersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative -mx-4">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto px-4 py-1 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FILTER_CATEGORIES.map((cat) => {
          const isAll = cat === 'all';
          const isActive = isAll ? selected === null : selected === cat;
          const config = isAll ? null : CATEGORY_CONFIG[cat];
          const IconComponent = isAll ? null : CATEGORY_ICONS[cat];

          return (
            <button
              key={cat}
              onClick={() => onSelect(isAll ? null : cat)}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold
                whitespace-nowrap transition-all duration-200 shrink-0
                ${isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }
              `}
              id={`filter-${cat}`}
            >
              {isAll ? (
                <Sparkles size={14} />
              ) : IconComponent ? (
                <IconComponent size={14} style={{ color: isActive ? 'white' : config?.color }} />
              ) : null}
              <span>{isAll ? 'All' : config?.label}</span>
            </button>
          );
        })}
      </div>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  );
}
