'use client';
import React, { useState } from 'react';
import { restaurantData } from '@/data/restaurant';

interface HeaderProps {
  rightSlot?: React.ReactNode;
  navBefore?: React.ReactNode;
  navAfter?: React.ReactNode;
  fixed?: boolean;
  transparent?: boolean;
}

const Header = ({ 
  rightSlot, 
  navBefore, 
  navAfter, 
  fixed = true, 
  transparent = false 
}: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' }
  ];

  const headerClasses = [
    fixed ? 'fixed top-0 left-0 right-0 z-50' : 'relative',
    transparent 
      ? 'bg-[var(--color-surface)]/95 backdrop-blur-sm' 
      : 'bg-[var(--color-surface)]',
    'border-b border-[var(--color-border)]',
    'transition-all duration-200'
  ].join(' ');

  return (
    <header className={headerClasses}>
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--gutter-x)]">
        <div className="flex items-center justify-between h-[var(--header-height)]">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            {restaurantData.logo ? (
              <img 
                src={restaurantData.logo} 
                alt={restaurantData.name}
                className="h-10 w-auto"
              />
            ) : (
              <h1 className="text-2xl font-bold text-[var(--color-on-surface)] font-[var(--font-heading)]">
                {restaurantData.name}
              </h1>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navBefore}
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-[var(--color-on-surface)]/80 hover:text-[var(--color-primary)] transition-colors duration-200 tracking-wide"
              >
                {item.name}
              </a>
            ))}
            {navAfter}
          </nav>

          {/* Right Section - Contact Info or Custom Slot */}
          <div className="hidden lg:flex items-center space-x-4">
            {rightSlot ? (
              rightSlot
            ) : (
              <>
                <div className="text-sm text-[var(--color-on-surface)]/80">
                  <a 
                    href={`tel:${restaurantData.phone}`} 
                    className="hover:text-[var(--color-primary)] transition-colors"
                  >
                    {restaurantData.phone}
                  </a>
                </div>
                {restaurantData.email && (
                  <div className="text-sm text-[var(--color-on-surface)]/80">
                    <a 
                      href={`mailto:${restaurantData.email}`} 
                      className="hover:text-[var(--color-primary)] transition-colors"
                    >
                      {restaurantData.email}
                    </a>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-[var(--color-on-surface)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-elevated)] transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navBefore && (
                <div className="px-3 py-2">
                  {navBefore}
                </div>
              )}
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-[var(--color-on-surface)]/80 hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-elevated)] rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {navAfter && (
                <div className="px-3 py-2">
                  {navAfter}
                </div>
              )}
              <div className="px-3 py-2 border-t border-[var(--color-border)]">
                <a 
                  href={`tel:${restaurantData.phone}`}
                  className="block text-sm text-[var(--color-on-surface)]/80 hover:text-[var(--color-primary)] transition-colors"
                >
                  📞 {restaurantData.phone}
                </a>
                {restaurantData.email && (
                  <a 
                    href={`mailto:${restaurantData.email}`}
                    className="block text-sm text-[var(--color-on-surface)]/80 hover:text-[var(--color-primary)] transition-colors mt-1"
                  >
                    ✉️ {restaurantData.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;