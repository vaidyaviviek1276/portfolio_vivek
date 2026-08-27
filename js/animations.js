/**
 * Scroll Reveal & Dynamics
 * Editorial Portfolio - Vivek Vaidya
 */

(function () {
  'use strict';

  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  // Intersection Observer for scroll triggers
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12,
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function initScrollAnimations() {
    const revealElements = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right'
    );

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });

    // Stat counters observer
    initStatCounters();

    // ScrollSpy for Header Navigation Links
    initScrollSpy();
  }

  // Animate Number Counters
  function initStatCounters() {
    const counterElements = document.querySelectorAll('.stat-num[data-target]');
    let animated = false;

    if (!counterElements.length) return;

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            counterElements.forEach((el) => {
              const target = parseInt(el.getAttribute('data-target'), 10) || 0;
              const suffix = el.getAttribute('data-suffix') || '';
              animateValue(el, 0, target, 1600, suffix);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) counterObserver.observe(statsGrid);
  }

  function animateValue(obj, start, end, duration, suffix) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * (end - start) + start);
      obj.innerHTML = current + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = end + suffix;
      }
    };
    window.requestAnimationFrame(step);
  }

  // ScrollSpy for Header Nav
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.site-nav .nav-link');

    window.addEventListener(
      'scroll',
      () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
      },
      { passive: true }
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }
})();
