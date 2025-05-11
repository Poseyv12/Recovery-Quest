// Badge descriptions with XP thresholds and descriptions
export const badgeDescriptions = {
  '👑 Recovery Champion': 'Achieved the highest level of recovery mastery with 10,000+ XP',
  '⭐ Recovery Master': 'Demonstrated exceptional commitment to recovery with 5,000+ XP',
  '🏆 Recovery Warrior': 'Shown remarkable dedication to your recovery journey with 2,000+ XP',
  '🛡️ Recovery Guardian': 'Built a strong foundation in your recovery with 1,000+ XP',
  '🎯 Recovery Focused': 'Staying consistently focused on your recovery goals with 750+ XP',
  '🔥 Recovery Energized': 'Maintaining steady momentum in your recovery with 500+ XP',
  '🌟 Recovery Rising': 'Making significant progress in your recovery journey with 250+ XP',
  '💪 Recovery Strong': 'Building strength in your recovery practice with 100+ XP',
  '✨ Recovery Inspired': 'Finding inspiration in your recovery journey with 50+ XP',
  '🌿 Recovery Growing': 'Taking important first steps in your recovery with 25+ XP',
  '🌱 Recovery Beginner': 'Starting your recovery journey',
}

// XP thresholds for each badge
export const badgeThresholds = [
  { badge: '👑 Recovery Champion', xp: 10000 },
  { badge: '⭐ Recovery Master', xp: 5000 },
  { badge: '🏆 Recovery Warrior', xp: 2000 },
  { badge: '🛡️ Recovery Guardian', xp: 1000 },
  { badge: '🎯 Recovery Focused', xp: 750 },
  { badge: '🔥 Recovery Energized', xp: 500 },
  { badge: '🌟 Recovery Rising', xp: 250 },
  { badge: '💪 Recovery Strong', xp: 100 },
  { badge: '✨ Recovery Inspired', xp: 50 },
  { badge: '🌿 Recovery Growing', xp: 25 },
  { badge: '🌱 Recovery Beginner', xp: 0 },
]

// Get the detailed badge info based on XP
export function getBadgeInfo(userXp: number) {
  const currentBadge = badgeThresholds.find(({ xp }) => userXp >= xp)
  const nextBadge = badgeThresholds.find(({ xp }) => userXp < xp)
  
  return {
    current: currentBadge?.badge ?? '🌱 Recovery Beginner',
    next: nextBadge?.badge,
    nextXpRequired: nextBadge ? nextBadge.xp - userXp : null,
    progress: nextBadge ? Math.floor((userXp / nextBadge.xp) * 100) : 100,
  }
} 