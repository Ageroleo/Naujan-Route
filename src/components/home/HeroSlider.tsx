'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

const HERO_IMAGES = [
  { src: '/images/Naujan Lake Boardwalk and Bicycle Lane.jpg', alt: 'Naujan Lake' },
  { src: '/images/Simbahang Bato.jpg', alt: 'Simbahang Bato' },
  { src: '/images/Montelago Hot Spring.jpg', alt: 'Montelago Hot Spring' },
  { src: '/images/Arangin Falls.jpg', alt: 'Arangin Falls' },
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[350px] md:h-[450px] lg:h-[550px] overflow-hidden animate-fade-in group">
      {/* Background Images */}
      {HERO_IMAGES.map((image, index) => (
        <div
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-[10000ms] ease-linear"
            style={{
              transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)',
            }}
            priority={index === 0}
          />
        </div>
      ))}

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 space-y-4 z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-50 text-xs font-medium border border-emerald-400/30">
          <MapPin size={14} />
          Naujan, Oriental Mindoro
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-[family-name:var(--font-display)] text-white leading-tight drop-shadow-lg">
          Discover Naujan
        </h2>
        <p className="text-sm md:text-base text-slate-200 max-w-md mx-auto drop-shadow-md font-medium">
          Explore lakes, waterfalls, heritage sites, and hot springs in the heart of Oriental Mindoro
        </p>
      </div>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-10">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-emerald-400 w-8' : 'bg-white/50 w-2 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
