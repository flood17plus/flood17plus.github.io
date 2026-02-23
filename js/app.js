/* ===========================
   FLOOD17+ App
   =========================== */
;(function () {
  'use strict';

  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => [...(p || document).querySelectorAll(s)];

  let events = [];
  let announcements = [];

  /* SVG Icons */
  const ico = {
    megaphone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
    shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    sparkles: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>',
    handshake: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88"/><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>',
    cal: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    clock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>',
    x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>'
  };

  /* ===========================
     Boot
     =========================== */
  async function boot() {
    await loadData();
    renderAnnouncements();
    renderUpcoming();
    renderPast();
    buildFilters();

    loader();
    cursor();
    magnetic();
    nav();
    mobileMenu();
    smoothScroll();
    gsapInit();
    search();
    filters();
    lightbox();
    hashRoute();
  }

  /* ===========================
     Data
     =========================== */
  async function loadData() {
    try {
      const [e, a] = await Promise.all([
        fetch('data/events.json').then(r => r.json()),
        fetch('data/announcements.json').then(r => r.json())
      ]);
      events = e;
      announcements = a;
      classify();
    } catch (err) {
      console.error('Data load:', err);
    }
  }

  function classify() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    events.forEach(e => { e.status = new Date(e.date) < now ? 'past' : 'upcoming'; });
  }

  function fmtDate(d) {
    return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function esc(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  /* ===========================
     Loader
     =========================== */
  function loader() {
    const el = $('#loader');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      el.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1400);
  }

  /* ===========================
     Cursor
     =========================== */
  function cursor() {
    if (matchMedia('(pointer:coarse)').matches) return;
    const c = $('#cursor'), f = $('#cursorFollower');
    let mx = 0, my = 0, cx = 0, cy = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function tick() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      fx += (mx - fx) * 0.07;
      fy += (my - fy) * 0.07;
      c.style.left = cx + 'px';
      c.style.top = cy + 'px';
      f.style.left = fx + 'px';
      f.style.top = fy + 'px';
      requestAnimationFrame(tick);
    })();

    document.addEventListener('mouseover', e => {
      if (e.target.closest('[data-hover]')) { c.classList.add('hover'); f.classList.add('hover'); }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('[data-hover]')) { c.classList.remove('hover'); f.classList.remove('hover'); }
    });
  }

  /* ===========================
     Magnetic
     =========================== */
  function magnetic() {
    if (matchMedia('(pointer:coarse)').matches) return;
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.3}px,${y * 0.3}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ===========================
     Nav
     =========================== */
  function nav() {
    const n = $('#nav');
    let t = false;
    window.addEventListener('scroll', () => {
      if (!t) { requestAnimationFrame(() => { n.classList.toggle('scrolled', scrollY > 60); t = false; }); t = true; }
    });

    // Active section highlight
    const secs = $$('section[id]');
    const links = $$('.nav-link');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
    secs.forEach(s => obs.observe(s));
  }

  /* ===========================
     Mobile Menu
     =========================== */
  function mobileMenu() {
    const btn = $('#navBurger'), menu = $('#mobMenu');
    btn.addEventListener('click', () => {
      const on = btn.classList.toggle('active');
      menu.classList.toggle('active', on);
      document.body.style.overflow = on ? 'hidden' : '';
    });
    $$('.mob-link', menu).forEach(l => l.addEventListener('click', () => {
      btn.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }));
  }

  /* ===========================
     Smooth Scroll
     =========================== */
  function smoothScroll() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const h = a.getAttribute('href');
        if (h.startsWith('#event/')) return;
        const t = $(h);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.pushState(null, '', h); }
      });
    });
  }

  /* ===========================
     GSAP
     =========================== */
  function gsapInit() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      $$('.reveal-up,.ann-card,.ev-card,.rule').forEach(el => { el.classList.add('revealed'); el.style.opacity = '1'; el.style.transform = 'none'; });
      $$('.stat-num').forEach(el => { el.textContent = el.dataset.count + '+'; });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    $$('.reveal-up').forEach(el => {
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => el.classList.add('revealed') });
    });

    staggerCards('.ann-card');
    staggerCards('.ev-card');
    staggerCards('.rule');

    // Counters
    $$('.stat-num').forEach(el => {
      const target = +el.dataset.count;
      ScrollTrigger.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: () => gsap.to(el, {
          duration: 2, ease: 'power2.out', innerText: target,
          snap: { innerText: 1 },
          onUpdate() { el.textContent = Math.round(+el.textContent) + '+'; }
        })
      });
    });

    // Hero parallax
    const hc = $('.hero-content');
    if (hc) gsap.to(hc, { y: 100, opacity: 0.2, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });

    // Glow orbs parallax
    $$('.hero-glow').forEach((o, i) => {
      gsap.to(o, { y: (i + 1) * -90, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
    });

    // Card image parallax
    $$('.ev-card-img img').forEach(img => {
      gsap.to(img, { y: -25, scrollTrigger: { trigger: img.closest('.ev-card'), start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
  }

  function staggerCards(sel) {
    $$(sel).forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card, start: 'top 94%', once: true,
        onEnter: () => setTimeout(() => card.classList.add('revealed'), i * 70)
      });
    });
  }

  /* ===========================
     Render Announcements
     =========================== */
  function renderAnnouncements() {
    const g = $('#annList');
    if (!g) return;
    const sorted = [...announcements].sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] || 2) - ({ high: 0, medium: 1, low: 2 }[b.priority] || 2));
    g.innerHTML = sorted.map(a => `
      <div class="ann-card${a.priority === 'high' ? ' p-high' : a.priority === 'medium' ? ' p-medium' : ''}" data-hover>
        <div class="ann-head">
          <div class="ann-icon">${ico[a.icon] || ico.sparkles}</div>
          <h3 class="ann-title">${esc(a.title)}</h3>
        </div>
        <p class="ann-body">${esc(a.content)}</p>
        <span class="ann-date">${fmtDate(a.date)}</span>
      </div>`).join('');
  }

  /* ===========================
     Render Events
     =========================== */
  function cardHTML(ev, past) {
    return `
      <article class="ev-card${past ? ' past' : ''}" data-id="${ev.id}" data-hover role="button" tabindex="0">
        <div class="ev-card-img">
          <img data-src="${ev.banner}" alt="${esc(ev.title)}" loading="lazy">
          <span class="ev-card-cat">${esc(ev.category)}</span>
        </div>
        <div class="ev-card-body">
          <div class="ev-card-date">${ico.cal} ${fmtDate(ev.date)}</div>
          <h3 class="ev-card-title">${esc(ev.title)}</h3>
          <p class="ev-card-desc">${esc(ev.shortDescription)}</p>
          <div class="ev-card-tags">${(ev.tags || []).map(t => `<span class="ev-tag">#${esc(t)}</span>`).join('')}</div>
        </div>
        <div class="ev-card-go">${ico.arrow}</div>
      </article>`;
  }

  function renderCards(container, list, past) {
    container.innerHTML = list.map(e => cardHTML(e, past)).join('');
    lazyLoad(container);
    $$('.ev-card', container).forEach(c => {
      const open = () => openEvent(c.dataset.id);
      c.addEventListener('click', open);
      c.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
    });
  }

  function renderUpcoming(filter, query) {
    const g = $('#upcomingGrid'), empty = $('#upcomingEmpty');
    let list = events.filter(e => e.status === 'upcoming');
    if (filter && filter !== 'all') list = list.filter(e => (e.tags && e.tags.includes(filter)) || e.category === filter);
    if (query) { const q = query.toLowerCase(); list = list.filter(e => e.title.toLowerCase().includes(q) || e.shortDescription.toLowerCase().includes(q) || (e.tags && e.tags.some(t => t.includes(q)))); }
    list.sort((a, b) => new Date(a.date) - new Date(b.date));
    renderCards(g, list, false);
    empty.classList.toggle('hidden', list.length > 0);
    // Animate fresh cards
    if (typeof ScrollTrigger !== 'undefined') $$('.ev-card', g).forEach((c, i) => setTimeout(() => c.classList.add('revealed'), i * 70 + 80));
  }

  function renderPast() {
    const g = $('#pastGrid');
    const list = events.filter(e => e.status === 'past').sort((a, b) => new Date(b.date) - new Date(a.date));
    renderCards(g, list, true);
  }

  /* ===========================
     Filters
     =========================== */
  function buildFilters() {
    const wrap = $('#evFilters');
    if (!wrap) return;
    const tags = new Set();
    events.forEach(e => { if (e.tags) e.tags.forEach(t => tags.add(t)); });
    const allBtn = wrap.querySelector('[data-filter="all"]');
    wrap.innerHTML = '';
    if (allBtn) wrap.appendChild(allBtn);
    tags.forEach(t => {
      const b = document.createElement('button');
      b.className = 'ev-filter';
      b.dataset.filter = t;
      b.dataset.hover = '';
      b.textContent = '#' + t;
      wrap.appendChild(b);
    });
  }

  function filters() {
    const wrap = $('#evFilters');
    if (!wrap) return;
    wrap.addEventListener('click', e => {
      const b = e.target.closest('.ev-filter');
      if (!b) return;
      $$('.ev-filter', wrap).forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      renderUpcoming(b.dataset.filter, ($('#evSearch') || {}).value || '');
    });
  }

  function search() {
    const inp = $('#evSearch');
    if (!inp) return;
    let t;
    inp.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => renderUpcoming($('.ev-filter.active')?.dataset.filter || 'all', inp.value), 200);
    });
  }

  /* ===========================
     Lightbox
     =========================== */
  function lightbox() {
    const lb = $('#lb'), close = $('#lbClose'), back = $('#lbBackdrop');
    close.addEventListener('click', closeEvent);
    back.addEventListener('click', closeEvent);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('active')) closeEvent(); });
  }

  function openEvent(id) {
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    const c = $('#lbContent');
    c.innerHTML = `
      <img class="lb-banner" src="${ev.banner}" alt="${esc(ev.title)}" loading="lazy">
      <div class="lb-body">
        <span class="lb-cat">${esc(ev.category)}</span>
        <h2 class="lb-title">${esc(ev.title)}</h2>
        <div class="lb-meta">
          <div class="lb-meta-item">${ico.cal} ${fmtDate(ev.date)}</div>
          ${ev.time ? `<div class="lb-meta-item">${ico.clock} ${esc(ev.time)}</div>` : ''}
        </div>
        <div class="lb-section"><h3>Описание</h3><div>${esc(ev.fullDescription)}</div></div>
        ${ev.rules ? `<div class="lb-section"><h3>Правила</h3><div>${esc(ev.rules)}</div></div>` : ''}
        ${ev.participationFormat ? `<div class="lb-section"><h3>Формат участия</h3><p>${esc(ev.participationFormat)}</p></div>` : ''}
        <div class="lb-tags">${(ev.tags || []).map(t => `<span class="ev-tag">#${esc(t)}</span>`).join('')}</div>
      </div>`;
    $('#lb').classList.add('active');
    document.body.style.overflow = 'hidden';
    history.pushState(null, '', '#event/' + id);
  }

  function closeEvent() {
    $('#lb').classList.remove('active');
    document.body.style.overflow = '';
    if (location.hash.startsWith('#event/')) history.pushState(null, '', location.pathname);
  }

  function hashRoute() {
    const h = location.hash;
    if (h.startsWith('#event/')) openEvent(h.replace('#event/', ''));
    window.addEventListener('hashchange', () => {
      const hh = location.hash;
      if (hh.startsWith('#event/')) openEvent(hh.replace('#event/', ''));
    });
  }

  /* ===========================
     Lazy Load
     =========================== */
  function lazyLoad(root) {
    const imgs = $$('img[data-src]', root);
    if ('IntersectionObserver' in window) {
      const o = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const i = e.target;
            i.src = i.dataset.src;
            i.removeAttribute('data-src');
            i.onload = () => i.classList.add('loaded');
            i.onerror = () => { i.classList.add('loaded'); i.style.background = 'var(--bg-card)'; };
            o.unobserve(i);
          }
        });
      }, { rootMargin: '200px' });
      imgs.forEach(i => o.observe(i));
    } else {
      imgs.forEach(i => { i.src = i.dataset.src; i.removeAttribute('data-src'); i.classList.add('loaded'); });
    }
  }

  /* GO */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
