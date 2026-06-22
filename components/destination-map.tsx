"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { MapPinned, X } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Sphere,
  ZoomableGroup,
} from "react-simple-maps";

import {
  DEFAULT_MAP_VIEW,
  DESTINATIONS,
  DESTINATION_CTA_HREF,
  DESTINATION_MAP_GEOGRAPHY,
  type Destination,
  type MapView,
} from "@/types/destinations";

const MAP_WIDTH = 980;
const MAP_HEIGHT = 430;
const PROJECTION_SCALE = 140;
const PROJECTION_CENTER: [number, number] = [0, 20];
const DESTINATION_LABEL_ZOOM_THRESHOLD = 1.75;
const MOBILE_FEATURED_FALLBACK_IMAGE = "/images/dest-caribbean.jpg";

type RegionLabelLayout = {
  coordinates: [number, number];
  textAnchor: "start" | "middle" | "end";
  dx?: number;
  dy?: number;
};

const REGION_LABEL_LAYOUT: Record<string, RegionLabelLayout> = {
  Caribbean: {
    coordinates: [-71, 13.5],
    textAnchor: "start",
  },
  Alaska: {
    coordinates: [-150, 66.5],
    textAnchor: "start",
  },
  Mediterranean: {
    coordinates: [24, 45],
    textAnchor: "middle",
  },
  "East Coast": {
    coordinates: [-84, 35.5],
    textAnchor: "start",
  },
  "West Coast": {
    coordinates: [-127, 39],
    textAnchor: "end",
  },
};

function clampLatitude(latitude: number) {
  return Math.max(Math.min(latitude, 85), -85);
}

function mercatorProject(
  coordinates: [number, number],
  width: number,
  height: number,
) {
  const [longitude, latitude] = coordinates;
  const [centerLongitude, centerLatitude] = PROJECTION_CENTER;
  const lambda = (longitude * Math.PI) / 180;
  const phi = (clampLatitude(latitude) * Math.PI) / 180;
  const centerLambda = (centerLongitude * Math.PI) / 180;
  const centerPhi = (centerLatitude * Math.PI) / 180;
  const centerYOffset = Math.log(Math.tan(Math.PI / 4 + centerPhi / 2));

  return {
    x: width / 2 + PROJECTION_SCALE * (lambda - centerLambda),
    y:
      height / 2 -
      PROJECTION_SCALE *
        (Math.log(Math.tan(Math.PI / 4 + phi / 2)) - centerYOffset),
  };
}

function getPopupPosition(
  destination: Destination,
  view: MapView,
  containerWidth: number,
  containerHeight: number,
) {
  const projectedPoint = mercatorProject(
    destination.coordinates,
    MAP_WIDTH,
    MAP_HEIGHT,
  );
  const projectedCenter = mercatorProject(view.center, MAP_WIDTH, MAP_HEIGHT);

  const relativeX =
    (projectedPoint.x - projectedCenter.x) * view.zoom + MAP_WIDTH / 2;
  const relativeY =
    (projectedPoint.y - projectedCenter.y) * view.zoom + MAP_HEIGHT / 2;

  const x = (relativeX / MAP_WIDTH) * containerWidth;
  const y = (relativeY / MAP_HEIGHT) * containerHeight;

  const baseWidth = destination.photo ? 280 : 244;
  const popupWidth = Math.max(
    220,
    Math.min(baseWidth, Math.floor(containerWidth - 24)),
  );
  const popupHeight = destination.photo ? 246 : 124;
  const preferredLeft = x + 20;
  const fallbackLeft = x - popupWidth - 20;
  const preferredTop = y - popupHeight - 20;
  const fallbackTop = y + 20;

  const left =
    preferredLeft + popupWidth > containerWidth - 12
      ? Math.max(12, fallbackLeft)
      : preferredLeft;

  const maxTop = Math.max(12, containerHeight - popupHeight - 12);
  const top =
    preferredTop < 12
      ? Math.min(maxTop, fallbackTop)
      : Math.min(maxTop, preferredTop);

  return {
    left,
    top,
    width: popupWidth,
    anchorX: x,
    anchorY: y,
  };
}

function easeInOut(progress: number) {
  return progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

export function DestinationMap() {
  const destinations = useMemo(
    () => DESTINATIONS.filter((destination) => destination.active),
    [],
  );
  const mobileDestinations = useMemo(
    () => destinations.filter((destination) => destination.photo),
    [destinations],
  );
  const groupedDestinations = useMemo(() => {
    const groups = new Map<string, Destination[]>();

    destinations.forEach((destination) => {
      const currentGroup = groups.get(destination.region) ?? [];
      currentGroup.push(destination);
      groups.set(destination.region, currentGroup);
    });

    return Array.from(groups.entries());
  }, [destinations]);
  const regionLabels = useMemo(
    () => groupedDestinations
      .map(([region, regionDestinations]) => {
        const layout = REGION_LABEL_LAYOUT[region];

        if (!layout || regionDestinations.length === 0) {
          return null;
        }

        return {
          region,
          ...layout,
        };
      })
      .filter((label): label is { region: string } & RegionLabelLayout => Boolean(label)),
    [groupedDestinations],
  );
  const [featuredMobileDestination, ...secondaryMobileDestinations] = mobileDestinations;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [view, setView] = useState<MapView>(DEFAULT_MAP_VIEW);
  const [mapSize, setMapSize] = useState({ width: MAP_WIDTH, height: MAP_HEIGHT });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const animationSequenceRef = useRef(0);
  const viewRef = useRef<MapView>(DEFAULT_MAP_VIEW);

  const activeDestination = useMemo(
    () => destinations.find((destination) => destination.id === activeId) ?? null,
    [activeId, destinations],
  );

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const commitView = useCallback((nextView: MapView) => {
    viewRef.current = nextView;
    setView(nextView);
  }, []);

  const animateView = useCallback(
    (targetView: MapView, durationMs: number) => {
      stopAnimation();

      return new Promise<void>((resolve) => {
        const startingView = viewRef.current;
        const startTime = performance.now();

        const step = (timestamp: number) => {
          const rawProgress = Math.min((timestamp - startTime) / durationMs, 1);
          const progress = easeInOut(rawProgress);

          commitView({
            center: [
              lerp(startingView.center[0], targetView.center[0], progress),
              lerp(startingView.center[1], targetView.center[1], progress),
            ],
            zoom: lerp(startingView.zoom, targetView.zoom, progress),
          });

          if (rawProgress < 1) {
            animationFrameRef.current = requestAnimationFrame(step);
            return;
          }

          animationFrameRef.current = null;
          commitView(targetView);
          resolve();
        };

        animationFrameRef.current = requestAnimationFrame(step);
      });
    },
    [commitView, stopAnimation],
  );

  useEffect(() => {
    const container = mapContainerRef.current;

    if (!container) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      setMapSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => stopAnimation();
  }, [stopAnimation]);

  const handleDestinationSelect = useCallback(
    async (destination: Destination) => {
      const sequence = ++animationSequenceRef.current;
      setActiveId(destination.id);

      if (activeId && activeId !== destination.id) {
        await animateView(DEFAULT_MAP_VIEW, 350);
      }

      if (sequence !== animationSequenceRef.current) {
        return;
      }

      await animateView(
        {
          center: destination.coordinates,
          zoom: destination.zoomScale,
        },
        750,
      );
    },
    [activeId, animateView],
  );

  const handleReset = useCallback(async () => {
    ++animationSequenceRef.current;
    setActiveId(null);
    await animateView(DEFAULT_MAP_VIEW, 500);
  }, [animateView]);

  const popupPosition = activeDestination
    ? getPopupPosition(
        activeDestination,
        view,
        mapSize.width || MAP_WIDTH,
        mapSize.height || MAP_HEIGHT,
      )
    : null;

  const canRenderPopup =
    !!activeDestination && (mapSize.width || MAP_WIDTH) >= 360 && (mapSize.height || MAP_HEIGHT) >= 260;
  const showDestinationLabels = view.zoom >= DESTINATION_LABEL_ZOOM_THRESHOLD;

  return (
    <section id="map" className="relative overflow-hidden bg-sand py-12 sm:py-16 lg:py-20">
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-emerald-deep/10 to-transparent pointer-events-none" aria-hidden="true" />
      <style>{`
        @keyframes destinationPinPulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50%       { transform: scale(1.15); opacity: 1; }
        }
        @keyframes destinationRingPulse {
          0%   { transform: scale(0.8); opacity: 0.5; }
          70%  { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        .destination-pin-core,
        .destination-pin-ring {
          transform-box: fill-box;
          transform-origin: center;
        }
        .destination-pin-core { animation: destinationPinPulse 2.2s ease-in-out infinite; }
        .destination-pin-ring { animation: destinationRingPulse 2.1s ease-out infinite; }
      `}</style>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sand/55 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-8rem] top-20 h-64 w-64 rounded-full bg-coral/8 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[92rem] px-5 sm:px-6 lg:px-10 xl:px-12">
        <div className="rounded-[2.5rem] bg-sand/72 p-4 shadow-[0_28px_80px_rgba(26,58,82,0.08)] ring-1 ring-white/70 sm:p-5 lg:rounded-[3rem] lg:p-8 xl:p-10">
          <div className="hidden lg:grid lg:grid-cols-[0.34fr_0.66fr] gap-8 xl:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="max-w-[32rem]"
            >
              <p className="mb-4 text-[0.82rem] font-bold uppercase tracking-[0.16em] text-coral">
                THE TRAVELHOLICS ATLAS
              </p>
              <h2 className="type-homepage-h2 font-serif text-ink">
                Where we&apos;ve sailed. Where we&apos;re sailing next.
              </h2>
              <p className="mt-6 max-w-[43ch] text-[1.06rem] font-medium leading-[1.75] text-ink/76">
                Every pin is a port Yolanda has actually been to, or a trip the Crew is already eyeing. Click around. Some become group sailings. All of them get a real opinion when you book.
              </p>
              <a
                href="/#contact"
                className="mt-8 inline-flex min-h-[46px] items-center justify-center rounded-xl bg-coral px-6 py-3 text-[1rem] font-semibold text-white shadow-md transition-colors hover:bg-coral-deep"
              >
                Plan My Cruise
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="rounded-[2.25rem] bg-cream/88 p-4 shadow-[0_24px_70px_rgba(26,58,82,0.1)] ring-1 ring-white/80 xl:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-5 px-1">
                <div>
                  <p className="font-serif text-[1.55rem] font-semibold leading-none tracking-[-0.04em] text-ink">
                    Yolanda&apos;s proof map
                  </p>
                  <p className="mt-1 text-[0.95rem] font-medium text-stone/78">
                    Green pins are sailed. Coral pins are on the list.
                  </p>
                </div>
                <div className="flex items-center gap-4 rounded-full bg-white/76 px-4 py-2 shadow-sm ring-1 ring-stone/10">
                  <span className="inline-flex items-center gap-2 text-[0.82rem] font-bold text-stone">
                    <svg width="10" height="14" viewBox="0 0 14 20" fill="none" className="shrink-0">
                      <path d="M7,0 L2,8.5 A6,6 0 1,1 12,8.5 Z" fill="#10755A" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinejoin="round" />
                    </svg>
                    Sailed
                  </span>
                  <span className="h-4 w-px bg-stone/14" aria-hidden="true" />
                  <span className="inline-flex items-center gap-2 text-[0.82rem] font-bold text-stone">
                    <svg width="10" height="14" viewBox="0 0 14 20" fill="none" className="shrink-0">
                      <path d="M7,0 L2,8.5 A6,6 0 1,1 12,8.5 Z" fill="#E85D5D" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinejoin="round" />
                    </svg>
                    On the list
                  </span>
                </div>
              </div>

              <div
                ref={mapContainerRef}
                onClick={() => { void handleReset(); }}
                className="relative aspect-[16/7.3] overflow-hidden rounded-[1.85rem] border border-stone/10 bg-[#F8F1E6] shadow-inner cursor-default"
                style={{ filter: "sepia(0.06) saturate(0.94)" }}
              >
                <div className="absolute inset-0">
                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{ scale: PROJECTION_SCALE, center: PROJECTION_CENTER }}
                    width={MAP_WIDTH}
                    height={MAP_HEIGHT}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <ZoomableGroup
                      center={view.center}
                      zoom={view.zoom}
                      minZoom={1}
                      maxZoom={6}
                      onMoveEnd={({ coordinates, zoom }: { coordinates: [number, number]; zoom: number }) => {
                        commitView({ center: [coordinates[0], coordinates[1]], zoom });
                      }}
                    >
                      <Sphere id="map-ocean" fill="#F5EFE4" stroke="rgba(180,155,120,0.2)" strokeWidth={0.5} />

                      <Geographies geography={DESTINATION_MAP_GEOGRAPHY}>
                        {({ geographies }: { geographies: Array<{ rsmKey: string }> }) =>
                          geographies.map((geo: { rsmKey: string }) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="#E8D4B0"
                              stroke="#C9A87E"
                              strokeWidth={0.8}
                              style={{
                                default: { outline: "none" },
                                hover:   { outline: "none", fill: "#D9C099" },
                                pressed: { outline: "none" },
                              }}
                            />
                          ))
                        }
                      </Geographies>

                      {!showDestinationLabels && regionLabels.map((regionLabel) => (
                        <Marker
                          key={regionLabel.region}
                          coordinates={regionLabel.coordinates}
                        >
                          <g style={{ pointerEvents: "none", userSelect: "none" }}>
                            <text
                              x={regionLabel.dx ?? 0}
                              y={regionLabel.dy ?? 0}
                              textAnchor={regionLabel.textAnchor}
                              fontSize="10"
                              fontWeight="700"
                              letterSpacing="0.18em"
                              fill="#1A2E2A"
                              opacity={0.8}
                              style={{ textTransform: "uppercase" }}
                              stroke="rgba(252,250,245,0.95)"
                              strokeWidth="2.5"
                              paintOrder="stroke"
                            >
                              {regionLabel.region}
                            </text>
                          </g>
                        </Marker>
                      ))}

                      {destinations.map((destination) => {
                        const isActive  = activeId === destination.id;
                        const isHovered = hoveredId === destination.id;
                        const isInteractive = isActive || isHovered;
                        const isSailed = !!destination.photo;
                        const pinFill   = isSailed ? "#10755A" : "#E85D5D";
                        const ringFill  = isSailed ? "#10755A" : "#E85D5D";
                        const shouldShowLabel = showDestinationLabels || isInteractive;

                        return (
                          <Marker
                            key={destination.id}
                            coordinates={destination.coordinates}
                            onMouseEnter={() => setHoveredId(destination.id)}
                            onMouseLeave={() => setHoveredId((cur) => cur === destination.id ? null : cur)}
                            onClick={(e: React.MouseEvent<SVGGElement>) => {
                              e.stopPropagation();
                              void handleDestinationSelect(destination);
                            }}
                          >
                            <g className="cursor-pointer" aria-label={destination.label}>
                              {isInteractive && (
                                <circle
                                  className="destination-pin-ring"
                                  cx="0" cy="-16"
                                  r={14}
                                  fill="none"
                                  stroke={ringFill}
                                  strokeWidth={1.5}
                                  opacity={0.7}
                                />
                              )}
                              <ellipse cx="0" cy="1.5" rx="5" ry="2.5" fill="rgba(42,59,54,0.18)" />
                              <path
                                className={isInteractive ? "destination-pin-core" : undefined}
                                d="M0,0 L-7,-12 A8,8 0 1,1 7,-12 Z"
                                fill={pinFill}
                                stroke="rgba(255,255,255,0.6)"
                                strokeWidth={1.2}
                                strokeLinejoin="round"
                              />
                              <circle cx="0" cy="-17" r="3" fill="rgba(255,255,255,0.35)" />
                              {shouldShowLabel && (
                                <text
                                  x="12"
                                  y="-13"
                                  fontSize={isInteractive ? "8.5" : "8"}
                                  fontWeight={isInteractive ? "700" : "600"}
                                  fill="#1A2E2A"
                                  stroke="rgba(252,250,245,0.95)"
                                  strokeWidth="2"
                                  paintOrder="stroke"
                                  style={{ userSelect: "none", pointerEvents: "none" }}
                                >
                                  {destination.label}
                                </text>
                              )}
                            </g>
                          </Marker>
                        );
                      })}
                    </ZoomableGroup>
                  </ComposableMap>
                </div>

                <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-cream/86 px-3 py-1.5 shadow-sm ring-1 ring-stone/10 backdrop-blur">
                  <MapPinned className="h-3 w-3 text-stone/60" />
                  <span className="text-[0.7rem] font-semibold text-stone/72">Click a pin to see Yolanda&apos;s notes</span>
                </div>

                <AnimatePresence>
                  {canRenderPopup && activeDestination && popupPosition ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 6 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute z-20 overflow-hidden rounded-[1.25rem] border border-stone/10 bg-cream shadow-[0_24px_60px_rgba(26,58,82,0.18)]"
                      style={{ left: popupPosition.left, top: popupPosition.top, width: popupPosition.width }}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveId(null)}
                        className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-cream/86 text-stone shadow-sm transition-colors hover:text-ink"
                        aria-label={`Close ${activeDestination.label} details`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>

                      {activeDestination.photo ? (
                        <div className="relative h-[136px] w-full">
                          <Image
                            src={activeDestination.photo}
                            alt={activeDestination.photoAlt ?? activeDestination.label}
                            fill className="object-cover" sizes="280px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/52 via-transparent to-transparent" />
                        </div>
                      ) : null}

                      <div className="p-4">
                        <p className="font-serif text-[1.2rem] font-semibold leading-tight tracking-[-0.03em] text-ink">{activeDestination.label}</p>
                        <p className="mt-1 text-[0.86rem] font-medium leading-snug text-stone">{activeDestination.sub}</p>
                        <a
                          href={DESTINATION_CTA_HREF}
                          className="mt-4 inline-flex items-center rounded-xl bg-coral px-4 py-2 text-[0.82rem] font-semibold text-white transition-colors hover:bg-coral-deep"
                        >
                          Plan My Cruise
                        </a>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:hidden"
          >
            <div className="mx-auto max-w-[28rem] text-center">
              <p className="mb-3 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-coral">THE TRAVELHOLICS ATLAS</p>
              <h2 className="font-serif text-[clamp(2.3rem,10vw,3.4rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-ink">
                Where we&apos;ve sailed. Where we&apos;re sailing next.
              </h2>
              <p className="mx-auto mt-4 max-w-[33ch] text-[1rem] font-medium leading-[1.65] text-ink/76">
                Every pin is a port Yolanda has been to, or a trip the Crew is eyeing next. Tap around for notes, stories, and future sailings.
              </p>
            </div>

            <div className="-mx-9 mt-7 rounded-none bg-cream/86 p-3 shadow-[0_22px_60px_rgba(26,58,82,0.1)] ring-1 ring-white/80 sm:mx-auto sm:max-w-[28rem] sm:rounded-[2rem]">
              <div className="mb-3 flex items-center justify-center gap-4 rounded-full bg-white/76 px-4 py-2 shadow-sm ring-1 ring-stone/10">
                <span className="inline-flex items-center gap-2 text-[0.76rem] font-bold text-stone">
                  <svg width="10" height="14" viewBox="0 0 14 20" fill="none"><path d="M7,0 L2,8.5 A6,6 0 1,1 12,8.5 Z" fill="#10755A" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinejoin="round" /></svg>
                  Sailed
                </span>
                <span className="h-4 w-px bg-stone/14" aria-hidden="true" />
                <span className="inline-flex items-center gap-2 text-[0.76rem] font-bold text-stone">
                  <svg width="10" height="14" viewBox="0 0 14 20" fill="none"><path d="M7,0 L2,8.5 A6,6 0 1,1 12,8.5 Z" fill="#E85D5D" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinejoin="round" /></svg>
                  On the list
                </span>
              </div>

              <div className="relative overflow-hidden rounded-[1.45rem] border border-stone/10 bg-[#F8F1E6] shadow-inner" style={{ aspectRatio:'4/3', minHeight:'220px', maxHeight:'340px' }}>
                <div className="absolute inset-0">
                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{ scale: 90, center: [-60, 20] }}
                    width={360}
                    height={270}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <ZoomableGroup center={[-60, 20]} zoom={1} minZoom={1} maxZoom={6}>
                      <Sphere id="map-ocean" fill="#F5EFE4" stroke="rgba(180,155,120,0.2)" strokeWidth={0.5} />
                      <Geographies geography={DESTINATION_MAP_GEOGRAPHY}>
                        {({ geographies }: { geographies: any[] }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="#E8D4B0"
                              stroke="#C9A87E"
                              strokeWidth={0.8}
                              style={{ default: { outline: 'none' }, hover: { outline: 'none', fill: '#D9C099' }, pressed: { outline: 'none' } }}
                            />
                          ))
                        }
                      </Geographies>
                      {destinations.map((destination) => {
                        const isSailed = !!destination.photo;
                        const pinFill = isSailed ? "#10755A" : "#E85D5D";
                        return (
                          <Marker key={destination.id} coordinates={destination.coordinates}>
                            <g className="cursor-pointer">
                              <ellipse cx="0" cy="1.5" rx="5" ry="2.5" fill="rgba(42,59,54,0.18)" />
                              <path d="M0,0 L-7,-12 A8,8 0 1,1 7,-12 Z" fill={pinFill} stroke="rgba(255,255,255,0.6)" strokeWidth={1.2} strokeLinejoin="round" />
                              <circle cx="0" cy="-17" r="3" fill="rgba(255,255,255,0.35)" />
                            </g>
                          </Marker>
                        );
                      })}
                    </ZoomableGroup>
                  </ComposableMap>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[0.78rem] font-semibold text-stone/70">
                <MapPinned className="h-3.5 w-3.5" />
                Tap a pin to see Yolanda&apos;s notes
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/#contact"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-coral px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-coral-deep sm:w-auto"
              >
                Plan My Cruise
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
