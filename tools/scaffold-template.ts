#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';

const templateId = process.argv[2];

if (!templateId) {
  console.error('❌ Error: Template ID is required');
  console.log('Usage: npx tsx tools/scaffold-template.ts <template-id>');
  process.exit(1);
}

if (!/^[a-z0-9\-]+$/.test(templateId)) {
  console.error('❌ Error: Template ID must contain only lowercase letters, numbers, and hyphens');
  process.exit(1);
}

const templatesDir = path.join(__dirname, '..', 'templates');
const templateDir = path.join(templatesDir, templateId);

if (fs.existsSync(templateDir)) {
  console.error(`❌ Error: Template "${templateId}" already exists`);
  process.exit(1);
}

if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}
fs.mkdirSync(templateDir, { recursive: true });

const componentName = templateId.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join('');

const templateTsx = `'use client';
import React from 'react';
import { Restaurant } from '@/lib/schema';
import styles from './template.module.css';

interface ${componentName}TemplateProps {
  restaurant: Restaurant;
}

export default function ${componentName}Template({ restaurant }: ${componentName}TemplateProps) {
  const { restaurant_info: info, menu_categories: menu } = restaurant;
  const allMenuItems = Object.values(menu).flat().slice(0, 8);

  return (
    <div className={styles.template}>
      <nav className={styles.navbar} data-block="navbar">
        <div className={styles.container}>
          <img src="/food-smile-logo.svg" alt={info.name} className={styles.logo} />
        </div>
      </nav>

      <section className={styles.hero} data-block="hero" id="hero">
        <div className={styles.container}>
          <h1>Welcome to {info.name}</h1>
          <p>Delicious {info.type_of_food} cuisine in {info.region}</p>
        </div>
      </section>

      <section className={styles.menu} data-block="menu" id="menu">
        <div className={styles.container}>
          <h2>Our Menu</h2>
          {allMenuItems.map((item, index) => (
            <div key={index} className={styles.menuItem}>
              <h3>{item.item_en}</h3>
              <p>{item.offer_price || item.price} {item.currency}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.gallery} data-block="gallery" id="gallery">
        <div className={styles.container}>
          <h2>Gallery</h2>
          {[1,2,3,4].map(i => (
            <img key={i} src="/cafert/img/placeholder.jpg" alt="Gallery" />
          ))}
        </div>
      </section>

      <section className={styles.hours} data-block="hours" id="hours">
        <div className={styles.container}>
          <h2>Hours</h2>
          <p>Monday - Friday: 9:00 AM - 10:00 PM</p>
          <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
        </div>
      </section>

      <section className={styles.cta} data-block="cta">
        <div className={styles.container}>
          <h2>Visit Us Today!</h2>
        </div>
      </section>

      <footer className={styles.footer} data-block="footer" id="contact">
        <div className={styles.container}>
          <h4>Contact Info</h4>
          <p>{info.region}, {info.state}</p>
          <p>Rating: {info.rating}/5</p>
        </div>
      </footer>
    </div>
  );
}
`;

const cssModule = `.template { font-family: Inter, sans-serif; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.section { padding: 3rem 0; }
.navbar { background: #ffffff; padding: 1rem 0; border-bottom: 1px solid #e5e7eb; }
.logo { height: 48px; }
.hero { background: #3b82f6; color: white; padding: 4rem 0; text-align: center; }
.menu { padding: 3rem 0; }
.menuItem { background: #f9f9f9; padding: 1rem; margin: 1rem 0; border-radius: 8px; }
.gallery { padding: 3rem 0; }
.hours { padding: 3rem 0; }
.cta { background: #1f2937; color: white; padding: 3rem 0; text-align: center; }
.footer { background: #111827; color: #9ca3af; padding: 3rem 0; }`;

const manifest = {
  id: templateId,
  name: `${componentName} Template`,
  slots: ["navbar", "hero", "menu", "gallery", "hours", "cta", "footer"],
  version: "1.0.0"
};

const readme = `# ${componentName} Template

A modern restaurant website template with essential sections for showcasing restaurant information, menu items, gallery, hours, and contact details.
`;

// Write files
fs.writeFileSync(path.join(templateDir, 'Template.tsx'), templateTsx);
fs.writeFileSync(path.join(templateDir, 'template.module.css'), cssModule);
fs.writeFileSync(path.join(templateDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
fs.writeFileSync(path.join(templateDir, 'README.md'), readme);

console.log(`✅ Template "${templateId}" scaffolded successfully!`);
console.log(`📁 Created: templates/${templateId}/`);
console.log('📄 Files generated:');
console.log('   - Template.tsx (React component with 7 slots)');
console.log('   - template.module.css (Basic styling)');
console.log('   - manifest.json (Template metadata)');
console.log('   - README.md (Documentation)');
console.log('');
console.log('🚀 Next steps:');
console.log(`   1. Customize the template in templates/${templateId}/`);
console.log('   2. Update styles in template.module.css');
console.log('   3. Test with: npm run dev');