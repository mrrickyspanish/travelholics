"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Compass, MapPinned, X } from "lucide-react";
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

  const popupWidth = destination.photo ? 280 : 244;
  const popupHeight = destination.photo ? 246 : 124;
  const preferredLeft = x + 20;
  const fallbackLeft = x - popupWidth - 20;
  const preferredTop = y - popupHeight - 20;
  const fallbackTop = y + 20;

  const left =
    preferredLeft + popupWidth > containerWidth - 12
      ? Math.max(12, fallbackLeft)
      : preferredLeft;

  const top =
    preferredTop < 12
      ? Math.min(containerHeight - popupHeight - 12, fallbackTop)
      : preferredTop;

  return {
    left,
    top,
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

  return (
    <section className="relative overflow-hidden bg-[#0f1f36] py-24 lg:py-28">
      <style>{`
        @keyframes destinationPinPulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.18); opacity: 1; }
        }

        @keyframes destinationRingPulse {
          0% { transform: scale(0.8); opacity: 0.55; }
          70% { transform: scale(1.85); opacity: 0; }
          100% { transform: scale(1.85); opacity: 0; }
        }

        .destination-pin-core,
        .destination-pin-ring {
          transform-box: fill-box;
          transform-origin: center;
        }

        .destination-pin-core {
          animation: destinationPinPulse 2.2s ease-in-out infinite;
        }

        .destination-pin-ring {
          animation: destinationRingPulse 2.1s ease-out infinite;
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 lg:mb-14"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-[1.5px] w-6 bg-[#f59e0b]" />
            <p className="text-xs font-bold uppercase tracking-[2px] text-[#f59e0b]">
              The Voyages
            </p>
          </div>
          <h2 className="max-w-2xl text-5xl font-extrabold leading-tight text-white lg:text-6xl">
            Sailed It. Lived It.{" "}
            <span className="text-[#059669]">Now I&apos;ll Book It for You.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/45">
            Every destination Yolanda recommends is one she&apos;s experienced
            firsthand — select a destination to explore the route.
          </p>
        </motion.div>

        <div className="hidden gap-6 lg:flex xl:gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-52 shrink-0 rounded-[26px] border border-white/10 bg-[#0a1a2e]/80 p-4 backdrop-blur"
          >
            <div className="mb-4 flex items-center gap-2 text-white/70">
              <Compass className="h-4 w-4 text-[#f59e0b]" />
              <p className="text-xs font-semibold uppercase tracking-[2px]">
                Destinations
              </p>
            </div>

            <div className="max-h-[420px] space-y-5 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => {
                  void handleReset();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                  activeId === null
                    ? "bg-[#059669] text-white"
                    : "text-white/60 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    activeId === null ? "bg-white" : "bg-white/25"
                  }`}
                />
                <span className="text-sm font-semibold">View All</span>
              </button>

              {groupedDestinations.map(([region, regionDestinations]) => (
                <div key={region}>
                  <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[1.8px] text-white/30">
                    {region}
                  </p>
                  <div className="space-y-1.5">
                    {regionDestinations.map((destination) => {
                      const isActive = activeId === destination.id;

                      return (
                        <button
                          key={destination.id}
                          type="button"
                          onClick={() => {
                            void handleDestinationSelect(destination);
                          }}
                          onMouseEnter={() => setHoveredId(destination.id)}
                          onMouseLeave={() => setHoveredId((current) => {
                            if (current === destination.id) {
                              return null;
                            }

                            return current;
                          })}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                            isActive
                              ? "bg-[#059669] text-white"
                              : "text-white/60 hover:bg-white/[0.08] hover:text-white"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-white" : "bg-white/25"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-semibold leading-tight">
                              {destination.label}
                            </p>
                            <p className="mt-0.5 text-[11px] text-white/45">
                              {destination.sub}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="flex-1"
          >
            <div
              ref={mapContainerRef}
              onClick={() => {
                void handleReset();
              }}
              className="relative aspect-[16/7] overflow-hidden rounded-[28px] border border-[rgba(245,158,11,0.15)] bg-[#0a2540] shadow-[0_30px_90px_rgba(3,7,18,0.35)]"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
                  backgroundSize: "28px 28px",
                }}
              />

              <div className="absolute inset-0">
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: PROJECTION_SCALE,
                    center: PROJECTION_CENTER,
                  }}
                  width={MAP_WIDTH}
                  height={MAP_HEIGHT}
                  style={{ width: "100%", height: "100%" }}
                >
                  <ZoomableGroup
                    center={view.center}
                    zoom={view.zoom}
                    minZoom={1}
                    maxZoom={6}
                    onMoveEnd={({
                      coordinates,
                      zoom,
                    }: {
                      coordinates: [number, number];
                      zoom: number;
                    }) => {
                      commitView({
                        center: [coordinates[0], coordinates[1]],
                        zoom,
                      });
                    }}
                  >
                    <Sphere
                      id="voyages-sphere"
                      fill="#0a2540"
                      stroke="rgba(10,26,46,0.45)"
                      strokeWidth={0.6}
                    />
                    <Geographies geography={DESTINATION_MAP_GEOGRAPHY}>
                      {({ geographies }: { geographies: Array<{ rsmKey: string }> }) =>
                        geographies.map((geography: { rsmKey: string }) => (
                          <Geography
                            key={geography.rsmKey}
                            geography={geography}
                            fill="#c4954a"
                            stroke="rgba(10,26,46,0.45)"
                            strokeWidth={0.4}
                            style={{
                              default: {
                                outline: "none",
                              },
                              hover: {
                                outline: "none",
                                fill: "#d4a862",
                              },
                              pressed: {
                                outline: "none",
                              },
                            }}
                          />
                        ))
                      }
                    </Geographies>

                    {destinations.map((destination) => {
                      const isInteractive =
                        activeId === destination.id || hoveredId === destination.id;

                      return (
                        <Marker
                          key={destination.id}
                          coordinates={destination.coordinates}
                          onMouseEnter={() => setHoveredId(destination.id)}
                          onMouseLeave={() => setHoveredId((current) => {
                            if (current === destination.id) {
                              return null;
                            }

                            return current;
                          })}
                          onClick={(e: React.MouseEvent<SVGGElement>) => {
                            e.stopPropagation();
                            void handleDestinationSelect(destination);
                          }}
                        >
                          <g className="cursor-pointer">
                            {isInteractive ? (
                              <circle
                                className="destination-pin-ring"
                                r={12}
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth={1.5}
                                opacity={0.9}
                              />
                            ) : null}
                            <circle
                              className={isInteractive ? "destination-pin-core" : undefined}
                              r={isInteractive ? 7 : 5}
                              fill={
                                isInteractive ? "#059669" : "#f59e0b"
                              }
                              stroke={
                                isInteractive ? "rgba(245,158,11,0.65)" : "rgba(245,158,11,0.4)"
                              }
                              strokeWidth={isInteractive ? 2 : 1}
                            />
                          </g>
                        </Marker>
                      );
                    })}
                  </ZoomableGroup>
                </ComposableMap>
              </div>

              <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1.8px] text-white/55 backdrop-blur">
                Yotravelholic Explorer View
              </div>

              <div className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-[11px] font-medium text-white/55 backdrop-blur">
                <MapPinned className="h-3.5 w-3.5 text-[#f59e0b]" />
                Click a pin or destination to zoom in.
              </div>

              <AnimatePresence>
                {activeDestination && popupPosition ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute z-20 w-[280px] overflow-hidden rounded-xl border border-[rgba(5,150,105,0.4)] bg-[rgba(15,23,42,0.88)] shadow-2xl backdrop-blur-xl"
                    style={{
                      left: popupPosition.left,
                      top: popupPosition.top,
                      width: activeDestination.photo ? 280 : 244,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(null)}
                      className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 text-white/70 transition-colors hover:text-white"
                      aria-label={`Close ${activeDestination.label} details`}
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {activeDestination.photo ? (
                      <div className="relative h-[140px] w-full">
                        <Image
                          src={activeDestination.photo}
                          alt={activeDestination.photoAlt ?? activeDestination.label}
                          fill
                          className="object-cover"
                          sizes="280px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent" />
                      </div>
                    ) : null}

                    <div className="p-4">
                      <p className="text-lg font-bold text-white">
                        {activeDestination.label}
                      </p>
                      <p className="mt-1 text-sm text-white/50">
                        {activeDestination.sub}
                      </p>
                      <a
                        href={DESTINATION_CTA_HREF}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#059669] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#047857]"
                      >
                        Plan My Cruise
                        <ArrowRight className="h-4 w-4" />
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
          className="grid grid-cols-2 auto-rows-[160px] gap-3 lg:hidden"
        >
          {mobileDestinations.map((destination, index) => (
            <a
              key={destination.id}
              href={DESTINATION_CTA_HREF}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 ${
                index === 0 ? "row-span-2" : ""
              }`}
            >
              <Image
                src={destination.photo ?? ""}
                alt={destination.photoAlt ?? destination.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-base font-bold text-white">
                  {destination.label}
                </p>
                <p className="mt-1 text-xs text-white/60">{destination.sub}</p>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
