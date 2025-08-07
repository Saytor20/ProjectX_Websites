'use client';
import { restaurantData } from '@/data/restaurant';

export default function Hero1SplitScreen() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center island-breeze">
      {/* Tropical paradise background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-yellow-100 to-teal-200 opacity-95"></div>
      
      {/* Animated tropical elements */}
      <div className="absolute top-10 left-10 coconut-sway">
        <div className="text-6xl">🌴</div>
      </div>
      <div className="absolute top-20 right-16 ocean-wave">
        <div className="text-4xl">🥥</div>
      </div>
      <div className="absolute bottom-20 left-20 tiki-flame">
        <div className="text-5xl">🌺</div>
      </div>
      <div className="absolute bottom-16 right-10 island-breeze">
        <div className="text-4xl">🍍</div>
      </div>
      
      {/* Hero content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="tropical-card p-8 md:p-16 tropical-glow">
          <div className="mb-8">
            <div className="text-6xl mb-4 ocean-wave">🏖️</div>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 tropical-title">
              <span className="sunset-gradient-text">{restaurantData.name}</span>
            </h1>
          </div>
          
          {/* Beach wave separator */}
          <div className="w-full h-2 bg-gradient-to-r from-teal-400 via-blue-300 to-teal-500 rounded-full my-8 ocean-wave"></div>
          
          <p className="text-xl md:text-3xl mb-8 tropical-text leading-relaxed ocean-text">
            {restaurantData.description || "🌊 Escape to paradise with every bite - where tropical flavors meet beachside bliss 🌊"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <button 
              onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
              className="paradise-button px-10 py-4 text-lg font-semibold min-w-[240px] flex items-center justify-center gap-2"
            >
              <span>🍽️ TASTE PARADISE</span>
            </button>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="tropical-card px-10 py-4 text-lg font-semibold ocean-text border-2 border-teal-400 hover:border-coral-400 transition-all min-w-[240px] flex items-center justify-center gap-2"
            >
              <span>📞 VISIT US</span>
            </button>
          </div>
          
          {/* Tropical features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t-2 border-gradient-tropical">
            <div className="text-center tropical-card p-6 ocean-wave">
              <div className="text-4xl mb-2">🌺</div>
              <div className="text-2xl font-bold sunset-gradient-text tropical-title">FRESH</div>
              <div className="ocean-text tropical-text">Island Ingredients</div>
            </div>
            <div className="text-center tropical-card p-6 coconut-sway">
              <div className="text-4xl mb-2">🏝️</div>
              <div className="text-2xl font-bold sunset-gradient-text tropical-title">PARADISE</div>
              <div className="ocean-text tropical-text">Dining Experience</div>
            </div>
            <div className="text-center tropical-card p-6 tiki-flame">
              <div className="text-4xl mb-2">🌊</div>
              <div className="text-2xl font-bold sunset-gradient-text tropical-title">OCEAN</div>
              <div className="ocean-text tropical-text">Fresh Flavors</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-8 h-12 border-3 border-teal-500 rounded-full flex justify-center paradise-button">
          <div className="w-2 h-4 bg-gradient-to-b from-orange-400 to-teal-400 rounded-full mt-2 ocean-wave"></div>
        </div>
      </div>
      
      {/* Floating tropical elements */}
      <div className="absolute top-1/4 left-4 text-3xl coconut-sway opacity-60">🥭</div>
      <div className="absolute top-1/3 right-8 text-2xl island-breeze opacity-60">🌸</div>
      <div className="absolute bottom-1/3 left-12 text-3xl tiki-flame opacity-60">🥥</div>
      <div className="absolute bottom-1/4 right-4 text-2xl ocean-wave opacity-60">🍹</div>
    </section>
  );
}