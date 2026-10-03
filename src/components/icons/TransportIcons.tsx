import React from "react";

export interface TransportIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

const baseProps = (size: number | string, className: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
});

// 1. Authentic Philippine Tricycle (Motorcycle + Covered Passenger Sidecar)
export const TricycleIcon: React.FC<TransportIconProps> = ({ size = 24, className = "", ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    {/* Passenger Sidecar Cabin & Roof */}
    <path d="M3 8.5h11c1 0 2 .8 2 1.8V17H2v-6.5C2 9.3 2.5 8.5 3 8.5z" />
    {/* Sidecar Window */}
    <rect x="5" y="11" width="5" height="3" rx="0.5" />
    {/* Motorcycle Handlebar & Front Windshield */}
    <path d="M16 11.5l3-2h2" />
    <path d="M18 9.5v2.5" />
    {/* Sidecar Wheel */}
    <circle cx="6" cy="18.5" r="2.5" />
    <circle cx="6" cy="18.5" r="0.8" fill="currentColor" />
    {/* Motorcycle Front Wheel */}
    <circle cx="19.5" cy="18.5" r="2.5" />
    <circle cx="19.5" cy="18.5" r="0.8" fill="currentColor" />
    {/* Chassis Connector */}
    <path d="M8.5 18.5h8.5" />
  </svg>
);

// 2. Authentic Philippine Jeepney (Long Hood, Roof Visor & Open Passenger Body)
export const JeepneyIcon: React.FC<TransportIconProps> = ({ size = 24, className = "", ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    {/* Roof & Sun Visor */}
    <path d="M2 7.5h19l1.5 2.5" />
    {/* Front Hood & Fender */}
    <path d="M21 10h-2.5V16h3.5c.6 0 1-.4 1-1v-3.5c0-.8-.5-1.5-2-1.5z" />
    {/* Main Passenger Body & Rear Entry */}
    <path d="M1.5 16V10c0-1.2.8-2.5 2-2.5h15" />
    {/* Windows & Rails */}
    <path d="M4 11h3.5v2.5H4z" />
    <path d="M9.5 11H13v2.5H9.5z" />
    <path d="M15 11h2.5v2.5H15z" />
    {/* Rear Wheel */}
    <circle cx="6" cy="17.5" r="2.5" />
    <circle cx="6" cy="17.5" r="0.8" fill="currentColor" />
    {/* Front Wheel */}
    <circle cx="18" cy="17.5" r="2.5" />
    <circle cx="18" cy="17.5" r="0.8" fill="currentColor" />
    {/* Undercarriage & Stepboard */}
    <path d="M1 16h2.5M8.5 17.5h7M20.5 16h1.5" />
  </svg>
);

// 3. Lake Naujan Motorized Bangka / Outrigger Boat (Slender Hull, Canopy & Katig)
export const BangkaIcon: React.FC<TransportIconProps> = ({ size = 24, className = "", ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    {/* Slender Hull with Upturned Bow & Stern */}
    <path d="M2 14.5c4.5 1.5 15.5 1.5 20 0l-2.5 3.5H4.5L2 14.5z" />
    {/* Shaded Passenger Canopy */}
    <path d="M6 7.5h12" />
    <path d="M8 7.5v6" />
    <path d="M16 7.5v6" />
    {/* Outrigger Support Booms (Tarik) */}
    <path d="M7 15l-3 4" />
    <path d="M17 15l-3 4" />
    {/* Outrigger Bamboo Float (Katig) & Water Ripple */}
    <path d="M3 20.5h18" strokeWidth="2.2" />
  </svg>
);

// Mapping from VehicleType to icon component for easy lookup
import type { VehicleType } from '@/lib/types/database';

export const VEHICLE_ICONS: Record<VehicleType, React.FC<TransportIconProps>> = {
  tricycle: TricycleIcon,
  jeepney: JeepneyIcon,
  boat: BangkaIcon,
};
