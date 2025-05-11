'use client'

export default function DashboardSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8 min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* User Info Skeleton */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="space-y-3">
          {/* Username placeholder */}
          <div className="h-8 sm:h-10 w-48 sm:w-64 bg-gray-200 rounded-md animate-pulse"></div>
          
          {/* Badge placeholder */}
          <div className="h-6 sm:h-8 w-36 sm:w-48 bg-gray-200 rounded-md animate-pulse"></div>
          
          {/* Stats placeholders */}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <div className="h-6 w-20 sm:w-24 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 w-24 sm:w-32 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Right side panels */}
        <div className="flex items-center gap-2 sm:gap-4 mt-3 sm:mt-0">
          <div className="h-8 sm:h-10 w-24 sm:w-28 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-8 sm:h-10 w-8 sm:w-10 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Tab Buttons Skeleton */}
      <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="h-9 sm:h-10 w-full sm:w-28 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-9 sm:h-10 w-full sm:w-36 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      {/* Tasks Skeleton */}
      <div>
        <div className="h-7 sm:h-8 w-36 sm:w-48 bg-gray-200 rounded-md animate-pulse mb-3 sm:mb-4"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-4 sm:p-5 border border-gray-200">
              <div className="h-5 sm:h-6 w-3/4 bg-gray-200 rounded-md animate-pulse mb-2 sm:mb-3"></div>
              <div className="h-3 sm:h-4 w-full bg-gray-200 rounded-md animate-pulse mb-2 sm:mb-3"></div>
              <div className="h-3 sm:h-4 w-5/6 bg-gray-200 rounded-md animate-pulse mb-2 sm:mb-3"></div>
              <div className="h-9 sm:h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
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
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 border border-gray-200">
      <div className="h-5 sm:h-6 w-3/4 bg-gray-200 rounded-md animate-pulse mb-2 sm:mb-3"></div>
      <div className="h-3 sm:h-4 w-full bg-gray-200 rounded-md animate-pulse mb-2 sm:mb-3"></div>
      <div className="h-3 sm:h-4 w-5/6 bg-gray-200 rounded-md animate-pulse mb-2 sm:mb-3"></div>
      <div className="h-9 sm:h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
    </div>
  )
}

// Team Panel Skeleton
export function TeamPanelSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 space-y-4 sm:space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="h-7 sm:h-8 w-28 sm:w-32 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-7 sm:h-8 w-16 sm:w-20 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="h-5 sm:h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-5 sm:h-6 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-20 sm:h-24 w-full bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    </div>
  )
} 