'use client';
import React from 'react';
import { Restaurant } from '@/lib/schema';
import styles from './template.module.css';

export default function Template({ restaurant }: { restaurant: Restaurant }) {
  const { restaurant_info: info, menu_categories } = restaurant;
  
  // Professional menu organization - limit to 4 categories, 6 items each
  const categorizedMenu = Object.entries(menu_categories).map(([category, items]) => ({
    name: category,
    items: items.slice(0, 6)
  })).slice(0, 4);

  return (
    <div className={styles.template}>
      {/* Navigation */}
      <header className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <img src="/food-smile-logo.svg" alt={info.name} />
          </div>
          <nav className={styles.navMenu}>
            <a href="#menu">Menu</a>
            <a href="#hours">Hours</a>
            <a href="#location">Location</a>
          </nav>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{info.name}</h1>
          <p className={styles.heroSubtitle}>Authentic {info.type_of_food} cuisine in {info.region}</p>
          <a href="#menu" className={styles.heroButton}>View Our Menu</a>
        </div>
      </section>
      
      {/* Menu Section */}
      <section className={styles.menu} id="menu">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>{info.name} Menu</h2>
            <span>Delicious dishes made with love</span>
          </div>
          <div className={styles.menuGrid}>
            {categorizedMenu.map((category, catIndex) => (
              <div key={catIndex} className={styles.menuColumn}>
                <div className={styles.heading}>
                  <h3>{category.name}</h3>
                </div>
                <div className={styles.body}>
                  {category.items.map((item, index) => (
                    <div key={index} className={styles.menuItem}>
                      <h5>
                        <span>{item.item_en || item.item_ar}</span>
                        <span className={styles.menuDots}></span>
                        <span className={styles.price}>
                          {item.currency} {item.offer_price || item.price}
                        </span>
                      </h5>
                      {item.description && (
                        <p className={styles.description}>{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Hours Section */}
      <section className={styles.hours} id="hours">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.hoursTitle}>Hours</h2>
          </div>
          <div className={styles.hoursContent}>
            <p><strong>Monday - Sunday:</strong> 8:00 AM - 11:00 PM</p>
            <p><strong>Friday Prayer:</strong> Closed 12:00 PM - 1:30 PM</p>
            <p>We're open daily to serve you the best {info.type_of_food} food!</p>
          </div>
        </div>
      </section>
      
      {/* Location Section */}
      <section className={styles.location} id="location">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Visit Us</h2>
            <span>Find us in the heart of {info.region}</span>
          </div>
          <div className={styles.locationContent}>
            <div className={styles.locationDetails}>
              <h4>📍 Location</h4>
              <p>{info.region}, {info.state}</p>
              <p>{info.country}</p>
              
              <h4>⭐ Reviews</h4>
              <p>Rating: {info.rating}/5.0 ({info.review_count} reviews)</p>
              <p>Loved by our community for authentic {info.type_of_food} cuisine</p>
              
              <h4>🍽️ Cuisine Type</h4>
              <p>{info.type_of_food} Restaurant</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Order?</h2>
            <p>Experience the authentic taste of {info.type_of_food} cuisine</p>
            <a href={info.hungerstation_url} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
              Order Now
            </a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.ftTop}>
            <div className={styles.ftLogo}>
              <img src="/food-smile-logo.svg" alt={info.name} />
            </div>
            <div className={styles.ftContent}>
              <div className={styles.ftCol}>
                <h6 className={styles.footerTitle}>Contact Info</h6>
                <p>{info.region}, {info.state}</p>
                <p>{info.country}</p>
                <p>Rating: {info.rating}/5 ({info.review_count} reviews)</p>
              </div>
              <div className={styles.ftCol}>
                <h6 className={styles.footerTitle}>Hours</h6>
                <p>Monday - Sunday</p>
                <p>8:00 AM - 11:00 PM</p>
                <p>Friday Prayer: Closed 12:00 PM - 1:30 PM</p>
              </div>
              <div className={styles.ftCol}>
                <h6 className={styles.footerTitle}>About {info.name}</h6>
                <p>Authentic {info.type_of_food} restaurant serving the best traditional dishes in {info.region}.</p>
              </div>
            </div>
          </div>
          <div className={styles.ftBot}>
            <p>&copy; 2024 {info.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}