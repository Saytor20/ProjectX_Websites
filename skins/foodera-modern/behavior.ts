/**
 * Foodera Modern Skin Behaviors
 * 
 * Custom JavaScript behaviors specific to the Foodera template
 */

export const FooderaBehaviors = {
  /**
   * Initialize smooth scrolling for navigation links
   */
  initSmoothScrolling: () => {
    const links = document.querySelectorAll('[data-skin="foodera-modern"] .page-scroll');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  },

  /**
   * Initialize navbar scroll effects
   */
  initNavbarEffects: () => {
    const navbar = document.querySelector('[data-skin="foodera-modern"] .navbar-inverse');
    if (navbar) {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  },

  /**
   * Initialize counters animation
   */
  initCounters: () => {
    const counters = document.querySelectorAll('[data-skin="foodera-modern"] .count');
    const animateCounter = (counter: Element) => {
      const target = parseInt(counter.textContent || '0');
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toString();
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toString();
        }
      }, 20);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    counters.forEach(counter => observer.observe(counter));
  },

  /**
   * Initialize testimonials slider
   */
  initTestimonialsSlider: () => {
    // This would integrate with the React Slick component
    // Implementation handled by the Testimonials component
  },

  /**
   * Initialize video modal
   */
  initVideoModal: () => {
    const videoTriggers = document.querySelectorAll('[data-skin="foodera-modern"] .intro-video-pop');
    videoTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        // This would integrate with the React Modal Video component
        // Implementation handled by the VideoCta component
      });
    });
  },

  /**
   * Initialize all Foodera behaviors
   */
  init: () => {
    if (typeof window !== 'undefined') {
      FooderaBehaviors.initSmoothScrolling();
      FooderaBehaviors.initNavbarEffects();
      FooderaBehaviors.initCounters();
      FooderaBehaviors.initTestimonialsSlider();
      FooderaBehaviors.initVideoModal();
    }
  }
};

export default FooderaBehaviors;