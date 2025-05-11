'use client'

export default function DashboardSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* User Info Skeleton */}
      <div className="mb-8 flex justify-between items-start">
        <div className="space-y-3">
          {/* Username placeholder */}
          <div className="h-10 w-64 bg-gray-200 rounded-md animate-pulse"></div>
          
          {/* Badge placeholder */}
          <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse"></div>
          
          {/* Stats placeholders */}
          <div className="flex gap-4">
            <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Right side panels */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-28 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Tab Buttons Skeleton */}
      <div className="flex gap-4 mb-6">
        <div className="h-10 w-28 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-10 w-36 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      {/* Tasks Skeleton */}
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-4"></div>
        
        <div className="grid sm:grid-cols-2 gap-5">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
              <div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse mb-3"></div>
              <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse mb-3"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded-md animate-pulse mb-3"></div>
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Task Item Skeleton for more focused loading states
export function TaskItemSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
      <div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse mb-3"></div>
      <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse mb-3"></div>
      <div className="h-4 w-5/6 bg-gray-200 rounded-md animate-pulse mb-3"></div>
      <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
    </div>
  )
}

// Team Panel Skeleton
export function TeamPanelSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
      
      <div className="space-y-4">
        <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-24 w-full bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    </div>
  )
} 