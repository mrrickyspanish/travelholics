import 'server-only'

import { createHash } from 'crypto'

function digest(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

export function tripAccessCookieName(tripId: string) {
  return `th_trip_${tripId}`
}

export function leaderAccessCookieName(tripId: string) {
  return `th_leader_${tripId}`
}

export function createTripGrant(tripId: string, accessCode: string) {
  return digest(`trip:${tripId}:${accessCode}`)
}

export function createLeaderGrant(tripId: string, leaderToken: string) {
  return digest(`leader:${tripId}:${leaderToken}`)
}

export function validGrant(actual: string | undefined, expected: string) {
  return Boolean(actual && actual === expected)
}
