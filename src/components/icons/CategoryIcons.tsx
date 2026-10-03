import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

// 1. Lake (Calm water ripples, distant hills, and morning sun)
export const LakeIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="m2 13 5-5 4 4 4-5 7 6" />
    <circle cx="18" cy="6" r="2" />
    <path d="M3 17c2.5-1 5 1 7.5 0s5-1 7.5 0 3 .5 3 .5" />
    <path d="M6 21c2-.75 4 .75 6 0s4-.75 6 0" />
  </svg>
);

// 2. Waterfall (Steep rock cliffs with cascading streams into a plunge pool)
export const WaterfallIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M2 4h6v6c0 1.5 1 2 2 2" />
    <path d="M14 12c1 0 2-.5 2-2V4h6" />
    <path d="M9 8v9" />
    <path d="M12 6v11" />
    <path d="M15 9v8" />
    <path d="M3 20c3-1 6 1 9 0s6 1 9 0" />
  </svg>
);

// 3. Heritage (Historical Spanish-era stone facade, bell arch & ruins cross)
export const HeritageIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 2v3M10.5 3.5h3" />
    <path d="m3 9 9-4 9 4" />
    <path d="M5 9v12h14V9" />
    <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
    <path d="M7 13h2M15 13h2M7 17h1M16 17h1" />
  </svg>
);

// 4. Hot Springs (Thermal steam waves rising from a natural rock pool)
export const HotSpringsIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M4 17a8 4 0 0 0 16 0" />
    <path d="M2 19h20" />
    <path d="M7 12c0-2 2-2 2-4s-2-2-2-4" />
    <path d="M12 12c0-2 2-2 2-4s-2-2-2-4" />
    <path d="M17 12c0-2 2-2 2-4s-2-2-2-4" />
  </svg>
);

// 5. River (Perspective winding river flowing between contoured banks)
export const RiverIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M4 3c4 4-2 9 3 14s4 4 4 4" />
    <path d="M13 3c4 4-2 9 3 14s4 4 4 4" />
    <path d="M8 8c1 1 2 1 3 0" />
    <path d="M9 14c1 1 2 1 3 0" />
  </svg>
);

// 6. Nature (Sprouting organic twin leaves)
export const NatureIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 22v-8" />
    <path d="M12 14c-4.5 0-7.5-3.5-7.5-7.5 4.5 0 7.5 3.5 7.5 7.5z" />
    <path d="M12 10c3.5 0 6.5-2.5 6.5-6-3.5 0-6.5 2.5-6.5 6z" />
    <path d="M4.5 6.5C7.5 9 10 11 12 14" />
  </svg>
);

// 7. Adventure (Explorer navigation compass with directional star)
export const AdventureIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="m14.5 9.5-2 5-3-3 5-2z" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
  </svg>
);

// 8. Viewpoint (Scenic observation binoculars on a stand)
export const ViewpointIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="3" y="7" width="6" height="11" rx="2" />
    <rect x="15" y="7" width="6" height="11" rx="2" />
    <path d="M9 12h6" />
    <path d="M12 18v4" />
    <path d="M8 22h8" />
    <path d="M6 7V5a6 6 0 0 1 12 0v2" />
  </svg>
);

// 9. Resort (Beach umbrella with lounge chair and palm accents)
export const ResortIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M17 21H7" />
    <path d="M12 3v18" />
    <path d="M4.6 11C5.5 6.5 8.5 3 12 3s6.5 3.5 7.4 8" />
    <path d="M4.6 11H12" />
    <path d="M18 16l3 5" />
    <path d="M16 16h5" />
  </svg>
);

// 10. Beach (Ocean waves meeting a sandy shore with sun)
export const BeachIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="18" cy="4" r="2" />
    <path d="M2 14c2-1 4 1 6 0s4-1 6 0 4 1 6 0" />
    <path d="M2 18c2-1 4 1 6 0s4-1 6 0 4 1 6 0" />
    <path d="M10 10V4l5 3-5 3z" />
    <path d="M2 22h20" />
  </svg>
);

// 11. Park (Trees and bench in a green space)
export const ParkIcon: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 13V7" />
    <path d="M12 7c-3 0-5-2.5-5-5 2.5 0 5 2.5 5 5z" />
    <path d="M12 7c3 0 5-2.5 5-5-2.5 0-5 2.5-5 5z" />
    <path d="M12 13c-2.5 0-4.5-2-4.5-4 2 0 4.5 2 4.5 4z" />
    <path d="M12 13c2.5 0 4.5-2 4.5-4-2 0-4.5 2-4.5 4z" />
    <path d="M12 13v9" />
    <path d="M4 22h16" />
  </svg>
);

// ---------- Utility map for runtime lookups ----------

import type { AttractionCategory } from '@/lib/types/database';

export const CATEGORY_ICONS: Record<AttractionCategory, React.FC<IconProps>> = {
  lake: LakeIcon,
  waterfall: WaterfallIcon,
  heritage: HeritageIcon,
  'hot-springs': HotSpringsIcon,
  river: RiverIcon,
  nature: NatureIcon,
  adventure: AdventureIcon,
  viewpoint: ViewpointIcon,
  resort: ResortIcon,
  beach: BeachIcon,
  park: ParkIcon,
};

/**
 * Returns the raw SVG string for a category — used in Leaflet DivIcon markers
 * where React components can't be rendered.
 */
export const CATEGORY_SVG_STRINGS: Record<AttractionCategory, string> = {
  lake: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 13 5-5 4 4 4-5 7 6"/><circle cx="18" cy="6" r="2"/><path d="M3 17c2.5-1 5 1 7.5 0s5-1 7.5 0 3 .5 3 .5"/><path d="M6 21c2-.75 4 .75 6 0s4-.75 6 0"/></svg>`,
  waterfall: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6v6c0 1.5 1 2 2 2"/><path d="M14 12c1 0 2-.5 2-2V4h6"/><path d="M9 8v9"/><path d="M12 6v11"/><path d="M15 9v8"/><path d="M3 20c3-1 6 1 9 0s6 1 9 0"/></svg>`,
  heritage: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v3M10.5 3.5h3"/><path d="m3 9 9-4 9 4"/><path d="M5 9v12h14V9"/><path d="M10 21v-4a2 2 0 0 1 4 0v4"/><path d="M7 13h2M15 13h2M7 17h1M16 17h1"/></svg>`,
  'hot-springs': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17a8 4 0 0 0 16 0"/><path d="M2 19h20"/><path d="M7 12c0-2 2-2 2-4s-2-2-2-4"/><path d="M12 12c0-2 2-2 2-4s-2-2-2-4"/><path d="M17 12c0-2 2-2 2-4s-2-2-2-4"/></svg>`,
  river: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3c4 4-2 9 3 14s4 4 4 4"/><path d="M13 3c4 4-2 9 3 14s4 4 4 4"/><path d="M8 8c1 1 2 1 3 0"/><path d="M9 14c1 1 2 1 3 0"/></svg>`,
  nature: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-8"/><path d="M12 14c-4.5 0-7.5-3.5-7.5-7.5 4.5 0 7.5 3.5 7.5 7.5z"/><path d="M12 10c3.5 0 6.5-2.5 6.5-6-3.5 0-6.5 2.5-6.5 6z"/><path d="M4.5 6.5C7.5 9 10 11 12 14"/></svg>`,
  adventure: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m14.5 9.5-2 5-3-3 5-2z"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/></svg>`,
  viewpoint: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="6" height="11" rx="2"/><rect x="15" y="7" width="6" height="11" rx="2"/><path d="M9 12h6"/><path d="M12 18v4"/><path d="M8 22h8"/><path d="M6 7V5a6 6 0 0 1 12 0v2"/></svg>`,
  resort: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21H7"/><path d="M12 3v18"/><path d="M4.6 11C5.5 6.5 8.5 3 12 3s6.5 3.5 7.4 8"/><path d="M4.6 11H12"/><path d="M18 16l3 5"/><path d="M16 16h5"/></svg>`,
  beach: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="4" r="2"/><path d="M2 14c2-1 4 1 6 0s4-1 6 0 4 1 6 0"/><path d="M2 18c2-1 4 1 6 0s4-1 6 0 4 1 6 0"/><path d="M10 10V4l5 3-5 3z"/><path d="M2 22h20"/></svg>`,
  park: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13V7"/><path d="M12 7c-3 0-5-2.5-5-5 2.5 0 5 2.5 5 5z"/><path d="M12 7c3 0 5-2.5 5-5-2.5 0-5 2.5-5 5z"/><path d="M12 13c-2.5 0-4.5-2-4.5-4 2 0 4.5 2 4.5 4z"/><path d="M12 13c2.5 0 4.5-2 4.5-4-2 0-4.5 2-4.5 4z"/><path d="M12 13v9"/><path d="M4 22h16"/></svg>`,
};
