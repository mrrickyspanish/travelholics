export interface TopicCluster {
  id: string
  label: string
  description: string
}

export interface AudienceScenario {
  id: string
  label: string
}

export const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    id: 'trip-blog',
    label: 'Trip Blog',
    description: "Yolanda's firsthand trip stories — write like a travel journal, not a review site",
  },
  {
    id: 'cruise-news',
    label: 'Cruise News',
    description: 'Industry news, Royal Caribbean updates, itinerary changes — informed insider, not a press release',
  },
  {
    id: 'deals',
    label: 'Deals & Offers',
    description: 'Real cruise and travel deals worth booking — honest analysis, not hype',
  },
  {
    id: 'shop-announcements',
    label: 'Shop Announcements',
    description: 'Travelholics merch and shop drops — conversational and excited, never pushy',
  },
]

export const AUDIENCE_SCENARIOS: AudienceScenario[] = [
  { id: 'first-time-cruiser', label: 'First-Time Cruiser' },
  { id: 'family-planner', label: 'Family Trip Planner' },
  { id: 'group-organizer', label: 'Group Organizer (10+)' },
  { id: 'tiktok-follower', label: 'TikTok Follower Curious to Book' },
  { id: 'deal-hunter', label: 'Deal Hunter Watching for the Right Price' },
]
