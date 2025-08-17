/**
 * MenuList Component
 * 
 * Enhanced restaurant menu display with multiple layout variants.
 * Supports RTL, pricing, images, pagination, and dietary tags.
 * 
 * Features:
 * - Image mode: 6-8 items with arrow navigation
 * - Non-image mode: Tabulated grid format with auto-padding
 * - Responsive grid layouts
 * - Pagination for large menus
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { MenuListProps, MenuItem, MenuSection } from './types';

export const MenuList: React.FC<MenuListProps> = ({
  variant = 'grid-photos',
  sections,
  currency,
  showImages = true,
  showPrices = true,
  showDescriptions = true,
  className = '',
  'data-testid': testId = 'menu-list',
  locale = 'en',
  direction = 'ltr',
  paginateThreshold = 24,
  grid = {
    columns: 3,
    imageShape: 'boxed'
  }
}) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});

  const formatPrice = useCallback((price: number, offerPrice?: number) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    };

    if (offerPrice && offerPrice < price) {
      return (
        <span className="menu-item__price menu-item__price--offer">
          <span className="menu-item__price--original" aria-label={locale === 'ar' ? 'السعر الأصلي' : 'Original price'}>
            {formatCurrency(price)}
          </span>
          <span className="menu-item__price--current" aria-label={locale === 'ar' ? 'السعر الحالي' : 'Current price'}>
            {formatCurrency(offerPrice)}
          </span>
        </span>
      );
    }

    return (
      <span className="menu-item__price">
        {formatCurrency(price)}
      </span>
    );
  }, [currency, locale]);

  const renderDietaryTags = useCallback((tags: string[] = []) => {
    if (!tags.length) return null;

    const tagLabels: Record<string, { en: string; ar: string; icon: string }> = {
      vegan: { en: 'Vegan', ar: 'نباتي', icon: '🌱' },
      vegetarian: { en: 'Vegetarian', ar: 'نباتي جزئي', icon: '🥬' },
      spicy: { en: 'Spicy', ar: 'حار', icon: '🌶️' },
      halal: { en: 'Halal', ar: 'حلال', icon: '🥩' },
      gluten_free: { en: 'Gluten Free', ar: 'خالي من الجلوتين', icon: '🌾' },
      dairy_free: { en: 'Dairy Free', ar: 'خالي من الألبان', icon: '🥛' },
    };

    return (
      <div className="menu-item__tags" role="list" aria-label={locale === 'ar' ? 'الخصائص الغذائية' : 'Dietary information'}>
        {tags.map(tag => {
          const tagInfo = tagLabels[tag];
          if (!tagInfo) return null;
          
          return (
            <span
              key={tag}
              className={`menu-item__tag menu-item__tag--${tag}`}
              role="listitem"
              aria-label={tagInfo[locale] || tagInfo.en}
              title={tagInfo[locale] || tagInfo.en}
            >
              <span aria-hidden="true">{tagInfo.icon}</span>
              <span className="menu-item__tag-text">{tagInfo[locale] || tagInfo.en}</span>
            </span>
          );
        })}
      </div>
    );
  }, [locale]);

  // Pagination logic
  const getPaginatedItems = useCallback((items: MenuItem[], sectionId: string) => {
    if (!paginateThreshold || items.length <= paginateThreshold) {
      return { 
        currentItems: items, 
        totalPages: 1, 
        currentPage: 1,
        hasMore: false
      };
    }

    // For image mode: show 6-8 items per page
    const itemsPerPage = showImages ? 8 : paginateThreshold;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const page = currentPage[sectionId] || 1;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      currentItems: items.slice(startIndex, endIndex),
      totalPages,
      currentPage: page,
      hasMore: page < totalPages
    };
  }, [paginateThreshold, showImages, currentPage]);

  const handlePageChange = useCallback((sectionId: string, page: number) => {
    setCurrentPage(prev => ({ ...prev, [sectionId]: page }));
  }, []);

  const renderPagination = useCallback((sectionId: string, totalPages: number, currentPageNum: number) => {
    if (totalPages <= 1) return null;

    return (
      <div className="menu-pagination" aria-label={locale === 'ar' ? 'تنقل الصفحات' : 'Page navigation'}>
        <button
          className="menu-pagination__button menu-pagination__button--prev"
          onClick={() => handlePageChange(sectionId, currentPageNum - 1)}
          disabled={currentPageNum <= 1}
          aria-label={locale === 'ar' ? 'الصفحة السابقة' : 'Previous page'}
        >
          {direction === 'rtl' ? '→' : '←'}
        </button>
        
        <span className="menu-pagination__info">
          {locale === 'ar' 
            ? `صفحة ${currentPageNum} من ${totalPages}`
            : `Page ${currentPageNum} of ${totalPages}`
          }
        </span>
        
        <button
          className="menu-pagination__button menu-pagination__button--next"
          onClick={() => handlePageChange(sectionId, currentPageNum + 1)}
          disabled={currentPageNum >= totalPages}
          aria-label={locale === 'ar' ? 'الصفحة التالية' : 'Next page'}
        >
          {direction === 'rtl' ? '←' : '→'}
        </button>
      </div>
    );
  }, [locale, direction, handlePageChange]);

  const renderMenuItem = useCallback((item: MenuItem, sectionId: string) => {
    const itemName = (locale === 'ar' && item.nameAr) ? item.nameAr : item.name;
    const itemDescription = (locale === 'ar' && item.descriptionAr) ? item.descriptionAr : item.description;
    
    return (
      <article
        key={item.id}
        className={`menu-item ${!item.available ? 'menu-item--unavailable' : ''} menu-item--${variant}`}
        data-testid={`menu-item-${item.id}`}
        aria-labelledby={`menu-item-name-${item.id}`}
      >
        {showImages && item.image && (
          <div className={`menu-item__image menu-item__image--${grid?.imageShape || 'boxed'}`}>
            <Image
              src={item.image}
              alt={item.alt || itemName}
              width={120}
              height={120}
              sizes="(max-width: 768px) 80px, 120px"
              style={{ objectFit: 'cover' }}
              loading="lazy"
            />
          </div>
        )}
        
        <div className="menu-item__content">
          <div className="menu-item__header">
            <h4 
              className="menu-item__name"
              id={`menu-item-name-${item.id}`}
            >
              {itemName}
              {!item.available && (
                <span className="menu-item__unavailable-badge" aria-label={locale === 'ar' ? 'غير متوفر' : 'Unavailable'}>
                  {locale === 'ar' ? 'غير متوفر' : 'Unavailable'}
                </span>
              )}
            </h4>
            
            {showPrices && (
              <div className="menu-item__price-wrapper" aria-live="polite">
                {formatPrice(item.price, item.offerPrice)}
              </div>
            )}
          </div>
          
          {showDescriptions && itemDescription && (
            <p className="menu-item__description">
              {itemDescription}
            </p>
          )}
          
          {renderDietaryTags(item.tags)}
        </div>
      </article>
    );
  }, [locale, showImages, showPrices, showDescriptions, formatPrice, renderDietaryTags, variant, grid?.imageShape]);

  const renderSection = useCallback((section: MenuSection) => {
    const sectionTitle = (locale === 'ar' && section.titleAr) ? section.titleAr : section.title;
    const { currentItems, totalPages, currentPage: currentPageNum, hasMore } = getPaginatedItems(section.items, section.id);
    
    // Determine grid classes based on variant and settings
    const gridClasses = useMemo(() => {
      const baseClasses = ['menu-section__items'];
      
      if (variant === 'table-clean') {
        return [...baseClasses, 'menu-section__items--table'].join(' ');
      } else if (variant === 'cards-compact') {
        return [...baseClasses, 'menu-section__items--cards'].join(' ');
      } else if (variant === 'grid-photos') {
        const columns = grid?.columns || 3;
        return [...baseClasses, 'menu-section__items--grid', `menu-section__items--cols-${columns}`].join(' ');
      }
      
      return [...baseClasses, `menu-section__items--${variant}`].join(' ');
    }, [variant, grid?.columns]);
    
    return (
      <section
        key={section.id}
        className="menu-section"
        data-testid={`menu-section-${section.id}`}
        aria-labelledby={`menu-section-title-${section.id}`}
      >
        <header className="menu-section__header">
          <h3 
            className="menu-section__title"
            id={`menu-section-title-${section.id}`}
          >
            {sectionTitle}
          </h3>
          {section.description && (
            <p className="menu-section__description">
              {section.description}
            </p>
          )}
          {hasMore && (
            <div className="menu-section__item-count">
              {locale === 'ar' 
                ? `يعرض ${currentItems.length} من ${section.items.length} عنصر`
                : `Showing ${currentItems.length} of ${section.items.length} items`
              }
            </div>
          )}
        </header>
        
        <div className={gridClasses}>
          {currentItems.map(item => renderMenuItem(item, section.id))}
        </div>
        
        {renderPagination(section.id, totalPages, currentPageNum)}
      </section>
    );
  }, [locale, getPaginatedItems, renderMenuItem, renderPagination, variant, grid?.columns]);

  const menuClasses = [
    'menu-list',
    `menu-list--${variant}`,
    `menu-list--${direction}`,
    showImages ? 'menu-list--with-images' : 'menu-list--no-images',
    className,
  ].filter(Boolean).join(' ');

  // Accordion variant (special handling)
  if (variant === 'accordion') {
    return (
      <div 
        className={menuClasses}
        data-testid={testId}
        dir={direction}
      >
        {sections.map(section => {
          const isActive = activeSection === section.id;
          const sectionTitle = (locale === 'ar' && section.titleAr) ? section.titleAr : section.title;
          const { currentItems } = getPaginatedItems(section.items, section.id);
          
          return (
            <div key={section.id} className="menu-accordion__section">
              <button
                className={`menu-accordion__trigger ${isActive ? 'menu-accordion__trigger--active' : ''}`}
                onClick={() => setActiveSection(isActive ? '' : section.id)}
                aria-expanded={isActive}
                aria-controls={`menu-accordion-content-${section.id}`}
                data-testid={`menu-accordion-trigger-${section.id}`}
              >
                <span className="menu-accordion__trigger-text">{sectionTitle}</span>
                <span className="menu-accordion__trigger-icon" aria-hidden="true">
                  {isActive ? '−' : '+'}
                </span>
              </button>
              
              <div
                id={`menu-accordion-content-${section.id}`}
                className={`menu-accordion__content ${isActive ? 'menu-accordion__content--open' : ''}`}
                aria-hidden={!isActive}
              >
                <div className="menu-accordion__items">
                  {currentItems.map(item => renderMenuItem(item, section.id))}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* JSON-LD structured data for menu */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Menu",
              "hasMenuSection": sections.map(section => ({
                "@type": "MenuSection",
                "name": section.title,
                "description": section.description,
                "hasMenuItem": section.items.map(item => ({
                  "@type": "MenuItem",
                  "name": item.name,
                  "description": item.description,
                  "offers": {
                    "@type": "Offer",
                    "price": item.offerPrice || item.price,
                    "priceCurrency": currency,
                    "availability": item.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                  },
                  "image": item.image,
                  "suitableForDiet": item.tags?.map(tag => `https://schema.org/${tag}Diet`).filter(Boolean)
                }))
              }))
            })
          }}
        />
      </div>
    );
  }

  // Other variants (grid-photos, table-clean, cards-compact, etc.)
  return (
    <div 
      className={menuClasses}
      data-testid={testId}
      data-component="menu-list"
      dir={direction}
    >
      {sections.map(renderSection)}
      
      {/* JSON-LD structured data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Menu",
            "hasMenuSection": sections.map(section => ({
              "@type": "MenuSection", 
              "name": section.title,
              "description": section.description,
              "hasMenuItem": section.items.map(item => ({
                "@type": "MenuItem",
                "name": item.name,
                "description": item.description,
                "offers": {
                  "@type": "Offer",
                  "price": item.offerPrice || item.price,
                  "priceCurrency": currency,
                  "availability": item.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                },
                "image": item.image,
                "suitableForDiet": item.tags?.map(tag => `https://schema.org/${tag}Diet`).filter(Boolean)
              }))
            }))
          })
        }}
      />
    </div>
  );
};