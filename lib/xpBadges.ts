export function getXpBadge(xp: number): string {
  if (xp >= 2000) return '🏆'
  if (xp >= 1000) return '🛡️'
  if (xp >= 500) return '🔥'
  if (xp >= 100) return '💪'
  if (xp >= 50) return '✨'
  return '🌱'
}