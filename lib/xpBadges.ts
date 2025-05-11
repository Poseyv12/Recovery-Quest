import { badgeThresholds } from './badgeData'

export function getXpBadge(xp: number): string {
  const badgeEntry = badgeThresholds.find(entry => xp >= entry.xp)
  return badgeEntry?.badge || '🌱 Recovery Beginner'
}