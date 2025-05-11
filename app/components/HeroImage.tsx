'use client';

import { useEffect, useState } from 'react';

export default function HeroImage() {
  // This is a placeholder with a gradient background that could be replaced with an actual image
  // For now, we'll create a simple gradient pattern with overlapping shapes
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white/10 backdrop-blur-md"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-white/10 backdrop-blur-md"></div>
      <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-white/20 backdrop-blur-md"></div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
} 