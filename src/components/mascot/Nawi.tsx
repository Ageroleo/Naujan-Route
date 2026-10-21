'use client';

import React from 'react';
import NawiMascotComponent, {
  type NawiPose as FullNawiPose,
  type NawiSize,
  getPoseForAttraction,
} from '@/components/NawiMascot';

export type NawiPose = FullNawiPose;
export { getPoseForAttraction };

export interface NawiMascotProps {
  /** Width/height of the mascot container or preset */
  size?: number | string | NawiSize;
  /** Additional CSS classes */
  className?: string;
  /** Show a "NAWI • NAUJAN" pill badge below the mascot */
  showBanner?: boolean;
  /** Optional contextual speech-bubble text */
  speechBubble?: string;
  /** Which pose illustration to display */
  pose?: NawiPose;
  /** Enable floating animation */
  animate?: boolean;
  /** Remove white sprite background with mix-blend-multiply */
  removeWhiteBg?: boolean;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Nawi — the Naujan Lake Duck mascot.
 * Upgraded from circular/pre-illustrated image to full-body 2D sprite character.
 */
const NawiMascot: React.FC<NawiMascotProps> = ({
  size = 120,
  className = '',
  showBanner = false,
  speechBubble,
  pose = 'thumbs-up',
  animate = false,
  removeWhiteBg = true,
  onClick,
}) => {
  // Support numeric string or preset
  let resolvedSize: NawiSize | number = 'md';
  if (typeof size === 'number') {
    resolvedSize = size;
  } else if (size === 'sm' || size === 'md' || size === 'lg' || size === 'xl') {
    resolvedSize = size;
  } else if (typeof size === 'string') {
    const parsed = parseInt(size, 10);
    resolvedSize = isNaN(parsed) ? 'md' : parsed;
  }

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <NawiMascotComponent
        pose={pose}
        size={resolvedSize}
        animate={animate}
        removeWhiteBg={removeWhiteBg}
        speechBubble={speechBubble}
        onClick={onClick}
      />
      {showBanner && (
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-xs tracking-wider uppercase">
          <span>🦆</span>
          <span>Nawi • Naujan Guide</span>
        </div>
      )}
    </div>
  );
};

export default NawiMascot;
