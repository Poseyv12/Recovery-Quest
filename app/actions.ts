'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export type Task = {
  id: string
  title: string
  description: string
  points: number
}

export type DashboardData = {
  userInfo: User
  tasks: Task[]
  completedToday: string[]
}

export type LeaderboardEntry = {
  id: string
  name: string
  xp: number
  rank: number
}

export type Team = {
  id: string
  name: string
  description: string
  created_by: string
  total_xp?: number
}

export type User = {
  id: string
  username: string
  email: string
  xp: number
  current_streak: number
  profile_photo?: string
}

// Fetch dashboard data
export async function getDashboardData(): Promise<DashboardData> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const today = new Date().toISOString().split('T')[0]

  const [profile, tasks, completions] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('tasks').select('*').eq('is_active', true),
    supabase.from('completed_tasks')
      .select('task_id')
      .eq('user_id', user.id)
      .eq('completed_day', today),
  ])

  return {
    userInfo: profile.data,
    tasks: tasks.data || [],
    completedToday: completions.data?.map((t) => t.task_id) || [],
  }
}

// Complete a task
export async function completeTask(taskId: string, points: number) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error: insertError } = await supabase.from('completed_tasks').insert({
    user_id: user.id,
    task_id: taskId,
    points_awarded: points,
  })
  if (insertError) throw insertError

  const { error: xpError } = await supabase.rpc('increment_user_xp', {
    uid: user.id,
    xp_to_add: points,
  })
  if (xpError) throw xpError

  const today = new Date().toISOString().split('T')[0]

const { data: userData } = await supabase
  .from('users')
  .select('last_checkin_date, current_streak')
  .eq('id', user.id)
  .single()

const lastCheckin = userData?.last_checkin_date
const streak = userData?.current_streak || 0

let newStreak = streak
let updateNeeded = false

if (!lastCheckin || new Date(lastCheckin).toDateString() !== new Date(today).toDateString()) {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const wasYesterday = new Date(lastCheckin).toDateString() === yesterday.toDateString()

  newStreak = wasYesterday ? streak + 1 : 1
  updateNeeded = true
}

if (updateNeeded) {
  await supabase
    .from('users')
    .update({
      current_streak: newStreak,
      last_checkin_date: today,
    })
    .eq('id', user.id)
}

  const { data: updatedUser, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  if (userError) throw userError

  return updatedUser
}

// 🏆 Team-based leaderboard
export async function getTeamLeaderboardData(): Promise<LeaderboardEntry[]> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  interface TeamMemberWithData {
    team_id: string;
    teams: { name: string } | null;
    users: { xp: number } | null;
  }

  const { data, error } = await supabase
  .from('team_members')
  .select('team_id, teams(name), users(xp)')
  .returns<TeamMemberWithData[]>();

  if (error) throw error

  const teamMap: Record<string, { name: string; totalXp: number }> = {}

  data.forEach((row) => {
    const id = row.team_id
    const name = row.teams?.name ?? 'Unnamed Team'
    const xp = row.users?.xp ?? 0

    if (!teamMap[id]) {
      teamMap[id] = { name, totalXp: 0 }
    }

    teamMap[id].totalXp += xp
  })

  const sorted = Object.entries(teamMap)
    .map(([id, t]) => ({
      id,
      name: t.name,
      xp: t.totalXp,
    }))
    .sort((a, b) => b.xp - a.xp)
    .map((entry, i) => ({ ...entry, rank: i + 1 }))

  return sorted
}

// Create a team and join it
export async function createTeam(name: string, description: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({ name, description, created_by: user.id })
    .select()
    .single()
  if (teamError) throw teamError

  const { error: joinError } = await supabase
    .from('team_members')
    .insert({ user_id: user.id, team_id: team.id })
  if (joinError) throw joinError

  return team
}

// Join a team
export async function joinTeam(teamId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: existing } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) throw new Error('You are already on a team.')

  const { error } = await supabase
    .from('team_members')
    .insert({ user_id: user.id, team_id: teamId })
  if (error) throw error

  return true
}

// Leave current team
export async function leaveTeam() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('user_id', user.id)
  if (error) throw error

  return true
}

// Get user's current team
export async function getUserTeam() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: teamData, error } = await supabase
    .from('team_members')
    .select('team:team_id(id, name, description, created_by)')
    .eq('user_id', user.id)
    .single()

  if (error || !teamData?.team) return null
  return teamData.team as unknown as Team
}