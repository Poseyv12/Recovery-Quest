'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Recovery Quest
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white dark:hover:border-gray-700"
              >
                Dashboard
              </Link>
              <Link 
                href="/leaderboard" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white dark:hover:border-gray-700"
              >
                Leaderboard
              </Link>
              <Link 
                href="/about" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white dark:hover:border-gray-700"
              >
                About
              </Link>
            </div>
          </div>
          {/* <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link 
              href="/auth/signin" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Link>
          </div> */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/leaderboard"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Leaderboard
            </Link>
            <Link
              href="/about"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              About
            </Link>
            <Link
              href="/auth"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-600 hover:bg-gray-50 hover:border-gray-300 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-gray-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 