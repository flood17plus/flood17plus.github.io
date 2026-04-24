/* =========================================================
   Кровавая луна — скрипт сцены
   Декор, intro, parallax, интерактив, резолвер фото
   ========================================================= */

(() => {
  // Надёжный детект мобилок/слабых устройств: не только по ширине экрана,
  // но и по тач-указателю и числу CPU-ядер. Это ловит телефоны, которые
  // по viewport-у могут репортить >768px (desktop mode, мелкий zoom и т.п.)
  const mqCoarse = matchMedia('(pointer: coarse)').matches;
  const mqNoHover = matchMedia('(hover: none)').matches;
  const hasTouch  = 'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0;
  const narrowVp  = matchMedia('(max-width: 900px)').matches;
  const fewCores  = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency < 6;

  const isMobile = mqCoarse || mqNoHover || hasTouch || narrowVp || fewCores;
  const isSmall  = matchMedia('(max-width: 480px)').matches || (isMobile && window.innerWidth < 560);
  const reduced  = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPower = isMobile;

  if (isMobile) document.body.classList.add('is-mobile');

  const rand  = (min, max) => Math.random() * (max - min) + min;
  const randi = (min, max) => Math.floor(rand(min, max + 1));
  const pick  = (arr) => arr[randi(0, arr.length - 1)];

  /* ---------- Каскадный резолвер фото для медальонов ---------- */
  // Пробуем разные расширения и регистры, прежде чем показать placeholder.
  // Покрывает: фото закоммичены в любом формате (.jpg/.jpeg/.png/.webp + регистр).
  document.querySelectorAll('.medallion-photo[data-slot]').forEach((img) => {
    const slot = img.dataset.slot;
    const exts = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'];
    let i = 0;
    const tryNext = () => {
      if (i >= exts.length) {
        img.onerror = null;
        img.src = `photos/placeholder-${slot}.svg`;
        return;
      }
      img.src = `photos/${slot}.${exts[i++]}`;
    };
    img.onerror = tryNext;
    tryNext();
  });

  /* ---------- Звёзды ---------- */
  const starsHost = document.querySelector('.stars');
  const starCount = isSmall ? 35 : isMobile ? 60 : 130;
  {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < starCount; i++) {
      const s = document.createElement('div');
      const r = Math.random();
      s.className = 'star' + (r < 0.15 ? ' big' : '') + (r > 0.85 ? ' blood' : '');
      s.style.left = rand(0, 100) + 'vw';
      s.style.top  = rand(0, 55) + 'vh';
      s.style.setProperty('--dur',   rand(2.5, 6.5).toFixed(2) + 's');
      s.style.setProperty('--delay', rand(0, 5).toFixed(2) + 's');
      frag.appendChild(s);
    }
    starsHost.appendChild(frag);
  }

  /* ---------- Глаза духов ---------- */
  const eyesHost = document.querySelector('.eyes');
  const eyeCount = isSmall ? 4 : isMobile ? 6 : 14;
  const eyeColors = ['#ff5a3a', '#c43a2a', '#ff7744', '#ffaa66'];
  {
    const frag = document.createDocumentFragment();
    const zones = [
      { xMin: 2,  xMax: 20, yMin: 42, yMax: 78 },
      { xMin: 80, xMax: 96, yMin: 42, yMax: 78 },
      { xMin: 4,  xMax: 22, yMin: 22, yMax: 40 },
      { xMin: 78, xMax: 94, yMin: 22, yMax: 40 },
      { xMin: 28, xMax: 38, yMin: 58, yMax: 76 },
      { xMin: 62, xMax: 72, yMin: 58, yMax: 76 },
    ];
    for (let i = 0; i < eyeCount; i++) {
      const z = zones[i % zones.length];
      const e = document.createElement('div');
      e.className = 'eye-pair';
      e.style.left = rand(z.xMin, z.xMax) + 'vw';
      e.style.top  = rand(z.yMin, z.yMax) + 'vh';
      e.style.setProperty('--dur',   rand(6, 12).toFixed(2) + 's');
      e.style.setProperty('--delay', rand(0, 8).toFixed(2) + 's');
      e.style.setProperty('--eye-color', pick(eyeColors));
      const scale = rand(0.7, 1.3).toFixed(2);
      e.style.transform = `scale(${scale})`;
      frag.appendChild(e);
    }
    eyesHost.appendChild(frag);
  }

  /* ---------- Свечи ---------- */
  const candlesHost = document.querySelector('.candles');
  const candleCount = isSmall ? 10 : isMobile ? 18 : 48;
  {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < candleCount; i++) {
      const c = document.createElement('div');
      const y = rand(62, 94);
      const depth = (y - 62) / 32;
      const scale = 0.5 + depth * 1.0;
      c.className = 'candle' + (depth < 0.25 ? ' far' : depth > 0.75 ? ' near' : '');
      let x;
      do { x = rand(2, 98); } while (depth < 0.5 && x > 36 && x < 64);
      c.style.left = x + 'vw';
      c.style.top  = y + 'vh';
      c.style.transform = `scale(${scale.toFixed(2)})`;
      c.style.setProperty('--i', i);
      c.style.zIndex = Math.round(depth * 10);
      frag.appendChild(c);
    }
    candlesHost.appendChild(frag);
  }

  /* ---------- Светлячки ---------- */
  const firefliesHost = document.querySelector('.fireflies');
  const fireflyCount = isSmall ? 4 : isMobile ? 8 : 18;
  {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < fireflyCount; i++) {
      const f = document.createElement('div');
      f.className = 'firefly';
      f.style.left = rand(5, 95) + 'vw';
      f.style.top  = rand(30, 80) + 'vh';
      f.style.setProperty('--dur',   rand(12, 24).toFixed(2) + 's');
      f.style.setProperty('--delay', rand(0, 8).toFixed(2) + 's');
      frag.appendChild(f);
    }
    firefliesHost.appendChild(frag);
  }

  /* ---------- Reveal букв (только десктоп — на мобиле лагает) ---------- */
  if (!isMobile && !reduced) {
    document.querySelectorAll('.reveal').forEach((el) => {
      const lines = el.innerHTML
        .split(/<br\s*\/?>/i)
        .map((s) => s.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
      el.innerHTML = '';
      let charIdx = 0;
      lines.forEach((line, lineIdx) => {
        if (lineIdx > 0) el.appendChild(document.createElement('br'));
        [...line].forEach((ch) => {
          if (ch === ' ') {
            el.appendChild(document.createTextNode(' '));
            return;
          }
          const span = document.createElement('span');
          span.className = 'ch';
          span.textContent = ch;
          span.style.setProperty('--i', charIdx++);
          el.appendChild(span);
        });
      });
    });
  } else {
    // На мобиле: простой fade-in строк со сдвигом, без побуквенной анимации
    document.body.classList.add('simple-reveal');
  }

  /* ---------- Loaded флаг ---------- */
  const startScene = () => document.body.classList.add('loaded');
  if (document.fonts && document.fonts.ready) {
    Promise.race([
      document.fonts.ready,
      new Promise((r) => setTimeout(r, 1000)),
    ]).then(() => requestAnimationFrame(startScene));
  } else {
    setTimeout(startScene, 200);
  }

  /* ---------- Parallax (только десктоп) ---------- */
  if (!isMobile && !reduced) {
    const parallaxEls = document.querySelectorAll('.parallax');
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => {
      const mx = window.innerWidth / 2;
      const my = window.innerHeight / 2;
      tx = (e.clientX - mx) / mx;
      ty = (e.clientY - my) / my;
    }, { passive: true });
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      parallaxEls.forEach((el) => {
        const d = parseFloat(el.dataset.depth || '0.02');
        const dx = (cx * d * 100).toFixed(2);
        const dy = (cy * d * 50).toFixed(2);
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Ambient искры (только десктоп) ---------- */
  const embersHost = document.querySelector('.embers');
  if (embersHost && !reduced && !lowPower) {
    const spawnEmber = () => {
      if (document.hidden) return;
      const e = document.createElement('div');
      e.className = 'ember';
      e.style.left = rand(42, 58) + '%';
      e.style.top  = rand(46, 58) + '%';
      e.style.setProperty('--dx', rand(-80, 80).toFixed(0) + 'px');
      e.style.setProperty('--dy', rand(-220, -140).toFixed(0) + 'px');
      e.style.setProperty('--dur', rand(2.2, 3.6).toFixed(2) + 's');
      embersHost.appendChild(e);
      setTimeout(() => e.remove(), 4000);
    };
    const schedule = () => {
      spawnEmber();
      setTimeout(schedule, rand(280, 700));
    };
    setTimeout(schedule, 4500);
  }

  /* ---------- Клик по медальону: ignite + искры ---------- */
  document.querySelectorAll('.medallion').forEach((med) => {
    med.addEventListener('click', () => {
      med.classList.remove('ignited');
      void med.offsetWidth;
      med.classList.add('ignited');

      if (!embersHost || lowPower) return;
      const rect = med.getBoundingClientRect();
      const px = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const py = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      for (let i = 0; i < 16; i++) {
        setTimeout(() => {
          const el = document.createElement('div');
          el.className = 'ember';
          el.style.left = px + '%';
          el.style.top  = py + '%';
          el.style.setProperty('--dx', rand(-140, 140).toFixed(0) + 'px');
          el.style.setProperty('--dy', rand(-260, -120).toFixed(0) + 'px');
          el.style.setProperty('--dur', rand(1.6, 2.8).toFixed(2) + 's');
          embersHost.appendChild(el);
          setTimeout(() => el.remove(), 3200);
        }, i * 22);
      }
    });
  });
})();
