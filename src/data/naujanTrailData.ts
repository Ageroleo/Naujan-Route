export type NawiPose =
  | "thumbs-up"
  | "phone"
  | "flying"
  | "lakeside"
  | "map"
  | "salute"
  | "sunset"
  | "walking"
  | "coconut";

export interface TrailAttraction {
  id: string;
  name: string;
  publishedLocation: string;
  publishedContact: string;
  admissionStatus: string;
  visitorInfo: string;
  activities: string[];
  activitiesSummary: string;
  nawiReminder: string;
  nawiPose: NawiPose;
  sourceUrl?: string;
  sourceLabel: string;
  requiresVerification: boolean;
  verificationNote?: string;
}

export interface TourismOffice {
  id: string;
  office: string;
  location: string;
  publishedContact: string[];
  purpose: string;
  needsLinkVerification?: boolean;
}

export interface TravelAgency {
  id: string;
  agency: string;
  publishedLocation: string;
  publishedContacts: string[];
  isLocalNaujan: boolean;
}

export interface EmergencyContact {
  id: string;
  service: string;
  publishedContacts: string[];
  useAndVerification: string;
  isPrimaryHotline: boolean;
}

export interface TrailReference {
  id: number;
  title: string;
  url: string;
}

export const NAUJAN_ATTRACTIONS: TrailAttraction[] = [
  {
    id: "naujan-lake-boardwalk",
    name: "Naujan Lake Boardwalk and Bicycle Lane",
    publishedLocation: "Vista Pilar Batong Dalig (listed under Socorro)",
    publishedContact: "0939-363-5900",
    admissionStatus: "Free admission listed",
    visitorInfo: "Free admission listed; cycling/walking. Verify municipality and map pin.",
    activities: ["Walking", "Jogging", "Cycling", "Sightseeing", "Lake photography"],
    activitiesSummary: "Walking, jogging, cycling, sightseeing, lake photography",
    nawiReminder: "Enjoy walking or cycling while viewing Naujan Lake. Stay on designated pathways, be careful near the water, and avoid slippery areas during rainy weather.",
    nawiPose: "lakeside",
    sourceUrl: "https://www.travelorientalmindoro.ph/place/naujan-lake-boardwalk-and-bicycle-lane",
    sourceLabel: "travelorientalmindoro.ph/place/naujan-lake-boardwalk-and-bicycle-lane",
    requiresVerification: true,
    verificationNote: "The Boardwalk listing places Batong Dalig in Socorro, although the project centers on Naujan. Confirm municipal jurisdiction and exact map coordinates."
  },
  {
    id: "naujan-town-plaza",
    name: "Naujan Town Plaza",
    publishedLocation: "Poblacion, Naujan",
    publishedContact: "0999-958-6334",
    admissionStatus: "Free admission listed",
    visitorInfo: "Free admission listed; also known as Liwasang Bonifacio.",
    activities: ["Sightseeing", "Relaxation", "Photography", "Community events", "Town celebrations"],
    activitiesSummary: "Sightseeing, relaxation, photography, community events and town celebrations",
    nawiReminder: "Keep the surroundings clean, dispose of trash properly, and respect public spaces. Check local announcements for scheduled events.",
    nawiPose: "walking",
    sourceUrl: "https://www.travelorientalmindoro.ph/place/naujan-town-plaza",
    sourceLabel: "travelorientalmindoro.ph/place/naujan-town-plaza",
    requiresVerification: false
  },
  {
    id: "333-steps",
    name: "333 Steps",
    publishedLocation: "Melgar A, Naujan",
    publishedContact: "0921-807-6578",
    admissionStatus: "Free admission listed",
    visitorInfo: "Free admission listed; 333 stairs to a viewpoint and altar.",
    activities: ["Stair climbing", "Physical exercise", "Sightseeing", "Panoramic photography", "Visiting the altar"],
    activitiesSummary: "Stair climbing, physical exercise, sightseeing, panoramic photography, visiting the altar",
    nawiReminder: "Bring drinking water and wear comfortable shoes. Take breaks when needed; use caution on wet steps and avoid climbing during thunderstorms.",
    nawiPose: "walking",
    sourceUrl: "https://www.travelorientalmindoro.ph/place/333-steps",
    sourceLabel: "travelorientalmindoro.ph/place/333-steps",
    requiresVerification: false
  },
  {
    id: "simbahang-bato",
    name: "Simbahang Bato",
    publishedLocation: "Bancuro, Naujan",
    publishedContact: "0920-463-0966",
    admissionStatus: "Free admission listed",
    visitorInfo: "Free admission listed; religious and heritage etiquette.",
    activities: ["Historical sightseeing", "Photography", "Learning about local history", "Religious visits"],
    activitiesSummary: "Historical sightseeing, photography, learning about local history, religious visits",
    nawiReminder: "This is a historical and religious site. Dress respectfully, remain quiet during prayers, and avoid climbing or damaging old structures.",
    nawiPose: "sunset",
    sourceUrl: "https://www.travelorientalmindoro.ph/place/simbahang-bato",
    sourceLabel: "travelorientalmindoro.ph/place/simbahang-bato",
    requiresVerification: false
  },
  {
    id: "malinao-beach-resort",
    name: "Malinao Beach Resort",
    publishedLocation: "Exact address for named resort not confirmed",
    publishedContact: "For verification",
    admissionStatus: "Verification needed",
    visitorInfo: "Confirm entrance fees, hours, swimming arrangements, cottages, and operator.",
    activities: ["Beach sightseeing", "Relaxation", "Photography", "Swimming (requires confirmation)"],
    activitiesSummary: "Beach sightseeing, relaxation, photography; swimming and resort facilities require confirmation",
    nawiReminder: "Check sea conditions before swimming and follow resort rules. Keep belongings secure; verify facilities and fees with management.",
    nawiPose: "coconut",
    sourceLabel: "Municipal Tourism Office – verification needed",
    requiresVerification: true,
    verificationNote: "Requires local validation with the Municipal Tourism Office for exact address, fees, and resort operator."
  },
  {
    id: "macapili-beach",
    name: "Macapili Beach",
    publishedLocation: "Exact address not confirmed",
    publishedContact: "For verification",
    admissionStatus: "Verification needed",
    visitorInfo: "Confirm access, swimming safety, parking, facilities, and environmental fees.",
    activities: ["Beach sightseeing", "Shore walking", "Photography", "Relaxation", "Swimming (subject to safety conditions)"],
    activitiesSummary: "Beach sightseeing, shore walking, photography, relaxation; swimming subject to local safety conditions",
    nawiReminder: "Check weather and sea conditions before entering the water, avoid swimming alone, and keep the shoreline litter-free.",
    nawiPose: "coconut",
    sourceLabel: "Municipal Tourism Office – verification needed",
    requiresVerification: true,
    verificationNote: "Requires local validation with the Municipal Tourism Office for access, safety conditions, and environmental fees."
  },
  {
    id: "arangin-falls",
    name: "Arangin Falls",
    publishedLocation: "Barangay Arangin, Naujan",
    publishedContact: "0935-668-2779",
    admissionStatus: "Free admission listed",
    visitorInfo: "Free admission listed; check trail and rainfall conditions.",
    activities: ["Nature trekking", "Sightseeing", "Picnicking", "Photography", "Swimming"],
    activitiesSummary: "Nature trekking, sightseeing, picnicking, photography; swimming reported in tourism descriptions",
    nawiReminder: "Wear non-slip footwear, beware of slippery rocks, and avoid heavy-rainfall visits. Do not jump into unfamiliar pools.",
    nawiPose: "map",
    sourceUrl: "https://www.travelorientalmindoro.ph/place/arangin-falls",
    sourceLabel: "travelorientalmindoro.ph/place/arangin-falls",
    requiresVerification: false
  },
  {
    id: "pungao-montelago-hot-spring",
    name: "Pungao Hot Spring / Montelago Hot Spring",
    publishedLocation: "Barangay Montelago, Naujan",
    publishedContact: "0946-858-2509",
    admissionStatus: "Free admission listed",
    visitorInfo: "Free admission listed; verify transport and water conditions.",
    activities: ["Hot spring bathing", "Sightseeing", "Birdwatching", "Possible island-hopping arrangements"],
    activitiesSummary: "Hot spring bathing, sightseeing, birdwatching; possible island-hopping arrangements",
    nawiReminder: "Test water temperature, avoid excessively hot areas, stay hydrated, and supervise children. Use authorized operators for boat trips.",
    nawiPose: "coconut",
    sourceUrl: "https://www.travelorientalmindoro.ph/place/pungao-hot-spring-montelago-hot-spring",
    sourceLabel: "travelorientalmindoro.ph/place/pungao-hot-spring-montelago-hot-spring",
    requiresVerification: false
  },
  {
    id: "karacha-falls",
    name: "Karacha Falls",
    publishedLocation: "Barangay Malvar, Naujan",
    publishedContact: "0953-278-4788",
    admissionStatus: "Free admission listed",
    visitorInfo: "Free admission listed; rugged access, guide availability to confirm.",
    activities: ["Nature trekking", "Waterfall sightseeing", "Photography", "Picnicking", "Stream swimming"],
    activitiesSummary: "Nature trekking, waterfall sightseeing, photography, picnicking; stream swimming described",
    nawiReminder: "Wear suitable trekking shoes, seek local guidance for difficult routes, and avoid crossing streams in heavy rain.",
    nawiPose: "map",
    sourceUrl: "https://www.travelorientalmindoro.ph/place/karacha-falls",
    sourceLabel: "travelorientalmindoro.ph/place/karacha-falls",
    requiresVerification: false
  },
  {
    id: "dao-water-lily-mini-park",
    name: "Dao Water Lily Mini Park",
    publishedLocation: "Barangay Dao, Naujan",
    publishedContact: "0907-145-9436",
    admissionStatus: "Free admission listed",
    visitorInfo: "Free admission listed; floating cottages may cost extra.",
    activities: ["Floating cottage experiences", "Sightseeing", "Photography", "Water-lily handicrafts"],
    activitiesSummary: "Floating cottage experiences, sightseeing, photography, water-lily handicrafts",
    nawiReminder: "Follow boarding instructions for floating cottages, use life jackets when provided, avoid overloading, and support local artisans.",
    nawiPose: "coconut",
    sourceUrl: "https://www.travelorientalmindoro.ph/place/dao-water-lily-mini-park",
    sourceLabel: "travelorientalmindoro.ph/place/dao-water-lily-mini-park",
    requiresVerification: false
  },
  {
    id: "paitan-river",
    name: "Paitan River",
    publishedLocation: "Barangay Paitan, Naujan",
    publishedContact: "0926-871-0027",
    admissionStatus: "Free admission listed",
    visitorInfo: "Free admission listed; deep water/rapids reported.",
    activities: ["Riverside sightseeing", "Photography", "Nature observation", "Swimming (requires safety verification)"],
    activitiesSummary: "Riverside sightseeing, photography, nature observation; swimming requires safety verification",
    nawiReminder: "Some sections are deep or have rapids. Do not enter unfamiliar water; check conditions and avoid the river during heavy rainfall.",
    nawiPose: "salute",
    sourceUrl: "https://www.travelorientalmindoro.ph/place/paitan-river",
    sourceLabel: "travelorientalmindoro.ph/place/paitan-river",
    requiresVerification: false
  }
];

export const GOVERNMENT_TOURISM_OFFICES: TourismOffice[] = [
  {
    id: "mto-naujan",
    office: "Municipal Tourism Office – Naujan",
    location: "New Municipal Hall, Santiago, Naujan",
    publishedContact: ["Official Facebook Page (verify link locally)"],
    purpose: "Destination verification, guides, local tourism rules",
    needsLinkVerification: true
  },
  {
    id: "pto-oriental-mindoro",
    office: "Provincial Tourism Office – Oriental Mindoro",
    location: "Provincial Capitol Complex, Calapan City",
    publishedContact: ["0917-110-8733"],
    purpose: "General tourism support and referrals"
  },
  {
    id: "mto-socorro",
    office: "Municipal Tourism Office – Socorro",
    location: "2/F Kabayan Hall, Zone IV, Socorro",
    publishedContact: ["0992-624-9003", "0964-982-1523"],
    purpose: "Boardwalk access and location verification"
  }
];

export const TRAVEL_AGENCIES: TravelAgency[] = [
  {
    id: "r-and-a-travel",
    agency: "R and A Travel and Tours",
    publishedLocation: "Tigkan, Naujan",
    publishedContacts: ["0905-189-2985"],
    isLocalNaujan: true
  },
  {
    id: "8n8-travel",
    agency: "8N8 Travel and Souvenirs",
    publishedLocation: "San Vicente South, Calapan City",
    publishedContacts: ["0917-815-9829"],
    isLocalNaujan: false
  },
  {
    id: "book-n-learn",
    agency: "Book N Learn Travel and Tours",
    publishedLocation: "Bonifacio Street, Ilaya, Calapan City",
    publishedContacts: ["0917-569-5509", "(043) 441-3226"],
    isLocalNaujan: false
  },
  {
    id: "gl-pellas",
    agency: "GL Pellas Travel and Business",
    publishedLocation: "Masipit, Calapan City",
    publishedContacts: ["0936-646-5274", "(043) 286-3740"],
    isLocalNaujan: false
  },
  {
    id: "runaway-travel",
    agency: "Runaway Travel and Tours",
    publishedLocation: "Sto. Niño, Calapan City",
    publishedContacts: ["0917-798-1921", "(043) 441-0148"],
    isLocalNaujan: false
  },
  {
    id: "shyvel-travel",
    agency: "Shyvel Travel and Tours",
    publishedLocation: "Mabini Street, Ibaba East, Calapan City",
    publishedContacts: ["0995-007-7302", "0908-239-6973"],
    isLocalNaujan: false
  },
  {
    id: "solem-travel",
    agency: "Solem Travel and Tours",
    publishedLocation: "Neo Calapan Mall, Calapan City",
    publishedContacts: ["0939-554-9714", "0927-957-8018"],
    isLocalNaujan: false
  },
  {
    id: "amiga-gracia-travel",
    agency: "Amiga Gracia Travel Services (Amiga Gracia Travel and Tours)",
    publishedLocation: "Roxas Drive, Libis, Calapan City, Oriental Mindoro",
    publishedContacts: ["0930-928-4278", "0966-926-3802", "(043) 738-2989"],
    isLocalNaujan: false
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: "national-911",
    service: "National Emergency Hotline",
    publishedContacts: ["911"],
    useAndVerification: "Police, fire, rescue, and medical emergencies",
    isPrimaryHotline: true
  },
  {
    id: "red-cross-143",
    service: "Philippine Red Cross",
    publishedContacts: ["143"],
    useAndVerification: "Humanitarian and emergency assistance",
    isPrimaryHotline: true
  },
  {
    id: "naujan-district-hospital",
    service: "Naujan District Hospital",
    publishedContacts: ["(043) 289-2134"],
    useAndVerification: "Medical assistance; verify number locally",
    isPrimaryHotline: false
  },
  {
    id: "naujan-police-station",
    service: "Naujan Police Station",
    publishedContacts: ["(043) 289-2088"],
    useAndVerification: "Security concerns; verify number locally",
    isPrimaryHotline: false
  },
  {
    id: "pdrrmo-oriental-mindoro",
    service: "Provincial Disaster Risk Reduction and Management Office",
    publishedContacts: ["0948-146-0382", "0920-951-3690"],
    useAndVerification: "Disaster information and emergency coordination; verify number",
    isPrimaryHotline: false
  }
];

export const TRAIL_REFERENCES: TrailReference[] = [
  {
    id: 1,
    title: "Travel Oriental Mindoro – Tourist spots in Naujan",
    url: "https://www.travelorientalmindoro.ph/attractions/in/naujan"
  },
  {
    id: 2,
    title: "Travel Oriental Mindoro – Tourism offices directory",
    url: "https://www.travelorientalmindoro.ph/directory/tourism-offices"
  },
  {
    id: 3,
    title: "Travel Oriental Mindoro – Travel agencies directory",
    url: "https://www.travelorientalmindoro.ph/directory/travel-agencies"
  },
  {
    id: 4,
    title: "Provincial Planning and Development Office, Oriental Mindoro – Facts and Figures 2021",
    url: "https://ppdo.ormindoro.gov.ph/wp-content/uploads/2022/06/20220613_Facts_and_Figures_2021.pdf"
  },
  {
    id: 5,
    title: "Provincial Government of Oriental Mindoro – Contact directory",
    url: "https://ormindoro.gov.ph/contact-us/"
  },
  {
    id: 6,
    title: "MOVE PH – Discover Oriental Mindoro",
    url: "https://moveph.org/discover-oriental-mindoro/"
  }
];

export const VALIDATION_PRIORITY_NOTE =
  "Verify current phone numbers, opening hours, entrance and activity fees, safe swimming areas, transport fares, guides, and exact map coordinates with the relevant tourism offices before publishing the live Digital Tourism Trail.";
