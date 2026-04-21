export interface Destination {
  id: string;
  label: string;
  sub: string;
  coordinates: [number, number];
  zoomScale: number;
  photo?: string;
  photoAlt?: string;
  region: string;
  active: boolean;
}

export interface MapView {
  center: [number, number];
  zoom: number;
}

export const DESTINATION_MAP_GEOGRAPHY = "/data/world-110m.json";
export const DESTINATION_CTA_HREF = "#contact";

export const DEFAULT_MAP_VIEW: MapView = {
  center: [0, 20],
  zoom: 1,
};

export const DESTINATIONS: Destination[] = [
  {
    id: "caribbean",
    label: "Caribbean",
    sub: "Royal Caribbean routes",
    coordinates: [-75.0, 18.0],
    zoomScale: 4.5,
    photo: "/images/dest-caribbean.jpg",
    photoAlt: "Yolanda at sunset on a Caribbean cruise",
    region: "Caribbean",
    active: true,
  },
  {
    id: "bahamas",
    label: "Bahamas",
    sub: "Nassau · Paradise Island",
    coordinates: [-77.3, 25.0],
    zoomScale: 5.0,
    photo: "/images/dest-bahamas.jpg",
    photoAlt: "Welcome sign at a Bahamas cruise port",
    region: "Caribbean",
    active: true,
  },
  {
    id: "alaska",
    label: "Alaska",
    sub: "Glacier Bay · Inside Passage",
    coordinates: [-136.0, 58.5],
    zoomScale: 4.0,
    photo: "/images/dest-alaska.jpg",
    photoAlt: "Yolanda in Alaska with glacial mountains",
    region: "Alaska",
    active: true,
  },
  {
    id: "alaska-glaciers",
    label: "Alaska Glaciers",
    sub: "Tracy Arm · Hubbard Glacier",
    coordinates: [-133.5, 60.0],
    zoomScale: 4.5,
    photo: "/images/dest-alaska-glaciers.jpg",
    photoAlt: "Glacial waters in Alaska",
    region: "Alaska",
    active: true,
  },
  {
    id: "mediterranean",
    label: "Mediterranean",
    sub: "Greece · Italy · Barcelona",
    coordinates: [18.0, 38.0],
    zoomScale: 4.0,
    photo: "/images/dest-mediterranean.jpg",
    photoAlt: "Yolanda at the Parthenon in Athens",
    region: "Mediterranean",
    active: true,
  },
  {
    id: "east-coast-ny",
    label: "New York",
    sub: "East Coast departure port",
    coordinates: [-74.0, 40.7],
    zoomScale: 5.5,
    region: "East Coast",
    active: true,
  },
  {
    id: "east-coast-baltimore",
    label: "Baltimore",
    sub: "East Coast departure port",
    coordinates: [-76.6, 39.3],
    zoomScale: 5.5,
    region: "East Coast",
    active: true,
  },
  {
    id: "east-coast-fl",
    label: "Florida Ports",
    sub: "Miami · Port Canaveral",
    coordinates: [-80.2, 25.8],
    zoomScale: 5.0,
    region: "East Coast",
    active: true,
  },
  {
    id: "la-port",
    label: "Los Angeles",
    sub: "West Coast departure port",
    coordinates: [-118.2, 33.7],
    zoomScale: 5.0,
    region: "West Coast",
    active: true,
  },
];
