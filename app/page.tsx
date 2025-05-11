import Link from 'next/link';
import HeroImage from './components/HeroImage';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 relative">
        {/* Background with custom hero image component */}
        <div className="absolute inset-0 z-0">
          <HeroImage />
        </div>
        
        <div className="container px-4 mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-bounce-in">
            Recovery Quest
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90">
            Turn your recovery journey into an adventure with daily quests, achievements, and support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth" 
              className="px-8 py-3 rounded-full bg-white text-blue-600 font-medium hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="/dashboard" 
              className="px-8 py-3 rounded-full bg-blue-500/30 text-white border border-white/20 backdrop-blur-sm font-medium hover:bg-blue-500/50 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 bg-white dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600 dark:text-blue-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Quests</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">Complete personalized daily quests designed to support your recovery journey</p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600 dark:text-blue-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Achievements</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">Unlock badges and level up as you make progress in your recovery journey</p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600 dark:text-blue-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">Connect with others on similar journeys and share your progress</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Stats Section */}
      <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Join the Recovery Quest</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">10k+</div>
              <p className="text-gray-600 dark:text-gray-300">Active Users</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">500k+</div>
              <p className="text-gray-600 dark:text-gray-300">Quests Completed</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">85%</div>
              <p className="text-gray-600 dark:text-gray-300">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-blue-600 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Recovery Quest?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">Join our community today and transform your recovery journey into an adventure.</p>
          <Link 
            href="/auth/signin" 
            className="px-8 py-3 rounded-full bg-white text-blue-600 font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  );
}
