/**
 * Scroll Storytelling & Dynamics Engine
 * Vivek Vaidya — Personal Portfolio
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Accessibility: Respect User's Reduced Motion Preference
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document
      .querySelectorAll(
        '[data-reveal], .scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .journey-item, .skill-row'
      )
      .forEach((el) => {
        el.classList.add('is-visible', 'is-active');
      });

    const progressBar = document.getElementById('journeyProgressBar');
    if (progressBar) progressBar.style.height = '100%';
    return;
  }

  // --------------------------------------------------------------------------
  // Global Reusable Scroll Reveal Observer (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealObserverOptions = {
    root: null,
    rootMargin: '80px 0px -20px 0px',
    threshold: 0.01,
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  function initGlobalScrollReveals() {
    const revealElements = document.querySelectorAll(
      '[data-reveal], .scroll-reveal, .scroll-reveal-left, .scroll-reveal-right'
    );

    const windowHeight = window.innerHeight;

    revealElements.forEach((el) => {
      // Immediate check in case element is already in viewport
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight * 0.92 && rect.bottom > 0) {
        el.classList.add('is-visible');
      } else {
        revealObserver.observe(el);
      }
    });
  }

  // --------------------------------------------------------------------------
  // Hero Cinematic Scroll Parallax (Lightweight & Throttled via rAF)
  // --------------------------------------------------------------------------
  const heroSection = document.getElementById('hero');
  const heroContent = heroSection ? heroSection.querySelector('.hero-content') : null;
  const heroTitle = heroSection ? heroSection.querySelector('.hero-title-wrap') : null;
  const heroPortrait = heroSection ? heroSection.querySelector('.hero-portrait-wrapper') : null;

  let lastScrollY = window.pageYOffset;
  let ticking = false;

  function updateHeroParallax() {
    if (!heroSection || window.innerWidth < 900) {
      ticking = false;
      return;
    }

    const scrollY = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    if (scrollY <= heroHeight + 50) {
      // Subtle layered translation
      if (heroTitle) {
        heroTitle.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
      }
      if (heroPortrait) {
        heroPortrait.style.transform = `translate3d(0, ${scrollY * 0.06}px, 0)`;
      }
      if (heroContent) {
        const opacityRatio = Math.max(0, 1 - scrollY / (heroHeight * 0.92));
        heroContent.style.opacity = opacityRatio.toFixed(3);
      }
    }

    ticking = false;
  }

  // --------------------------------------------------------------------------
  // Signature Career Journey — Vertical Progressive Line & Activated Nodes
  // --------------------------------------------------------------------------
  const journeySection = document.getElementById('journey');
  const journeyTimeline = document.getElementById('journeyTimeline');
  const journeyProgressBar = document.getElementById('journeyProgressBar');
  const journeyItems = journeyTimeline ? journeyTimeline.querySelectorAll('.journey-item') : [];

  function updateJourneyTimeline() {
    if (!journeyTimeline || !journeyProgressBar || journeyItems.length === 0) return;

    const timelineRect = journeyTimeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Trigger line calculation when timeline enters middle of viewport
    const triggerPoint = windowHeight * 0.65;
    const startY = timelineRect.top;
    const totalHeight = timelineRect.height;

    let progress = 0;
    if (startY <= triggerPoint) {
      const scrolledPast = triggerPoint - startY;
      progress = Math.min(Math.max(scrolledPast / totalHeight, 0), 1);
    }

    const progressPercent = (progress * 100).toFixed(1);
    journeyProgressBar.style.height = `${progressPercent}%`;

    // Activate individual milestone items as the line reaches each milestone node
    journeyItems.forEach((item) => {
      const node = item.querySelector('.journey-node');
      if (!node) return;

      const nodeRect = node.getBoundingClientRect();
      const nodeTriggerPoint = windowHeight * 0.7;

      if (nodeRect.top <= nodeTriggerPoint) {
        item.classList.add('is-active', 'is-visible');
      } else {
        // Only remove if scrolled far back up
        if (nodeRect.top > windowHeight * 0.85) {
          item.classList.remove('is-active');
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // Marquee Viewport Connection
  // --------------------------------------------------------------------------
  const marqueeSection = document.querySelector('.marquee-section');
  if (marqueeSection) {
    const marqueeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            marqueeSection.classList.add('in-view');
          } else {
            marqueeSection.classList.remove('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );
    marqueeObserver.observe(marqueeSection);
  }

  // --------------------------------------------------------------------------
  // Unified Passive Scroll Coordinator
  // --------------------------------------------------------------------------
  // Unified Passive Scroll Coordinator
  // --------------------------------------------------------------------------
  function checkRevealFallbacks() {
    const hiddenElements = document.querySelectorAll(
      '[data-reveal]:not(.is-visible), .scroll-reveal:not(.is-visible), .scroll-reveal-left:not(.is-visible), .scroll-reveal-right:not(.is-visible)'
    );
    if (hiddenElements.length === 0) return;

    const windowHeight = window.innerHeight;
    hiddenElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight * 0.95 && rect.bottom > 0) {
        el.classList.add('is-visible');
      }
    });
  }

  function onScroll() {
    lastScrollY = window.pageYOffset;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeroParallax();
        updateJourneyTimeline();
        updateScrollSpy();
        checkRevealFallbacks();
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // --------------------------------------------------------------------------
  // ScrollSpy for Header Navigation Links
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav .nav-link');

  function updateScrollSpy() {
    let current = '';
    const scrollPosition = lastScrollY + 220;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // Stat Number Counters (Animated on enter)
  // --------------------------------------------------------------------------
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
              animateValue(el, 0, target, 1400, suffix);
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

  // --------------------------------------------------------------------------
  // Initialization on DOM Ready
  // --------------------------------------------------------------------------
  function init() {
    initGlobalScrollReveals();
    initStatCounters();
    updateJourneyTimeline();
    updateScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
