"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MapPinned, X } from "lucide-react";
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

  return (
    <section id="map" className="relative overflow-hidden bg-sand py-20 lg:py-24">
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

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Desktop: 2-col — text left, map right (no sidebar inside map) */}
        <div className="hidden lg:grid lg:grid-cols-[36%_64%] gap-10 xl:gap-14 items-start">

          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="pt-6"
          >
            <p className="type-kicker text-coral mb-3">Where We&apos;ve Been</p>
            <h2 className="font-serif text-3xl lg:text-[2.4rem] font-semibold text-ink leading-tight tracking-tight mb-4">
              Where We&apos;re Going Next
            </h2>
            <p className="text-[15px] leading-relaxed text-stone mb-7">
              From the turquoise waters of the Caribbean to the breathtaking fjords of Alaska—these
              are some of our favorite destinations and what&apos;s coming up next.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 border-2 border-emerald-mid text-emerald-mid hover:bg-emerald-mid hover:text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
            >
              Explore Destinations →
            </a>
          </motion.div>

          {/* Right: illustrated-style map */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <div
              ref={mapContainerRef}
              onClick={() => { void handleReset(); }}
              className="relative aspect-[16/7] overflow-hidden rounded-3xl border border-blush/70 bg-cream shadow-md cursor-default"
              style={{ filter: "sepia(0.08) saturate(0.92)" }}
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
                    {/* Ocean: sand color — map visually floats on section bg */}
                    <Sphere id="map-ocean" fill="#F5EFE4" stroke="rgba(180,155,120,0.2)" strokeWidth={0.5} />

                    {/* Landmasses: warm painted tan — illustrated/editorial feel */}
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

                    {/* Teardrop pins with persistent labels */}
                    {destinations.map((destination) => {
                      const isActive  = activeId === destination.id;
                      const isHovered = hoveredId === destination.id;
                      const isInteractive = isActive || isHovered;
                      const pinFill   = isActive ? "#10755A" : "#F26A75";
                      const ringFill  = isActive ? "#10755A" : "#F26A75";

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
                            {/* Pulse ring on active */}
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
                            {/* Drop shadow */}
                            <ellipse cx="0" cy="1.5" rx="5" ry="2.5" fill="rgba(42,59,54,0.18)" />
                            {/* Teardrop pin body: tip at (0,0), head ~24px tall */}
                            <path
                              className={isInteractive ? "destination-pin-core" : undefined}
                              d="M0,0 L-7,-12 A8,8 0 1,1 7,-12 Z"
                              fill={pinFill}
                              stroke="rgba(255,255,255,0.6)"
                              strokeWidth={1.2}
                              strokeLinejoin="round"
                            />
                            {/* Highlight circle inside pin head */}
                            <circle cx="0" cy="-17" r="3" fill="rgba(255,255,255,0.35)" />
                            {/* Persistent label */}
                            <text
                              x="12" y="-13"
                              fontSize="8"
                              fontWeight="600"
                              fill="#1A2E2A"
                              style={{ userSelect: "none", pointerEvents: "none" }}
                            >
                              {destination.label}
                            </text>
                          </g>
                        </Marker>
                      );
                    })}
                  </ZoomableGroup>
                </ComposableMap>
              </div>

              {/* "Traveled / On Our List" legend — bottom-left */}
              <div className="pointer-events-none absolute bottom-4 left-4 bg-cream/85 backdrop-blur rounded-xl px-3 py-2 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <svg width="10" height="14" viewBox="0 0 14 20" fill="none" className="shrink-0">
                    <path d="M7,0 L2,8.5 A6,6 0 1,1 12,8.5 Z" fill="#F26A75" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[10px] font-semibold text-stone">Traveled</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="10" height="14" viewBox="0 0 14 20" fill="none" className="shrink-0">
                    <path d="M7,0 L2,8.5 A6,6 0 1,1 12,8.5 Z" fill="#10755A" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[10px] font-semibold text-stone">On Our List</span>
                </div>
              </div>

              {/* Subtle hint */}
              <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 bg-cream/80 backdrop-blur rounded-full px-3 py-1.5">
                <MapPinned className="h-3 w-3 text-stone/60" />
                <span className="text-[10px] text-stone/70 font-medium">Click a pin to explore</span>
              </div>

              {/* Destination popup */}
              <AnimatePresence>
                {canRenderPopup && activeDestination && popupPosition ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute z-20 overflow-hidden rounded-xl border border-blush bg-cream shadow-2xl"
                    style={{ left: popupPosition.left, top: popupPosition.top, width: popupPosition.width }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(null)}
                      className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-sand/80 text-stone transition-colors hover:text-ink"
                      aria-label={`Close ${activeDestination.label} details`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    {activeDestination.photo ? (
                      <div className="relative h-[130px] w-full">
                        <Image
                          src={activeDestination.photo}
                          alt={activeDestination.photoAlt ?? activeDestination.label}
                          fill className="object-cover" sizes="280px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
                      </div>
                    ) : null}

                    <div className="p-4">
                      <p className="font-serif text-base font-semibold text-ink">{activeDestination.label}</p>
                      <p className="mt-0.5 text-[13px] text-stone">{activeDestination.sub}</p>
                      <a
                        href={DESTINATION_CTA_HREF}
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-coral px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-coral-deep"
                      >
                        Plan My Cruise <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Mobile: photo grid fallback */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="lg:hidden"
        >
          <div className="mb-8">
            <p className="type-kicker text-coral mb-2">Where We&apos;ve Been</p>
            <h2 className="font-serif text-3xl font-semibold text-ink leading-tight tracking-tight mb-3">
              Where We&apos;re Going Next
            </h2>
            <p className="text-[15px] text-stone leading-relaxed mb-5">
              Some of our favorite destinations—and what&apos;s coming up next.
            </p>
            <a href="/#contact" className="inline-flex items-center gap-2 border-2 border-emerald-mid text-emerald-mid font-semibold px-5 py-2.5 rounded-full text-sm">
              Explore Destinations →
            </a>
          </div>
          <div className="grid grid-cols-2 auto-rows-[160px] gap-3">
            {mobileDestinations.map((destination, index) => (
              <a
                key={destination.id}
                href={DESTINATION_CTA_HREF}
                className={`group relative overflow-hidden rounded-2xl border border-blush ${index === 0 ? "row-span-2" : ""}`}
              >
                <Image
                  src={destination.photo ?? ""}
                  alt={destination.photoAlt ?? destination.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-base font-semibold text-white">{destination.label}</p>
                  <p className="mt-0.5 text-xs text-white/70">{destination.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
