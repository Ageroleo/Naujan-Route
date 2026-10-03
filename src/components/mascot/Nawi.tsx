'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Available Nawi mascot poses.
 *
 * - `default`     – neutral standing pose, friendly smile
 * - `map`         – walking while reading a map (exploring)
 * - `wave`        – jumping excitedly with wings spread (welcome)
 * - `binoculars`  – sitting on rock looking through binoculars (searching/discovering)
 * - `pointing`    – pointing to the right (directing/guiding)
 * - `compass`     – holding compass with thumbs up (navigation/tips)
 * - `signpost`    – leaning on signpost, slightly sad (empty state/lost)
 */
export type NawiPose =
  | 'default'
  | 'map'
  | 'wave'
  | 'binoculars'
  | 'pointing'
  | 'compass'
  | 'signpost';

/** Map each pose to its image path under /images/mascot/ */
const POSE_IMAGES: Record<NawiPose, string> = {
  default: '/images/mascot/nawi-default.jpg',
  map: '/images/mascot/nawi-map.jpg',
  wave: '/images/mascot/nawi-wave.jpg',
  binoculars: '/images/mascot/nawi-binoculars.jpg',
  pointing: '/images/mascot/nawi-pointing.jpg',
  compass: '/images/mascot/nawi-compass.jpg',
  signpost: '/images/mascot/nawi-signpost.jpg',
};

export interface NawiMascotProps {
  /** Width/height of the mascot container (default 200) */
  size?: number | string;
  /** Additional CSS classes */
  className?: string;
  /** Show a "NAWI • NAUJAN" pill badge below the mascot */
  showBanner?: boolean;
  /** Optional contextual speech-bubble text */
  speechBubble?: string;
  /** Which pose illustration to display (default "default") */
  pose?: NawiPose;
}

/**
 * Nawi — the Naujan Lake Duck mascot.
 *
 * Now rendered as a pre-illustrated image with multiple pose variants
 * instead of an inline SVG.
 */
const NawiMascot: React.FC<NawiMascotProps> = ({
  size = 200,
  className = '',
  showBanner = false,
  speechBubble,
  pose = 'default',
}) => {
  const sizeNum = typeof size === 'string' ? parseInt(size, 10) || 200 : size;

  return (
    <div
      className={`nawi-mascot-wrapper ${className}`}
      style={{
        width: sizeNum,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Speech bubble */}
      {speechBubble && (
        <div
          className="nawi-speech-bubble"
          style={{
            position: 'relative',
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 14,
            padding: '10px 14px',
            fontSize: Math.max(11, sizeNum * 0.06),
            lineHeight: 1.45,
            color: '#334155',
            maxWidth: sizeNum * 1.4,
            marginBottom: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            textAlign: 'center',
          }}
        >
          {speechBubble}
          {/* Tail pointing down */}
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            style={{
              position: 'absolute',
              bottom: -9,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <path
              d="M0 0 L8 10 L16 0"
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />
            <path d="M1 0 L8 8.5 L15 0" fill="#ffffff" stroke="none" />
          </svg>
        </div>
      )}

      {/* Mascot illustration */}
      <div
        style={{
          width: sizeNum,
          height: sizeNum,
          position: 'relative',
        }}
      >
        <Image
          src={POSE_IMAGES[pose]}
          alt={`Nawi the Naujan Lake Duck mascot — ${pose} pose`}
          width={sizeNum}
          height={sizeNum}
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '100%',
          }}
          draggable={false}
          unoptimized
        />
      </div>

      {/* Banner pill */}
      {showBanner && (
        <div
          className="nawi-banner"
          style={{
            marginTop: 6,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 14px',
            borderRadius: 9999,
            background: 'linear-gradient(135deg, #059669, #0891b2)',
            color: '#ffffff',
            fontSize: Math.max(10, sizeNum * 0.055),
            fontWeight: 700,
            letterSpacing: '0.06em',
            boxShadow: '0 2px 8px rgba(5,150,105,0.25)',
          }}
        >
          NAWI&nbsp;•&nbsp;NAUJAN
        </div>
      )}
    </div>
  );
};

export default NawiMascot;
