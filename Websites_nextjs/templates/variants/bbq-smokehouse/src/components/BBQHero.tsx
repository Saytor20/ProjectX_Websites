'use client';
import { restaurantData } from '@/data/restaurant';

const BBQHero = () => {
  return (
    <section id="home" className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Pink Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${restaurantData.heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-bbq-pink/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider mb-4">
          Welcome!
        </h1>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-light uppercase tracking-widest">
          {restaurantData.name}
        </h2>
        <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto">
          {restaurantData.description}
        </p>
        <div className="mt-8">
          <a 
            href="#contact"
            className="inline-block bg-bbq-dark hover:bg-bbq-brown text-white px-8 py-3 rounded-lg text-lg font-bold uppercase tracking-wide transition-all duration-300 hover:scale-105 mr-4"
          >
            Reservations
          </a>
          <a 
            href="#menu"
            className="inline-block border-2 border-white bg-transparent hover:bg-white hover:text-bbq-dark text-white px-8 py-3 rounded-lg text-lg font-bold uppercase tracking-wide transition-all duration-300"
          >
            Menu
          </a>
        </div>
      </div>
    </section>
  );
};

export default BBQHero;