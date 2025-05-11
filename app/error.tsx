'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-6">Oops!</h1>
        <h2 className="text-3xl font-semibold mb-4">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
          We apologize for the inconvenience. Please try again or return to the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <Link 
            href="/" 
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 