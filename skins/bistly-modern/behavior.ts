/**
 * Bistly Modern Skin Behaviors
 * 
 * Client-side behaviors and interactions specific to this skin.
 * Includes hero carousel functionality similar to cafert-modern.
 */

export interface SkinBehaviorConfig {
  enableAnimations?: boolean;
  enableHeroCarousel?: boolean;
  enableScrollEffects?: boolean;
  enableHoverEffects?: boolean;
  carouselInterval?: number;
  debugMode?: boolean;
}

export class BistlyModernBehavior {
  private config: Required<SkinBehaviorConfig>;
  private carouselTimer?: number;
  private currentSlide = 0;
  private totalSlides = 0;
  private initialized = false;

  constructor(config: SkinBehaviorConfig = {}) {
    this.config = {
      enableAnimations: true,
      enableHeroCarousel: true,
      enableScrollEffects: true,
      enableHoverEffects: true,
      carouselInterval: 4000, // 4 seconds
      debugMode: false,
      ...config,
    };
  }

  // Initialize all behaviors
  init(): void {
    if (this.initialized) return;

    try {
      if (this.config.enableHeroCarousel) {
        this.initHeroCarousel();
      }

      if (this.config.enableScrollEffects) {
        this.initScrollEffects();
      }

      if (this.config.enableHoverEffects) {
        this.initHoverEffects();
      }

      if (this.config.enableAnimations) {
        this.initAnimations();
      }

      this.initialized = true;
      this.log('Bistly Modern behaviors initialized');
    } catch (error) {
      console.error('Failed to initialize Bistly Modern behaviors:', error);
    }
  }

  // Initialize hero carousel functionality
  private initHeroCarousel(): void {
    const heroElement = document.querySelector('.hero');
    if (!heroElement) {
      this.log('Hero element not found, skipping carousel initialization');
      return;
    }

    // Create carousel structure
    this.createCarouselStructure(heroElement);
    
    // Initialize carousel behavior
    this.startCarousel();
    
    // Add click handlers for dots
    this.initCarouselDots();

    this.log('Hero carousel initialized');
  }

  // Create the carousel DOM structure
  private createCarouselStructure(heroElement: Element): void {
    // Check if carousel already exists
    if (heroElement.querySelector('.hero__carousel')) {
      this.log('Carousel structure already exists');
      return;
    }

    // Create the complete split layout structure
    const container = document.createElement('div');
    container.className = 'hero__container';

    // Create content section (left side)
    const contentSection = document.createElement('div');
    contentSection.className = 'hero__content';

    // Get restaurant data or use default
    const restaurantName = document.title || 'Our Restaurant';
    const welcomeText = 'Welcome to';
    const description = 'Experience authentic cuisine with fresh ingredients, traditional recipes, and modern presentation come together to create an unforgettable dining experience.';

    // Create content structure
    contentSection.innerHTML = `
      <p class="hero__subtitle">${welcomeText}</p>
      <h1 class="hero__title">${restaurantName}</h1>
      <p class="hero__description">${description}</p>
      <a href="#menu" class="hero__cta-button">View Our Menu</a>
    `;

    // Create image section (right side)
    const imageSection = document.createElement('div');
    imageSection.className = 'hero__image-section';

    // Add both sections to container
    container.appendChild(contentSection);
    container.appendChild(imageSection);

    // Clear hero and add new structure
    heroElement.innerHTML = '';
    heroElement.appendChild(container);

    // Sample restaurant images for carousel
    const carouselImages = [
      'https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    ];

    this.totalSlides = carouselImages.length;

    // Create carousel container
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'hero__carousel';

    // Create carousel images
    carouselImages.forEach((imageUrl, index) => {
      const img = document.createElement('img');
      img.className = `hero__carousel-image ${index === 0 ? 'active' : ''}`;
      img.src = imageUrl;
      img.alt = `Restaurant atmosphere ${index + 1}`;
      img.style.objectFit = 'cover';
      carouselContainer.appendChild(img);
    });

    // Create image overlay
    const imageOverlay = document.createElement('div');
    imageOverlay.className = 'hero__image-overlay';

    // Create carousel dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'hero__carousel-dots';

    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = `hero__carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('data-slide', i.toString());
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dotsContainer.appendChild(dot);
    }

    // Add elements to image section
    imageSection.appendChild(carouselContainer);
    imageSection.appendChild(imageOverlay);
    imageSection.appendChild(dotsContainer);
  }

  // Start automatic carousel rotation
  private startCarousel(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }

    this.carouselTimer = window.setInterval(() => {
      this.nextSlide();
    }, this.config.carouselInterval);
  }

  // Stop carousel rotation
  private stopCarousel(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
      this.carouselTimer = undefined;
    }
  }

  // Go to next slide
  private nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateCarousel();
  }

  // Go to specific slide
  private goToSlide(slideIndex: number): void {
    this.currentSlide = slideIndex;
    this.updateCarousel();
    
    // Restart timer
    this.startCarousel();
  }

  // Update carousel display
  private updateCarousel(): void {
    const images = document.querySelectorAll('.hero__carousel-image');
    const dots = document.querySelectorAll('.hero__carousel-dot');

    // Update images
    images.forEach((img, index) => {
      img.classList.toggle('active', index === this.currentSlide);
    });

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
  }

  // Initialize carousel dot click handlers
  private initCarouselDots(): void {
    const dots = document.querySelectorAll('.hero__carousel-dot');
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToSlide(index);
      });
    });

    // Pause carousel on hover
    const heroElement = document.querySelector('.hero');
    if (heroElement) {
      heroElement.addEventListener('mouseenter', () => {
        this.stopCarousel();
      });

      heroElement.addEventListener('mouseleave', () => {
        this.startCarousel();
      });
    }
  }

  // Initialize scroll effects
  private initScrollEffects(): void {
    let ticking = false;

    const updateScrollEffects = () => {
      const scrollY = window.scrollY;

      // Navbar background opacity
      const navbar = document.querySelector('.navbar') as HTMLElement;
      if (navbar) {
        const opacity = Math.min(scrollY / 100, 0.95);
        navbar.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
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
    const cards = document.querySelectorAll('.menu-category, .gallery__item');
    
    cards.forEach((card) => {
      const cardElement = card as HTMLElement;
      
      cardElement.addEventListener('mouseenter', () => {
        cardElement.style.transform = 'translateY(-4px) scale(1.02)';
      });

      cardElement.addEventListener('mouseleave', () => {
        cardElement.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.hero__cta-button, .cta__button');
    
    buttons.forEach((button) => {
      const buttonElement = button as HTMLElement;
      
      buttonElement.addEventListener('mouseenter', () => {
        buttonElement.style.transform = 'translateY(-2px) scale(1.05)';
      });
      
      buttonElement.addEventListener('mouseleave', () => {
        buttonElement.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // Initialize animations
  private initAnimations(): void {
    const animatedElements = document.querySelectorAll('.menu-category, .gallery__item, .location-map__item');
    
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    // Set initial state
    animatedElements.forEach((el) => {
      const element = el as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
  }

  // Cleanup function
  destroy(): void {
    this.stopCarousel();
    
    // Remove event listeners
    const dots = document.querySelectorAll('.hero__carousel-dot');
    dots.forEach((dot) => {
      dot.removeEventListener('click', () => {});
    });
    
    this.initialized = false;
    this.log('Bistly Modern behaviors destroyed');
  }

  // Logging utility
  private log(...args: any[]): void {
    if (this.config.debugMode) {
      console.log('[Bistly Modern]', ...args);
    }
  }
}

// Auto-initialization
if (typeof window !== 'undefined') {
  const behavior = new BistlyModernBehavior();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => behavior.init());
  } else {
    behavior.init();
  }

  // Export for manual control
  (window as any).BistlyModernBehavior = behavior;
}

export default BistlyModernBehavior;