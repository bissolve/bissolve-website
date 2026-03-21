// ============================================================
// pages.js — Shared interactivity for all Bissolve inner pages
// ============================================================

// ── Scroll Reveal ─────────────────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ── Sticky Header — hide on scroll down, reveal on scroll up ─
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScrollY = window.scrollY;

  function onScroll() {
    const currentY = window.scrollY;
    const diff = currentY - lastScrollY;

    if (currentY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (diff > 6 && currentY > 120) {
      header.classList.add('hidden');
    } else if (diff < -4) {
      header.classList.remove('hidden');
    }

    lastScrollY = currentY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile Burger Menu ────────────────────────────────────
function initBurgerMenu() {
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!burger || !mobileNav) return;

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', !isOpen);
    burger.classList.toggle('open', !isOpen);
    mobileNav.classList.toggle('open', !isOpen);
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// ── FAQ Accordion ─────────────────────────────────────────
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-q.open').forEach(q => {
    q.classList.remove('open');
    q.nextElementSibling.classList.remove('open');
  });

  // Open clicked (if it wasn't already open)
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// Expose globally for inline onclick
window.toggleFaq = toggleFaq;

// ── Contact Form Handler ──────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return false;

  // Simulate form submission
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    form.style.opacity = '0.4';
    form.style.pointerEvents = 'none';
    success.classList.add('visible');
    btn.textContent = 'Sent ✓';
  }, 900);

  return false;
}

// Expose globally for inline onsubmit
window.handleSubmit = handleSubmit;

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initStickyHeader();
  initBurgerMenu();
});
