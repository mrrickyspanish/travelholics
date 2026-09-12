export const INQUIRY_STATUSES = ['new', 'contacted', 'planning', 'confirmed', 'closed_lost'] as const
export const PARTY_STATUSES = ['invited', 'submitted', 'contacted', 'booking_in_progress', 'booked', 'travel_ready'] as const
export const TRIP_STATUSES = ['draft', 'published', 'archived'] as const

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number]
export type PartyStatus = (typeof PARTY_STATUSES)[number]
export type TripStatus = (typeof TRIP_STATUSES)[number]
export type PriceDisplay = 'per_person' | 'cabin_total' | 'both'

export type CabinOfferInput = {
  name: string
  description?: string
  occupancyLabel?: string
  perPersonPrice?: number | null
  cabinTotalPrice?: number | null
  availabilityNote?: string
}

export type ItineraryItemInput = {
  dayNumber: number
  title: string
  port?: string
  arrivalTime?: string
  departureTime?: string
  description?: string
}

export type DeadlineInput = {
  title: string
  deadlineDate: string
  description?: string
  reminderDaysBefore: number[]
}

export type GroupTripCreateInput = {
  name: string
  slug: string
  destination: string
  cruiseLine: string
  ship: string
  sailDate: string
  returnDate?: string
  departurePort?: string
  heroImageUrl?: string
  overview?: string
  accessCode: string
  groupLeaderName: string
  groupLeaderEmail: string
  groupLeaderPhone?: string
  priceDisplay: PriceDisplay
  bookingRequestNote?: string
  inquiryId?: string
  cabins: CabinOfferInput[]
  itinerary: ItineraryItemInput[]
  deadlines: DeadlineInput[]
}

export type EditableCabinOfferInput = CabinOfferInput & { id?: string }
export type EditableItineraryItemInput = ItineraryItemInput & { id?: string }
export type EditableDeadlineInput = DeadlineInput & { id?: string }

export type GroupTripUpdateInput = {
  name: string
  destination: string
  cruiseLine: string
  ship: string
  sailDate: string
  returnDate?: string
  departurePort?: string
  heroImageUrl?: string
  overview?: string
  accessCode: string
  groupLeaderName: string
  groupLeaderEmail: string
  groupLeaderPhone?: string
  priceDisplay: PriceDisplay
  bookingRequestNote?: string
  cabins: EditableCabinOfferInput[]
  itinerary: EditableItineraryItemInput[]
  deadlines: EditableDeadlineInput[]
}

export function partyStatusLabel(status: PartyStatus | string) {
  return ({
    invited: 'Invited',
    submitted: 'Submitted',
    contacted: 'Contacted',
    booking_in_progress: 'Booking in Progress',
    booked: 'Booked',
    travel_ready: 'Travel Ready',
  } as Record<string, string>)[status] ?? status
}
