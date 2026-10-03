'use client';

import NawiMascot from './Nawi';
import { RotateCcw } from 'lucide-react';

interface NawiEmptyStateProps {
  /** Callback fired when user clicks "Reset Filters" */
  onReset: () => void;
}

export default function NawiEmptyState({ onReset }: NawiEmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4 space-y-4 animate-fade-in">
      <NawiMascot
        size={160}
        speechBubble="Walang nahanap si Nawi!"
        pose="signpost"
      />

      <div className="space-y-1.5 max-w-xs">
        <p className="text-sm text-slate-600 leading-relaxed">
          No tourist spots or activities matched your search. Try searching for{' '}
          <span className="font-semibold text-emerald-700">&lsquo;Lake&rsquo;</span>,{' '}
          <span className="font-semibold text-emerald-700">&lsquo;Falls&rsquo;</span>,{' '}
          <span className="font-semibold text-emerald-700">&lsquo;Bancuro&rsquo;</span>,{' '}
          or select a different category.
        </p>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97]"
        id="reset-filters-button"
      >
        <RotateCcw size={14} />
        Reset Filters
      </button>
    </div>
  );
}
