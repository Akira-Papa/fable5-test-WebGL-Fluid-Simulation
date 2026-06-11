'use strict';

/* ============================================================
   株式会社フラックス — UI
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- ヘッダー状態・紙のベール・ページトップ ---------- */
const header = document.getElementById('siteHeader');
const veil = document.getElementById('veil');
const pagetop = document.getElementById('pagetop');
let scrollTicking = false;

function onScroll () {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 30);
  pagetop.classList.toggle('show', y > innerHeight * 0.8);
  // ヒーローを抜けるにつれて紙を重ね、本文の可読性を保つ
  veil.style.opacity = Math.max(0.12, Math.min(y / (innerHeight * 0.85), 1) * 0.96);
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(onScroll);
  }
}, { passive: true });
onScroll();

pagetop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

/* ---------- スクロールリビール ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- カウントアップ ---------- */
function animateCount (el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const duration = 1500;
  const start = performance.now();

  function frame (now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(2, -10 * t); // easeOutExpo
    el.textContent = (target * eased).toFixed(decimals);
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = target.toFixed(decimals);
  }
  requestAnimationFrame(frame);
}

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (prefersReducedMotion) {
        const el = entry.target;
        el.textContent = parseFloat(el.dataset.target).toFixed(parseInt(el.dataset.decimals || '0', 10));
      } else {
        animateCount(entry.target);
      }
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-num').forEach(el => countObserver.observe(el));

/* ---------- お問い合わせ: 墨をひと流し ---------- */
const ctaBtn = document.getElementById('ctaBtn');
if (ctaBtn) {
  ctaBtn.addEventListener('click', () => window.fluxFluid?.burst(6));
}

/* ---------- モバイルメニュー ---------- */
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

siteNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- フッター年号 ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
