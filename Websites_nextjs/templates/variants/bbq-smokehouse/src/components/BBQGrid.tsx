'use client';
import { restaurantData } from '@/data/restaurant';

const BBQGrid = () => {
  const gridItems = [
    {
      title: "Menu",
      image: restaurantData.gallery?.[0] || restaurantData.heroImage,
      link: "#menu"
    },
    {
      title: "Gallery", 
      image: restaurantData.gallery?.[1] || restaurantData.aboutImage,
      link: "#gallery"
    },
    {
      title: "About Us",
      image: restaurantData.aboutImage || restaurantData.heroImage,
      link: "#about"
    },
    {
      title: "Reservations",
      image: restaurantData.gallery?.[2] || restaurantData.heroImage,
      link: "#contact"
    },
    {
      title: "Contact",
      image: restaurantData.heroImage,
      link: "#contact"
    },
    {
      title: "Location",
      image: restaurantData.gallery?.[0] || restaurantData.heroImage,
      link: "#contact"
    }
  ];

  return (
    <section className="py-16 bg-bbq-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wide text-bbq-dark mb-4">
            Explore Our Restaurant
          </h2>
          <p className="text-lg text-bbq-brown max-w-2xl mx-auto">
            Discover everything we have to offer at {restaurantData.name}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {gridItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] block hover-scale"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-bbq-dark/40 group-hover:bg-bbq-pink/60 transition-all duration-300"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-wide">
                  {item.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BBQGrid;