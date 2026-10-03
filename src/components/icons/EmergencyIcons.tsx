import React from "react";

export interface EmergencyIconProps extends React.SVGProps<SVGSVGElement> {
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

// 1. MDRRMO Naujan (Disaster Response & Rescue Buoy / Life Ring)
export const MdrrmoIcon: React.FC<EmergencyIconProps> = ({ size = 24, className = "", ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M16.24 16.24l2.83 2.83" />
    <path d="M19.07 4.93l-2.83 2.83" />
    <path d="M7.76 16.24l-2.83 2.83" />
  </svg>
);

// 2. PNP Naujan (Philippine National Police Shield Badge with Star)
export const PnpIcon: React.FC<EmergencyIconProps> = ({ size = 24, className = "", ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M12 2l8 3.5v6.2c0 5.4-3.4 10.3-8 11.8-4.6-1.5-8-6.4-8-11.8V5.5L12 2z" />
    <polygon points="12 7.5 13.3 10.2 16.3 10.6 14.1 12.7 14.6 15.6 12 14.2 9.4 15.6 9.9 12.7 7.7 10.6 10.7 10.2 12 7.5" fill="currentColor" stroke="none" />
  </svg>
);

// 3. Naujan Municipal Office / Hall (Government Columns & Pediment)
export const MunicipalHallIcon: React.FC<EmergencyIconProps> = ({ size = 24, className = "", ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="m3 9 9-6 9 6" />
    <path d="M4 9h16v2H4z" />
    <path d="M6 11v7" />
    <path d="M10 11v7" />
    <path d="M14 11v7" />
    <path d="M18 11v7" />
    <path d="M2 21h20" />
    <path d="M3 18h18" />
  </svg>
);

// 4. BFP Naujan (Bureau of Fire Protection - Flame & Shield)
export const BfpIcon: React.FC<EmergencyIconProps> = ({ size = 24, className = "", ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M8.5 14.5A3.5 3.5 0 0 0 12 18a3.5 3.5 0 0 0 3.5-3.5c0-2-1.5-3-2-4.5-.5 1-1.5 1.5-2 1.5-1 0-1.5-.5-1.5-1.5 0-2 2-3.5 2-6C8.5 6 5 9.5 5 14a7 7 0 0 0 14 0c0-3-1.5-5.5-3-7" />
  </svg>
);

// 5. Philippine Red Cross - Oriental Mindoro (Official Humanitarian Cross)
export const RedCrossIcon: React.FC<EmergencyIconProps> = ({ size = 24, className = "", ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <circle cx="12" cy="12" r="9.5" />
    <path
      d="M10 6h4v4h4v4h-4v4h-4v-4H6v-4h4V6z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

// 6. Philippine Coast Guard - Calapan (Maritime Anchor & Flukes)
export const CoastGuardIcon: React.FC<EmergencyIconProps> = ({ size = 24, className = "", ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v13" />
    <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    <path d="M5 20h2" />
    <path d="M17 20h2" />
    <path d="M8 10h8" />
  </svg>
);

// 7. Naujan Municipality Tourism Office (Information Compass & Flag)
export const TourismOfficeIcon: React.FC<EmergencyIconProps> = ({ size = 24, className = "", ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12" y2="8.01" strokeWidth="2.5" />
    <line x1="12" y1="11" x2="12" y2="16" strokeWidth="2" />
    <path d="M10.5 11H12" strokeWidth="2" />
  </svg>
);

// Mapping from EmergencyCategory to icon component
import type { EmergencyCategory } from '@/lib/types/database';

export const EMERGENCY_ICONS: Record<EmergencyCategory, React.FC<EmergencyIconProps>> = {
  disaster: MdrrmoIcon,
  police: PnpIcon,
  medical: RedCrossIcon,
  fire: BfpIcon,
  government: MunicipalHallIcon,
  tourism: TourismOfficeIcon,
};
