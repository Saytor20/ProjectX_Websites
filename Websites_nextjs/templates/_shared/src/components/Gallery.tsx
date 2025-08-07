'use client';
import React, { useState } from 'react';
import { restaurantData } from '@/data/restaurant';

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage('');
  };

  if (!restaurantData.gallery || restaurantData.gallery.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-12">
          Gallery
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {restaurantData.gallery.slice(0, 12).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Gallery image ${index + 1}`}
              onClick={() => handleImageClick(image)}
              className="w-full h-64 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            />
          ))}
        </div>
        
        {/* Modal */}
        {open && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={handleClose}
                className="absolute -top-10 right-0 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ×
              </button>
              <img
                src={selectedImage}
                alt="Gallery image"
                className="max-w-full max-h-full rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;