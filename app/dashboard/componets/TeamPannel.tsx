'use client'

import { useEffect, useState } from 'react'
import {
  createTeam,
  joinTeam,
  leaveTeam,
  getUserTeam,
} from '@/app/actions'
import { supabase } from '@/lib/supabaseClient'
import { format } from 'date-fns'
import { TeamPanelSkeleton } from './DashboardSkeleton'

// Define types for our data structures
interface Team {
  id: string
  name: string
  description?: string
  total_xp?: number
}

interface ErrorWithMessage {
  message: string
}

interface ActivityEntry {
  id: string
  user_id: string
  task_id: string
  points_awarded: number
  completed_at: string
  users?: {
    username: string
  }
  tasks?: {
    title: string
  }
}

interface CacheData {
  timestamp: number
  team: Team | null
  teams: Team[]
  activity: ActivityEntry[]
}

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000

// Refresh icon SVG component
const RefreshIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" 
    />
  </svg>
)

export default function TeamPanel() {
  const [team, setTeam] = useState<Team | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [creationMode, setCreationMode] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [teams, setTeams] = useState<Team[]>([])
  const [joiningTeamId, setJoiningTeamId] = useState<string | null>(null)
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  
  // Load data with caching
  const loadCachedData = () => {
    try {
      const cachedData = localStorage.getItem('teamPanelCache')
      if (cachedData) {
        const { timestamp, team, teams, activity } = JSON.parse(cachedData) as CacheData
        const now = new Date().getTime()
        
        // Check if cache is still valid
        if (now - timestamp < CACHE_EXPIRATION) {
          // Make sure team data is complete with total_xp
          if (team && !team.total_xp && team.id) {
            console.log('Team data missing total_xp, will fetch fresh data')
            return false
          }
          
          setTeam(team)
          setTeams(teams || [])
          setActivity(activity || [])
          // Ensure timestamp is properly handled as a Date object
          setLastUpdated(new Date(timestamp))
          setIsLoading(false)
          return true
        }
      }
    } catch (err) {
      console.error('Error reading from cache:', err)
    }
    return false
  }
  
  // Save data to cache
  const updateCache = (teamData: Team | null, teamsData: Team[] = [], activityData: ActivityEntry[] = []) => {
    try {
      // Use local timestamp
      const timestamp = new Date().getTime()
      const cacheData: CacheData = {
        timestamp,
        team: teamData,
        teams: teamsData,
        activity: activityData
      }
      localStorage.setItem('teamPanelCache', JSON.stringify(cacheData))
      setLastUpdated(new Date(timestamp))
    } catch (err) {
      console.error('Error saving to cache:', err)
    }
  }
  
  // Clear cache (used after mutations)
  const clearCache = () => {
    try {
      localStorage.removeItem('teamPanelCache')
    } catch (err) {
      console.error('Error clearing cache:', err)
    }
  }
  
  // Fetch fresh data from the server
  const fetchTeamData = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    
    try {
      const current = await getUserTeam() as Team | null
      let updatedTeam = current;

      let activityData: ActivityEntry[] = []
      let teamsData: Team[] = []

      if (current) {
        // 👇 fetch total team XP
        const { data: members } = await supabase
          .from('team_members')
          .select('user_id')
          .eq('team_id', current.id)
      
        const memberIds = members?.map((m) => m.user_id) ?? []
      
        if (memberIds.length > 0) {
          const { data: totalXPRow } = await supabase
            .from('users')
            .select('xp', { count: 'exact' }) // returns all, but we'll reduce it
            .in('id', memberIds)
      
          const totalXP =
            totalXPRow?.reduce((sum, user) => sum + (user.xp || 0), 0) ?? 0
      
          // Important: Update the team object directly with total_xp
          updatedTeam = { ...current, total_xp: totalXP };
          setTeam(updatedTeam);

          // Fetch activity
          if (memberIds.length > 0) {
            const { data: fetchedActivity } = await supabase
              .from('completed_tasks')
              .select('id, user_id, task_id, points_awarded, completed_at, users(username), tasks(title)')
              .in('user_id', memberIds)
              .order('completed_at', { ascending: false })
              .limit(10)
        
            activityData = (fetchedActivity || []) as unknown as ActivityEntry[]
            setActivity(activityData)
          }
        }
      }

      // If not on a team, show joinable teams
      if (!current) {
        const { data: allTeams } = await supabase.from('teams').select('*')
        teamsData = allTeams as Team[] || []
        setTeams(teamsData)
      }
      
      // Update the cache with fresh data - use updatedTeam that has the total_xp property
      updateCache(updatedTeam, teamsData, activityData)
    } catch (err) {
      console.error('Error fetching team data:', err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }
  
  // Refresh handler
  const handleRefresh = () => {
    fetchTeamData(true); // Force refresh
  }
  
  useEffect(() => {
    const init = async () => {
      // Try to load from cache first
      if (!loadCachedData()) {
        // If no cache or expired, fetch fresh data
        await fetchTeamData();
      }
    };
    
    init();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Team name is required")
      return
    }
    
    setError(null)
    setCreating(true)
    
    try {
      console.log("Creating team:", name)
      const newTeam = await createTeam(name, description) as Team
      console.log("Team created:", newTeam)
      setTeam(newTeam)
      setCreationMode(false)
      setCreating(false)
      setName('')
      setDescription('')
      setTeams([]) // clear browser view
      clearCache() // Clear cache on data mutation
      fetchTeamData() // Fetch fresh data after mutation
    } catch (err: unknown) {
      console.error('Error creating team:', err)
      const error = err as ErrorWithMessage
      setError(error.message || "Failed to create team")
      setCreating(false)
    }
  }

  const handleJoin = async (teamId: string) => {
    setJoiningTeamId(teamId)
    setError(null)
    try {
      await joinTeam(teamId)
      clearCache() // Clear cache on data mutation
      await fetchTeamData() // Fetch fresh data after mutation
    } catch (err: unknown) {
      const error = err as ErrorWithMessage
      setError(error.message)
    } finally {
      setJoiningTeamId(null)
    }
  }

  const handleLeave = async () => {
    setIsLeaving(true)
    try {
      await leaveTeam()
      clearCache() // Clear cache on data mutation
      await fetchTeamData() // Fetch fresh data after mutation
    } catch (err: unknown) {
      const error = err as ErrorWithMessage
      setError(error.message)
    } finally {
      setIsLeaving(false)
    }
  }

  // // Loading spinner component
  // const LoadingSpinner = () => (
  //   <div className="flex justify-center items-center py-8">
  //     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
  //   </div>
  // )

  // Format time ago using date-fns
  const formatTimeAgo = (date: Date) => {
    // Ensure we're using local time by forcing the date to be interpreted locally
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const now = new Date();
    
    // Check if the time difference is less than a day
    const diffMs = now.getTime() - localDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      // For today's timestamps, show the time in 12-hour format
      return 'Today at ' + format(localDate, 'h:mm a');
    } else if (diffHours < 48) {
      // For yesterday's timestamps
      return 'Yesterday at ' + format(localDate, 'h:mm a');
    } else {
      // For older timestamps, show the date and time
      return format(localDate, 'MMM d') + ' at ' + format(localDate, 'h:mm a');
    }
  };

  if (isLoading) {
    return <TeamPanelSkeleton />
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 space-y-4 sm:space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-700">Team Panel</h2>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated {format(new Date(lastUpdated.getTime() - (lastUpdated.getTimezoneOffset() * 0)), 'h:mm a')}
            </span>
          )}
          <button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className={`p-2 rounded-full ${isRefreshing ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
            title="Refresh data"
          >
            <RefreshIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
  
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      )}
  
      {team ? (
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <p className="text-gray-800 text-sm sm:text-base">
              You&apos;re on <span className="font-semibold">{team.name}</span>
            </p>
            <p className="text-green-700 text-xs sm:text-sm">
              🧠 Total Team XP: <span className="font-bold">{team.total_xp}</span>
            </p>
            <p className="text-gray-500 text-xs sm:text-sm italic">{team.description}</p>
            <button
              onClick={handleLeave}
              disabled={isLeaving}
              className={`mt-1 sm:mt-2 text-xs sm:text-sm transition ${
                isLeaving 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-red-600 hover:underline"
              }`}
            >
              {isLeaving ? 'Leaving...' : 'Leave team'}
            </button>
          </div>
  
          {/* Activity Feed */}
          {activity.length > 0 && (
            <div className="pt-3 sm:pt-4 border-t border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">📰 Team Activity</h3>
              <ul className="space-y-2 max-h-56 sm:max-h-64 overflow-y-auto pr-1">
                {activity.map((entry) => (
                  <li
                    key={entry.id}
                    className="text-xs sm:text-sm text-gray-700 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded shadow-sm"
                  >
                    <div className="flex flex-wrap justify-between gap-1">
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">{entry.users?.username}</span> completed{' '}
                        <span className="font-medium">&quot;{entry.tasks?.title}&quot;</span> —{' '}
                        <span className="text-green-600 font-semibold">+{entry.points_awarded} XP</span>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">
                        {formatTimeAgo(new Date(entry.completed_at))}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <>
          {creationMode ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Team name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-blue-400 text-sm sm:text-base"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-blue-400 text-sm sm:text-base"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  disabled={!name.trim() || creating}
                  className={`flex-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition text-xs sm:text-sm ${
                    !name.trim() || creating
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {creating ? 'Creating...' : 'Create Team'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreationMode(false)
                    setCreating(false)
                    setName('')
                    setDescription('')
                    setError(null)
                  }}
                  disabled={creating}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition text-xs sm:text-sm ${
                    creating ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
              </div>
              {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setCreationMode(true)
                setCreating(false)
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition text-xs sm:text-sm"
            >
              Create a Team
            </button>
          )}
  
          {teams.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Or join an existing team:</h3>
              <ul className="space-y-3 sm:space-y-4">
                {teams.map((t) => (
                  <li
                    key={t.id}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 hover:shadow-md transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">{t.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{t.description}</p>
                    </div>
                    <button
                      onClick={() => handleJoin(t.id)}
                      disabled={joiningTeamId === t.id}
                      className={`w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md font-medium transition ${
                        joiningTeamId === t.id
                          ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {joiningTeamId === t.id ? 'Joining...' : 'Join'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
  
          {error && <p className="text-red-500 mt-3 sm:mt-4 text-xs sm:text-sm">{error}</p>}
        </>
      )}
    </div>
  )
}