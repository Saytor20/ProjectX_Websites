'use client';
import React, { useEffect } from 'react';
import { Restaurant } from '@/lib/schema';
import { registerBlock } from '@/editor/registry';
import styles from './template.module.css';

export default function Template({ restaurant }: { restaurant: Restaurant }) {
  const { restaurant_info: info, menu_categories } = restaurant;
  
  // Authentic Foodera menu layout - card-based grid (limited for performance)
  const menuItems = Object.values(menu_categories).flat().slice(0, 9);

  // Editor block registration
  useEffect(() => {
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

    registerBlock({
      id: 'hero',
      name: 'Hero Section',
      selector: '[data-block="hero"]',
      fields: [
        {
          id: 'title',
          type: 'text',
          label: 'Hero Title',
          selector: `.${styles.heroTitle}`,
        },
        {
          id: 'subtitle',
          type: 'text',
          label: 'Hero Subtitle',
          selector: `.${styles.heroSubtitle}`,
        }
      ]
    });

    registerBlock({
      id: 'menu',
      name: 'Menu Section',
      selector: '[data-block="menu"]',
      fields: [
        {
          id: 'title',
          type: 'text',
          label: 'Menu Title',
          selector: `.${styles.menuTitle}`,
        }
      ]
    });

    registerBlock({
      id: 'contact',
      name: 'Contact Section',
      selector: '[data-block="contact"]',
      fields: [
        {
          id: 'title',
          type: 'text',
          label: 'Contact Title',
          selector: `.${styles.contactTitle}`,
        }
      ]
    });
  }, []);

  return (
    <div className={styles.template}>
      {/* Navigation - Authentic Foodera Style */}
      <header className={styles.navbar} data-block="navbar">
        <div className={styles.container}>
          <div className={styles.logo}>
            <img src="/food-smile-logo.svg" alt={info.name} />
          </div>
          <nav className={styles.navMenu}>
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#explore">Explore Foods</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section - Authentic Foodera */}
      <section className={styles.hero} data-block="hero" id="home">
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h3 className={styles.heroTitle}>Good food choices are good investments.</h3>
            <p className={styles.heroSubtitle}>
              Experience authentic {info.type_of_food} cuisine at {info.name}. Located in {info.region}, we pride ourselves on serving fresh, high-quality dishes.
            </p>
            <div className={styles.space30}></div>
            <div className={styles.heroButtons}>
              <a href="#explore" className={styles.btnPrimary}>
                Order Now <span>🛒</span>
              </a>
              <a href="#about" className={styles.btnSecondary}>
                Learn More <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Authentic Foodera */}
      <div className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statsInfo}>
              <i className="icon-piggy"></i>
              <p>{Math.floor(info.rating * 300)}+</p>
              <h2>Savings</h2>
            </div>
            <div className={styles.statsInfo}>
              <i className="icon-people"></i>
              <p>{info.review_count}+</p>
              <h2>Happy Customers</h2>
            </div>
            <div className={styles.statsInfo}>
              <i className="icon-cup"></i>
              <p>{menuItems.length}+</p>
              <h2>Menu Items</h2>
            </div>
            <div className={styles.statsInfo}>
              <i className="icon-heart"></i>
              <p>{info.rating}</p>
              <h2>Rating</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Foods Section - Authentic Card Layout */}
      <section className={styles.menu} data-block="menu" id="explore">
        <div className={styles.container}>
          <div className={styles.aboutInline}>
            <h3 className={styles.menuTitle}>Explore Our Foods</h3>
            <p className={styles.menuSubtitle}>
              Discover our carefully crafted menu featuring authentic {info.type_of_food} dishes. 
              Each item is prepared with the finest ingredients and traditional cooking methods 
              to bring you the most authentic flavors.
            </p>
          </div>
          
          <div className={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <div key={index} className={styles.cardProduct}>
                <div className={styles.imgWrap}>
                  <img 
                    src={item.image || `/menu-placeholder-${(index % 3) + 1}.jpg`} 
                    alt={item.item_en || item.item_ar} 
                  />
                </div>
                <div className={styles.infoWrap}>
                  <h4 className={styles.title}>{item.item_en || item.item_ar}</h4>
                  <p className={styles.desc}>
                    {item.description || `Authentic ${info.type_of_food} dish prepared with traditional flavors and fresh ingredients`}
                  </p>
                  <div className={styles.priceWrap}>
                    <span className={styles.priceNew}>
                      {item.currency}{item.offer_price || item.price}
                    </span>
                    {item.offer_price && (
                      <del className={styles.priceOld}>
                        {item.currency}{item.price}
                      </del>
                    )}
                  </div>
                </div>
                <div className={styles.bottomWrap}>
                  <a href="#order" className={styles.btnOrder}>
                    Order Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about} id="about">
        <div className={styles.container}>
          <div className={styles.aboutInline}>
            <h3>We pride ourselves on making real food from the best ingredients.</h3>
            <p>
              At {info.name}, we believe in serving authentic {info.type_of_food} cuisine using only the finest 
              and freshest ingredients. Our skilled chefs bring years of experience and passion to every dish, 
              ensuring that each meal is prepared with care and attention to detail. Located in the heart of {info.region}, 
              we have been serving our community with traditional flavors and modern presentation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contact} data-block="contact" id="contact">
        <div className={styles.container}>
          <h2 className={styles.contactTitle}>Visit Us Today</h2>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <h4>📍 Location</h4>
              <p>{info.region}, {info.state}</p>
              <p>{info.country}</p>
            </div>
            <div className={styles.contactItem}>
              <h4>⭐ Rating</h4>
              <p>{info.rating}/5.0 Stars</p>
              <p>Based on {info.review_count} reviews</p>
            </div>
            <div className={styles.contactItem}>
              <h4>🍽️ Cuisine</h4>
              <p>{info.type_of_food}</p>
              <p>Authentic & Fresh</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}