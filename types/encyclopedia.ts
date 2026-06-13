export type EncyclopediaCategory =
  | 'story'
  | 'quote'
  | 'client_scenario'
  | 'stat'
  | 'vocabulary'
  | 'compliance_note'
  | 'topic_guidance'

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
}

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
