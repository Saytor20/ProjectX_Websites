import { restaurantData } from '@/data/restaurant';

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">About {restaurantData.name}</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {restaurantData.description}
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Our commitment to excellence extends beyond our kitchen to every aspect of your dining experience. 
              From our carefully curated wine selection to our warm, welcoming atmosphere, every detail is designed 
              to create memorable moments for you and your loved ones.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                <span className="text-gray-700">Fresh, locally sourced ingredients</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                <span className="text-gray-700">Traditional Italian recipes</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                <span className="text-gray-700">Elegant dining atmosphere</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/1398688/pexels-photo-1398688.jpeg" 
              alt="Chef making fresh pizza dough"
              className="rounded-lg shadow-xl w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}