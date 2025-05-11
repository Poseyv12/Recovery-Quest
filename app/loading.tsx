export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative h-12 w-12">
          <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-t-blue-600 animate-spin"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">Loading...</p>
      </div>
    </div>
  );
} 