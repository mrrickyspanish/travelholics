export type EncyclopediaCategory =
  | 'story'
  | 'quote'
  | 'client_scenario'
  | 'stat'
  | 'vocabulary'
  | 'compliance_note'
  | 'topic_guidance'

export type EncyclopediaIntent = 'trip_page' | 'blog' | 'both'

export interface EncyclopediaEntry {
  id: string
  category: EncyclopediaCategory
  title: string
  content: string
  excerpt: string | null
  confidence: 'high' | 'medium' | 'low'
  source: string | null
  sort_order: number
  active: boolean
  created_at: string
  /** Where this knowledge applies. Same fact can read very differently in each. */
  intent: EncyclopediaIntent
  /** Free-text region/sub-region tags, e.g. "Eastern Caribbean". Empty = applies everywhere. */
  regions: string[]
}

export const INTENT_CONFIG: Record<EncyclopediaIntent, { label: string; description: string }> = {
  trip_page: {
    label: 'Trip Pages',
    description: 'Factual destination info — ports, timing, excursions. Feeds the /cruises overview pages, not blog voice.',
  },
  blog: {
    label: 'Blog',
    description: "Personal, opinionated. Feeds Yolanda's first-person trip-blog stories, not the destination overview pages.",
  },
  both: {
    label: 'Both',
    description: "Generic enough to support either — the factual rundown and the personal story.",
  },
}

// Suggestions only — entries can carry any free-text region tag, including
// ones not listed here yet (e.g. a future destination like Japan).
export const SUGGESTED_REGIONS = [
  'Eastern Caribbean',
  'Western Caribbean',
  'Southern Caribbean',
  'Bahamas',
  'Alaska',
  'Mediterranean',
] as const

export const CATEGORY_CONFIG: Record<
  EncyclopediaCategory,
  { label: string; icon: string; bg: string; color: string; description: string }
> = {
  story: {
    label: 'Stories',
    icon: '✈️',
    bg: 'bg-emerald-50',
    color: 'text-emerald-700',
    description: "Yolanda's travel stories and firsthand cruise experiences",
  },
  quote: {
    label: 'Quotes',
    icon: '💬',
    bg: 'bg-coral-50',
    color: 'text-coral-700',
    description: "Memorable Yolanda quotes and soundbites to weave into articles",
  },
  client_scenario: {
    label: 'Client Scenarios',
    icon: '👥',
    bg: 'bg-blue-50',
    color: 'text-blue-700',
    description: 'Real client situations, outcomes, and booking stories',
  },
  stat: {
    label: 'Stats & Data',
    icon: '📊',
    bg: 'bg-amber-50',
    color: 'text-amber-700',
    description: 'Travel stats, pricing data, cruise industry numbers',
  },
  vocabulary: {
    label: 'Vocabulary',
    icon: '📖',
    bg: 'bg-purple-50',
    color: 'text-purple-700',
    description: "Cruise and travel terms Yolanda uses and how she defines them",
  },
  compliance_note: {
    label: 'Compliance',
    icon: '⚖️',
    bg: 'bg-slate-50',
    color: 'text-slate-700',
    description: 'Affiliate disclosures, legal notes, required language',
  },
  topic_guidance: {
    label: 'Topic Guidance',
    icon: '🎯',
    bg: 'bg-teal-50',
    color: 'text-teal-700',
    description: 'Per-topic writing angles, emphasis, and what to avoid',
  },
}
