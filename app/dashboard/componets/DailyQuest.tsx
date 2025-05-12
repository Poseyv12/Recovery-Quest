import { type Task } from '@/app/actions'

type DailyQuestProps = {
  title: string
  storyline: string
  bonus_xp: number
  tasks: Task
}

export default function DailyQuest({ title, storyline, bonus_xp, tasks }: DailyQuestProps) {
  console.log('DailyQuest component props:', { title, storyline, bonus_xp, tasks })
  
  return (
    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-purple-900">{title}</h2>
        <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold">
          Bonus XP: {bonus_xp}
        </span>
      </div>
      <p className="text-purple-800 mb-4 italic">{storyline}</p>
      <div className="bg-white/50 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2">Quest Task:</h3>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="font-medium text-purple-900">{tasks.title}</p>
            <p className="text-sm text-purple-700">{tasks.description}</p>
          </div>
          <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-sm font-semibold whitespace-nowrap">
            {tasks.points} XP
          </span>
        </div>
      </div>
    </div>
  )
} 