import { restaurantData } from '@/data/restaurant';

export default function MichelinHero() {
  return (
    <section id="home" className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Luxury background elements */}
      <div className="absolute inset-0">
        {/* Floating gold particles */}
        <div className="luxury-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>
        
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="luxury-pattern"></div>
        </div>
        
        {/* Premium lighting effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-400/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          {/* Michelin Star Badge */}
          <div className="mb-8 michelin-badge-entrance">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-4 michelin-star-glow">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="text-amber-400 text-sm font-medium uppercase tracking-[0.3em] mb-2">
              Michelin Starred Experience
            </div>
          </div>

          {/* Main Restaurant Name */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-thin text-white mb-6 tracking-tight luxury-title-animation">
            {restaurantData.name}
          </h1>

          {/* Elegant tagline */}
          <div className="mb-8 luxury-fade-in-delay-1">
            <div className="flex items-center justify-center mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent flex-1 max-w-24"></div>
              <span className="text-amber-400 text-xs uppercase tracking-[0.4em] mx-6">Since 1998</span>
              <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent flex-1 max-w-24"></div>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
              {restaurantData.description}
            </p>
          </div>

          {/* Luxury action buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 luxury-fade-in-delay-2">
            <a 
              href="#menu" 
              className="group relative overflow-hidden bg-gradient-to-r from-amber-400 to-amber-500 text-black px-10 py-4 font-medium text-lg tracking-wide transition-all duration-500 luxury-button-primary"
            >
              <span className="relative z-10">Experience Our Menu</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 transform -translate-x-full transition-transform duration-500 group-hover:translate-x-0"></div>
            </a>
            
            <a 
              href="#contact" 
              className="group relative overflow-hidden bg-transparent border-2 border-amber-400 text-amber-400 px-10 py-4 font-medium text-lg tracking-wide transition-all duration-500 luxury-button-secondary"
            >
              <span className="relative z-10">Reserve Table</span>
              <div className="absolute inset-0 bg-amber-400 transform -translate-x-full transition-transform duration-500 group-hover:translate-x-0"></div>
              <div className="absolute inset-0 bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </a>
          </div>

          {/* Luxury credentials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto luxury-fade-in-delay-3">
            <div className="text-center luxury-credential">
              <div className="text-3xl font-thin text-amber-400 mb-2">★</div>
              <div className="text-gray-300 text-sm uppercase tracking-wider">Michelin Starred</div>
            </div>
            <div className="text-center luxury-credential">
              <div className="text-3xl font-thin text-amber-400 mb-2">25+</div>
              <div className="text-gray-300 text-sm uppercase tracking-wider">Years of Excellence</div>
            </div>
            <div className="text-center luxury-credential">
              <div className="text-3xl font-thin text-amber-400 mb-2">∞</div>
              <div className="text-gray-300 text-sm uppercase tracking-wider">Culinary Artistry</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-amber-400 luxury-scroll-indicator">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider mb-3">Scroll to Explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-amber-400 to-transparent relative overflow-hidden">
            <div className="w-px h-3 bg-amber-400 absolute top-0 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}