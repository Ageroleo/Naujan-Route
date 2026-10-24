'use client';

import React from 'react';
import Image from 'next/image';
import type { NawiPose as CanonicalNawiPose } from '@/data/naujanTrailData';

export type NawiPose =
  | CanonicalNawiPose
  | 'camera'
  | 'signpost'
  | 'scooter'
  | 'singing'
  | 'presenting'
  | 'stepping'
  | 'map-ground'
  | 'avatar'
  // Legacy aliases for backward compatibility
  | 'default'
  | 'wave'
  | 'pointing'
  | 'compass'
  | 'binoculars';

export type NawiSize = 'sm' | 'md' | 'lg' | 'xl';

export interface NawiMascotProps {
  /** The specific 2D mascot pose */
  pose?: NawiPose;
  /** Size preset or custom pixel number */
  size?: NawiSize | number;
  /** Adds a gentle floating hover animation and subtle scale effect */
  animate?: boolean;
  /** Applies subtle drop shadow for depth */
  removeWhiteBg?: boolean;
  /** Optional comic-style speech bubble */
  speechBubble?: string;
  /** Position of the speech bubble relative to Nawi */
  speechBubblePosition?: 'top' | 'left' | 'right';
  /** Additional wrapper CSS classes */
  className?: string;
  /** Additional mascot image container CSS classes */
  spriteClassName?: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Accessibility label */
  alt?: string;
}

/**
 * Individual cropped mascot image paths under /images/mascot/
 */
export const NAWI_POSE_IMAGES: Record<string, string> = {
  'thumbs-up': '/images/mascot/thumbs-up.png',
  phone: '/images/mascot/phone.png',
  flying: '/images/mascot/flying.png',
  lakeside: '/images/mascot/lakeside.png',
  map: '/images/mascot/map.png',
  salute: '/images/mascot/salute.png',
  sunset: '/images/mascot/sunset.png',
  walking: '/images/mascot/walking.png',
  coconut: '/images/mascot/coconut.png',
  camera: '/images/mascot/camera.png',
  signpost: '/images/mascot/signpost.png',
  scooter: '/images/mascot/scooter.png',
  singing: '/images/mascot/singing.png',
  presenting: '/images/mascot/presenting.png',
  stepping: '/images/mascot/stepping.png',
  'map-ground': '/images/mascot/map-ground.png',
  avatar: '/images/mascot/avatar.png',
  // Backward compatibility mappings:
  default: '/images/mascot/thumbs-up.png',
  wave: '/images/mascot/wave.png',
  pointing: '/images/mascot/phone.png',
  compass: '/images/mascot/map.png',
  binoculars: '/images/mascot/binoculars.png',
};

/**
 * 3x3 Sprite Sheet Coordinates preserved for backwards compatibility
 */
export const NAWI_POSE_COORDINATES: Record<string, string> = {
  'thumbs-up': '0% 0%',
  phone: '50% 0%',
  flying: '100% 0%',
  lakeside: '0% 50%',
  map: '50% 50%',
  salute: '100% 50%',
  sunset: '0% 100%',
  walking: '50% 100%',
  coconut: '100% 100%',
  default: '0% 0%',
  wave: '100% 0%',
  pointing: '50% 0%',
  compass: '50% 50%',
  binoculars: '0% 50%',
  signpost: '50% 100%',
};

export const NAWI_POSE_DESCRIPTIONS: Record<string, string> = {
  'thumbs-up': 'Nawi giving a cheerful thumbs-up',
  phone: 'Nawi holding a smartphone and pointing at emergency hotlines',
  flying: 'Nawi flying with wings spread wide',
  lakeside: 'Nawi sitting peacefully on a lakeside rock with scenic mountains',
  map: 'Nawi holding an unfolded trail map with a location pin',
  salute: 'Nawi giving a scout salute with a friendly wink',
  sunset: 'Nawi looking out over heritage church silhouette at sunset',
  walking: 'Nawi marching cheerfully along the trail',
  coconut: 'Nawi sipping fresh buko juice under the sun',
};

/**
 * Maps attraction name, slug, or category to its matching Nawi pose
 */
export function getPoseForAttraction(identifier?: string): CanonicalNawiPose {
  if (!identifier) return 'salute';
  const id = identifier.toLowerCase();

  if (id.includes('lake') || id.includes('boardwalk') || id.includes('viewpoint')) {
    return 'lakeside';
  }
  if (id.includes('plaza') || id.includes('walking') || id.includes('town')) {
    return 'walking';
  }
  if (
    id.includes('bato') ||
    id.includes('333') ||
    id.includes('church') ||
    id.includes('altar') ||
    id.includes('heritage')
  ) {
    return 'sunset';
  }
  if (
    id.includes('malinao') ||
    id.includes('macapili') ||
    id.includes('beach') ||
    id.includes('spring') ||
    id.includes('montelago') ||
    id.includes('pungao') ||
    id.includes('lily') ||
    id.includes('dao')
  ) {
    return 'coconut';
  }
  if (
    id.includes('falls') ||
    id.includes('arangin') ||
    id.includes('karacha') ||
    id.includes('river') ||
    id.includes('paitan') ||
    id.includes('trail') ||
    id.includes('trek')
  ) {
    return 'map';
  }

  return 'salute';
}

const SIZE_MAP: Record<NawiSize, { widthClass: string; heightClass: string; pixelSize: number }> = {
  sm: { widthClass: 'w-16', heightClass: 'h-16', pixelSize: 64 },
  md: { widthClass: 'w-24', heightClass: 'h-24', pixelSize: 96 },
  lg: { widthClass: 'w-32', heightClass: 'h-32', pixelSize: 128 },
  xl: { widthClass: 'w-44', heightClass: 'h-44', pixelSize: 176 },
};

/**
 * NawiMascot:
 * Full-body 2D character silhouette rendered from individually cropped high-resolution images.
 * NEVER crops Nawi into a small circle (`rounded-full`).
 */
export default function NawiMascot({
  pose = 'thumbs-up',
  size = 'md',
  animate = false,
  removeWhiteBg = true,
  speechBubble,
  speechBubblePosition = 'top',
  className = '',
  spriteClassName = '',
  onClick,
  alt,
}: NawiMascotProps) {
  const imageSrc = NAWI_POSE_IMAGES[pose] || '/images/mascot/thumbs-up.png';
  const description = alt || NAWI_POSE_DESCRIPTIONS[pose] || 'Nawi the Naujan Lake Duck mascot';

  // Determine sizing
  let sizeStyle: React.CSSProperties = {};
  let sizeClasses = '';

  if (typeof size === 'number') {
    sizeStyle = { width: `${size}px`, height: `${size}px` };
  } else {
    const config = SIZE_MAP[size] || SIZE_MAP.md;
    sizeClasses = `${config.widthClass} ${config.heightClass}`;
  }

  return (
    <div
      className={`nawi-mascot-wrapper inline-flex flex-col items-center relative select-none ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {/* Comic Speech Bubble */}
      {speechBubble && (
        <div
          className={`nawi-speech-bubble relative z-10 max-w-[260px] sm:max-w-xs px-3.5 py-2.5 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 text-xs font-bold shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] leading-snug text-center mb-2.5 animate-fade-in ${
            speechBubblePosition === 'left' ? 'sm:-translate-x-8' : ''
          }`}
        >
          <span>{speechBubble}</span>
          {/* Triangular Tail */}
          <div
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: '9px solid #0f172a',
            }}
          />
          <div
            className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '7px solid #ffffff',
            }}
          />
        </div>
      )}

      {/* Full-Body Character Silhouette Container using individually cropped image */}
      <div
        className={`relative shrink-0 transition-transform duration-300 ${sizeClasses} hover:scale-105 ${spriteClassName}`}
        style={sizeStyle}
      >
        <Image
          src={imageSrc}
          alt={description}
          fill
          sizes="(max-width: 768px) 128px, 176px"
          className="object-contain pointer-events-none select-none"
          style={{
            mixBlendMode: 'normal',
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.12))',
          }}
          priority={size === 'xl' || pose === 'flying'}
          unoptimized
          draggable={false}
        />
      </div>
    </div>
  );
}
