/**
 * CTA (Call-to-Action) Component
 * 
 * Versatile button component for various actions.
 * Supports different styles, sizes, and accessibility features.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { CTAProps } from './types';

export const CTA: React.FC<CTAProps> = ({
  variant,
  text,
  href,
  onClick,
  size = 'medium',
  style = 'primary',
  icon,
  disabled = false,
  className = '',
  'data-testid': testId,
  locale = 'en',
  direction = 'ltr',
}) => {
  // Generate test ID if not provided
  const buttonTestId = testId || `cta-${variant}`;

  const baseClasses = [
    'cta',
    `cta--${variant}`,
    `cta--${size}`,
    `cta--${style}`,
    `cta--${direction}`,
    disabled && 'cta--disabled',
    className,
  ].filter(Boolean).join(' ');

  // Icon mapping for common CTA variants
  const getVariantIcon = () => {
    if (icon) return icon;
    
    const icons = {
      reservation: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      order: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
      contact: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    };
    
    return icons[variant as keyof typeof icons];
  };

  // Content with icon and text
  const buttonContent = (
    <>
      {getVariantIcon() && (
        <span className="cta__icon" aria-hidden="true">
          {getVariantIcon()}
        </span>
      )}
      <span className="cta__text">{text}</span>
    </>
  );

  // Render as link if href is provided
  if (href && !disabled) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    
    if (isExternal) {
      return (
        <a
          href={href}
          className={baseClasses}
          data-testid={buttonTestId}
          dir={direction}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-describedby={href.startsWith('http') ? `${buttonTestId}-external` : undefined}
        >
          {buttonContent}
          {href.startsWith('http') && (
            <>
              <span className="cta__external-icon" aria-hidden="true">↗</span>
              <span id={`${buttonTestId}-external`} className="sr-only">
                {locale === 'ar' ? '(يفتح في نافذة جديدة)' : '(opens in new window)'}
              </span>
            </>
          )}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={baseClasses}
        data-testid={buttonTestId}
        dir={direction}
      >
        {buttonContent}
      </Link>
    );
  }

  // Render as button
  return (
    <button
      type="button"
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      data-testid={buttonTestId}
      dir={direction}
      aria-describedby={disabled ? `${buttonTestId}-disabled` : undefined}
    >
      {buttonContent}
      {disabled && (
        <span id={`${buttonTestId}-disabled`} className="sr-only">
          {locale === 'ar' ? '(غير متاح حالياً)' : '(currently unavailable)'}
        </span>
      )}
    </button>
  );
};

// Specialized CTA variants with preset configurations
export const ReservationCTA: React.FC<Omit<CTAProps, 'variant'>> = (props) => (
  <CTA
    {...props}
    variant="reservation"
    text={props.text || (props.locale === 'ar' ? 'احجز طاولة' : 'Reserve Table')}
  />
);

export const OrderCTA: React.FC<Omit<CTAProps, 'variant'>> = (props) => (
  <CTA
    {...props}
    variant="order"
    text={props.text || (props.locale === 'ar' ? 'اطلب الآن' : 'Order Now')}
  />
);

export const ContactCTA: React.FC<Omit<CTAProps, 'variant'>> = (props) => (
  <CTA
    {...props}
    variant="contact"
    text={props.text || (props.locale === 'ar' ? 'تواصل معنا' : 'Contact Us')}
  />
);