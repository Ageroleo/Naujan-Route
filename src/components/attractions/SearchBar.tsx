'use client';

import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search spots, activities, barangays...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(query);
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div
      className={`
        relative flex items-center gap-2 rounded-2xl px-4 py-3
        transition-all duration-300
        ${isFocused
          ? 'bg-white border border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm'
          : 'bg-slate-50 border border-slate-200'
        }
      `}
    >
      <Search
        size={18}
        className={`shrink-0 transition-colors duration-200 ${
          isFocused ? 'text-emerald-600' : 'text-slate-400'
        }`}
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
        id="search-attractions"
        aria-label="Search attractions"
      />
      {query && (
        <button
          onClick={handleClear}
          className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
