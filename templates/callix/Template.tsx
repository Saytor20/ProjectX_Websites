'use client';

import React, { useEffect } from 'react';
import { Restaurant } from '@/lib/schema';
import { registerBlock } from '@/editor/registry';
import styles from './template.module.css';

interface CallixTemplateProps {
  restaurant: Restaurant;
}

export default function CallixTemplate({ restaurant }: CallixTemplateProps) {
  const { restaurant_info: info, menu_categories } = restaurant;
  
  // Get menu items and organize them into two columns
  const allMenuItems = Object.entries(menu_categories).flatMap(([category, items]) => 
    items.map(item => ({ ...item, category }))
  );
  const halfPoint = Math.ceil(allMenuItems.length / 2);
  const leftColumnItems = allMenuItems.slice(0, halfPoint);
  const rightColumnItems = allMenuItems.slice(halfPoint);

  // Gallery items - using menu item images
  const galleryImages = allMenuItems
    .filter(item => item.image)
    .slice(0, 6)
    .map(item => item.image);

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
          selector: `.${styles.heroContent} h1`,
        },
        {
          id: 'hero-subtitle',
          type: 'text',
          label: 'Subtitle',
          selector: `.${styles.heroContent} p`,
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
          selector: `.${styles.aboutText} h2`,
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
          selector: `.${styles.sectionHeader} h2`,
        }
      ]
    });

    // Gallery block
    registerBlock({
      id: 'gallery',
      name: 'Gallery Section',
      selector: '[data-block="gallery"]',
      fields: []
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
          selector: `.${styles.contactInfo} h3`,
        }
      ]
    });

    // Hours block
    registerBlock({
      id: 'hours',
      name: 'Hours Section',
      selector: '[data-block="hours"]',
      fields: [
        {
          id: 'hours-title',
          type: 'text',
          label: 'Hours Title',
          selector: `.${styles.hoursContent} h2`,
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
          id: 'footer-title',
          type: 'text',
          label: 'Footer Title',
          selector: `.${styles.footerSection} h3`,
        }
      ]
    });
  }, []);

  return (
    <div className={styles.template}>
      {/* Navigation */}
      <header className={styles.navbar} data-block="navbar">
        <div className={styles.container}>
          <div className={styles.navContent}>
            <div className={styles.logo}>
              <img src="/food-smile-logo.svg" alt={info.name} />
            </div>
            <nav>
              <ul className={styles.navLinks}>
                <li><a href="#hero">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#menu">Menu</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero} data-block="hero" id="hero">
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1>Modern {info.type_of_food} Cuisine</h1>
            <p>Experience exceptional dining at {info.name}, where traditional flavors meet contemporary presentation in the heart of {info.region}.</p>
            <div className={styles.heroCta}>
              <a href="#menu" className={styles.primaryBtn}>View Menu</a>
              <a href="#contact" className={styles.secondaryBtn}>Make Reservation</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about} data-block="about" id="about">
        <div className={styles.container}>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <div className={styles.sectionSubtitle}>Our Story</div>
              <h2>Welcome to {info.name}</h2>
              <p>Located in {info.region}, {info.state}, we've been serving authentic {info.type_of_food} cuisine with a modern twist. Our commitment to quality ingredients and exceptional service has earned us a {info.rating}-star rating from over {info.review_count} satisfied customers.</p>
              <p>Every dish is crafted with passion and attention to detail, combining traditional recipes with contemporary techniques to create an unforgettable dining experience.</p>
              <a href="#menu" className={styles.primaryBtn}>Explore Menu</a>
            </div>
            <div className={styles.aboutImage}>
              <img 
                src={galleryImages[0] || "/callix/images/background/1.jpg"} 
                alt="Restaurant interior" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className={styles.menu} data-block="menu" id="menu">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionSubtitle}>Our Menu</div>
            <h2>Signature Dishes</h2>
            <p>Discover our carefully curated selection of authentic {info.type_of_food} specialties</p>
          </div>
          
          <div className={styles.menuGrid}>
            {/* Left Column */}
            <div className={styles.menuColumn}>
              {leftColumnItems.map((item, index) => (
                <div key={`left-${index}`} className={styles.menuItem}>
                  <div className={styles.menuItemContent}>
                    <div className={styles.menuItemHeader}>
                      <h4 className={styles.menuItemName}>{item.item_en}</h4>
                      <div className={styles.menuItemPrice}>
                        <span className={styles.dots}></span>
                        <span className={styles.price}>{item.currency} {item.price}</span>
                      </div>
                    </div>
                    {item.description && (
                      <p className={styles.menuItemDescription}>{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className={styles.menuColumn}>
              {rightColumnItems.map((item, index) => (
                <div key={`right-${index}`} className={styles.menuItem}>
                  <div className={styles.menuItemContent}>
                    <div className={styles.menuItemHeader}>
                      <h4 className={styles.menuItemName}>{item.item_en}</h4>
                      <div className={styles.menuItemPrice}>
                        <span className={styles.dots}></span>
                        <span className={styles.price}>{item.currency} {item.price}</span>
                      </div>
                    </div>
                    {item.description && (
                      <p className={styles.menuItemDescription}>{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.gallery} data-block="gallery" id="gallery">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionSubtitle}>Gallery</div>
            <h2>Food Showcase</h2>
            <p>A visual journey through our culinary creations</p>
          </div>
          
          <div className={styles.galleryGrid}>
            {galleryImages.map((image, index) => (
              <div key={index} className={styles.galleryItem}>
                <img 
                  src={image || `/callix/images/background/${(index % 3) + 1}.jpg`} 
                  alt={`Gallery item ${index + 1}`}
                />
                <div className={styles.galleryOverlay}>
                  <i className="fas fa-search-plus"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours Section */}
      <section className={styles.hours} data-block="hours" id="hours">
        <div className={styles.container}>
          <div className={styles.hoursContent}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionSubtitle}>Opening Hours</div>
              <h2>Visit Us</h2>
              <p>We're open seven days a week to serve you</p>
            </div>
            
            <div className={styles.hoursGrid}>
              <div className={styles.hourItem}>
                <h4>Monday - Thursday</h4>
                <p>11:00 AM - 10:00 PM</p>
              </div>
              <div className={styles.hourItem}>
                <h4>Friday - Saturday</h4>
                <p>11:00 AM - 11:00 PM</p>
              </div>
              <div className={styles.hourItem}>
                <h4>Sunday</h4>
                <p>12:00 PM - 9:00 PM</p>
              </div>
              <div className={styles.hourItem}>
                <h4>Reservations</h4>
                <p>Call ahead for special events</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contact} data-block="contact" id="contact">
        <div className={styles.container}>
          <div className={styles.contactContent}>
            <div className={styles.contactInfo}>
              <div className={styles.sectionSubtitle}>Contact</div>
              <h3>Get In Touch</h3>
              <p>Ready to experience exceptional dining? Contact us for reservations or inquiries.</p>
              
              <ul className={styles.contactDetails}>
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{info.region}, {info.state}, {info.country}</span>
                </li>
                <li>
                  <i className="fas fa-phone"></i>
                  <span>+966 XX XXX XXXX</span>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>info@{info.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                </li>
                <li>
                  <i className="fas fa-star"></i>
                  <span>{info.rating} stars from {info.review_count} reviews</span>
                </li>
              </ul>
              
              <a href={info.hungerstation_url} target="_blank" rel="noopener noreferrer" className={styles.primaryBtn}>
                Order Online
              </a>
            </div>
            
            <div className={styles.contactImage}>
              <img 
                src={galleryImages[1] || "/callix/images/background/2.jpg"} 
                alt="Restaurant location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer} data-block="footer">
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>{info.name}</h3>
              <p>Experience the finest {info.type_of_food} cuisine in {info.region}. We're committed to serving exceptional food with outstanding service.</p>
              <div className={styles.footerSocial}>
                <a href="#" className={styles.socialLink}><i className="fab fa-facebook-f"></i></a>
                <a href="#" className={styles.socialLink}><i className="fab fa-instagram"></i></a>
                <a href="#" className={styles.socialLink}><i className="fab fa-twitter"></i></a>
              </div>
            </div>
            
            <div className={styles.footerSection}>
              <h3>Quick Links</h3>
              <ul className={styles.footerLinks}>
                <li><a href="#about">About Us</a></li>
                <li><a href="#menu">Menu</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className={styles.footerSection}>
              <h3>Contact Info</h3>
              <ul className={styles.footerLinks}>
                <li>{info.region}, {info.state}</li>
                <li>+966 XX XXX XXXX</li>
                <li>info@{info.name.toLowerCase().replace(/\s+/g, '')}.com</li>
                <li>Rating: {info.rating}/5 ({info.review_count} reviews)</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <p>&copy; 2024 {info.name}. All rights reserved. | Powered by Modern Restaurant Solutions</p>
          </div>
        </div>
      </footer>
    </div>
  );
}