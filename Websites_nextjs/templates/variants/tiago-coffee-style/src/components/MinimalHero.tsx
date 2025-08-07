import { restaurantData } from '@/data/restaurant';

export default function MinimalHero() {
  return (
    <section id="home" className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Minimalist background elements */}
      <div className="absolute inset-0">
        {/* Subtle geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-gray-100 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-gray-50 transform rotate-45 animate-pulse opacity-40"></div>
        <div className="absolute top-1/2 left-10 w-2 h-16 bg-gray-100 animate-pulse opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Clean, minimal branding */}
        <div className="mb-12">
          <div className="inline-block mb-6">
            <div className="text-xs text-gray-400 uppercase tracking-[0.3em] mb-2">
              Fresh • Simple • Clean
            </div>
            <div className="w-12 h-px bg-gray-200 mx-auto"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-thin text-gray-900 mb-6 tracking-tight minimal-slide-in">
            {restaurantData.name}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto minimal-fade-in">
            {restaurantData.description}
          </p>
        </div>

        {/* Minimal action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a 
            href="#menu" 
            className="group relative px-8 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 minimal-button"
          >
            <span className="relative z-10">Explore Menu</span>
            <div className="absolute inset-0 border-b-2 border-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </a>
          
          <a 
            href="#contact" 
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-300 underline-offset-4 hover:underline"
          >
            Visit Us Today
          </a>
        </div>

        {/* Minimal stats grid */}
        <div className="grid grid-cols-3 gap-12 pt-12 border-t border-gray-100">
          <div className="text-center minimal-stat-fade">
            <div className="text-2xl font-thin text-gray-900 mb-1">Fresh</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Daily Ingredients</div>
          </div>
          <div className="text-center minimal-stat-fade">
            <div className="text-2xl font-thin text-gray-900 mb-1">Simple</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Honest Flavors</div>
          </div>
          <div className="text-center minimal-stat-fade">
            <div className="text-2xl font-thin text-gray-900 mb-1">Clean</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Pure Experience</div>
          </div>
        </div>
      </div>

      {/* Minimal scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-400">
        <div className="text-xs uppercase tracking-wider mb-2">Scroll</div>
        <div className="w-px h-12 bg-gray-200 relative overflow-hidden">
          <div className="w-px h-4 bg-gray-400 absolute top-0 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}