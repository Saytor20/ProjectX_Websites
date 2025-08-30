'use client';

import React, { useEffect } from 'react';
import { Restaurant } from '@/lib/schema';
import { registerBlock } from '@/editor/registry';
import styles from './template.module.css';

interface CoillTemplateProps {
  restaurant: Restaurant;
}

export default function CoillTemplate({ restaurant }: CoillTemplateProps) {
  const { restaurant_info: info, menu_categories } = restaurant;
  const menuItems = Object.values(menu_categories).flat().slice(0, 8);
  const bestSellerItems = menu_categories['Bestsellers 🔥'] || Object.values(menu_categories)[0] || [];
  const otherItems = Object.values(menu_categories).flat().filter(item => !bestSellerItems.includes(item)).slice(0, 4);

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
          type: 'text',
          label: 'Brand Name',
          selector: `.${styles.navbarBrand}`,
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
          id: 'hero-subtitle',
          type: 'text',
          label: 'Subtitle',
          selector: `.${styles.heroSubtitle}`,
        },
        {
          id: 'hero-title',
          type: 'text',
          label: 'Main Title',
          selector: `.${styles.heroTitle}`,
        },
        {
          id: 'hero-button',
          type: 'text',
          label: 'Button Text',
          selector: `.${styles.heroButton}`,
        }
      ]
    });

    // Services block
    registerBlock({
      id: 'services',
      name: 'Services Section',
      selector: '[data-block="services"]',
      fields: [
        {
          id: 'services-title',
          type: 'text',
          label: 'Services Title',
          selector: `.${styles.servicesTitle}`,
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
      name: 'Portfolio Gallery',
      selector: '[data-block="gallery"]',
      fields: [
        {
          id: 'gallery-title',
          type: 'text',
          label: 'Gallery Title',
          selector: `.${styles.galleryTitle}`,
        }
      ]
    });

    // Features block
    registerBlock({
      id: 'features',
      name: 'Features Section',
      selector: '[data-block="features"]',
      fields: [
        {
          id: 'features-title',
          type: 'text',
          label: 'Features Title',
          selector: `.${styles.featuresTitle}`,
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
        }
      ]
    });

    // Footer block
    registerBlock({
      id: 'footer',
      name: 'Footer',
      selector: '[data-block="footer"]',
      fields: []
    });
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header} data-block="navbar">
        <nav className={styles.navbar}>
          <div className={styles.containerFluid}>
            <div className={styles.navbarHeader}>
              <button type="button" className={styles.navbarToggle}>
                <span className={styles.iconBar}></span>
                <span className={styles.iconBar}></span>
                <span className={styles.iconBar}></span>
              </button>
              <a className={styles.navbarBrand} href="#home">{info.name}</a>
            </div>
            <div className={styles.navbarCollapse}>
              <ul className={styles.navbarNav}>
                <li><a href="#home">Home</a></li>
                <li><a href="#services">About</a></li>
                <li><a href="#menu">Menu</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection} data-block="hero" id="home">
        <div className={styles.heroSlider}>
          <div className={styles.heroSlide}>
            <div className={styles.heroContent}>
              <div className={styles.heroSubtitle}>Discover Awesome Features.</div>
              <h1 className={styles.heroTitle}>Powerful cuisine that <br /> looks delicious</h1>
              <a href="#menu" className={styles.heroButton}>Read More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection} data-block="services" id="services">
        <div className={styles.containerInner}>
          <div className={styles.titleSection}>
            <h1 className={styles.servicesTitle}>We are digital creative kitchen</h1>
            <p>Services are delivered by our team with years of experience <br /> Experience the finest {info.type_of_food} cuisine with professional quality <br /> Variations of fresh ingredients available daily</p>
          </div>
        </div>
        <div className={styles.servicesBox}>
          <div className={styles.servicesPost}>
            <a href="#"><span className={styles.iconDesktop}></span></a>
            <h2>Fresh & Quality Ingredients</h2>
            <p>We use only the finest and freshest ingredients to ensure every dish meets our high standards of quality and taste.</p>
          </div>
          <div className={styles.servicesPost}>
            <a href="#"><span className={styles.iconFolderAdd}></span></a>
            <h2>Authentic {info.type_of_food} Menu</h2>
            <p>Our extensive menu offers traditional and modern {info.type_of_food} dishes prepared with authentic recipes.</p>
          </div>
          <div className={styles.servicesPost}>
            <a href="#"><span className={styles.iconMapAlt}></span></a>
            <h2>Prime Location</h2>
            <p>Located in the heart of {info.region}, we offer convenient dining with excellent accessibility.</p>
          </div>
          <div className={styles.servicesPost}>
            <a href="#"><span className={styles.iconGlobe}></span></a>
            <h2>Events & Catering</h2>
            <p>We offer catering services for special events and celebrations with our signature dishes.</p>
          </div>
        </div>
      </section>

      {/* Menu Section (replacing Portfolio) */}
      <section className={styles.menuSection} data-block="menu" id="menu">
        <div className={styles.containerInner}>
          <div className={styles.titleSection + ' ' + styles.whiteStyle}>
            <h1 className={styles.menuTitle}>This is our menu</h1>
          </div>
        </div>
        <div className={styles.menuBox}>
          {menuItems.slice(0, 8).map((item, index) => (
            <div key={index} className={styles.menuItem}>
              <img src={item.image || '/coill/images/menu-placeholder.jpg'} alt={item.item_en || item.item_ar} />
              <div className={styles.menuItemHover}>
                <div className={styles.menuItemInner}>
                  <h2><a href="#">{item.item_en || item.item_ar}</a></h2>
                  <span>{item.currency} {item.offer_price || item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.centerButton}>
          <a href="#contact">View Full Menu</a>
        </div>
      </section>

      {/* Gallery Section (Food Photos) */}
      <section className={styles.portfolioSection} data-block="gallery" id="gallery">
        <div className={styles.containerInner}>
          <div className={styles.titleSection}>
            <h1 className={styles.galleryTitle}>Fresh food gallery</h1>
          </div>
        </div>
        <div className={styles.portfolioBox}>
          {bestSellerItems.slice(0, 6).map((item, index) => (
            <div key={index} className={styles.projectPost}>
              <img src={item.image || '/coill/images/gallery-placeholder.jpg'} alt={item.item_en || item.item_ar} />
              <div className={styles.hoverBox}>
                <div className={styles.innerHover}>
                  <h2><a href="#">{item.item_en || item.item_ar}</a></h2>
                  <span>{item.description || 'Delicious ' + info.type_of_food + ' cuisine'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection} data-block="features">
        <div className={styles.containerInner}>
          <div className={styles.titleSection}>
            <h1 className={styles.featuresTitle}>Discover awesome features</h1>
            <p>Experience the finest {info.type_of_food} dining with our exceptional service and quality ingredients <br /> Fresh, authentic, and delicious meals prepared daily</p>
          </div>
          <div className={styles.featuresBox}>
            <div className={styles.featurePost + ' ' + styles.offsetTop1}>
              <h2>Fresh & Healthy</h2>
              <p>All ingredients are sourced fresh daily and prepared with care to maintain nutritional value and taste.</p>
            </div>
            <div className={styles.featureImage}>
              <img src="/coill/images/restaurant-feature.jpg" alt="Restaurant" />
            </div>
            <div className={styles.featurePost + ' ' + styles.offsetTop2}>
              <h2>Traditional Recipes</h2>
              <p>Our chefs use time-honored recipes passed down through generations to create authentic flavors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className={styles.statisticSection}>
        <div className={styles.containerInner}>
          <div className={styles.statisticBox}>
            <div className={styles.statisticPost}>
              <p><span className={styles.timer}>{info.review_count || 125}</span></p>
              <h2>Happy Customers</h2>
            </div>
            <div className={styles.statisticPost}>
              <p><span className={styles.timer}>{info.rating}</span></p>
              <h2>Rating Stars</h2>
            </div>
            <div className={styles.statisticPost}>
              <p><span className={styles.timer}>{Object.keys(menu_categories).length}</span></p>
              <h2>Menu Categories</h2>
            </div>
            <div className={styles.statisticPost}>
              <p><span className={styles.timer}>{Object.values(menu_categories).flat().length}</span></p>
              <h2>Delicious Dishes</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection} data-block="cta">
        <div className={styles.containerInner}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Visit {info.name}</h2>
            <p>Experience the finest {info.type_of_food} cuisine in {info.region}</p>
            <a href="#contact" className={styles.ctaButton}>Make Reservation</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer} data-block="footer" id="contact">
        <div className={styles.upFooter}>
          <div className={styles.containerInner}>
            <div className={styles.footerCol}>
              <div className={styles.footerWidget + ' ' + styles.textWidget}>
                <h2>we are <span>{info.name.toLowerCase()}</span></h2>
                <span>Located in {info.region}, {info.state}</span>
                <span>Rating: {info.rating}/5 ⭐</span>
              </div>
              <div className={styles.footerWidget + ' ' + styles.socialWidget}>
                <h3>We are social</h3>
                <ul className={styles.socialIcons}>
                  <li><a className={styles.facebook} href="#"><i className="fa fa-facebook"></i></a></li>
                  <li><a className={styles.twitter} href="#"><i className="fa fa-twitter"></i></a></li>
                  <li><a className={styles.instagram} href="#"><i className="fa fa-instagram"></i></a></li>
                  <li><a className={styles.linkedin} href="#"><i className="fa fa-linkedin"></i></a></li>
                </ul>
              </div>
            </div>
            <div className={styles.footerCol}>
              <div className={styles.footerWidget}>
                <h3>Popular Dishes</h3>
                <ul className={styles.popularList}>
                  {bestSellerItems.slice(0, 3).map((item, index) => (
                    <li key={index}>
                      <h4><a href="#">{item.item_en || item.item_ar}</a></h4>
                      <a href="#">{item.currency} {item.offer_price || item.price}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.footerCol}>
              <div className={styles.footerWidget}>
                <h3>Restaurant Info</h3>
                <p>Type of Food: {info.type_of_food}</p>
                <p>Location: {info.region}, {info.state}</p>
                <p>Rating: {info.rating}/5 stars</p>
                <p>Reviews: {info.review_count} customers</p>
              </div>
            </div>
            <div className={styles.footerCol}>
              <div className={styles.footerWidget + ' ' + styles.newsletterWidget}>
                <h2>Contact Us</h2>
                <p>Get in touch for reservations and catering services.</p>
                <form className={styles.newsletterForm}>
                  <input type="text" placeholder="Your message" />
                  <input type="submit" value="Send" />
                </form>
              </div>
            </div>
          </div>
        </div>
        <p className={styles.copyright}>
          © Copyright 2024. "{info.name}" Restaurant. All rights reserved.
        </p>
      </footer>
    </div>
  );
}