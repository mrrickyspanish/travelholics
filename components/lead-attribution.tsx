"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureLeadAttribution } from "@/lib/lead-attribution";

export function LeadAttribution() {
  const pathname = usePathname();
  useEffect(() => { captureLeadAttribution(); }, [pathname]);
  return null;
}
