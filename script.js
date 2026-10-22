/**
 * Developer Portfolio Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Dark / Light Mode)
  initTheme();

  // 2. Mobile Navigation Drawer
  initMobileNav();

  // 3. Scroll Spy / Active Navigation Highlighting
  initActiveNav();

  // 4. 3D Wheel Scroll Animations (Cross-browser fallback)
  initWheelScroll();

  // 5. Project Card Tap / Click Navigation
  initProjectCards();

  // 6. Contact Form Submission Handling
  initContactForm();

  // 7. Interactive Ambient Glow Cursor (Higginsfield/Figma aesthetic)
  initCursorGlow();

  // 8. 3D Card Tilt & Holographic Hover
  init3DTilt();

  // 9. Dynamic Typewriter Effect for Hero
  initTypewriter();

  // 10. Update Current Year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

/**
 * Initializes and manages theme switching (Dark & Light Mode)
 * with persistence in localStorage and system preferences fallback.
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Check saved preference or fallback to system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  root.setAttribute('data-theme', initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      root.setAttribute('data-theme', nextTheme);
      localStorage.setItem('portfolio-theme', nextTheme);
    });
  }

  // Listen for operating system theme changes if user has not set an explicit override
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Handles mobile hamburger toggle, drawer open/close,
 * clicking outside, and ESC key dismissal.
 */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', isOpen);
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
  }

  mobileToggle.addEventListener('click', () => toggleMenu());

  // Close when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  });

  // Close when clicking outside of navbar
  document.addEventListener('click', (event) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(event.target) &&
      !mobileToggle.contains(event.target)
    ) {
      toggleMenu(false);
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/**
 * Highlights active navigation item as the user scrolls
 * using IntersectionObserver.
 */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const wheelDots = document.querySelectorAll('.wheel-dot');

  if (!sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });

        wheelDots.forEach((dot) => {
          const sectionTarget = dot.getAttribute('data-section');
          dot.classList.toggle('active', sectionTarget === id);
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * Ultra-smooth, zero-lag 3D Wheel scroll transitions.
 * In Chrome/Edge/Safari, native CSS view-timeline runs 100% on the GPU compositor thread.
 * For other browsers, uses an asynchronous IntersectionObserver with hardware-accelerated cubic-bezier transitions.
 */
function initWheelScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // If the browser natively supports CSS scroll-driven view timelines, let CSS compositor handle it at 120 FPS!
  if (window.CSS && CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    return;
  }

  const sections = document.querySelectorAll('.wheel-section');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.remove('wheel-below', 'wheel-above');
        el.classList.add('wheel-active');
      } else {
        el.classList.remove('wheel-active');
        if (entry.boundingClientRect.top > 0) {
          el.classList.add('wheel-below');
          el.classList.remove('wheel-above');
        } else {
          el.classList.add('wheel-above');
          el.classList.remove('wheel-below');
        }
      }
    });
  }, {
    root: null,
    rootMargin: '-5% 0px -5% 0px',
    threshold: 0.15
  });

  sections.forEach((sec, index) => {
    if (index === 0) {
      sec.classList.add('wheel-active');
    } else {
      sec.classList.add('wheel-below');
    }
    observer.observe(sec);
  });
}

/**
 * Contact form powered by Web3Forms
 * Delivers messages directly to mutisyakevin5@gmail.com
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (!form || !feedback) return;

  const ACCESS_KEY = '04ad2cf7-38f2-4be9-abc5-06bbe1d2f111';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      feedback.textContent = 'Please fill out all fields.';
      feedback.className = 'form-feedback error';
      return;
    }

    // Indicate loading state
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Sending... <span class="btn-spinner"></span>`;
    }
    feedback.textContent = 'Sending your message...';
    feedback.className = 'form-feedback';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: name,
          email: email,
          message: message,
          from_name: `${name} (Portfolio Inquiry)`,
          subject: `New Portfolio Message from ${name}`
        })
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        feedback.textContent = `✓ Message sent successfully! Thanks, ${name}. I will reply to you soon.`;
        feedback.className = 'form-feedback success';
        form.reset();
      } else {
        feedback.textContent = result.message || 'Something went wrong. Please try again or email me directly.';
        feedback.className = 'form-feedback error';
      }
    } catch (error) {
      feedback.textContent = 'Network error. Please email me directly at mutisyakevin5@gmail.com';
      feedback.className = 'form-feedback error';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      setTimeout(() => {
        if (feedback.className.includes('success')) {
          feedback.textContent = '';
          feedback.className = 'form-feedback';
        }
      }, 7000);
    }
  });
}

/**
 * Makes entire project cards tappable and clickable on mobile and desktop
 * while preserving direct clicks on external links (Visit Live Site, GitHub).
 */
function initProjectCards() {
  const cards = document.querySelectorAll('.project-card[data-url]');
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // Don't intercept if clicking an external action button (Live link, GitHub, etc.)
      if (e.target.closest('.project-links a')) {
        return;
      }
      const targetUrl = card.getAttribute('data-url');
      if (targetUrl) {
        window.location.href = targetUrl;
      }
    });
  });
}

/**
 * Interactive Project Device Showcase Modal
 */
function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal) return;

  // Project datasets with multi-page desktop & mobile screenshots
  const projectsData = {
    'aic-ziwani': {
      title: 'AIC Ziwani CYA — Youth Community Portal',
      badge: '⭐ Featured Project',
      subtitle: 'Fellowship & Community Platform for Youth Ministry',
      liveUrl: 'https://youth.aicziwani.org',
      pages: {
        'Home Page': 'assets/images/aic-ziwani.png',
        'Fellowship Hub': 'assets/images/aic-ziwani-fellowship.png',
        'Events Calendar': 'assets/images/aic-ziwani-events.png'
      },
      mobileImg: 'assets/images/aic-ziwani-mobile.png',
      desc: 'A full-scale community platform for AIC Ziwani youth ministry featuring member authentication, fellowship community spaces, interactive events calendar, and ministry resource sharing.',
      features: [
        'Google Sign-In & Member Profiles',
        'Fellowship Directory & Ministries',
        'Events Calendar & Countdowns',
        'Mobile-First Responsive Layout'
      ]
    },
    'vibecraft': {
      title: 'VibeCraft 254 — Projector & Entertainment Store',
      badge: 'E-Commerce Platform',
      subtitle: 'Smart Home Cinema & Projector Setup Storefront',
      liveUrl: 'https://vibecraft254.com',
      pages: {
        'Storefront Home': 'assets/images/vibecraft.png'
      },
      mobileImg: 'assets/images/vibecraft-mobile.png',
      desc: 'A sleek, high-converting e-commerce web platform for smart home projector setups with an interactive shopping cart, instant product search popover, and dark/light theme switching.',
      features: [
        'Dark & Light Theme Engine',
        'Interactive Client-Side Cart System',
        'Instant Live Search Popover',
        'Conversion-Optimized UI Design'
      ]
    },
    'sijui-game': {
      title: 'Sijui Charades — Mobile Party Game',
      badge: '⭐ Favorite Web Game',
      subtitle: 'Kenyan Heads-Up Charades Web App',
      liveUrl: 'https://sijui-game.onrender.com',
      pages: {
        'Game Hub': 'assets/images/sijui-game.png'
      },
      mobileImg: 'assets/images/sijui-mobile.png',
      desc: 'An engaging Kenyan charades game designed for mobile browser gameplay ("hold phone to forehead"). Features customized deck categories, solo and team score tracking, and real-time round timers.',
      features: [
        'Landscape Mobile Gaming Mode',
        'Motion Sensor / Gyro Gameplay',
        'Customizable Kenyan Decks',
        'Team & Solo Scoring Modes'
      ]
    }
  };

  const modalTitle = document.getElementById('modal-title');
  const modalBadge = document.getElementById('modal-badge');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalDesc = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalLiveLink = document.getElementById('modal-live-link');
  const laptopImg = document.getElementById('laptop-img');
  const phoneImg = document.getElementById('phone-img');
  const pageTabsContainer = document.getElementById('page-tabs');
  const deviceStage = document.getElementById('device-stage');
  const modeTabs = document.querySelectorAll('.mode-tab');

  function openProject(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalBadge.textContent = data.badge;
    modalSubtitle.textContent = data.subtitle;
    modalDesc.textContent = data.desc;
    modalLiveLink.setAttribute('href', data.liveUrl);

    // Populate features
    modalFeatures.innerHTML = '';
    data.features.forEach((feat) => {
      const pill = document.createElement('span');
      pill.className = 'modal-feature-pill';
      pill.textContent = feat;
      modalFeatures.appendChild(pill);
    });

    // Populate Page Switcher Tabs
    pageTabsContainer.innerHTML = '';
    const pageKeys = Object.keys(data.pages);

    pageKeys.forEach((key, index) => {
      const tabBtn = document.createElement('button');
      tabBtn.type = 'button';
      tabBtn.className = `page-tab ${index === 0 ? 'active' : ''}`;
      tabBtn.textContent = key;
      tabBtn.addEventListener('click', () => {
        document.querySelectorAll('.page-tab').forEach((t) => t.classList.remove('active'));
        tabBtn.classList.add('active');
        laptopImg.src = data.pages[key];
        laptopImg.alt = `${data.title} - ${key}`;
      });
      pageTabsContainer.appendChild(tabBtn);
    });

    // Set initial images
    laptopImg.src = data.pages[pageKeys[0]];
    laptopImg.alt = `${data.title} - ${pageKeys[0]}`;
    phoneImg.src = data.mobileImg;
    phoneImg.alt = `${data.title} - Mobile View`;

    // Reset scroll positions of mockup screens
    document.getElementById('laptop-screen').scrollTop = 0;
    document.getElementById('phone-screen').scrollTop = 0;

    // Show modal
    modal.showModal();
  }

  // Legacy modal trigger binding (only intercept if element is a button with open-modal-btn)
  document.querySelectorAll('button.open-modal-btn').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = trigger.getAttribute('data-project');
      if (projectId) {
        openProject(projectId);
      }
    });
  });

  // Device Mode Switcher (Both / Laptop / Phone)
  modeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      modeTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const mode = tab.getAttribute('data-mode');
      deviceStage.className = `device-stage stage-${mode}`;
    });
  });

  // Close handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  // Close when clicking outside dialog (on backdrop)
  modal.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close();
    }
  });
}

/**
 * Interactive Ambient Glow Cursor (Figma / Higginsfield Inspired)
 * Follows mouse smoothly with dampening
 */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) {
      glow.style.opacity = '1';
      isVisible = true;
    }
  });

  window.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    isVisible = false;
  });

  function render() {
    // Smooth lerp (linear interpolation) for buttery-smooth 60fps tracking
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Expand glow when hovering interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-category-card, .stat-card');
  hoverTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      glow.style.width = '600px';
      glow.style.height = '600px';
      glow.style.filter = 'blur(60px)';
    });
    target.addEventListener('mouseleave', () => {
      glow.style.width = '450px';
      glow.style.height = '450px';
      glow.style.filter = 'blur(40px)';
    });
  });
}

/**
 * 3D Tilt & Physics on Hero Code Card & Project Cards
 * Uses requestAnimationFrame + damping lerp to eliminate cursor stutter and lag
 */
function init3DTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) return;

  const tiltElements = document.querySelectorAll('.code-card, .project-card');

  tiltElements.forEach((card) => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovered = false;
    let animId = null;

    function update() {
      // Smooth dampening interpolation
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      if (isHovered || Math.abs(currentX) > 0.05 || Math.abs(currentY) > 0.05) {
        card.style.transform = `perspective(1000px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) translateY(-8px)`;
        animId = requestAnimationFrame(update);
      } else {
        card.style.transform = '';
        animId = null;
      }
    }

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      if (!animId) animId = requestAnimationFrame(update);
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Gentle, controlled max angle (+/- 7 degrees)
      targetX = ((y - centerY) / centerY) * -7;
      targetY = ((x - centerX) / centerX) * 7;

      if (!animId) animId = requestAnimationFrame(update);
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
    });
  });
}

/**
 * Dynamic Typewriter Effect for Hero Headline
 */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Full-Stack Developer',
    'Creative UI Engineer',
    'Frontend Specialist',
    'Web Architecture Designer'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const pauseTime = 1800;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === current.length) {
      delay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}


