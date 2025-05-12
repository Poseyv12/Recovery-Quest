'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import TasksPanel from './componets/TaskPannel'
import TeamPanel from './componets/TeamPannel'
import DashboardSkeleton from './componets/DashboardSkeleton'
import DailyQuest from './componets/DailyQuest'
import { getDashboardData, completeTask, updateSoberDate, removeSoberDate, type Task, type User, type DashboardData} from '../actions'
import { getXpBadge } from '@/lib/xpBadges'
import { supabase } from '@/lib/supabaseClient'
export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set())
  const [view, setView] = useState<'tasks' | 'team'>('tasks')
  const [loading, setLoading] = useState(true)
  const [pendingTasks, setPendingTasks] = useState<Set<string>>(new Set())
  const [showSoberDateModal, setShowSoberDateModal] = useState(false)
  const [soberDate, setSoberDate] = useState('')
  const [dailyQuest, setDailyQuest] = useState<DashboardData['dailyQuest']>(undefined)

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
        const dashboardData = await getDashboardData()
        console.log('Dashboard Data received:', dashboardData)
        console.log('Daily Quest data:', dashboardData.dailyQuest)
        setUserInfo(dashboardData.userInfo)
        setTasks(dashboardData.tasks)
        setCompletedToday(new Set(dashboardData.completedToday))
        setDailyQuest(dashboardData.dailyQuest)
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

  const handleSoberDateSave = async () => {
    if (!userInfo || !soberDate) return
    
    try {
      const updatedUser = await updateSoberDate(soberDate)
      setUserInfo(updatedUser)
      setShowSoberDateModal(false)
    } catch (error) {
      console.error('Error updating sober date:', error)
    }
  }

  const handleRemoveSoberDate = async () => {
    if (!userInfo?.sober_start_date) return
    
    if (confirm('Are you sure you want to remove your sobriety tracking data?')) {
      try {
        const updatedUser = await removeSoberDate()
        setUserInfo(updatedUser)
        setShowSoberDateModal(false)
      } catch (error) {
        console.error('Error removing sober date:', error)
      }
    }
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8 min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Sober date modal */}
      {showSoberDateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {userInfo?.sober_start_date ? 'Update Your Sobriety Date' : 'Set Your Sobriety Start Date'}
            </h3>
            <p className="text-gray-600 mb-4">
              {userInfo?.sober_start_date 
                ? 'Update the date when your sobriety began. This will recalculate your sobriety days.'
                : 'This will help you track your days of sobriety in your recovery journey.'}
            </p>
            <div className="mb-4">
              <label htmlFor="soberDate" className="block text-sm font-medium text-gray-700 mb-1">
                Sobriety start date:
              </label>
              <input
                id="soberDate"
                type="date"
                value={soberDate}
                onChange={(e) => setSoberDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              {userInfo?.sober_start_date && (
                <button
                  onClick={handleRemoveSoberDate}
                  className="px-3 py-1.5 text-red-600 text-sm hover:text-red-700 hover:underline"
                  type="button"
                >
                  Remove sobriety date
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSoberDateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSoberDateSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={!soberDate}
                  type="button"
                >
                  {userInfo?.sober_start_date ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <label className="relative group cursor-pointer">
              <Image
                src={userInfo?.profile_photo || '/images/default-avatar.png'}
                alt="Profile"
                width={48}
                height={48}
                className="rounded-full border-2 border-gray-300 group-hover:brightness-90 transition object-cover"
                style={{ width: '48px', height: '48px' }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-800 break-words">{userInfo?.username}</h1>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">Your Badge: {getXpBadge(userInfo?.xp ?? 0)}</h2>
          <p className="text-base sm:text-lg text-gray-600 flex flex-wrap gap-2 sm:gap-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
              ⭐ XP: {userInfo?.xp ?? 0}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              🔥 Streak: {userInfo?.current_streak ?? 0} days
            </span>
            <Link href="/badges" className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold hover:bg-purple-200 transition-colors">
              🏆 View All Badges
            </Link>
          </p>
          {userInfo?.sober_start_date ? (
            <div className="flex items-center mt-2 gap-2">
              <p className="text-sm inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                🗓️ Days sober:{" "}
                <strong>
                  {Math.floor(
                    (new Date().getTime() -
                      new Date(userInfo.sober_start_date).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </strong>
              </p>
              <button
                onClick={() => {
                  setSoberDate(userInfo.sober_start_date || '')
                  setShowSoberDateModal(true)
                }}
                className="text-xs text-gray-500 hover:text-blue-600 flex items-center"
                title="Edit sobriety date"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowSoberDateModal(true)}
              className="text-sm mt-2 inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200"
            >
              🗓️ Set sobriety start date
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 sm:gap-4 mb-6">
        <button
          onClick={() => setView('tasks')}
          className={`px-3 sm:px-4 py-2 rounded-md font-semibold transition flex-1 sm:flex-none text-center ${
            view === 'tasks' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          My Tasks
        </button>
        <button
          onClick={() => setView('team')}
          className={`px-3 sm:px-4 py-2 rounded-md font-semibold transition flex-1 sm:flex-none text-center ${
            view === 'team' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Team Progress
        </button>
      </div>

      {view === 'tasks' ? (
        <>
          {(() => {
            console.log('Current dailyQuest state:', dailyQuest)
            return null
          })()}
          {dailyQuest && (
            <DailyQuest
              title={dailyQuest.title}
              storyline={dailyQuest.storyline}
              bonus_xp={dailyQuest.bonus_xp}
              tasks={dailyQuest.tasks}
            />
          )}
          <TasksPanel
            tasks={tasks}
            completedToday={completedToday}
            pendingTasks={pendingTasks}
            handleCompleteTask={handleCompleteTask}
            isLoading={loading}
          />
        </>
      ) : (
        <TeamPanel />
      )}
    </div>
  )
}