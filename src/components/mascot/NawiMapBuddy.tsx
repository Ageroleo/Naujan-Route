'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import NawiMascot, { type NawiPose } from './Nawi';

// ── Fun speech bubble messages grouped by context ──────────────────
const IDLE_QUIPS = [
  "Psst… tap a pin to explore! 📍",
  "Naujan has 19+ spots to discover!",
  "Try tapping me for a fun fact! 🦆",
  "The lake is HUGE — 8,100 hectares!",
  "I know all the secret spots! 🌿",
  "Zoom in for hidden gems! 🔍",
];

const NAVIGATING_QUIPS = [
  "Let's gooo! 🚀",
  "Adventure awaits! 🗺️",
  "I'll guide you there! 🦆",
  "Watch out for carabaos! 🐃",
  "Almost there, keep going! 💪",
  "Follow the road, amigo!",
];

const FUN_FACTS = [
  "Did you know? Naujan Lake is the largest lake in Mindoro! 🏞️",
  "Fun fact: The Philippine Duck (like me!) is endangered! 🦆💚",
  "Tip: Jeepney fares start at just ₱13! 🚐",
  "Secret: Corralmo Falls has the best swimming spots! 💦",
  "Naujan was founded way back in 1607! 📜",
  "Pro tip: Visit waterfalls early morning for the best photos! 📸",
  "There are hot springs here! Perfect after a hike 🥾♨️",
  "Masagana Falls has 7 tiers — can you climb them all? 🧗",
  "The best sunset view? Macapili Beach! 🌅",
  "Baco River is perfect for kayaking! 🛶",
];

// Pose + idle rotation combos
const IDLE_POSES: NawiPose[] = ['map', 'binoculars', 'compass', 'pointing', 'wave'];
const NAV_POSES: NawiPose[] = ['map', 'pointing', 'compass'];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface NawiMapBuddyProps {
  /** Whether a route/attraction is currently being navigated */
  isNavigating?: boolean;
}

export default function NawiMapBuddy({ isNavigating = false }: NawiMapBuddyProps) {
  const [pose, setPose] = useState<NawiPose>('map');
  const [bubble, setBubble] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Show a speech bubble for a set duration
  const showBubble = useCallback((text: string, durationMs = 4000) => {
    setBubble(text);
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => setBubble(null), durationMs);
  }, []);

  // Tap handler — show a fun fact and do a bounce
  const handleTap = useCallback(() => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);

    const fact = pickRandom(FUN_FACTS);
    showBubble(fact, 5000);
    setPose(pickRandom(IDLE_POSES));
  }, [showBubble]);

  // Idle rotation: every 12-18s, change pose and occasionally show a quip
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 12000 + Math.random() * 6000;
      idleTimerRef.current = setTimeout(() => {
        const quips = isNavigating ? NAVIGATING_QUIPS : IDLE_QUIPS;
        const poses = isNavigating ? NAV_POSES : IDLE_POSES;

        setPose(pickRandom(poses));

        // ~40% chance to show a quip
        if (Math.random() < 0.4) {
          showBubble(pickRandom(quips), 4000);
        }

        // Small bounce for liveliness
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 600);

        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isNavigating, showBubble]);

  // When navigation starts, react immediately
  useEffect(() => {
    if (isNavigating) {
      setPose('map');
      showBubble(pickRandom(NAVIGATING_QUIPS), 3500);
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 600);
    }
  }, [isNavigating, showBubble]);

  // Initial greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      showBubble("Hi! I'm Nawi! Tap me for fun facts! 🦆", 4500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showBubble]);

  if (!isVisible) {
    // Small button to bring Nawi back
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="nawi-buddy-restore"
        aria-label="Show Nawi"
        id="nawi-restore-button"
      >
        🦆
      </button>
    );
  }

  return (
    <div
      className={`nawi-buddy-container ${isBouncing ? 'nawi-bounce' : ''}`}
      id="nawi-map-buddy"
    >
      {/* Speech bubble */}
      {bubble && (
        <div className="nawi-buddy-bubble animate-fade-in">
          <p>{bubble}</p>
          <div className="nawi-buddy-bubble-tail" />
        </div>
      )}

      {/* Mascot */}
      <button
        onClick={handleTap}
        className="nawi-buddy-avatar"
        aria-label="Talk to Nawi"
        id="nawi-buddy-tap"
      >
        <NawiMascot size={64} pose={pose} />
      </button>

      {/* Dismiss button */}
      <button
        onClick={() => setIsVisible(false)}
        className="nawi-buddy-dismiss"
        aria-label="Hide Nawi"
        id="nawi-buddy-dismiss"
      >
        ×
      </button>
    </div>
  );
}
