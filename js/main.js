/* ============================================================
   BioVR-Investigator — Shared Utilities & Navigation
   ============================================================ */

/**
 * Initialize navigation behavior
 */
export function initNavigation() {
  const nav = document.querySelector('.glass-nav');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  // Scroll effect on navbar
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // Active nav link highlight
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (navLinks.length > 0 && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -60% 0px' });

    sections.forEach(section => observer.observe(section));
  }
}

/**
 * Initialize scroll reveal animations
 */
export function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1,
  });

  reveals.forEach(el => observer.observe(el));
}

/**
 * Smooth scroll to element
 */
export function scrollToElement(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Animate counter from 0 to target
 */
export function animateCounter(element, target, duration = 2000, suffix = '') {
  const startTime = performance.now();
  const startValue = 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startValue + (target - startValue) * eased);
    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Typing effect for text
 */
export function typeText(element, text, speed = 30) {
  return new Promise((resolve) => {
    let i = 0;
    element.textContent = '';
    element.style.visibility = 'visible';

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }

    type();
  });
}

/**
 * Text-to-Speech using Web Speech API
 */
export function speak(text, lang = 'id-ID') {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-Speech not supported');
      resolve();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1;

    // Try to find Indonesian voice
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.startsWith('id'));
    if (idVoice) utterance.voice = idVoice;

    utterance.onend = resolve;
    utterance.onerror = (e) => {
      console.warn('TTS error:', e);
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Debounce utility
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Lerp (linear interpolation)
 */
export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map value from one range to another
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
