// Interactive script for dedicated project subpages
document.addEventListener('DOMContentLoaded', () => {
  // Theme sync from localStorage
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('km_portfolio_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', nextTheme);
      localStorage.setItem('km_portfolio_theme', nextTheme);
    });
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('nav-open');
    });
  }

  // Device view modes switcher (Both Devices / Laptop / iPhone 14)
  const modeTabs = document.querySelectorAll('.mode-tab');
  const stage = document.getElementById('device-stage');

  if (modeTabs.length && stage) {
    modeTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        modeTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const mode = tab.getAttribute('data-mode');
        stage.classList.remove('stage-side-by-side', 'stage-laptop-only', 'stage-phone-only');

        if (mode === 'laptop') {
          stage.classList.add('stage-laptop-only');
        } else if (mode === 'phone') {
          stage.classList.add('stage-phone-only');
        } else {
          stage.classList.add('stage-side-by-side');
        }
      });
    });
  }

  // Laptop page screenshot tabs switcher
  const pageTabs = document.querySelectorAll('.page-tab');
  const laptopImg = document.getElementById('laptop-img');
  const laptopScreen = document.getElementById('laptop-screen');

  if (pageTabs.length && laptopImg) {
    pageTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        pageTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const newSrc = tab.getAttribute('data-src');
        if (newSrc) {
          laptopImg.style.opacity = '0.4';
          laptopImg.src = newSrc;
          laptopImg.onload = () => {
            laptopImg.style.opacity = '1';
          };
          if (laptopScreen) {
            laptopScreen.scrollTop = 0;
          }
        }
      });
    });
  }
});

