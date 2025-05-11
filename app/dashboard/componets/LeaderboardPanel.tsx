'use client'

import { useState, useRef, useEffect } from 'react'
import { LeaderboardEntry } from '../../actions'
import { getXpBadge } from '@/lib/xpBadges'
interface LeaderboardPanelProps {
  initialData: LeaderboardEntry[]
  userTeamId?: string | null
}

export default function LeaderboardPanel({ initialData, userTeamId }: LeaderboardPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [leaderboardData] = useState<LeaderboardEntry[]>(initialData)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm"
      >
        Leaderboard
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 md:w-96 bg-white rounded-lg shadow-lg z-50 max-h-[80vh] overflow-hidden">
          <div className="p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Leaderboard</h2>
            <div className="max-h-72 sm:max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">XP</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Badge</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboardData.map((entry) => (
                    <tr 
                      key={entry.id} 
                      className={`hover:bg-gray-50 ${userTeamId && entry.id === userTeamId ? 'bg-blue-50 font-medium' : ''}`}
                    >
                      <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-900">#{entry.rank}</td>
                      <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-500 truncate max-w-[100px]">{entry.name}</td>
                      <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-500">{entry.xp}</td>
                      <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-500 truncate">{getXpBadge(entry.xp)}</td>
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