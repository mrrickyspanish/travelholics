import type { DestinationConfig } from "./types";
import { caribbean } from "./caribbean";
import { alaska } from "./alaska";
import { mediterranean } from "./mediterranean";

export type { DestinationConfig, PortNote, Excursion, FaqItem } from "./types";

export const destinations: DestinationConfig[] = [caribbean, alaska, mediterranean];

export const destinationMap: Record<string, DestinationConfig> = Object.fromEntries(
  destinations.map((d) => [d.slug, d]),
);

export function getDestination(slug: string): DestinationConfig | undefined {
  return destinationMap[slug];
}
