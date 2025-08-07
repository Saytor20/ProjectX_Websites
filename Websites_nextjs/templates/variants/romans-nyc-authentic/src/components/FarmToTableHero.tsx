import { restaurantData } from '@/data/restaurant';

export default function FarmToTableHero() {
  return (
    <section id="home" className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 relative overflow-hidden">
      {/* Rustic background elements */}
      <div className="absolute inset-0">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="rustic-texture"></div>
        </div>
        
        {/* Floating ingredient illustrations */}
        <div className="ingredient-elements">
          <div className="ingredient ingredient-tomato"></div>
          <div className="ingredient ingredient-herb"></div>
          <div className="ingredient ingredient-grain"></div>
        </div>
        
        {/* Warm lighting effects */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-yellow-200/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Text content */}
          <div className="space-y-8">
            {/* Neighborhood badge */}
            <div className="neighborhood-badge-entrance">
              <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Fort Greene, Brooklyn
              </div>
            </div>

            {/* Main restaurant name */}
            <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight rustic-title-animation">
              {restaurantData.name}
            </h1>

            {/* Farm-to-table tagline */}
            <div className="space-y-4 rustic-fade-in-delay-1">
              <h2 className="text-2xl md:text-3xl text-orange-700 font-light italic">
                Ingredient Driven • Neighborhood Italian
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                {restaurantData.description}
              </p>
              
              {/* Farm partnership highlight */}
              <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg inline-flex">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L8.5 8.5L2 12l6.5 3.5L12 22l3.5-6.5L22 12l-6.5-3.5L12 2z"/>
                </svg>
                <span>Partnered with Hudson Valley farms</span>
              </div>
            </div>

            {/* Community-focused action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 rustic-fade-in-delay-2">
              <a 
                href="#menu" 
                className="group relative overflow-hidden bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 font-medium text-lg transition-all duration-300 rustic-button-primary"
              >
                <span className="relative z-10">View Our Menu</span>
                <div className="absolute inset-0 bg-orange-700 transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
              </a>
              
              <a 
                href="#contact" 
                className="group relative overflow-hidden bg-transparent border-2 border-orange-600 text-orange-600 hover:text-white px-8 py-3 font-medium text-lg transition-all duration-300 rustic-button-secondary"
              >
                <span className="relative z-10">Join Our Community</span>
                <div className="absolute inset-0 bg-orange-600 transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
              </a>
            </div>

            {/* Community values */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 rustic-fade-in-delay-3">
              <div className="text-center rustic-value">
                <div className="text-2xl font-light text-orange-600 mb-1">Local</div>
                <div className="text-gray-600 text-sm">Sourced Daily</div>
              </div>
              <div className="text-center rustic-value">
                <div className="text-2xl font-light text-orange-600 mb-1">Fresh</div>
                <div className="text-gray-600 text-sm">Never Frozen</div>
              </div>
              <div className="text-center rustic-value">
                <div className="text-2xl font-light text-orange-600 mb-1">Artisan</div>
                <div className="text-gray-600 text-sm">Handcrafted</div>
              </div>
            </div>
          </div>

          {/* Right side - Visual elements */}
          <div className="relative rustic-image-entrance">
            {/* Farm-to-table illustration placeholder */}
            <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl relative overflow-hidden shadow-lg">
              
              {/* Rustic frame effect */}
              <div className="absolute inset-4 border-2 border-orange-200 rounded-xl"></div>
              
              {/* Central content area */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <svg className="w-24 h-24 text-orange-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L8.5 8.5L2 12l6.5 3.5L12 22l3.5-6.5L22 12l-6.5-3.5L12 2z"/>
                  </svg>
                  <h3 className="text-xl font-medium text-orange-700 mb-2">Farm Fresh</h3>
                  <p className="text-orange-600 text-sm">Direct from our partner farms in the Hudson Valley</p>
                </div>
              </div>

              {/* Floating ingredient badges */}
              <div className="absolute top-6 left-6 bg-white shadow-md rounded-full px-3 py-1 text-xs text-green-700 font-medium">
                🍅 Organic Tomatoes
              </div>
              <div className="absolute top-16 right-6 bg-white shadow-md rounded-full px-3 py-1 text-xs text-green-700 font-medium">
                🌿 Fresh Basil
              </div>
              <div className="absolute bottom-16 left-8 bg-white shadow-md rounded-full px-3 py-1 text-xs text-green-700 font-medium">
                🧀 Local Cheese
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-orange-600 rustic-scroll-indicator">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider mb-3 font-medium">Discover Our Story</span>
          <div className="w-px h-8 bg-gradient-to-b from-orange-600 to-transparent relative overflow-hidden">
            <div className="w-px h-3 bg-orange-600 absolute top-0 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}