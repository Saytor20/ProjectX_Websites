'use client';

import React, { useEffect, useState } from 'react';
import { Restaurant } from '@/lib/schema';
import { registerBlock } from '@/editor/registry';
import styles from './template.module.css';

interface TastyTemplateProps {
  restaurant: Restaurant;
}

export default function TastyTemplate({ restaurant }: TastyTemplateProps) {
  const { restaurant_info: info, menu_categories } = restaurant;
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Organize menu by categories for horizontal layout (Pattern B)
  const categorizedMenu = Object.entries(menu_categories).map(([category, items]) => ({
    name: category,
    items: items.slice(0, 8) // Show more items for horizontal layout
  })).slice(0, 6); // Show up to 6 categories
  
  // Get all menu items for gallery
  const allMenuItems = Object.values(menu_categories).flat();
  const featuredItems = allMenuItems.slice(0, 12);
  
  // Hero slider images
  const heroImages = [
    '/tasty/images/2.jpg',
    '/tasty/images/1.jpg',
    '/tasty/images/3.jpg'
  ];

  // Auto-rotate hero slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Register blocks with the editor registry
  useEffect(() => {
    // Header block
    registerBlock({
      id: 'header',
      name: 'Header Navigation',
      selector: '[data-block="header"]',
      fields: [
        {
          id: 'logo-text',
          type: 'text',
          label: 'Logo Text',
          selector: `.${styles.logo}`,
        }
      ]
    });

    // Hero block
    registerBlock({
      id: 'hero',
      name: 'Hero Section',
      selector: '[data-block="hero"]',
      fields: [
        {
          id: 'hero-title',
          type: 'text',
          label: 'Main Title',
          selector: `.${styles.heroTitle}`,
        },
        {
          id: 'hero-subtitle',
          type: 'text',
          label: 'Subtitle',
          selector: `.${styles.heroSubtitle}`,
        }
      ]
    });

    // About block
    registerBlock({
      id: 'about',
      name: 'About Section',
      selector: '[data-block="about"]',
      fields: [
        {
          id: 'about-title',
          type: 'text',
          label: 'About Title',
          selector: `.${styles.sectionTitle}`,
        }
      ]
    });

    // Menu block
    registerBlock({
      id: 'menu',
      name: 'Menu Section',
      selector: '[data-block="menu"]',
      fields: [
        {
          id: 'menu-title',
          type: 'text',
          label: 'Menu Title',
          selector: `.${styles.sectionTitle}`,
        }
      ]
    });

    // Gallery block
    registerBlock({
      id: 'gallery',
      name: 'Gallery Section',
      selector: '[data-block="gallery"]',
      fields: [
        {
          id: 'gallery-title',
          type: 'text',
          label: 'Gallery Title',
          selector: `.${styles.sectionTitle}`,
        }
      ]
    });

    // Contact block
    registerBlock({
      id: 'contact',
      name: 'Contact Section',
      selector: '[data-block="contact"]',
      fields: [
        {
          id: 'contact-title',
          type: 'text',
          label: 'Contact Title',
          selector: `.${styles.sectionTitle}`,
        }
      ]
    });
  }, []);

  return (
    <div className={styles.template}>
      {/* Header */}
      <header className={`${styles.header} ${styles.transparent}`} data-block="header">
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <a href="#hero" className={styles.logo}>
              tasty
            </a>
            <nav className={styles.nav}>
              <a href="#hero" className={`${styles.navLink} ${styles.active}`}>Home</a>
              <a href="#about" className={styles.navLink}>Resto</a>
              <a href="#menu" className={styles.navLink}>Menu</a>
              <a href="#gallery" className={styles.navLink}>Gallery</a>
              <a href="#contact" className={styles.navLink}>Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Zoom Animation */}
      <section className={styles.hero} data-block="hero" id="hero">
        <div className={`${styles.heroBackground} ${styles.zoom}`}>
          <img 
            src={heroImages[currentSlide]} 
            alt="Hero background" 
            key={currentSlide}
          />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            delicious italian food
          </h1>
          <p className={styles.heroSubtitle}>
            Making delicious italian food since 1990
          </p>
        </div>
      </section>

      {/* About/Resto Section */}
      <section className={`${styles.section} ${styles.about}`} data-block="about" id="about">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>About {info.name}</h2>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <p>
                Welcome to {info.name}, where culinary tradition meets contemporary excellence. 
                Located in the heart of {info.region}, we have been serving authentic {info.type_of_food} 
                cuisine with passion and dedication.
              </p>
              <p>
                Our chefs carefully select the finest ingredients to create memorable dining experiences. 
                Every dish tells a story of tradition, quality, and the love we put into our craft.
              </p>
              <p>
                From our signature specialties to classic favorites, we invite you to discover 
                the flavors that have made us a beloved destination for food enthusiasts.
              </p>
            </div>
            <div className={styles.aboutImage}>
              <img 
                src="/tasty/images/4.jpg" 
                alt="Restaurant interior"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section - Horizontal Layout (Pattern B) */}
      <section className={`${styles.section} ${styles.menu}`} data-block="menu" id="menu">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Menu</h2>
          <div className={styles.menuGrid}>
            {/* Left Column */}
            <div className={styles.menuColumn}>
              {categorizedMenu.slice(0, Math.ceil(categorizedMenu.length / 2)).map((category, categoryIndex) => (
                <div key={categoryIndex} className={styles.menuCategory}>
                  <h3 className={styles.categoryTitle}>{category.name}</h3>
                  {category.items.slice(0, 4).map((item, itemIndex) => (
                    <div key={itemIndex} className={styles.menuItem}>
                      <div className={styles.menuItemImage}>
                        <img 
                          src={`/tasty/images/${(itemIndex % 12) + 1}.jpg`}
                          alt={item.item_en}
                        />
                      </div>
                      <div className={styles.menuItemContent}>
                        <h4 className={styles.menuItemName}>{item.item_en}</h4>
                        <p className={styles.menuItemDescription}>
                          {item.description || 'Fresh ingredients prepared with traditional recipes and modern techniques.'}
                        </p>
                        <span className={styles.menuItemPrice}>
                          {item.price ? `$${item.price}` : '$14'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Right Column */}
            <div className={styles.menuColumn}>
              {categorizedMenu.slice(Math.ceil(categorizedMenu.length / 2)).map((category, categoryIndex) => (
                <div key={categoryIndex + 100} className={styles.menuCategory}>
                  <h3 className={styles.categoryTitle}>{category.name}</h3>
                  {category.items.slice(0, 4).map((item, itemIndex) => (
                    <div key={itemIndex} className={styles.menuItem}>
                      <div className={styles.menuItemImage}>
                        <img 
                          src={`/tasty/images/${((itemIndex + 6) % 12) + 1}.jpg`}
                          alt={item.item_en}
                        />
                      </div>
                      <div className={styles.menuItemContent}>
                        <h4 className={styles.menuItemName}>{item.item_en}</h4>
                        <p className={styles.menuItemDescription}>
                          {item.description || 'Crafted with care using premium ingredients and authentic cooking methods.'}
                        </p>
                        <span className={styles.menuItemPrice}>
                          {item.price ? `$${item.price}` : '$14'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section with Zoom Effects */}
      <section className={`${styles.section} ${styles.gallery}`} data-block="gallery" id="gallery">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Gallery</h2>
          <div className={styles.galleryGrid}>
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className={styles.galleryItem}>
                <img 
                  src={`/tasty/images/${(index + 5) % 16 + 1}.jpg`}
                  alt={`Gallery image ${index + 1}`}
                  className={styles.zoom}
                />
                <div className={styles.galleryOverlay}>
                  <span className={styles.scriptText}>Delicious</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={`${styles.section} ${styles.contact}`} data-block="contact" id="contact">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Contact Us</h2>
          <div className={styles.contactContent}>
            <div className={styles.contactInfo}>
              <h3>Visit Us</h3>
              <p>
                <strong>{info.name}</strong><br />
                {info.region}, {info.state}<br />
                {info.country}
              </p>
              
              <h3>Opening Hours</h3>
              <div className={styles.hoursGrid}>
                <div className={styles.hoursRow}>
                  <span>Monday - Thursday</span>
                  <span>11:00 AM - 10:00 PM</span>
                </div>
                <div className={styles.hoursRow}>
                  <span>Friday - Saturday</span>
                  <span>11:00 AM - 11:00 PM</span>
                </div>
                <div className={styles.hoursRow}>
                  <span>Sunday</span>
                  <span>12:00 PM - 9:00 PM</span>
                </div>
              </div>
            </div>
            
            <div className={styles.contactInfo}>
              <h3>Reserve a Table</h3>
              <p>
                Experience the finest {info.type_of_food} cuisine in {info.region}. 
                Call us or visit our restaurant to make a reservation.
              </p>
              <p>
                We look forward to serving you our signature dishes in a warm, 
                welcoming atmosphere that celebrates the art of fine dining.
              </p>
              <a href="tel:+15551234567" className={styles.btn}>
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>tasty</div>
            <div>
              <p>&copy; 2024 {info.name}. All rights reserved. | Delicious Italian Food Since 1990</p>
            </div>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>📘</a>
              <a href="#" className={styles.socialLink}>📷</a>
              <a href="#" className={styles.socialLink}>🐦</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}