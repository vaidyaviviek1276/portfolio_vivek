/**
 * Custom Magnetic Cursor Engine
 * Editorial Portfolio - Vivek Vaidya
 */

(function () {
  'use strict';

  // Disable completely on touch / mobile devices
  const isTouchDevice = () => {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.innerWidth < 900
    );
  };

  if (isTouchDevice()) {
    return;
  }

  // Create cursor elements dynamically if not already in DOM
  let cursorDot = document.querySelector('.custom-cursor-dot');
  let cursorRing = document.querySelector('.custom-cursor-ring');

  if (!cursorDot) {
    cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(cursorDot);
  }

  if (!cursorRing) {
    cursorRing = document.createElement('div');
    cursorRing.className = 'custom-cursor-ring';
    cursorRing.innerHTML = '<span class="cursor-arrow">↗</span>';
    document.body.appendChild(cursorRing);
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;

  // Track Mouse Position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Direct positioning for instant dot feedback
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    if (!isMoving) {
      isMoving = true;
      document.body.classList.remove('cursor-hidden');
    }
  });

  window.addEventListener('mouseleave', () => {
    document.body.classList.add('cursor-hidden');
  });

  window.addEventListener('mouseenter', () => {
    document.body.classList.remove('cursor-hidden');
  });

  // Smooth lerp loop for outer ring
  const lerp = (start, end, factor) => start + (end - start) * factor;

  function renderCursor() {
    ringX = lerp(ringX, mouseX, 0.18);
    ringY = lerp(ringY, mouseY, 0.18);

    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states detection
  function attachHoverListeners() {
    // Interactive clickable links & buttons
    const clickables = document.querySelectorAll(
      'a, button, .btn-primary, .btn-secondary, .btn-hero-primary, .btn-hero-secondary, .contact-email-box, .skills-filter-btn, [data-project-trigger]'
    );

    clickables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });

    // Project cards & rich interaction items - view state
    const viewables = document.querySelectorAll(
      '.project-centerpiece-media, .project-media, .hero-floating-badge, .skill-row, .focus-word-item'
    );
    viewables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-view');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-view');
      });
    });

    // Magnetic interaction for main CTA buttons
    const magnetics = document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary, .hero-floating-badge, .btn-header-cta');
    magnetics.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - btnCenterX) * 0.28;
        const deltaY = (e.clientY - btnCenterY) * 0.28;

        btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHoverListeners);
  } else {
    attachHoverListeners();
  }

  // Expose re-bind function in case dynamic elements are inserted
  window.rebindCustomCursor = attachHoverListeners;
})();
