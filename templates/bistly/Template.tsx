'use client';

import React, { useEffect } from 'react';
import { Restaurant } from '@/lib/schema';
import { registerBlock } from '@/editor/registry';
import styles from './template.module.css';

interface BistlyTemplateProps {
  restaurant: Restaurant;
}

export default function BistlyTemplate({ restaurant }: BistlyTemplateProps) {
  // Register blocks with the editor registry
  useEffect(() => {
    // Navbar block
    registerBlock({
      id: 'navbar',
      name: 'Navigation Bar',
      selector: '[data-block="navbar"]',
      fields: [
        {
          id: 'logo',
          type: 'image',
          label: 'Logo Image',
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
        },
        {
          id: 'hero-button-text',
          type: 'text',
          label: 'Button Text',
          selector: `.${styles.heroButton}`,
        },
        {
          id: 'hero-variant',
          type: 'select',
          label: 'Hero Background',
          // Apply as CSS inline style on the hero section
          property: 'background',
          options: [
            'linear-gradient(135deg, #D0965C, #2D4443)',
            '#2D4443',
            '#D0965C',
            '#ffffff'
          ]
        },
        {
          id: 'hero-padding',
          type: 'spacing',
          label: 'Section Padding',
          property: 'padding-top',
          min: 2,
          max: 8,
          step: 0.5,
          unit: 'rem'
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
          label: 'Section Title',
          selector: `.${styles.menuTitle} h2`,
        },
        {
          id: 'menu-description',
          type: 'text',
          label: 'Section Description',
          selector: `.${styles.menuTitle} p`,
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
          label: 'Section Title',
          selector: `.${styles.galleryTitle} h2`,
        },
        {
          id: 'gallery-description',
          type: 'text',
          label: 'Section Description',
          selector: `.${styles.galleryTitle} p`,
        },
        {
          id: 'gallery-image-1',
          type: 'image',
          label: 'Gallery Image 1',
          selector: `.${styles.galleryImage}:nth-child(1)`,
        },
        {
          id: 'gallery-image-2',
          type: 'image',
          label: 'Gallery Image 2',
          selector: `.${styles.galleryImage}:nth-child(2)`,
        }
      ]
    });

    // Hours block
    registerBlock({
      id: 'hours',
      name: 'Opening Hours',
      selector: '[data-block="hours"]',
      fields: [
        {
          id: 'hours-title',
          type: 'text',
          label: 'Section Title',
          selector: `.${styles.hoursTitle} h2`,
        },
        {
          id: 'hours-description',
          type: 'text',
          label: 'Section Description',
          selector: `.${styles.hoursTitle} p`,
        }
      ]
    });

    // CTA block
    registerBlock({
      id: 'cta',
      name: 'Call to Action',
      selector: '[data-block="cta"]',
      fields: [
        {
          id: 'cta-title',
          type: 'text',
          label: 'CTA Title',
          selector: `.${styles.ctaTitle}`,
        },
        {
          id: 'cta-description',
          type: 'text',
          label: 'CTA Description',
          selector: `.${styles.ctaDescription}`,
        },
        {
          id: 'cta-button-text',
          type: 'text',
          label: 'Button Text',
          selector: `.${styles.ctaButton}`,
        }
      ]
    });

    // Footer block
    registerBlock({
      id: 'footer',
      name: 'Footer',
      selector: '[data-block="footer"]',
      fields: [
        {
          id: 'footer-about-title',
          type: 'text',
          label: 'About Section Title',
          selector: `.${styles.footerSection}:nth-child(1) h4`,
        },
        {
          id: 'footer-contact-title',
          type: 'text',
          label: 'Contact Section Title',
          selector: `.${styles.footerSection}:nth-child(2) h4`,
        },
        {
          id: 'footer-links-title',
          type: 'text',
          label: 'Links Section Title',
          selector: `.${styles.footerSection}:nth-child(3) h4`,
        }
      ]
    });

    console.log('Bistly template blocks registered with editor');
  }, []);
  const { restaurant_info: info, menu_categories: menu } = restaurant;

  // Get all menu items for display
  const allMenuItems = Object.values(menu).flat().slice(0, 12);
  
  // Sample gallery images (in a real implementation, these would come from restaurant data)
  const galleryImages = [
    '/cafert/img/placeholder.jpg',
    '/cafert/img/placeholder.jpg',
    '/cafert/img/placeholder.jpg',
    '/cafert/img/placeholder.jpg',
  ];

  return (
    <div className={styles.template}>
      {/* Navbar */}
      <nav className={styles.navbar} data-block="navbar">
        <div className={styles.navbarContainer}>
          <div>
            <img 
              src="/food-smile-logo.svg" 
              alt={info.name} 
              className={styles.logo} 
            />
          </div>
          <ul className={styles.navMenu}>
            <li><a href="#hero">Home</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#hours">Hours</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero} data-block="hero" id="hero">
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            Welcome to {info.name}
          </h1>
          <p className={styles.heroSubtitle}>
            Classic Italian cuisine reimagined with modern flair, fresh ingredients, and bold flavors
          </p>
          <a href="#menu" className={styles.heroButton}>
            View Our Menu
          </a>
        </div>
      </section>

      {/* Menu Section */}
      <section className={styles.menu} data-block="menu" id="menu">
        <div className={styles.menuContainer}>
          <div className={styles.menuTitle}>
            <h2>Our Delicious Menu</h2>
            <p>Discover our carefully crafted dishes made with the finest ingredients</p>
          </div>
          
          <div className={styles.menuGrid}>
            {allMenuItems.map((item, index) => (
              <div key={index} className={styles.menuItem}>
                <h3 className={styles.menuItemName}>
                  {item.item_en}
                </h3>
                {item.description && (
                  <p className={styles.menuItemDescription}>
                    {item.description}
                  </p>
                )}
                <div className={styles.menuItemPrice}>
                  {item.offer_price || item.price} {item.currency}
                  {item.offer_price && item.price !== item.offer_price && (
                    <span style={{ textDecoration: 'line-through', marginLeft: '8px', opacity: 0.6 }}>
                      {item.price} {item.currency}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.gallery} data-block="gallery" id="gallery">
        <div className={styles.galleryContainer}>
          <div className={styles.galleryTitle}>
            <h2>Restaurant Gallery</h2>
            <p>Take a look at our beautiful restaurant and delicious dishes</p>
          </div>
          
          <div className={styles.galleryGrid}>
            {galleryImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${info.name} gallery ${index + 1}`}
                className={styles.galleryImage}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hours Section */}
      <section className={styles.hours} data-block="hours" id="hours">
        <div className={styles.hoursContainer}>
          <div className={styles.hoursTitle}>
            <h2>Opening Hours</h2>
            <p>Visit us during these hours for the best dining experience</p>
          </div>
          
          <div className={styles.hoursTable}>
            <div className={styles.hoursRow}>
              <span className={styles.hoursDay}>Monday</span>
              <span className={styles.hoursTime}>10:00 AM - 10:00 PM</span>
            </div>
            <div className={styles.hoursRow}>
              <span className={styles.hoursDay}>Tuesday</span>
              <span className={styles.hoursTime}>10:00 AM - 10:00 PM</span>
            </div>
            <div className={styles.hoursRow}>
              <span className={styles.hoursDay}>Wednesday</span>
              <span className={styles.hoursTime}>10:00 AM - 10:00 PM</span>
            </div>
            <div className={styles.hoursRow}>
              <span className={styles.hoursDay}>Thursday</span>
              <span className={styles.hoursTime}>10:00 AM - 10:00 PM</span>
            </div>
            <div className={styles.hoursRow}>
              <span className={styles.hoursDay}>Friday</span>
              <span className={styles.hoursTime}>10:00 AM - 11:00 PM</span>
            </div>
            <div className={styles.hoursRow}>
              <span className={styles.hoursDay}>Saturday</span>
              <span className={styles.hoursTime}>10:00 AM - 11:00 PM</span>
            </div>
            <div className={styles.hoursRow}>
              <span className={styles.hoursDay}>Sunday</span>
              <span className={styles.hoursTime}>Closed</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta} data-block="cta">
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to Dine With Us?</h2>
          <p className={styles.ctaDescription}>
            Experience exceptional cuisine in a warm and welcoming atmosphere. 
            Make your reservation today!
          </p>
          <a href="tel:+1234567890" className={styles.ctaButton}>
            Make a Reservation
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer} data-block="footer" id="contact">
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerSection}>
              <h4>About {info.name}</h4>
              <p>
                Located in {info.region}, {info.state}, we serve authentic {info.type_of_food} 
                cuisine with a modern twist. Join us for an unforgettable dining experience.
              </p>
            </div>
            
            <div className={styles.footerSection}>
              <h4>Contact Info</h4>
              <p>
                {info.region}, {info.state}<br />
                {info.country}
              </p>
              <p>Rating: {info.rating}/5 ({info.review_count} reviews)</p>
            </div>
            
            <div className={styles.footerSection}>
              <h4>Quick Links</h4>
              <p><a href="#menu">Our Menu</a></p>
              <p><a href="#gallery">Gallery</a></p>
              <p><a href="#hours">Opening Hours</a></p>
              <p><a href="#contact">Contact Us</a></p>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <p>&copy; 2025 {info.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
