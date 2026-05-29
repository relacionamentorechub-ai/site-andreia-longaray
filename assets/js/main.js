(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ----- hero load anim ----- */
  const hero = $('.hero');
  if (hero) {
    requestAnimationFrame(() => hero.classList.add('loaded'));
  }

  /* ----- header scroll state ----- */
  const header = $('[data-header]');
  const onScroll = () => {
    if (window.scrollY > 24) {
      header?.setAttribute('data-scrolled', '');
    } else {
      header?.removeAttribute('data-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- mobile menu ----- */
  const menuBtn = $('[data-menu-toggle]');
  const nav = $('.site-nav');
  if (menuBtn && nav) {
    const setMenuState = (open) => {
      nav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      if (header) {
        if (open) header.setAttribute('data-menu-open', '');
        else header.removeAttribute('data-menu-open');
      }
      document.documentElement.style.overflow = open ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', () => {
      setMenuState(!nav.classList.contains('open'));
    });
    $$('.site-nav a').forEach(a => {
      a.addEventListener('click', () => setMenuState(false));
    });
  }

  /* ----- reveal on scroll ----- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ----- WhatsApp flutuante (aparece após 400px) ----- */
  const wa = $('[data-wa]');
  if (wa) {
    const toggleWa = () => {
      if (window.scrollY > 400) wa.setAttribute('data-visible', '');
      else wa.removeAttribute('data-visible');
    };
    window.addEventListener('scroll', toggleWa, { passive: true });
    toggleWa();
  }

  /* ----- parallax leve no hero ----- */
  const heroImg = $('.hero-media img');
  if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            heroImg.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(${1 + Math.min(y / 4000, 0.04)})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ----- ano dinâmico no footer ----- */
  $$('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ----- vídeo: play só quando visível no viewport ----- */
  const video = $('.video-frame video');
  if (video) {
    const tryPlay = () => video.play().catch(() => {});
    const playWhenVisible = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (video.readyState >= 2) tryPlay();
          else video.addEventListener('loadeddata', tryPlay, { once: true });
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.3 });
    playWhenVisible.observe(video);
  }
})();
