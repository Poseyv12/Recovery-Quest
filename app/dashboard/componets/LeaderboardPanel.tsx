'use client'

import { useState } from 'react'
import { LeaderboardEntry } from '../../actions'
import { getXpBadge } from '@/lib/xpBadges'
interface LeaderboardPanelProps {
  initialData: LeaderboardEntry[]
  userTeamId?: string | null
}

export default function LeaderboardPanel({ initialData, userTeamId }: LeaderboardPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [leaderboardData] = useState<LeaderboardEntry[]>(initialData)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Leaderboard
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">XP</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Badge</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboardData.map((entry) => (
                    <tr 
                      key={entry.id} 
                      className={`hover:bg-gray-50 ${userTeamId && entry.id === userTeamId ? 'bg-blue-50 font-medium' : ''}`}
                    >
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">#{entry.rank}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{entry.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{entry.xp}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{getXpBadge(entry.xp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 