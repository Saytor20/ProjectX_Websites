import { restaurantData } from '@/data/restaurant';

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Gallery</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take a glimpse into our beautiful restaurant and delicious dishes.
          </p>
        </div>

        {restaurantData.gallery && restaurantData.gallery.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantData.gallery.map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={image} 
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurantData.menu.slice(0, 4).map(item => (
            <div key={item.id} className="relative overflow-hidden rounded-lg shadow-md">
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-semibold">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}