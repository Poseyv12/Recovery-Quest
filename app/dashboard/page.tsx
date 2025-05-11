'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import TasksPanel from './componets/TaskPannel'
import TeamPanel from './componets/TeamPannel'
import NavMenu from './componets/NavMenu'
import LeaderboardPanel from './componets/LeaderboardPanel'
import DashboardSkeleton from './componets/DashboardSkeleton'
import { getDashboardData, completeTask, type Task, type LeaderboardEntry, type User, getTeamLeaderboardData, getUserTeam } from '../actions'
import { getXpBadge } from '@/lib/xpBadges'
import { supabase } from '@/lib/supabaseClient'
export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set())
  const [view, setView] = useState<'tasks' | 'team'>('tasks')
  const [loading, setLoading] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [pendingTasks, setPendingTasks] = useState<Set<string>>(new Set())
  const [userTeamId, setUserTeamId] = useState<string | null>(null)

  // Helper to clear team cache when completing tasks to keep team data fresh
  const clearTeamCache = () => {
    try {
      localStorage.removeItem('teamPanelCache')
    } catch (err) {
      console.error('Error clearing team cache:', err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, leaderboard, userTeam] = await Promise.all([
          getDashboardData(),
          getTeamLeaderboardData(),
          getUserTeam()
        ])
        setUserInfo(dashboardData.userInfo)
        setTasks(dashboardData.tasks)
        setCompletedToday(new Set(dashboardData.completedToday))
        setLeaderboardData(leaderboard)
        setUserTeamId(userTeam?.id || null)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        window.location.href = '/auth'
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userInfo) return
  
    const fileExt = file.name.split('.').pop()
    const filePath = `avatars/${userInfo.id}.${fileExt}`
  
    const { error } = await supabase.storage
      .from('avatars') // 👈 Make sure this matches your Supabase bucket
      .upload(filePath, file, { upsert: true })
  
    if (error) {
      console.error('Upload error:', error)
      return
    }
  
    const publicUrl = supabase.storage.from('avatars').getPublicUrl(filePath).data.publicUrl
  
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_photo: publicUrl })
      .eq('id', userInfo.id)
  
    if (updateError) {
      console.error('Profile update error:', updateError)
      return
    }
  
    setUserInfo((prev) => prev && { ...prev, profile_photo: publicUrl })
  }

  const handleCompleteTask = async (task: Task) => {
    if (!userInfo) return;
    
    // Optimistically update UI
    setCompletedToday((prev) => new Set(prev).add(task.id))
    setUserInfo((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        xp: prev.xp + task.points
      };
    })
    setPendingTasks((prev) => new Set(prev).add(task.id))

    try {
      // Make the API call
      const updatedUser = await completeTask(task.id, task.points)
      
      // Update with actual value from server response
      if (updatedUser) {
        setUserInfo((prev) => {
          if (!prev) return updatedUser;
          return {
            ...prev,
            xp: updatedUser.xp
          };
        })
      }
      
      // Clear team cache to ensure team activity is up to date
      clearTeamCache()
    } catch (error) {
      // If the call fails, revert the optimistic updates
      console.error('Error completing task:', error)
      setCompletedToday((prev) => {
        const newSet = new Set(prev)
        newSet.delete(task.id)
        return newSet
      })
      setUserInfo((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          xp: prev.xp - task.points
        };
      })
    } finally {
      setPendingTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(task.id)
        return newSet
      })
    }
  }

  if (loading) return <DashboardSkeleton />

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="mb-8 flex justify-between items-start">
        <div>
        <div className="flex items-center gap-3 mb-2">
  <label className="relative group cursor-pointer">
    <Image
      src={userInfo?.profile_photo || '/images/default-avatar.png'}
      alt="Profile"
      width={48}
      height={48}
      className="rounded-full border-2 border-gray-300 group-hover:brightness-90 transition"
    />
    <input
      type="file"
      accept="image/*"
      onChange={handleProfilePhotoChange}
      className="absolute inset-0 opacity-0 cursor-pointer"
    />
  </label>
  <h1 className="text-4xl font-extrabold text-gray-800">Welcome, {userInfo?.username}</h1>
</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Your Badge: {getXpBadge(userInfo?.xp ?? 0)}</h2>
          <p className="text-lg text-gray-600 flex gap-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
              ⭐ XP: {userInfo?.xp ?? 0}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              🔥 Streak: {userInfo?.current_streak ?? 0} days
            </span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LeaderboardPanel initialData={leaderboardData} userTeamId={userTeamId} />
          <NavMenu />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView('tasks')}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            view === 'tasks' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          My Tasks
        </button>
        <button
          onClick={() => setView('team')}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            view === 'team' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Team Progress
        </button>
      </div>

      {view === 'tasks' ? (
        <TasksPanel
          tasks={tasks}
          completedToday={completedToday}
          pendingTasks={pendingTasks}
          handleCompleteTask={handleCompleteTask}
          isLoading={loading}
        />
      ) : (
        <TeamPanel />
      )}
    </div>
  )
}