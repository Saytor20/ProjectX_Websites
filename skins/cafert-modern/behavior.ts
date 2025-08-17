/**
 * Cafert Modern Skin Behaviors
 * 
 * Client-side behaviors and interactions specific to this skin.
 * These are optional enhancements that run after the page loads.
 */

export interface SkinBehaviorConfig {
  enableAnimations?: boolean;
  enableParallax?: boolean;
  enableScrollEffects?: boolean;
  enableHoverEffects?: boolean;
  enableLazyLoading?: boolean;
  debugMode?: boolean;
}

export class CafertModernBehavior {
  private config: Required<SkinBehaviorConfig>;
  private observer?: IntersectionObserver;
  private initialized = false;

  constructor(config: SkinBehaviorConfig = {}) {
    this.config = {
      enableAnimations: true,
      enableParallax: false, // Disabled for better mobile performance
      enableScrollEffects: true,
      enableHoverEffects: true,
      enableLazyLoading: true,
      debugMode: false,
      ...config,
    };
  }

  // Initialize all behaviors
  init(): void {
    if (this.initialized) return;

    try {
      if (this.config.enableAnimations) {
        this.initAnimations();
      }

      if (this.config.enableScrollEffects) {
        this.initScrollEffects();
      }

      if (this.config.enableHoverEffects) {
        this.initHoverEffects();
      }

      if (this.config.enableLazyLoading) {
        this.initLazyLoading();
      }

      this.initAccessibilityEnhancements();
      this.initPerformanceOptimizations();

      this.initialized = true;
      this.log('Cafert Modern behaviors initialized');
    } catch (error) {
      console.error('Failed to initialize Cafert Modern behaviors:', error);
    }
  }

  // Initialize entrance animations
  private initAnimations(): void {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const animation = element.dataset.animate || 'fadeIn';
          const delay = parseInt(element.dataset.delay || '0');

          setTimeout(() => {
            element.classList.add('animate-in');
            element.style.animationName = animation;
          }, delay);

          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    animatedElements.forEach((el) => observer.observe(el));
  }

  // Initialize scroll-based effects
  private initScrollEffects(): void {
    let ticking = false;

    const updateScrollEffects = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Parallax effect for hero section (if enabled)
      if (this.config.enableParallax) {
        const heroElement = document.querySelector('.hero') as HTMLElement;
        if (heroElement) {
          const offset = scrollY * 0.5;
          heroElement.style.transform = `translateY(${offset}px)`;
        }
      }

      // Navbar background opacity
      const navbar = document.querySelector('.navbar') as HTMLElement;
      if (navbar) {
        const opacity = Math.min(scrollY / 100, 0.95);
        navbar.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
      }

      // Progress indicator (if exists)
      const progressBar = document.querySelector('.scroll-progress') as HTMLElement;
      if (progressBar) {
        const docHeight = document.documentElement.scrollHeight - windowHeight;
        const progress = (scrollY / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
      }

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Initialize hover effects
  private initHoverEffects(): void {
    // Enhanced card hover effects
    const cards = document.querySelectorAll('.menu-list__category, .gallery__item');
    
    cards.forEach((card) => {
      const cardElement = card as HTMLElement;
      
      cardElement.addEventListener('mouseenter', () => {
        this.addRippleEffect(cardElement);
      });

      cardElement.addEventListener('mouseleave', () => {
        this.removeRippleEffect(cardElement);
      });
    });

    // Button magnetic effect
    const buttons = document.querySelectorAll('.hero__cta-button');
    
    buttons.forEach((button) => {
      const buttonElement = button as HTMLElement;
      
      buttonElement.addEventListener('mousemove', (e) => {
        const rect = buttonElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        const moveX = deltaX * 5;
        const moveY = deltaY * 5;
        
        buttonElement.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
      
      buttonElement.addEventListener('mouseleave', () => {
        buttonElement.style.transform = 'translate(0, 0)';
      });
    });
  }

  // Initialize lazy loading for images
  private initLazyLoading(): void {
    const images = document.querySelectorAll('img[data-src]');
    
    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.classList.remove('loading');
            img.classList.add('loaded');
            img.removeAttribute('data-src');
          }
          
          imageObserver.unobserve(img);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px',
    });

    images.forEach((img) => {
      img.classList.add('loading');
      imageObserver.observe(img);
    });

    this.observer = imageObserver;
  }

  // Add accessibility enhancements
  private initAccessibilityEnhancements(): void {
    // Enhanced keyboard navigation
    const focusableElements = document.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach((element) => {
      element.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (element.tagName === 'A' || element.tagName === 'BUTTON') {
            element.dispatchEvent(new Event('click'));
          }
        }
      });
    });

    // High contrast mode detection
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.documentElement.classList.add('high-contrast');
    }

    // Reduced motion respect
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduced-motion');
      this.config.enableAnimations = false;
      this.config.enableParallax = false;
    }
  }

  // Performance optimizations
  private initPerformanceOptimizations(): void {
    // Prefetch critical resources
    this.prefetchCriticalResources();

    // Optimize images
    this.optimizeImages();

    // Service worker registration (if available)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        this.log('Service Worker registration failed:', error);
      });
    }
  }

  // Prefetch important resources
  private prefetchCriticalResources(): void {
    const criticalResources = [
      '/fonts/inter-var.woff2',
      // Add other critical resources
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  // Optimize image loading
  private optimizeImages(): void {
    const images = document.querySelectorAll('img');
    
    images.forEach((img) => {
      // Add loading="lazy" if not already present
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }

      // Add proper alt text if missing
      if (!img.alt && img.dataset.alt) {
        img.alt = img.dataset.alt;
      }

      // Add error handling
      img.addEventListener('error', () => {
        img.src = '/images/placeholder.jpg';
        img.alt = 'Image not available';
      });
    });
  }

  // Add ripple effect to elements
  private addRippleEffect(element: HTMLElement): void {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple-effect');
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Remove ripple effect
  private removeRippleEffect(element: HTMLElement): void {
    const ripples = element.querySelectorAll('.ripple-effect');
    ripples.forEach((ripple) => ripple.remove());
  }

  // Cleanup function
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    // Remove event listeners
    window.removeEventListener('scroll', () => {});
    
    this.initialized = false;
    this.log('Cafert Modern behaviors destroyed');
  }

  // Logging utility
  private log(...args: any[]): void {
    if (this.config.debugMode) {
      console.log('[Cafert Modern]', ...args);
    }
  }
}

// CSS for animations (injected if needed)
export const behaviorCSS = `
  .loading {
    opacity: 0.5;
    filter: blur(2px);
    transition: all 0.3s ease;
  }

  .loaded {
    opacity: 1;
    filter: blur(0);
  }

  .ripple-effect {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(37, 99, 235, 0.3);
    transform: translate(-50%, -50%);
    animation: ripple 0.6s ease-out;
  }

  @keyframes ripple {
    to {
      width: 200px;
      height: 200px;
      opacity: 0;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-in {
    animation-duration: 0.6s;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    animation-fill-mode: both;
  }

  .reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .high-contrast {
    filter: contrast(150%);
  }
`;

// Auto-initialization
if (typeof window !== 'undefined') {
  const behavior = new CafertModernBehavior();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => behavior.init());
  } else {
    behavior.init();
  }

  // Export for manual control
  (window as any).CafertModernBehavior = behavior;
}

export default CafertModernBehavior;