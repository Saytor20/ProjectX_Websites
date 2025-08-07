import { restaurantData } from '@/data/restaurant';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${restaurantData.heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif">
          {restaurantData.name}
        </h1>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed">
          {restaurantData.description}
        </p>
        <div className="space-x-4">
          <a 
            href="#menu" 
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            View Menu
          </a>
          <a 
            href="#contact" 
            className="inline-block border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Make Reservation
          </a>
        </div>
      </div>
    </section>
  );
}