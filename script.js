// script.js — Guillem the Frutem (PERA) Landing Page

// 1. Mobile Menu (Hamburger)
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');

// Toggle menu
navToggle.addEventListener('click', () => {
  const expanded = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  navMenu.setAttribute('aria-hidden', expanded ? 'false' : 'true');
  
  // Trap focus within menu when open (accessibility)
  if (expanded) {
    const focusableEls = navMenu.querySelectorAll('a[href], button');
    const firstFocusable = focusableEls[0];
    const lastFocusable = focusableEls[focusableEls.length - 1];
    
    // Focus first item
    firstFocusable.focus();
    
    // Trap focus in menu
    navMenu.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }
});

// Close menu on link click (mobile)
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 900 && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
    }
  });
});

// 2. Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const hash = anchor.getAttribute('href');
    if (hash.length > 1 && document.querySelector(hash)) {
      e.preventDefault();
      document.querySelector(hash).scrollIntoView({ behavior: 'smooth' });
      document.querySelector(hash).focus({ preventScroll: true });
    }
  });
});

// 3. Copy contract to clipboard + toast
const copyBtn = document.getElementById('copy-contract');
const contractAddress = document.getElementById('contract-address');
const toast = document.getElementById('toast');
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(contractAddress.textContent).then(() => {
    showToast('Contract copied!');
  }, () => {
    showToast('Failed to copy.');
  });
});
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// 4. FAQ accordion
const faqs = document.querySelectorAll('.faq-item');
faqs.forEach((item, index) => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  
  // Close other FAQs when opening a new one
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    
    // Close all other FAQs
    faqs.forEach((otherItem, otherIndex) => {
      if (otherIndex !== index) {
        const otherBtn = otherItem.querySelector('.faq-question');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        otherBtn.setAttribute('aria-expanded', 'false');
        otherAnswer.hidden = true;
      }
    });

    // Toggle current FAQ
    btn.setAttribute('aria-expanded', !expanded);
    answer.hidden = expanded;
    
    // Focus management
    if (!expanded) {
      answer.focus({ preventScroll: true });
      // Scroll into view if needed
      const rect = answer.getBoundingClientRect();
      const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!isInViewport) {
        answer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });

  // Keyboard accessibility (Enter/Space)
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

// 5. IntersectionObserver for fade/slide animations
function revealOnScroll(selector, visibleClass = 'visible') {
  const els = document.querySelectorAll(selector);
  if (!('IntersectionObserver' in window) || els.length === 0) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(visibleClass);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  els.forEach(el => observer.observe(el));
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  revealOnScroll('.fade-in');
  revealOnScroll('.slide-in');
});

// 6. Countdown for liquidity lock
function updateLockCountdown() {
  const countdownEl = document.getElementById('lock-countdown');
  if (!countdownEl) return;

  const endDate = new Date('2025-12-31T23:59:59'); // Replace with actual lock end date
  const now = new Date();
  const diff = endDate - now;

  if (diff <= 0) {
    countdownEl.textContent = 'Liquidity lock expired';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  countdownEl.textContent = `Liquidity lock ends in: ${days}d ${hours}h ${minutes}m`;
}

// Update countdown every minute
setInterval(updateLockCountdown, 60000);
updateLockCountdown();