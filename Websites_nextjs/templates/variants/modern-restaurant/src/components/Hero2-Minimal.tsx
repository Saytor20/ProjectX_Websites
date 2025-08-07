import { restaurantData } from '@/data/restaurant';

export default function Hero2Minimal() {
  return (
    <section id="home" className="min-h-screen bg-white">
      {/* Navigation Space */}
      <div className="pt-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <span className="text-amber-600 text-sm font-medium uppercase tracking-[0.2em]">
              Est. 1998 • Authentic Italian Cuisine
            </span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-light text-gray-900 mb-8 tracking-tight">
            {restaurantData.name}
          </h1>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              {restaurantData.description}
            </p>
          </div>
          
          <div className="flex justify-center">
            <a 
              href="#menu" 
              className="group relative overflow-hidden bg-gray-900 text-white px-12 py-4 font-medium tracking-wide transition-all duration-300"
            >
              <span className="relative z-10">View Our Menu</span>
              <div className="absolute inset-0 bg-amber-600 transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
            </a>
          </div>
        </div>
        
        {/* Large Image */}
        <div className="relative">
          <div className="aspect-[16/9] overflow-hidden">
            <img 
              src={restaurantData.heroImage} 
              alt="Restaurant interior"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          
          {/* Overlay Text */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 lg:p-12">
            <div className="max-w-md">
              <h3 className="text-white text-2xl font-light mb-2">
                Experience Fine Dining
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Every dish tells a story of tradition, passion, and authentic Italian flavors carefully crafted by our master chefs.
              </p>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-light text-gray-900 mb-2">25+</div>
            <div className="text-gray-600 text-sm uppercase tracking-wide">Years of Excellence</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-gray-900 mb-2">Chef</div>
            <div className="text-gray-600 text-sm uppercase tracking-wide">Michelin Trained</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-gray-900 mb-2">100%</div>
            <div className="text-gray-600 text-sm uppercase tracking-wide">Fresh Ingredients</div>
          </div>
        </div>
      </div>
    </section>
  );
}