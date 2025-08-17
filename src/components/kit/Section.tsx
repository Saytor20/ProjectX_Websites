/**
 * Section Component
 * 
 * Wrapper component that provides consistent spacing, backgrounds, and layout.
 * Used to structure page sections with semantic HTML.
 */

'use client';

import React from 'react';
import { SectionProps } from './types';

export const Section: React.FC<SectionProps> = ({
  children,
  variant = 'default',
  background = 'transparent',
  padding = 'medium',
  id,
  'aria-labelledby': ariaLabelledBy,
  className = '',
  'data-testid': testId,
  locale = 'en',
  direction = 'ltr',
}) => {
  // Generate test ID if not provided
  const sectionTestId = testId || (id ? `section-${id}` : 'section');

  const sectionClasses = [
    'section',
    `section--${variant}`,
    `section--${background}`,
    `section--padding-${padding}`,
    `section--${direction}`,
    className,
  ].filter(Boolean).join(' ');

  // Determine the appropriate HTML element
  const getSectionElement = () => {
    // Use semantic HTML based on variant
    switch (variant) {
      case 'contained':
      case 'full-width':
      case 'centered':
        return 'section';
      default:
        return 'div';
    }
  };

  const Element = getSectionElement() as any;

  return (
    <Element
      id={id}
      className={sectionClasses}
      data-testid={sectionTestId}
      dir={direction}
      aria-labelledby={ariaLabelledBy}
      role={variant === 'centered' ? 'region' : undefined}
    >
      {variant === 'contained' || variant === 'centered' ? (
        <div className="section__container">
          <div className="section__content">
            {children}
          </div>
        </div>
      ) : variant === 'full-width' ? (
        <div className="section__full-width">
          {children}
        </div>
      ) : (
        children
      )}
    </Element>
  );
};

// Specialized section variants
export const ContainedSection: React.FC<Omit<SectionProps, 'variant'>> = (props) => (
  <Section {...props} variant="contained" />
);

export const FullWidthSection: React.FC<Omit<SectionProps, 'variant'>> = (props) => (
  <Section {...props} variant="full-width" />
);

export const CenteredSection: React.FC<Omit<SectionProps, 'variant'>> = (props) => (
  <Section {...props} variant="centered" />
);

// Hero section wrapper with specific styling
export const HeroSection: React.FC<Omit<SectionProps, 'variant' | 'padding'>> = (props) => (
  <Section 
    {...props} 
    variant="full-width" 
    padding="none"
    className={`hero-section ${props.className || ''}`}
  />
);

// Content section with standard padding
export const ContentSection: React.FC<Omit<SectionProps, 'variant'>> = (props) => (
  <Section {...props} variant="contained" />
);