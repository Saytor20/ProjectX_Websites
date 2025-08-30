'use client';

import React, { useEffect } from 'react';
import { Restaurant } from '@/lib/schema';
import { registerBlock } from '@/editor/registry';
import styles from './template.module.css';

interface FooderaTemplateProps {
  restaurant: Restaurant;
}

export default function FooderaTemplate({ restaurant }: FooderaTemplateProps) {
  const { restaurant_info: info, menu_categories } = restaurant;
  
  // Organize menu by categories for professional layout
  const categorizedMenu = Object.entries(menu_categories).map(([category, items]) => ({
    name: category,
    items: items.slice(0, 6) // Limit items per category for better presentation
  })).slice(0, 4); // Show up to 4 categories
  
  // Get featured items for offers section
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
          selector: `.${styles.bannerTitle}`,
        },
        {
          id: 'hero-subtitle',
          type: 'text',
          label: 'Subtitle', 
          selector: `.${styles.bannerText}`,
        },
        {
          id: 'hero-button',
          type: 'text',
          label: 'Button Text',
          selector: `.${styles.themeBtn}`,
        }
      ]
    });

    // Offers block
    registerBlock({
      id: 'offers',
      name: 'Special Offers',
      selector: '[data-block="offers"]',
      fields: []
    });

    // Menu block
    registerBlock({
      id: 'menu',
      name: 'Popular Dishes',
      selector: '[data-block="menu"]',
      fields: [
        {
          id: 'menu-title',
          type: 'text',
          label: 'Section Title',
          selector: `.${styles.sectionTitle}`,
        }
      ]
    });

    // Gallery block
    registerBlock({
      id: 'gallery',
      name: 'About Section',
      selector: '[data-block="gallery"]',
      fields: [
        {
          id: 'about-title',
          type: 'text',
          label: 'About Title',
          selector: `.${styles.aboutTitle}`,
        }
      ]
    });

    // Hours block
    registerBlock({
      id: 'hours',
      name: 'Opening Hours',
      selector: '[data-block="hours"]',
      fields: []
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
      <header className={styles.headerSection} data-block="navbar">
        <div className={styles.headerWrapper}>
          <div className={styles.logo}>
            <img src="/foodera/logo/logo.svg" alt={info.name} />
          </div>
          <div className={styles.headerItems}>
            <div className={styles.headerTop}>
              <span>
                <i className={styles.clockIcon}></i> 09:00 am - 06:00 pm
              </span>
              <div className={styles.socialIcon}>
                <span>Follow Us:</span>
                <a href="#"><i className={styles.facebook}></i></a>
                <a href="#"><i className={styles.twitter}></i></a>
                <a href="#"><i className={styles.youtube}></i></a>
              </div>
            </div>
            <nav className={styles.mainMenu}>
              <ul>
                <li><a href="#hero">Home</a></li>
                <li><a href="#offers">Offers</a></li>
                <li><a href="#menu">Menu</a></li>
                <li><a href="#gallery">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className={styles.bannerSection} data-block="hero" id="hero">
        <div className={styles.bannerWrapper}>
          <div className={styles.container}>
            <div className={styles.bannerContent}>
              <h1 className={styles.bannerTitle}>
                Welcome to {info.name}
              </h1>
              <p className={styles.bannerText}>
                Experience the finest {info.type_of_food} cuisine in {info.region}
              </p>
              <a href="#menu" className={styles.themeBtn}>
                ORDER NOW <i className={styles.arrowIcon}></i>
              </a>
            </div>
          </div>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
        </div>
      </section>

      {/* Special Offers */}
      <section className={styles.offerSection} data-block="offers" id="offers">
        <div className={styles.container}>
          <div className={styles.offerGrid}>
            <div className={styles.offerCard}>
              <div className={styles.offerContent}>
                <h6>SPECIAL TODAY</h6>
                <h3>{menuItems[0]?.item_en || 'SIGNATURE DISH'}</h3>
                <p>Limited Time Offer</p>
                <a href="#menu" className={styles.themeBtn}>
                  ORDER NOW <i className={styles.arrowIcon}></i>
                </a>
              </div>
              <div className={styles.offerThumb}>
                <img src="/foodera/dishes/dishes1_1.png" alt="offer" />
              </div>
            </div>
            
            <div className={styles.offerCard}>
              <div className={styles.offerContent}>
                <h6>WELCOME {info.name.toUpperCase()}</h6>
                <h3>TODAY SPECIAL FOOD</h3>
                <p>Limited Time Offer</p>
                <a href="#menu" className={styles.themeBtn}>
                  ORDER NOW <i className={styles.arrowIcon}></i>
                </a>
              </div>
              <div className={styles.offerThumb}>
                <img src="/foodera/dishes/dishes1_2.png" alt="offer" />
              </div>
            </div>

            <div className={styles.offerCard}>
              <div className={styles.offerContent}>
                <h6>ON THIS WEEK</h6>
                <h3>{menuItems[1]?.item_en || 'CHEF SPECIAL'}</h3>
                <p>Limited Time Offer</p>
                <a href="#menu" className={styles.themeBtn}>
                  ORDER NOW <i className={styles.arrowIcon}></i>
                </a>
              </div>
              <div className={styles.offerThumb}>
                <img src="/foodera/dishes/dishes1_3.png" alt="offer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Menu Section */}
      <section className={styles.popularDishesSection} data-block="menu" id="menu">
        <div className={styles.container}>
          <div className={styles.titleArea}>
            <div className={styles.subTitle}>
              <img src="/foodera/icon/titleIcon.svg" alt="icon" />
              OUR MENU
              <img src="/foodera/icon/titleIcon.svg" alt="icon" />
            </div>
            <h2 className={styles.sectionTitle}>Signature Dishes</h2>
          </div>
          
          <div className={styles.menuGrid}>
            {categorizedMenu.map((category, categoryIndex) => (
              <div key={categoryIndex} className={`${styles.menuColumn} ${categoryIndex % 2 === 0 ? styles.left : styles.right}`}>
                <div className={styles.categoryHeader}>
                  <h3>{category.name}</h3>
                  <div className={styles.categoryIcon}>
                    🍽️
                  </div>
                </div>
                <div className={styles.menuCategoryBody}>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className={styles.professionalMenuItem}>
                      <h5>
                        <a href="#" title={item.description || "Delicious dish"}>
                          {item.item_en || item.item_ar}
                        </a>
                        <span className={styles.menuDots}></span>
                        <span className={styles.menuPrice}>
                          <span className={styles.currencySymbol}>{item.currency}</span>
                          {item.offer_price || item.price}
                        </span>
                      </h5>
                      {item.description && (
                        <ul className={styles.menuTags}>
                          <li><a href="#" title="Description">{item.description.slice(0, 20)}...</a></li>
                          <li><a href="#" title="Quality">Premium</a></li>
                          <li><a href="#" title="Style">Traditional</a></li>
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection} data-block="gallery" id="gallery">
        <div className={styles.aboutWrapper}>
          <div className={styles.container}>
            <div className={styles.titleArea}>
              <div className={styles.subTitle}>
                <img src="/foodera/icon/titleIcon.svg" alt="icon" />
                About US
                <img src="/foodera/icon/titleIcon.svg" alt="icon" />
              </div>
              <h2 className={styles.aboutTitle}>
                Variety of flavours from {info.type_of_food} cuisine
              </h2>
              <div className={styles.aboutText}>
                Experience the finest {info.type_of_food} cuisine in {info.region}. 
                We pride ourselves on authentic flavors and fresh ingredients 
                that make every dish a memorable experience.
              </div>
              <div className={styles.btnWrapper}>
                <a className={styles.themeBtn} href="#menu">
                  ORDER NOW <i className={styles.arrowIcon}></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Hours */}
      <section className={styles.hoursSection} data-block="hours" id="hours">
        <div className={styles.container}>
          <div className={styles.hoursContent}>
            <h3>Opening Hours & Contact</h3>
            <p>Monday - Friday: 10:00 AM - 11:00 PM</p>
            <p>Saturday - Sunday: 9:00 AM - 12:00 AM</p>
            <p>Location: {info.region}, {info.state}</p>
            <p>Rating: {info.rating}/5 ⭐ ({info.review_count} reviews)</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer} data-block="footer" id="contact">
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              <img src="/foodera/logo/logo.svg" alt={info.name} />
            </div>
            <div className={styles.footerInfo}>
              <h4 className={styles.footerTitle}>{info.name}</h4>
              <p>Experience the finest {info.type_of_food} cuisine</p>
              <p>Location: {info.region}, {info.state}</p>
              <p>Type: {info.type_of_food}</p>
            </div>
            <div className={styles.footerSocial}>
              <h4>Follow Us</h4>
              <div className={styles.socialLinks}>
                <a href="#"><i className={styles.facebook}></i></a>
                <a href="#"><i className={styles.twitter}></i></a>
                <a href="#"><i className={styles.instagram}></i></a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            © 2024 {info.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}