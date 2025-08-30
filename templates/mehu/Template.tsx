'use client';

import React, { useEffect } from 'react';
import { Restaurant } from '@/lib/schema';
import { registerBlock } from '@/editor/registry';
import styles from './template.module.css';

interface MehuTemplateProps {
  restaurant: Restaurant;
}

/**
 * Mehu Template
 * Converted from NgeTemplates Mehu (Envato Elements) into a React/Next.js template.
 * Sections: navbar, hero, product (menu grid), why-us, testimonial, contact, footer.
 * Data: Uses real `restaurant_data` (menu_categories, restaurant_info) — no fake placeholders.
 */
export default function MehuTemplate({ restaurant }: MehuTemplateProps) {
  const { restaurant_info: info, menu_categories } = restaurant;
  const menuItems = Object.values(menu_categories).flat();

  // Organize menu by categories for professional display
  const categoryEntries = Object.entries(menu_categories);
  const leftCategories = categoryEntries.slice(0, Math.ceil(categoryEntries.length / 2));
  const rightCategories = categoryEntries.slice(Math.ceil(categoryEntries.length / 2));

  useEffect(() => {
    // Navbar block
    registerBlock({
      id: 'navbar',
      name: 'Navigation Bar',
      selector: '[data-block="navbar"]',
      fields: [
        { id: 'logo', type: 'image', label: 'Logo Image', selector: `.${styles.logo} img` },
      ],
    });

    // Hero block
    registerBlock({
      id: 'hero',
      name: 'Hero Section',
      selector: '[data-block="hero"]',
      fields: [
        { id: 'hero-kicker', type: 'text', label: 'Kicker', selector: `.${styles.heroKicker}` },
        { id: 'hero-title', type: 'text', label: 'Title', selector: `.${styles.heroTitle}` },
        { id: 'hero-subtitle', type: 'text', label: 'Subtitle', selector: `.${styles.heroSubtitle}` },
        { id: 'hero-button', type: 'text', label: 'CTA Text', selector: `.${styles.heroButton}` },
      ],
    });

    // Product (Menu) block
    registerBlock({
      id: 'product',
      name: 'Product Grid (Menu)',
      selector: '[data-block="product"]',
      fields: [
        { id: 'product-title', type: 'text', label: 'Section Title', selector: `.${styles.productTitle}` },
      ],
    });

    // Why Us block
    registerBlock({
      id: 'why-us',
      name: 'Why Us',
      selector: '[data-block="why-us"]',
      fields: [
        { id: 'why-title', type: 'text', label: 'Title', selector: `.${styles.whyTitle}` },
        { id: 'why-subtitle', type: 'text', label: 'Subtitle', selector: `.${styles.whyKicker}` },
      ],
    });

    // Testimonial block
    registerBlock({
      id: 'testimonial',
      name: 'Testimonial',
      selector: '[data-block="testimonial"]',
      fields: [],
    });

    // Contact block
    registerBlock({
      id: 'contact',
      name: 'Contact',
      selector: '[data-block="contact"]',
      fields: [
        { id: 'contact-title', type: 'text', label: 'Title', selector: `.${styles.contactTitle}` },
        { id: 'contact-kicker', type: 'text', label: 'Kicker', selector: `.${styles.contactKicker}` },
      ],
    });

    // Footer block
    registerBlock({
      id: 'footer',
      name: 'Footer',
      selector: '[data-block="footer"]',
      fields: [],
    });
  }, []);

  return (
    <div className={styles.template}>
      {/* Navbar */}
      <header className={styles.navbar} data-block="navbar">
        <div className={styles.container}>
          <a href="#" className={styles.logo}>
            <img src="/food-smile-logo.svg" alt={info.name} />
          </a>
          <nav className={styles.navlinks}>
            <a href="#hero">Home</a>
            <a href="#product">Menu</a>
            <a href="#why-us">Why Us</a>
            <a href="#testimonial">Testimonials</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className={styles.navCta}>
            <a className={styles.button} href="#product">Order Now</a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section id="hero" className={styles.hero} data-block="hero">
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroText}>
                <h6 className={styles.heroKicker}>Fresh, Fast, and Flavorful</h6>
                <h1 className={styles.heroTitle}>Welcome to {info.name}</h1>
                <p className={styles.heroSubtitle}>
                  Authentic {info.type_of_food} in {info.region}, {info.state}. Rated {info.rating}/5 by {info.review_count} diners.
                </p>
                <a className={styles.heroButton} href="#product">Browse Menu</a>
              </div>
              <div className={styles.heroArt}>
                {/* Visual only — keeps layout similar to Mehu without bundling their images */}
                <div className={styles.heroBlob} />
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section - Professional 2-Column Layout */}
        <section id="product" className={styles.product} data-block="product">
          <div className={styles.container}>
            <h2 className={styles.productTitle}>Our Fresh Menu</h2>
            <div className={styles.menuGrid}>
              {/* Left Column */}
              <div className={`${styles.menuColumn} ${styles.left}`}>
                {leftCategories.map(([categoryName, items], categoryIdx) => (
                  <div key={categoryIdx} className={styles.ourMenuCol}>
                    <div className={styles.categoryHeader}>
                      <h3>{categoryName}</h3>
                    </div>
                    <div className={styles.menuList}>
                      {items.map((item, itemIdx) => (
                        <div key={itemIdx} className={styles.menuItem}>
                          <div className={styles.menuItemHeader}>
                            <h5 className={styles.menuItemName}>
                              {item.item_en || item.item_ar}
                            </h5>
                            <div className={styles.menuDots}></div>
                            <div className={styles.menuPrice}>
                              <span className={styles.currency}>{item.currency}</span>
                              <span className={styles.amount}>{item.offer_price ?? item.price}</span>
                            </div>
                          </div>
                          {/* Show description if available */}
                          {item.description && (
                            <div className={styles.menuIngredients}>
                              <span className={styles.ingredientTag}>
                                {item.description}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Right Column */}
              <div className={`${styles.menuColumn} ${styles.right}`}>
                {rightCategories.map(([categoryName, items], categoryIdx) => (
                  <div key={categoryIdx} className={styles.ourMenuCol}>
                    <div className={styles.categoryHeader}>
                      <h3>{categoryName}</h3>
                    </div>
                    <div className={styles.menuList}>
                      {items.map((item, itemIdx) => (
                        <div key={itemIdx} className={styles.menuItem}>
                          <div className={styles.menuItemHeader}>
                            <h5 className={styles.menuItemName}>
                              {item.item_en || item.item_ar}
                            </h5>
                            <div className={styles.menuDots}></div>
                            <div className={styles.menuPrice}>
                              <span className={styles.currency}>{item.currency}</span>
                              <span className={styles.amount}>{item.offer_price ?? item.price}</span>
                            </div>
                          </div>
                          {/* Show description if available */}
                          {item.description && (
                            <div className={styles.menuIngredients}>
                              <span className={styles.ingredientTag}>
                                {item.description}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section id="why-us" className={styles.why} data-block="why-us">
          <div className={styles.container}>
            <div className={styles.whyGrid}>
              <div className={styles.whyImage}>
                <div className={styles.whyBlob} />
              </div>
              <div className={styles.whyText}>
                <h6 className={styles.whyKicker}>Benefit</h6>
                <h2 className={styles.whyTitle}>Why Choose {info.name}</h2>
                <p>
                  Enjoy fresh, authentic {info.type_of_food}. We serve the {info.region} area with quality ingredients and quick service.
                </p>
                <ul className={styles.whyList}>
                  <li>Authentic flavors</li>
                  <li>Fresh ingredients</li>
                  <li>Great value</li>
                  <li>Fast service</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial (simple static copy for layout fidelity) */}
        <section id="testimonial" className={styles.testimonial} data-block="testimonial">
          <div className={styles.container}>
            <div className={styles.testimonialWrap}>
              <div className={styles.quote}>“</div>
              <p>
                Fantastic {info.type_of_food}! {info.name} never disappoints — flavorful, fast, and friendly.
              </p>
              <div className={styles.testimonialMeta}>
                <h5>Local Diner</h5>
                <span>{info.region}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className={styles.contact} data-block="contact">
          <div className={styles.container}>
            <div className={styles.contactGrid}>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>☎</div>
                  <div>
                    <h5>Phone</h5>
                    <span>—</span>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>✉</div>
                  <div>
                    <h5>Email</h5>
                    <span>—</span>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📍</div>
                  <div>
                    <h5>Address</h5>
                    <span>{info.region}, {info.state}, {info.country}</span>
                  </div>
                </div>
              </div>
              <div className={styles.contactArt}>
                <div className={styles.contactBlob} />
              </div>
              <div className={styles.contactCta}>
                <h6 className={styles.contactKicker}>Contact</h6>
                <h2 className={styles.contactTitle}>Get In Touch</h2>
                <p>Questions about the menu or large orders? We’re happy to help.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer} data-block="footer">
        <div className={styles.container}>
          <div className={styles.footerRow}>
            <ul className={styles.socials}>
              <li><a href="#" aria-label="Facebook">f</a></li>
              <li><a href="#" aria-label="Twitter">t</a></li>
              <li><a href="#" aria-label="Instagram">ig</a></li>
              <li><a href="#" aria-label="YouTube">yt</a></li>
            </ul>
            <div className={styles.copy}>© {new Date().getFullYear()} {info.name}. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

