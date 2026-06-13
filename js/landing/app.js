/* ============================================================
   BioVR-Investigator — Landing Page Entry Point
   Initializes all landing page modules & interactions
   ============================================================ */

import { initHeroScene } from './hero-scene.js';
import { initNavigation, initScrollReveals, animateCounter } from '/js/main.js';

/**
 * Boot the landing page
 */
function init() {
  // ── Initialize Navigation (scroll effect, mobile menu, active links) ──
  initNavigation();

  // ── Initialize Scroll Reveal Animations ──
  initScrollReveals();

  // ── Initialize Three.js Hero Scene ──
  try {
    initHeroScene();
  } catch (err) {
    console.warn('Three.js hero scene failed to initialize:', err);
  }

  // ── Counter Animations ──
  initCounterAnimations();

  // ── Smooth Scroll for Anchor Links ──
  initSmoothScroll();

  // ── Navbar active state on scroll ──
  initNavbarScrollEffect();

  console.log('🧬 BioVR-Investigator Landing Page initialized');
}

/**
 * Animate stat counters when they scroll into view
 * Uses IntersectionObserver for performance
 */
function initCounterAnimations() {
  const statValues = document.querySelectorAll('.stat-value[data-target]');

  if (statValues.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';

          // Only animate numeric targets
          if (!isNaN(target)) {
            animateCounter(el, target, 2000, suffix);
          }

          // Unobserve after animation triggered
          observer.unobserve(el);
        }
      });
    },
    {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.3,
    }
  );

  statValues.forEach((el) => observer.observe(el));
}

/**
 * Enable smooth scrolling for all anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');

      // Skip empty hashes
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();

        // Offset for fixed navbar
        const navHeight = document.querySelector('.glass-nav')?.offsetHeight || 72;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Update URL hash without jumping
        history.pushState(null, '', targetId);
      }
    });
  });
}

/**
 * Add extra scroll-based effects to the navbar
 */
function initNavbarScrollEffect() {
  const nav = document.querySelector('.glass-nav');
  if (!nav) return;

  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    const scrollY = window.scrollY;

    // Hide/show navbar on scroll direction (only after scrolling past hero)
    if (scrollY > 600) {
      if (scrollY > lastScrollY && scrollY - lastScrollY > 10) {
        // Scrolling down — hide nav
        nav.style.transform = 'translateY(-100%)';
      } else if (lastScrollY > scrollY && lastScrollY - scrollY > 10) {
        // Scrolling up — show nav
        nav.style.transform = 'translateY(0)';
      }
    } else {
      nav.style.transform = 'translateY(0)';
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Ensure nav has transition for smooth show/hide
  nav.style.transition = 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease';
}

// ── Boot when DOM is ready ──
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
