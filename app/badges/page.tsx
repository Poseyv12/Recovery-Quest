import { getDashboardData } from '../actions'
import { getXpBadge } from '@/lib/xpBadges'
import { badgeDescriptions, badgeThresholds, getBadgeInfo } from '@/lib/badgeData'
import Link from 'next/link'

interface BadgesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BadgesPage({ searchParams }: BadgesPageProps) {
  // Properly await the searchParams as required in Next.js 15
  await searchParams
  
  // Get user data to determine which badges they've earned
  const dashboardData = await getDashboardData()
  const userXp = dashboardData.userInfo.xp
  const currentBadge = getXpBadge(userXp)
  const badgeInfo = getBadgeInfo(userXp)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Achievement Badges</h1>
        <p className="text-gray-600">Track your progress through these recovery milestones</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link 
            href="/dashboard" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Dashboard
          </Link>
          <p className="text-gray-500 text-sm font-medium">
            Your current badge: <span className="font-bold">{currentBadge}</span>
          </p>
          <p className="text-gray-500 text-sm font-medium">
            Current XP: <span className="font-bold">{userXp}</span>
          </p>
          {badgeInfo.next && (
            <p className="text-gray-500 text-sm font-medium">
              Next badge in: <span className="font-bold">{badgeInfo.nextXpRequired} XP</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {badgeThresholds.map(({ badge, xp }) => {
          const isEarned = userXp >= xp
          const isCurrentBadge = badge === currentBadge
          
          return (
            <div 
              key={badge}
              className={`
                p-4 rounded-lg shadow-sm 
                ${isEarned ? 'bg-white' : 'bg-gray-100'} 
                ${isCurrentBadge ? 'ring-2 ring-blue-500' : ''}
                transition-all duration-200
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`text-4xl ${isEarned ? '' : 'opacity-40'}`}>
                  {badge.split(' ')[0]}
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${isEarned ? 'text-gray-800' : 'text-gray-500'}`}>
                    {badge}
                    {isCurrentBadge && <span className="ml-2 text-blue-500 text-sm">(Current)</span>}
                  </h2>
                  <p className={`text-sm mt-1 ${isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
                    {badgeDescriptions[badge as keyof typeof badgeDescriptions]}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs font-medium text-gray-500">
                      {xp} XP required
                    </div>
                    {isEarned ? (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Earned
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">
                        {userXp > 0 ? `${Math.floor((userXp / xp) * 100)}% progress` : 'Not started'}
                      </span>
                    )}
                  </div>
                  {!isEarned && userXp > 0 && xp > 0 && (
                    <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.min(100, Math.floor((userXp / xp) * 100))}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 