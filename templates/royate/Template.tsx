'use client';

import React, { useEffect } from 'react';
import { Restaurant } from '@/lib/schema';
import { registerBlock } from '@/editor/registry';
import styles from './template.module.css';

interface RoyateTemplateProps {
  restaurant: Restaurant;
}

export default function RoyateTemplate({ restaurant }: RoyateTemplateProps) {
  const { restaurant_info: info, menu_categories } = restaurant;
  const menuItems = Object.values(menu_categories).flat().slice(0, 8);

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
          id: 'hero-button',
          type: 'text',
          label: 'Button Text',
          selector: `.${styles.heroButton}`,
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
          selector: `.${styles.menuTitle}`,
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
          selector: `.${styles.hoursTitle}`,
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
          id: 'cta-button',
          type: 'text',
          label: 'CTA Button',
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
          id: 'footer-title',
          type: 'text',
          label: 'Footer Title',
          selector: `.${styles.footerTitle}`,
        }
      ]
    });
  }, []);

  return (
    <div className={styles.template}>
      {/* Navigation */}
      <header className={styles.navbar} data-block="navbar">
        <nav className={styles.navbarDesktop}>
          <div className={styles.left}>
            <a href="#" className={styles.logo}>
              <img src="/food-smile-logo.svg" alt={info.name} />
            </a>
          </div>
          <ul className={styles.navMenu}>
            <li><a href="#hero">Home</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        {/* Hero Section - Revolution Slider converted to simple hero */}
        <section className={styles.hero} data-block="hero" id="hero">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Experience the food</h1>
            <p className={styles.heroSubtitle}>Wish you have good food at {info.name}</p>
            <a href="#menu" className={styles.heroButton}>Booking now</a>
          </div>
        </section>

        {/* Welcome Section */}
        <section className={styles.welcome} data-block="gallery" id="gallery">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Welcome to {info.name}</h2>
              <span>~ Luxury & Quality ~</span>
            </div>
            <div className={styles.welcomeGrid}>
              <div className={styles.welcomeItem}>
                <div className={styles.postThumb}>
                  <img src="/royate/images/post-thumb-1.jpg" alt="Professional level" />
                </div>
                <div className={styles.postBody}>
                  <h5>Professional level</h5>
                  <p>Experience the finest {info.type_of_food} cuisine with professional quality and exceptional service.</p>
                  <a href="#menu" className={styles.readMore}>Read More</a>
                </div>
              </div>
              <div className={styles.welcomeItem}>
                <div className={styles.postThumb}>
                  <img src="/royate/images/post-thumb-2.jpg" alt="Fresh food guaranteed" />
                </div>
                <div className={styles.postBody}>
                  <h5>Fresh food guaranteed</h5>
                  <p>We use only the freshest ingredients to ensure every dish meets our high standards of quality.</p>
                  <a href="#menu" className={styles.readMore}>Read More</a>
                </div>
              </div>
              <div className={styles.welcomeItem}>
                <div className={styles.postThumb}>
                  <img src="/royate/images/post-thumb-3.jpg" alt="The menu is plentiful" />
                </div>
                <div className={styles.postBody}>
                  <h5>The menu is plentiful</h5>
                  <p>Our extensive menu offers a wide variety of {info.type_of_food} dishes to satisfy every taste.</p>
                  <a href="#menu" className={styles.readMore}>Read More</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section className={styles.menu} data-block="menu" id="menu">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.menuTitle}>Our food menu</h2>
              <span>~ See what we offer ~</span>
            </div>
            <div className={styles.menuGrid}>
              <div className={styles.ourMenuCol + ' ' + styles.left}>
                <div className={styles.heading}>
                  <h3>Main Course</h3>
                  <span className={styles.icon}>
                    <img src="/royate/images/main-course.png" alt="Main Course" />
                  </span>
                </div>
                <div className={styles.body}>
                  {menuItems.slice(0, 4).map((item, index) => (
                    <div key={index} className={styles.menuItem}>
                      <h5>
                        <a href="#">{item.item_en || item.item_ar}</a>
                        <span className={styles.dots}></span>
                        <span className={styles.price}>
                          <span className={styles.currencySymbol}>{item.currency}</span>
                          <span className={styles.number}>{item.offer_price || item.price}</span>
                        </span>
                      </h5>
                      <ul>
                        {/* Generate ingredient tags from description or predefined tags */}
                        <li><a href="#">Fresh</a></li>
                        <li><a href="#">Authentic</a></li>
                        <li><a href="#">Spicy</a></li>
                        <li><a href="#">Traditional</a></li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.ourMenuCol + ' ' + styles.right}>
                <div className={styles.heading}>
                  <h3>Soups & Salads</h3>
                  <span className={styles.icon + ' ' + styles.mt12}>
                    <img src="/royate/images/soups-and-salads.png" alt="Soups & Salads" />
                  </span>
                </div>
                <div className={styles.body}>
                  {menuItems.slice(4, 8).map((item, index) => (
                    <div key={index} className={styles.menuItem}>
                      <h5>
                        <a href="#">{item.item_en || item.item_ar}</a>
                        <span className={styles.dots}></span>
                        <span className={styles.price}>
                          <span className={styles.currencySymbol}>{item.currency}</span>
                          <span className={styles.number}>{item.offer_price || item.price}</span>
                        </span>
                      </h5>
                      <ul>
                        <li><a href="#">Healthy</a></li>
                        <li><a href="#">Light</a></li>
                        <li><a href="#">Nutritious</a></li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hours Section */}
        <section className={styles.hours} data-block="hours" id="hours">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.hoursTitle}>Opening Hours</h2>
            </div>
            <div className={styles.hoursContent}>
              <p>Monday - Friday: 10:00 AM - 11:00 PM</p>
              <p>Saturday - Sunday: 9:00 AM - 12:00 AM</p>
              <p>Rating: {info.rating}/5 ⭐</p>
            </div>
          </div>
        </section>

        {/* CTA Section - Booking */}
        <section className={styles.cta} data-block="cta">
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Reserve Your Table</h2>
              <p>Book now and experience the finest dining</p>
              <a href="#contact" className={styles.ctaButton}>Book Now</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer} data-block="footer" id="contact">
        <div className={styles.ftTop}>
          <div className={styles.container}>
            <div className={styles.ftTopWrapper}>
              <div className={styles.ftLogo}>
                <img src="/food-smile-logo.svg" alt={info.name} />
              </div>
              <div className={styles.ftContent}>
                <div className={styles.ftCol}>
                  <h6 className={styles.footerTitle}>About {info.name}</h6>
                  <p>Experience the finest {info.type_of_food} cuisine in {info.region}.</p>
                </div>
                <div className={styles.ftCol}>
                  <h6>Get news & offers</h6>
                  <form>
                    <div className={styles.formInner}>
                      <input type="email" placeholder="Enter your email" />
                      <button type="submit">Subscribe</button>
                    </div>
                  </form>
                </div>
                <div className={styles.ftCol}>
                  <h6>Contact Us</h6>
                  <p>{info.region}, {info.state}</p>
                  <p>Rating: {info.rating}/5</p>
                  <p>Type: {info.type_of_food}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.ftBot}>
          <div className={styles.container}>
            © 2024 {info.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}