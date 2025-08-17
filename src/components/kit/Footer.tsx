/**
 * Footer Component
 * 
 * Website footer with contact information, social links, and navigation.
 * Supports multiple layouts and accessibility features.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FooterProps } from './types';

export const Footer: React.FC<FooterProps> = ({
  brandName,
  brandHref = '/',
  logo,
  logoAlt,
  address,
  phone,
  email,
  social = [],
  links = [],
  copyright,
  variant = 'detailed',
  className = '',
  'data-testid': testId = 'footer',
  locale = 'en',
  direction = 'ltr',
}) => {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = copyright || 
    `© ${currentYear} ${brandName}. ${locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.`;

  const footerClasses = [
    'footer',
    `footer--${variant}`,
    `footer--${direction}`,
    className,
  ].filter(Boolean).join(' ');

  // Social media icons (reuse from Navbar)
  const getSocialIcon = (platform: string) => {
    const icons = {
      facebook: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      instagram: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.017 0C8.396 0 7.989.016 6.756.08 5.526.148 4.718.371 4.015.7c-.715.277-1.32.657-1.923 1.26C1.49 2.563 1.11 3.168.833 3.883c-.329.703-.552 1.511-.62 2.741C.148 7.858.132 8.266.132 11.886c0 3.621.016 4.029.08 5.262.068 1.23.291 2.038.62 2.741.277.715.657 1.32 1.26 1.923.603.603 1.208.983 1.923 1.26.703.329 1.511.552 2.741.62 1.233.064 1.641.08 5.261.08 3.621 0 4.029-.016 5.262-.08 1.23-.068 2.038-.291 2.741-.62.715-.277 1.32-.657 1.923-1.26.603-.603.983-1.208 1.26-1.923.329-.703.552-1.511.62-2.741.064-1.233.08-1.641.08-5.261 0-3.621-.016-4.029-.08-5.262-.068-1.23-.291-2.038-.62-2.741-.277-.715-.657-1.32-1.26-1.923C17.464.489 16.859.109 16.144-.168c-.703-.329-1.511-.552-2.741-.62C12.169.016 11.761 0 8.141 0h3.876zm-.717 1.825c.558 0 1.078-.004 1.565.006.487.009.915.036 1.204.06.648.094 1.008.218 1.243.362.312.122.534.267.768.501.234.234.38.456.501.768.144.235.268.595.362 1.243.024.289.051.717.06 1.204.009.487.006 1.007.006 1.565v3.876c0 .558-.004 1.078-.006 1.565-.009.487-.036.915-.06 1.204-.094.648-.218 1.008-.362 1.243-.122.312-.267.534-.501.768-.234.234-.456.38-.768.501-.235.144-.595.268-1.243.362-.289.024-.717.051-1.204.06-.487.009-1.007.006-1.565.006H8.141c-.558 0-1.078.004-1.565-.006-.487-.009-.915-.036-1.204-.06-.648-.094-1.008-.218-1.243-.362-.312-.122-.534-.267-.768-.501-.234-.234-.38-.456-.501-.768-.144-.235-.268-.595-.362-1.243-.024-.289-.051-.717-.06-1.204-.009-.487-.006-1.007-.006-1.565V8.141c0-.558.004-1.078.006-1.565.009-.487.036-.915.06-1.204.094-.648.218-1.008.362-1.243.122-.312.267-.534.501-.768.234-.234.456-.38.768-.501.235-.144.595-.268 1.243-.362.289-.024.717-.051 1.204-.06.487-.009 1.007-.006 1.565-.006h3.876zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
      twitter: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      whatsapp: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.473 3.085"/>
        </svg>
      ),
      tiktok: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      ),
    };

    return icons[platform as keyof typeof icons] || icons.facebook;
  };

  return (
    <footer 
      className={footerClasses}
      data-testid={testId}
      dir={direction}
      role="contentinfo"
    >
      <div className="footer__container">
        {variant === 'detailed' && (
          <div className="footer__main">
            {/* Brand section */}
            <div className="footer__brand">
              <Link href={brandHref} className="footer__brand-link">
                {logo ? (
                  <div className="footer__logo">
                    <Image
                      src={logo}
                      alt={logoAlt || brandName}
                      width={40}
                      height={40}
                    />
                    <span className="footer__brand-text">{brandName}</span>
                  </div>
                ) : (
                  <span className="footer__brand-text">{brandName}</span>
                )}
              </Link>
            </div>

            {/* Contact information */}
            {(address || phone || email) && (
              <div className="footer__contact">
                <h3 className="footer__section-title">
                  {locale === 'ar' ? 'معلومات التواصل' : 'Contact Info'}
                </h3>
                
                {address && (
                  <div className="footer__contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{address}</span>
                  </div>
                )}
                
                {phone && (
                  <div className="footer__contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <a href={`tel:${phone}`} className="footer__contact-link">
                      {phone}
                    </a>
                  </div>
                )}
                
                {email && (
                  <div className="footer__contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <a href={`mailto:${email}`} className="footer__contact-link">
                      {email}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Navigation links */}
            {links.length > 0 && (
              <div className="footer__links">
                <h3 className="footer__section-title">
                  {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
                </h3>
                <nav role="navigation" aria-label={locale === 'ar' ? 'روابط التذييل' : 'Footer navigation'}>
                  <ul className="footer__nav-list">
                    {links.map((link, index) => (
                      <li key={`${link.href}-${index}`} className="footer__nav-item">
                        {link.external ? (
                          <a
                            href={link.href}
                            className="footer__nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link['aria-label'] || `${link.text} (${locale === 'ar' ? 'رابط خارجي' : 'external link'})`}
                          >
                            {link.text}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="footer__nav-link"
                            aria-label={link['aria-label']}
                          >
                            {link.text}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            {/* Social media links */}
            {social.length > 0 && (
              <div className="footer__social">
                <h3 className="footer__section-title">
                  {locale === 'ar' ? 'تابعنا على' : 'Follow Us'}
                </h3>
                <div className="footer__social-links" role="group" aria-label={locale === 'ar' ? 'روابط التواصل الاجتماعي' : 'Social media links'}>
                  {social.map((socialLink, index) => {
                    const Icon = getSocialIcon(socialLink.platform);
                    return (
                      <a
                        key={`${socialLink.platform}-${index}`}
                        href={socialLink.url}
                        className={`footer__social-link footer__social-link--${socialLink.platform}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={socialLink['aria-label'] || 
                          `${locale === 'ar' ? 'تابعنا على' : 'Follow us on'} ${socialLink.platform}`
                        }
                        data-testid={`footer-social-${socialLink.platform}`}
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Simple variant content */}
        {variant === 'simple' && (
          <div className="footer__simple">
            <div className="footer__simple-brand">
              <Link href={brandHref}>{brandName}</Link>
            </div>
            
            {social.length > 0 && (
              <div className="footer__simple-social">
                {social.map((socialLink, index) => {
                  const Icon = getSocialIcon(socialLink.platform);
                  return (
                    <a
                      key={`${socialLink.platform}-${index}`}
                      href={socialLink.url}
                      className={`footer__social-link footer__social-link--${socialLink.platform}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${locale === 'ar' ? 'تابعنا على' : 'Follow us on'} ${socialLink.platform}`}
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Copyright */}
        <div className="footer__bottom">
          <div className="footer__copyright">
            {defaultCopyright}
          </div>
        </div>
      </div>

      {/* JSON-LD structured data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WPFooter",
            "copyrightHolder": {
              "@type": "Organization",
              "name": brandName,
              "url": brandHref,
              "logo": logo,
            },
            "copyrightYear": currentYear,
            "license": defaultCopyright,
          })
        }}
      />
    </footer>
  );
};