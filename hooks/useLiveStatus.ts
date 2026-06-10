"use client";

import { useEffect, useState } from "react";
import { getLiveStatus, type LiveStatus } from "@/lib/liveSchedule";

/**
 * Live status, recomputed every 30 seconds.
 * Returns null until mounted (prevents SSR/client hydration mismatch —
 * the server doesn't know the visitor's clock).
 */
export function useLiveStatus(): LiveStatus | null {
  const [status, setStatus] = useState<LiveStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getLiveStatus());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return status;
}
