'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TrendingUp, MapPin } from 'lucide-react';
import SearchBar from '@/components/attractions/SearchBar';
import CategoryFilters from '@/components/attractions/CategoryFilters';
import AttractionCard from '@/components/attractions/AttractionCard';
import HeroSlider from '@/components/home/HeroSlider';
import NawiMascot from '@/components/mascot/Nawi';
import NawiEmptyState from '@/components/mascot/NawiEmptyState';
import VisitorDirectorySection from '@/components/directory/VisitorDirectorySection';
import { createClient } from '@/lib/supabase/client';
import { FALLBACK_ATTRACTIONS, enrichWithTrailData } from '@/lib/data/fallback';
import type { Attraction, AttractionCategory } from '@/lib/types/database';

export default function HomePage() {
  const [attractions, setAttractions] = useState<Attraction[]>(FALLBACK_ATTRACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AttractionCategory | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const searchRef = useRef<HTMLElement>(null);

  // Fetch from Supabase on mount, fall back to hardcoded data
  useEffect(() => {
    async function fetchAttractions() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('attractions')
          .select('*')
          .order('name');

        if (!error && data && data.length > 0) {
          setAttractions((data as Attraction[]).map(enrichWithTrailData));
        }
      } catch {
        // Supabase not configured — use fallback data
      } finally {
        setIsLoaded(true);
      }
    }
    fetchAttractions();
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredAttractions = useMemo(() => {
    let result = attractions;

    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.barangay?.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [attractions, searchQuery, selectedCategory]);


  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSlider />

      <div className="px-4 py-6 md:py-8 max-w-7xl mx-auto space-y-8">
        {/* Nawi Full-Body Hero Welcome Banner */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
          <div className="card p-5 sm:p-6 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-emerald-100/40 border border-emerald-200/80 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {/* Full-Body Nawi Mascot */}
              <div className="shrink-0 -mb-2 sm:mb-0">
                <NawiMascot
                  size="xl"
                  pose="flying"
                  animate={true}
                  removeWhiteBg={true}
                  className="drop-shadow-lg"
                />
              </div>

              {/* Speech Callout and Actions */}
              <div className="flex-1 min-w-0 text-center sm:text-left space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-2xs">
                  <span>🦆</span>
                  <span>Official Naujan Trail Guide</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-[family-name:var(--font-display)] leading-snug">
                  Mabuhay! Welcome to Naujan&apos;s Digital Tourism Trail!
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium max-w-2xl">
                  I&apos;m <span className="font-bold text-emerald-800">Nawi</span>, your local companion around Naujan Lake, cascading waterfalls, colonial church ruins, and thermal hot springs. Tap any stop below for verified local tips and etiquette!
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                  <button
                    onClick={() => searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all active:scale-[0.97] shadow-sm cursor-pointer"
                    id="start-exploring-button"
                  >
                    <MapPin size={14} />
                    Explore 11 Trail Destinations
                  </button>
                  <Link
                    href="/map"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-800 text-xs font-bold border border-emerald-300 hover:bg-emerald-50 transition-all active:scale-[0.97]"
                  >
                    <span>Open Interactive Trail Map</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search */}
        <section ref={searchRef} className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <SearchBar onSearch={handleSearch} />
        </section>

        {/* Category Filters */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <CategoryFilters selected={selectedCategory} onSelect={setSelectedCategory} />
        </section>


        {/* Attraction Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {searchQuery || selectedCategory ? 'Results' : 'All Attractions'}
              </h3>
            </div>
            <span className="text-xs text-slate-500">{filteredAttractions.length} spots</span>
          </div>

          {!isLoaded ? (
            // Loading skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card">
                  <div className="skeleton h-44 w-full" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAttractions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredAttractions.map((attraction, index) => (
                <AttractionCard key={attraction.id} attraction={attraction} index={index} />
              ))}
            </div>
          ) : (
            <NawiEmptyState
              onReset={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
            />
          )}
        </section>

        {/* Visitor Directory Section */}
        <VisitorDirectorySection />
      </div>
    </div>
  );
}
