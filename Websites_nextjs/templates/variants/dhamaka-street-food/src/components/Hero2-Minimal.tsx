import { restaurantData } from '@/data/restaurant';

export default function Hero2Minimal() {
  return (
    <section id="home" className="min-h-screen bg-white">
      {/* Navigation Space */}
      <div className="pt-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content */}
        <div className="mb-16">
          <div className="mb-12">
            <span className="text-gray-500 text-sm font-medium uppercase tracking-[0.3em] border-b border-gray-200 pb-2">
              Authentic Street Food • Cultural Experience
            </span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Typography */}
            <div>
              <h1 className="text-5xl lg:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-none">
                {restaurantData.name}
              </h1>
              
              <div className="max-w-lg">
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {restaurantData.description}
                </p>
                
                <p className="text-sm text-gray-500 leading-relaxed mb-8 italic">
                  Where traditional flavors meet modern presentation in an atmosphere that celebrates authentic cultural cuisine.
                </p>
              </div>
              
              <div className="flex space-x-4">
                <a 
                  href="#menu" 
                  className="group relative overflow-hidden bg-gray-900 text-white px-8 py-3 font-medium tracking-wide transition-all duration-300 hover:bg-gray-800"
                >
                  <span className="relative z-10">Explore Menu</span>
                </a>
                <a 
                  href="#about" 
                  className="border border-gray-900 text-gray-900 px-8 py-3 font-medium tracking-wide transition-all duration-300 hover:bg-gray-50"
                >
                  Our Story
                </a>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={restaurantData.heroImage} 
                  alt="Authentic cuisine"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating accent */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100 rounded-full opacity-60"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gray-100 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
        
        {/* Stats - Asymmetrical Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 pt-16 border-t border-gray-100">
          <div className="lg:col-span-1">
            <div className="text-4xl font-light text-gray-900 mb-2">15+</div>
            <div className="text-gray-500 text-sm uppercase tracking-wide leading-tight">Years Serving Authentic Flavors</div>
          </div>
          <div className="lg:col-span-1">
            <div className="text-4xl font-light text-gray-900 mb-2">Daily</div>
            <div className="text-gray-500 text-sm uppercase tracking-wide leading-tight">Fresh Ingredients</div>
          </div>
          <div className="lg:col-span-1">
            <div className="text-4xl font-light text-gray-900 mb-2">100%</div>
            <div className="text-gray-500 text-sm uppercase tracking-wide leading-tight">Traditional Recipes</div>
          </div>
          <div className="lg:col-span-1">
            <div className="text-4xl font-light text-gray-900 mb-2">Local</div>
            <div className="text-gray-500 text-sm uppercase tracking-wide leading-tight">Community Favorite</div>
          </div>
        </div>
      </div>
    </section>
  );
}