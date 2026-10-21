'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import NawiMascot, { type NawiPose } from './Nawi';
import type { Attraction, AttractionCategory } from '@/lib/types/database';

// ── Fun speech bubble messages grouped by context ──────────────────
const IDLE_QUIPS = [
  "Psst… tap a pin to explore! 📍",
  "Naujan has 19+ spots to discover!",
  "Try tapping me for a fun fact! 🦆",
  "The lake is HUGE — 8,100 hectares!",
  "I know all the secret spots! 🌿",
  "Zoom in for hidden gems! 🔍",
];

const FUN_FACTS = [
  "Did you know? Naujan Lake is the largest lake in Mindoro! 🏞️",
  "Fun fact: The Philippine Duck (like me!) is endangered! 🦆💚",
  "Tip: Jeepney fares start at just ₱13! 🚐",
  "Secret: Arangin Falls has the best swimming spots! 💦",
  "Naujan was founded way back in 1607! 📜",
  "Pro tip: Visit waterfalls early morning for the best photos! 📸",
  "There are hot springs here! Perfect after a hike 🥾♨️",
  "Masagana Falls has 7 tiers — can you climb them all? 🧗",
  "The best sunset view? Macapili Beach! 🌅",
  "Baco River is perfect for kayaking! 🛶",
];

// ── Category-specific travel reminders ─────────────────────────────
const CATEGORY_REMINDERS: Record<AttractionCategory, string[]> = {
  waterfall: [
    "Wear aqua shoes — rocks near falls can be slippery! 🩴",
    "Bring a waterproof bag for your phone & wallet! 🎒",
    "Don't swim alone — always go with a buddy! 🏊",
    "Check water depth before jumping in! 💦",
    "Best visited in the morning for calmer water flow 🌅",
    "Bring insect repellent — forest trails have mosquitoes! 🦟",
  ],
  'hot-springs': [
    "Don't stay in hot water for more than 15-20 minutes! ♨️",
    "Drink plenty of water — hot springs can dehydrate you! 💧",
    "Remove metal jewelry before soaking — minerals may tarnish them 💍",
    "Shower before entering the spring — it's respectful! 🚿",
    "Bring extra clothes — you'll want dry ones after! 👕",
    "If you feel dizzy, step out and cool down immediately ⚠️",
  ],
  heritage: [
    "Please don't touch or climb on historical structures 🏛️",
    "Photography is usually allowed, but no flash indoors 📸",
    "Take only photos, leave only footprints! 👣",
    "Ask locals about the history — they love sharing stories! 📜",
    "Respect the site — some areas may be sacred or restricted 🙏",
    "Wear respectful clothing when visiting religious heritage sites 👔",
  ],
  nature: [
    "Stay on marked trails to protect the ecosystem! 🌿",
    "Don't pick flowers or disturb wildlife 🦋",
    "Bring biodegradable sunscreen to protect nature! ☀️",
    "Pack out all your trash — leave no trace! ♻️",
    "Bring water and snacks — nature spots may not have vendors 🥤",
    "Watch your step — tree roots and rocks on trails! 🥾",
  ],
  adventure: [
    "Wear proper footwear — no slippers on adventure trails! 🥾",
    "Let someone know your planned route before heading out 📱",
    "Bring a first aid kit for any adventure activity! 🏥",
    "Start early to avoid the midday heat! ☀️",
    "Check the weather before you go — safety first! 🌤️",
    "Stay hydrated — bring at least 1 liter of water 💧",
  ],
  lake: [
    "Life jackets are required for all boat rides! 🦺",
    "Don't swim beyond marked safe zones 🏊",
    "Bring polarized sunglasses — lake glare can be intense! 😎",
    "Best photos during golden hour — early morning or late afternoon 📸",
    "Don't litter in the lake — it's a protected area! ♻️",
    "Apply sunscreen — there's little shade on the water! ☀️",
  ],
  river: [
    "Watch for sudden water level changes, especially after rain! 🌊",
    "Wear water shoes for rocky riverbeds 🩴",
    "Don't leave food near the river — it attracts wildlife 🦎",
    "Check current strength before wading in 💪",
    "Best visited during dry season for safer water levels 🌤️",
    "Bring insect repellent for riverside areas! 🦟",
  ],
  resort: [
    "Follow resort rules and posted guidelines! 📋",
    "Bring your own towel — some resorts charge for rentals 🏖️",
    "Check check-in/check-out times in advance ⏰",
    "Ask about group discounts if you're with friends! 👫",
    "Respect quiet hours if staying overnight 🤫",
    "Bring cash — some resorts don't accept cards 💵",
  ],
  viewpoint: [
    "Best visited early morning or late afternoon for clear views! 🌄",
    "Bring a wide-angle lens for panoramic shots! 📷",
    "Stay behind safety barriers — don't risk it for a photo! ⚠️",
    "Wear comfortable shoes for the climb up! 👟",
    "Bring water — viewpoints are often uphill with no vendors 💧",
    "Sunset and sunrise are the golden hours here! 🌅",
  ],
  beach: [
    "Apply reef-safe sunscreen to protect marine life! 🐠",
    "Don't leave trash on the beach — pack it out! ♻️",
    "Swim near lifeguard stations when available 🏊",
    "Check tide schedules before swimming! 🌊",
    "Bring shade (umbrella or tent) — beach sun is intense! ☂️",
    "Wear aqua shoes on rocky beaches 🩴",
  ],
  park: [
    "Keep to walking paths — don't trample the grass! 🌱",
    "Don't feed wild animals — it disrupts their diet 🐒",
    "Bring a mat or blanket for picnic spots! 🧺",
    "Dispose trash properly — use bins provided ♻️",
    "Best visited in the morning for cooler weather 🌤️",
    "Respect other visitors — keep noise levels down 🤫",
  ],
};

// ── Spot-specific reminders keyed by attraction slug ───────────────
// These are shown INSTEAD of generic category reminders when the exact
// tourist spot is known. Each array contains tips unique to that place.
const SPOT_SPECIFIC_REMINDERS: Record<string, string[]> = {
  'largo-castillo-farm-resort': [
    "It's a farm resort — wear closed shoes for muddy paths! 🥾",
    "They blend agriculture & leisure — ask for a farm tour! 🌾",
    "Bring cash — cell signal may be spotty in Brgy. Estrella 💵",
    "Try the fresh produce if they offer it — farm-to-table! 🥬",
    "Check their opening hours: 6 AM – 6 PM ⏰",
  ],
  'naujan-lake-boardwalk-bicycle-lane': [
    "Rent a bike and ride the lakeside bicycle lane! 🚲",
    "The boardwalk is great for sunset photos — golden hour is magic! 🌅",
    "It's free and open 24 hours — visit any time! 🎉",
    "Naujan Lake is 8,100 hectares — the largest in Mindoro! 🏞️",
    "Watch for Philippine Ducks near the shore — they're endangered! 🦆",
    "Bring water — there aren't many vendors along the boardwalk 💧",
  ],
  'naujan-town-plaza': [
    "The plaza is in Poblacion I — the heart of Naujan! 🏛️",
    "Free entry and open 24 hours — perfect for a quick stop 🎉",
    "Look around for local food stalls near the plaza! 🍢",
    "This is a good starting point to explore nearby heritage sites 🗺️",
    "The Municipal Hall is right nearby — get tourist info there! ℹ️",
  ],
  'pungao-hot-spring-montelago-hot-spring': [
    "Water temperature is 38–42°C — ease in slowly! ♨️",
    "Entrance fee is ₱50 — bring exact change! 💵",
    "Don't soak for more than 15-20 minutes to avoid overheating ⚠️",
    "The minerals can tarnish jewelry — leave accessories behind! 💍",
    "Drink lots of water — hot springs dehydrate you fast! 💧",
    "Surrounded by igneous rock formations — geologically unique! 🪨",
  ],
  'macapili-beach': [
    "Macapili Beach has calm waters — great for wading! 🏖️",
    "Free entry and open 24 hours — perfect for sunrise visits! 🌅",
    "Bring reef-safe sunscreen to protect marine life! 🐠",
    "Pack your own food and water — few vendors around 🎒",
    "Don't leave trash on the beach — keep it pristine! ♻️",
  ],
  'malinao-beach-resort': [
    "It's a resort — check if they have day-use rates! 🏖️",
    "Fees vary — bring cash and ask at the entrance 💵",
    "Open 6 AM – 6 PM, plan your visit accordingly ⏰",
    "Located in Brgy. Sta. Cruz — enjoy the tropical vibe! 🌴",
    "Bring your own towel — some resorts charge for rentals 🏝️",
  ],
  'simbahang-bato': [
    "It's a 'church within a church' — a modern chapel inside 17th-century ruins! 🏛️",
    "Built by Augustinian missionaries — super historic! 📜",
    "Don't climb the old stone walls — they're fragile heritage structures! ⚠️",
    "Free entry, open 24 hours — great for photography anytime 📸",
    "The roofless ruins are stunning at golden hour! 🌅",
    "Respect the site — it may still be used for worship 🙏",
  ],
  'montelago-hot-spring': [
    "Mineral-rich waters ideal for therapeutic bathing! ♨️",
    "Entrance is ₱50 per person — bring cash! 💵",
    "Shower before entering the spring — it's respectful! 🚿",
    "Bring extra clothes — you'll want dry ones after! 👕",
    "If you feel dizzy, step out and cool down immediately ⚠️",
    "Open 6 AM – 6 PM, arrive early for fewer crowds! ⏰",
  ],
  'arangin-falls': [
    "Crystal-clear waters cascading over moss-covered rocks — stunning! 💦",
    "Entrance is ₱20 — very affordable! 💵",
    "Wear aqua shoes — rocks near the falls are slippery! 🩴",
    "Open 7 AM – 4 PM, arrive early for the best light! 📸",
    "Don't swim alone — always have a buddy! 🏊",
    "The natural swimming pools are the highlight — bring swimwear! 🩱",
  ],
  '333-steps': [
    "333 steps to the top — it's a workout! Take it slow 🏋️",
    "Wear comfortable shoes — no slippers for this climb! 👟",
    "Bring water — you'll need it halfway up! 💧",
    "The view from the top is worth every step! 🌄",
    "Free entry, open 24 hours — try it at sunrise! 🌅",
    "Great for exercise — locals use it as a morning routine! 🏃",
  ],
  'karacha-falls': [
    "Hidden gem in Brgy. Malvar — surrounded by dense tropical forest! 🌿",
    "The pool at the base is refreshingly cold — brace yourself! 🥶",
    "Entrance is only ₱15 — super affordable! 💵",
    "Open 7 AM – 4 PM, come early for fewer visitors! ⏰",
    "Bring insect repellent — it's deep in the forest! 🦟",
    "Waterproof bag is essential here — protect your phone! 📱",
  ],
  'dao-water-lily-mini-park': [
    "A peaceful mini park with water lilies — perfect for photos! 📸",
    "Free and open 24 hours — a quick, relaxing stop 🎉",
    "Best visited in the morning when lilies are in full bloom! 🌸",
    "Bring a mat for a picnic by the tranquil pond 🧺",
    "Don't pick the water lilies — let everyone enjoy them! 🌺",
  ],
  'paitan-river': [
    "Beautiful for nature walks, fishing, and riverside relaxation! 🎣",
    "Free entry, open 24 hours — a local favorite! 🎉",
    "Wear water shoes for the rocky riverbed! 🩴",
    "Check water levels — be cautious after heavy rain! 🌊",
    "Bring insect repellent for riverside areas! 🦟",
    "Best visited during dry season for safer conditions 🌤️",
  ],
};

// Generic navigation greeting templates — {name} gets replaced
const NAV_GREETINGS = [
  "We're heading to {name}! 🚀",
  "Let's go to {name}! 🗺️",
  "Adventure time — {name} awaits! 🦆",
  "Off to {name}! Follow the route! 💪",
  "On our way to {name}! Let's go! 🏃",
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
  /** The tourist spot currently being navigated to */
  targetAttraction?: Attraction | null;
}

export default function NawiMapBuddy({
  isNavigating = false,
  targetAttraction = null,
}: NawiMapBuddyProps) {
  const [pose, setPose] = useState<NawiPose>('map');
  const [bubble, setBubble] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Build spot-specific reminders when a target attraction is set
  const spotReminders = useMemo(() => {
    if (!targetAttraction) return [];

    // Prefer exact spot-specific reminders over generic category tips
    const slug = targetAttraction.slug;
    const spotTips = SPOT_SPECIFIC_REMINDERS[slug];
    // Check for explicit nawiReminder from Digital Tourism Trail data
    const trailReminder = targetAttraction.nawiReminder;

    if (spotTips && spotTips.length > 0) {
      // Use exact tips written for this specific tourist spot, prioritizing the trail reminder
      return trailReminder ? [trailReminder, ...spotTips] : spotTips;
    }

    // Fallback: build contextual tips from the spot's own data + category tips
    const category = targetAttraction.category;
    const categoryTips = CATEGORY_REMINDERS[category] || [];

    const contextTips: string[] = [];

    // Entrance fee reminder
    if (targetAttraction.entrance_fee && targetAttraction.entrance_fee !== 'Free') {
      contextTips.push(`Entrance fee is ${targetAttraction.entrance_fee} — bring cash! 💵`);
    } else if (targetAttraction.entrance_fee === 'Free') {
      contextTips.push(`Good news — ${targetAttraction.name} is FREE entry! 🎉`);
    }

    // Opening hours reminder
    if (targetAttraction.opening_hours && targetAttraction.opening_hours !== 'Open 24 hours') {
      contextTips.push(`Hours: ${targetAttraction.opening_hours} — plan accordingly! ⏰`);
    }

    // Contact number tip
    if (targetAttraction.contact_number) {
      contextTips.push(`Need info? Call ahead: ${targetAttraction.contact_number} 📞`);
    }

    const combinedTips = [...contextTips, ...categoryTips];
    return trailReminder ? [trailReminder, ...combinedTips] : combinedTips;
  }, [targetAttraction]);

  // Show a speech bubble for a set duration
  const showBubble = useCallback((text: string, durationMs = 4000) => {
    setBubble(text);
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => setBubble(null), durationMs);
  }, []);

  // Tap handler — show a fun fact (or spot-specific tip when navigating)
  const handleTap = useCallback(() => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);

    if (isNavigating && spotReminders.length > 0) {
      // Show a spot-specific reminder
      showBubble(pickRandom(spotReminders), 5000);
    } else {
      // Show a generic fun fact
      showBubble(pickRandom(FUN_FACTS), 5000);
    }
    setPose(pickRandom(isNavigating ? NAV_POSES : IDLE_POSES));
  }, [showBubble, isNavigating, spotReminders]);

  // Idle rotation: every 12-18s, change pose and occasionally show a quip
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 12000 + Math.random() * 6000;
      idleTimerRef.current = setTimeout(() => {
        const poses = isNavigating ? NAV_POSES : IDLE_POSES;
        setPose(pickRandom(poses));

        // ~40% chance to show a quip
        if (Math.random() < 0.4) {
          if (isNavigating && spotReminders.length > 0) {
            // Show a spot-specific reminder during navigation
            showBubble(pickRandom(spotReminders), 4500);
          } else {
            showBubble(pickRandom(IDLE_QUIPS), 4000);
          }
        }

        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isNavigating, showBubble, spotReminders]);

  // When navigation starts, react immediately with a contextual greeting
  useEffect(() => {
    if (isNavigating && targetAttraction) {
      setPose('map');
      const greeting = pickRandom(NAV_GREETINGS).replace('{name}', targetAttraction.name);
      showBubble(greeting, 3500);
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 600);

      // Show a spot-specific tip shortly after the greeting
      const tipTimer = setTimeout(() => {
        if (spotReminders.length > 0) {
          showBubble(pickRandom(spotReminders), 5000);
          setPose(pickRandom(NAV_POSES));
        }
      }, 5500);
      return () => clearTimeout(tipTimer);
    }
  }, [isNavigating, targetAttraction, showBubble, spotReminders]);

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
      className="nawi-buddy-container"
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
