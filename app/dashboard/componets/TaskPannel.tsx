'use client'
import { type Task } from '@/app/actions'
import { useState } from 'react'
import { TaskItemSkeleton } from './DashboardSkeleton'

interface TasksPanelProps {
  tasks: Task[]
  completedToday: Set<string>
  pendingTasks?: Set<string>
  handleCompleteTask: (task: Task) => void
  isLoading?: boolean
}

export default function TasksPanel({
  tasks,
  completedToday,
  pendingTasks = new Set<string>(),
  handleCompleteTask,
  isLoading = false,
}: TasksPanelProps) {
  const [showPopup, setShowPopup] = useState(false)
  const [completedTask, setCompletedTask] = useState<Task | null>(null)
  const [encouragingMessage, setEncouragingMessage] = useState("")

  const encouragingMessages = [
    "Great job! You're making fantastic progress!",
    "Excellent work! Keep up the momentum!",
    "Way to go! You're crushing it today!",
    "Amazing effort! Each task brings you closer to your goals!",
    "Awesome work! You should be proud of yourself!"
  ]

  const getRandomMessage = () => {
    return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
  }

  const onCompleteTask = (task: Task) => {
    setCompletedTask(task)
    setEncouragingMessage(getRandomMessage())
    setShowPopup(true)
    handleCompleteTask(task)
    
    // Auto-hide popup after 3 seconds
    setTimeout(() => {
      setShowPopup(false)
    }, 3000)
  }

  // Render loading skeletons
  if (isLoading) {
    return (
      <>
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Today&apos;s Tasks</h2>
        <ul className="grid sm:grid-cols-2 gap-5">
          {[...Array(4)].map((_, index) => (
            <TaskItemSkeleton key={index} />
          ))}
        </ul>
      </>
    )
  }

  // Render empty state
  if (tasks.length === 0) {
    return (
      <>
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Today&apos;s Tasks</h2>
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 text-center">
          <svg 
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tasks Available</h3>
          <p className="text-gray-500">
            You don&apos;t have any tasks for today. Check back later!
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Today&apos;s Tasks</h2>
      
      {/* Congratulations Popup */}
      {showPopup && completedTask && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-4 text-center animate-bounce-in">
            <div className="text-3xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">Congratulations!</h3>
            <p className="text-gray-700 mb-4">
              You earned <span className="font-bold text-green-600">+{completedTask.points} XP</span>!
            </p>
            <p className="text-gray-700 mb-4">{encouragingMessage}</p>
            <button 
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      <ul className="grid sm:grid-cols-2 gap-5">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{task.description}</p>
            <button
              onClick={() => onCompleteTask(task)}
              disabled={completedToday.has(task.id) || pendingTasks.has(task.id)}
              className={`w-full py-2 rounded-md font-medium transition-colors duration-200 ${
                completedToday.has(task.id)
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : pendingTasks.has(task.id)
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {completedToday.has(task.id) 
                ? '✓ Completed' 
                : pendingTasks.has(task.id)
                ? 'Saving...'
                : `Complete (+${task.points} XP)`}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}