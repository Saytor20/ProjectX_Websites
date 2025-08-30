'use client';
import React from 'react';
import { Restaurant } from '@/lib/schema';
import styles from './template.module.css';

interface SimpleModernTemplateProps {
  restaurant: Restaurant;
  variant?: 'light' | 'dark';
}

export default function SimpleModernTemplate({ restaurant, variant = 'light' }: SimpleModernTemplateProps) {
  const { restaurant_info: info, menu_categories: menu } = restaurant;
  const allMenuItems = Object.values(menu).flat().slice(0, 8);

  return (
    <div className={`${styles.template} ${variant === 'dark' ? styles.dark : styles.light}`}>
      <nav className={styles.navbar} data-block="navbar">
        <div className={styles.container}>
          <img src="/food-smile-logo.svg" alt={info.name} className={styles.logo} />
          <h2 className={styles.navTitle}>{info.name}</h2>
        </div>
      </nav>

      <section className={`${styles.section} ${styles.hero}`} data-block="hero" id="hero">
        <div className={styles.container}>
          <h1>Welcome to {info.name}</h1>
          <p>Delicious {info.type_of_food} cuisine in {info.region}</p>
          <button className={styles.ctaButton}>Order Now</button>
        </div>
      </section>

      <section className={`${styles.section} ${styles.menu}`} data-block="menu" id="menu">
        <div className={styles.container}>
          <h2>Our Menu</h2>
          <div className={styles.menuGrid}>
            {Object.entries(menu).map(([categoryName, items]) => (
              <div key={categoryName} className={styles.menuCategory}>
                <h3 className={styles.categoryTitle}>{categoryName}</h3>
                {items.slice(0, 4).map((item, index) => (
                  <div key={index} className={styles.menuItem}>
                    <div className={styles.itemInfo}>
                      <h4>{item.item_en}</h4>
                      {item.item_ar && <p className={styles.itemArabic}>{item.item_ar}</p>}
                    </div>
                    <span className={styles.itemPrice}>
                      {item.offer_price || item.price} {item.currency}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.gallery}`} data-block="gallery" id="gallery">
        <div className={styles.container}>
          <h2>Gallery</h2>
          <div className={styles.galleryGrid}>
            {[1,2,3,4,5,6].map(i => (
              <img key={i} src="/cafert/img/placeholder.jpg" alt="Food Gallery" className={styles.galleryImage} />
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.hours}`} data-block="hours" id="hours">
        <div className={styles.container}>
          <h2>Opening Hours</h2>
          <div className={styles.hoursGrid}>
            <div className={styles.hoursDay}>
              <span>Monday - Thursday</span>
              <span>9:00 AM - 10:00 PM</span>
            </div>
            <div className={styles.hoursDay}>
              <span>Friday - Saturday</span>
              <span>9:00 AM - 11:00 PM</span>
            </div>
            <div className={styles.hoursDay}>
              <span>Sunday</span>
              <span>10:00 AM - 9:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.cta}`} data-block="cta">
        <div className={styles.container}>
          <h2>Ready to Order?</h2>
          <p>Experience the best {info.type_of_food} in {info.region}</p>
          <button className={styles.ctaButton}>Order Online</button>
        </div>
      </section>

      <footer className={`${styles.section} ${styles.footer}`} data-block="footer" id="contact">
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h4>Contact Info</h4>
              <p>{info.region}, {info.state}</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Email: info@{info.name.toLowerCase().replace(/\s+/g, '')}.com</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Location</h4>
              <p>{info.region}</p>
              <p>{info.state}</p>
              <p>Rating: {info.rating}/5 ⭐</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Cuisine</h4>
              <p>{info.type_of_food}</p>
              <p>Delivery Available</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
