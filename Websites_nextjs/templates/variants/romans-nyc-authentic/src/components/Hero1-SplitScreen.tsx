import { restaurantData } from '@/data/restaurant';

export default function Hero1SplitScreen() {
  return (
    <section id="home" className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Content */}
      <div className="flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-8 lg:p-16">
        <div className="max-w-lg">
          <div className="mb-6">
            <span className="inline-block bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
              Authentic Italian
            </span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-amber-600">{restaurantData.name}</span>
            <br />
            <span className="text-2xl lg:text-3xl font-light">Restaurant</span>
          </h1>
          
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {restaurantData.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#menu" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 text-center"
            >
              Explore Menu
            </a>
            <a 
              href="#contact" 
              className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all text-center"
            >
              Book Table
            </a>
          </div>
          
          <div className="mt-12 flex items-center gap-8 text-gray-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">25+</div>
              <div className="text-sm">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">50+</div>
              <div className="text-sm">Signature Dishes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">4.9</div>
              <div className="text-sm">★ Rating</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Image */}
      <div className="relative min-h-[400px] lg:min-h-screen">
        <img 
          src={restaurantData.heroImage} 
          alt="Restaurant ambiance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {/* Floating Card */}
        <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Reserve Your Table</h3>
              <p className="text-gray-600 text-sm">Available today from 5 PM</p>
            </div>
            <a 
              href="#contact" 
              className="bg-amber-600 text-white px-6 py-2 rounded-full font-medium hover:bg-amber-700 transition-colors"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}