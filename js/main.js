/**
 * Core Application Logic & Interactions
 * Editorial Portfolio - Vivek Vaidya
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Mobile Navigation Menu Toggle
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu() {
    const isOpen = mobileOverlay.classList.toggle('active');
    mobileToggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    mobileOverlay.classList.remove('active');
    mobileToggle.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeProjectModal();
    }
  });

  // --------------------------------------------------------------------------
  // Skills Interactive Category Filter (Smooth Editorial Transition)
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.skills-filter-btn');
  const skillRows = document.querySelectorAll('.skill-row');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;

      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillRows.forEach((row, index) => {
        const category = row.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          row.style.display = '';
          row.classList.remove('is-filtering-out');
          setTimeout(() => {
            row.classList.add('is-filtering-in', 'is-visible');
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
          }, 20 + index * 25);
        } else {
          row.classList.remove('is-filtering-in');
          row.classList.add('is-filtering-out');
          row.style.opacity = '0';
          row.style.transform = 'translateY(10px)';
          setTimeout(() => {
            if (row.classList.contains('is-filtering-out')) {
              row.style.display = 'none';
            }
          }, 240);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // Project Detail Modal (Shree Enterprises - Single Completed Project)
  // --------------------------------------------------------------------------
  const projectData = {
    shree: {
      number: '01 / 01',
      category: 'Android Application',
      title: 'Shree Enterprises',
      image: 'assets/images/project-shree.jpg',
      description:
        'An Android-based laptop and PC configuration application designed to help users explore computer components and build system configurations through a structured mobile interface. Built with native Java, SQLite, and Firebase integration.',
      features: [
        'Product & component browsing across CPUs, GPUs, RAM, motherboards, and storage drives.',
        'PC and laptop component technical specifications and pricing details.',
        'System configuration builder interface to review complete PC builds.',
        'Local SQLite database integration for fast offline data caching and query performance.',
        'Firebase integration for cloud-based inventory updates and component catalog sync.',
        'Native Android UI implemented using Java and modular XML layouts in Android Studio.',
        'Admin-side management for updating component availability, pricing, and configurations.',
      ],
      tech: ['Java', 'XML', 'SQLite', 'Firebase', 'Android Studio'],
      developmentAreas: ['Android Development', 'UI Development', 'Database Integration', 'Firebase Integration'],
      link: '#',
    },
  };

  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalMetaNum = document.getElementById('modalMetaNum');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalImg = document.getElementById('modalImg');
  const modalDesc = document.getElementById('modalDesc');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalDevAreas = document.getElementById('modalDevAreas');
  const modalTech = document.getElementById('modalTech');

  function openProjectModal(key) {
    const data = projectData[key];
    if (!data) return;

    modalMetaNum.textContent = data.number;
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalImg.src = data.image;
    modalImg.alt = data.title;
    modalDesc.textContent = data.description;

    // Features
    modalFeatures.innerHTML = '';
    data.features.forEach((feat) => {
      const li = document.createElement('div');
      li.className = 'modal-feature-item';
      li.innerHTML = `<span class="modal-feature-bullet">▪</span><span>${feat}</span>`;
      modalFeatures.appendChild(li);
    });

    // Development Areas
    if (modalDevAreas) {
      modalDevAreas.innerHTML = '';
      (data.developmentAreas || []).forEach((area) => {
        const pill = document.createElement('span');
        pill.className = 'project-tech-pill';
        pill.style.backgroundColor = 'var(--color-surface-subtle)';
        pill.textContent = area;
        modalDevAreas.appendChild(pill);
      });
    }

    // Tech stack
    modalTech.innerHTML = '';
    data.tech.forEach((t) => {
      const pill = document.createElement('span');
      pill.className = 'project-tech-pill';
      pill.textContent = t;
      modalTech.appendChild(pill);
    });

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Re-bind cursor for modal elements
    if (window.rebindCustomCursor) {
      window.rebindCustomCursor();
    }
  }

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Trigger modal from cards
  document.querySelectorAll('[data-project-trigger]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = el.getAttribute('data-project-trigger');
      openProjectModal(projectKey);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // Copy Email with Toast Notification & Button Feedback
  // --------------------------------------------------------------------------
  const copyEmailBox = document.getElementById('copyEmailBox');
  const contactCopyBtn = document.getElementById('contactCopyBtn');
  const toastNotice = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimeout;
  let copyBtnTimeout;

  function showToast(message) {
    if (!toastNotice) return;
    if (toastMsg) toastMsg.textContent = message;
    toastNotice.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3000);
  }

  function handleEmailCopy() {
    const email = 'vaidyavivek1276@gmail.com';
    const setCopiedState = () => {
      if (contactCopyBtn) {
        contactCopyBtn.textContent = 'Email Copied ✓';
        contactCopyBtn.classList.add('copied');

        clearTimeout(copyBtnTimeout);
        copyBtnTimeout = setTimeout(() => {
          contactCopyBtn.textContent = 'COPY EMAIL ↗';
          contactCopyBtn.classList.remove('copied');
        }, 2000);
      }
      showToast(`Email copied: ${email}`);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(email)
        .then(setCopiedState)
        .catch(() => {
          fallbackCopy(email);
          setCopiedState();
        });
    } else {
      fallbackCopy(email);
      setCopiedState();
    }
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      // Ignored
    }
    document.body.removeChild(textArea);
  }

  if (copyEmailBox) {
    copyEmailBox.addEventListener('click', handleEmailCopy);
  }

  // --------------------------------------------------------------------------
  // Interactive Contact Form Handling
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const messageInput = document.getElementById('contactMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        showToast('Please fill out all fields.');
        return;
      }

      // Simple email validation regex
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showToast('Please enter a valid email address.');
        return;
      }

      // Professional confirmation response
      showToast('Thanks! Your message is ready to send.');
      contactForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // Real-Time IST (India Standard Time) Clock
  // --------------------------------------------------------------------------
  const liveClockEl = document.getElementById('liveTimeIst');

  function updateClock() {
    if (!liveClockEl) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      const istString = new Intl.DateTimeFormat('en-US', options).format(now);
      liveClockEl.textContent = `${istString} IST • Based in India`;
    } catch (err) {
      liveClockEl.textContent = 'India (IST) • Open to Global Roles';
    }
  }

  setInterval(updateClock, 1000);
  updateClock();
})();
