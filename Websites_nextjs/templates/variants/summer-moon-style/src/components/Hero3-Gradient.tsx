'use client';
import { restaurantData } from '@/data/restaurant';
import { useEffect, useState } from 'react';

export default function Hero3Gradient() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Authentic', 'Exquisite', 'Traditional', 'Unforgettable'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 opacity-60 animate-pulse"></div>
        
        {/* Background Image with Blend */}
        <img 
          src={restaurantData.heroImage} 
          alt="Restaurant"
          className="w-full h-full object-cover mix-blend-overlay opacity-40"
        />
        
        {/* Animated Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-white/10 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-amber-300/20 rounded-full animate-pulse"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl">
          {/* Animated Text */}
          <div className="mb-8">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium uppercase tracking-wider">
              Since 1998 • Award Winning
            </span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold text-white mb-8">
            <span className="block mb-2">{restaurantData.name}</span>
            <span className="text-3xl md:text-5xl font-light block">
              <span className="inline-block min-w-[280px] text-left">
                {words.map((word, index) => (
                  <span
                    key={word}
                    className={`absolute transition-all duration-1000 transform ${
                      index === currentWord
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </span>
              {' '}Italian Cuisine
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
            {restaurantData.description}
          </p>
          
          {/* Glowing Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="#menu" 
              className="group relative bg-white text-gray-900 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10">Discover Menu</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white rounded-full group-hover:scale-110 transition-transform duration-300"></div>
            </a>
            
            <a 
              href="#contact" 
              className="border-2 border-white text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-gray-900 backdrop-blur-sm bg-white/10"
            >
              Reserve Table
            </a>
          </div>
          
          {/* Floating Elements */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center backdrop-blur-sm bg-white/10 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-white mb-2">4.9★</div>
              <div className="text-white/80 text-sm">Google Reviews</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/10 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-white mb-2">25+</div>
              <div className="text-white/80 text-sm">Years Excellence</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/10 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80 text-sm">Signature Dishes</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}