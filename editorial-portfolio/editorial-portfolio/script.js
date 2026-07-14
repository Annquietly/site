(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Автоматический год в футере.
  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  // Плавное появление блоков во время скролла.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Параллакс фоновых объектов.
  const parallaxObjects = [...document.querySelectorAll('[data-speed]')];
  let latestScrollY = window.scrollY;
  let parallaxFrame = null;

  const updateParallax = () => {
    parallaxObjects.forEach((object) => {
      const speed = Number(object.dataset.speed || 0);
      object.style.translate = `0 ${latestScrollY * speed}px`;
    });
    parallaxFrame = null;
  };

  if (!reduceMotion && parallaxObjects.length) {
    window.addEventListener('scroll', () => {
      latestScrollY = window.scrollY;
      if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax);
    }, { passive: true });
    updateParallax();
  }

  // Hover-превью проектов, плавно следующее за курсором.
  const preview = document.querySelector('.hover-preview');
  const previewImage = preview?.querySelector('img');
  const projectTargets = document.querySelectorAll('[data-image]');

  if (preview && previewImage && window.matchMedia('(hover: hover)').matches) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const animatePreview = () => {
      currentX += (targetX - currentX) * 0.13;
      currentY += (targetY - currentY) * 0.13;
      preview.style.left = `${currentX}px`;
      preview.style.top = `${currentY}px`;
      requestAnimationFrame(animatePreview);
    };
    animatePreview();

    window.addEventListener('mousemove', (event) => {
      const width = preview.offsetWidth || 420;
      const height = preview.offsetHeight || 315;
      targetX = Math.min(window.innerWidth - width * 0.42, Math.max(width * 0.42, event.clientX + 34));
      targetY = Math.min(window.innerHeight - height * 0.42, Math.max(height * 0.42, event.clientY + 12));
    }, { passive: true });

    projectTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        const nextImage = target.dataset.image;
        if (nextImage && previewImage.getAttribute('src') !== nextImage) {
          previewImage.src = nextImage;
        }
        preview.classList.add('is-visible');
      });
      target.addEventListener('mouseleave', () => preview.classList.remove('is-visible'));
    });
  }

  // Раскрытие описания кейса на странице Work.
  document.querySelectorAll('.work-row').forEach((row) => {
    row.addEventListener('click', (event) => {
      const item = row.closest('.work-item');
      if (!item) return;

      const wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.work-item.is-open').forEach((openItem) => openItem.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');

      if (history.replaceState) {
        history.replaceState(null, '', wasOpen ? 'work.html' : `#${item.id}`);
      }

      // Оставляем обычное поведение ссылки только при открытии из другой страницы.
      if (window.location.pathname.endsWith('work.html') || window.location.pathname.endsWith('/work')) {
        event.preventDefault();
      }
    });
  });

  if (window.location.hash) {
    document.querySelector(window.location.hash)?.classList.add('is-open');
  }

  // Небольшой переход между локальными страницами.
  document.querySelectorAll('a[href]').forEach((link) => {
    const url = new URL(link.href, window.location.href);
    const isLocalPage = url.origin === window.location.origin && /(?:index|work|about)\.html$/.test(url.pathname);
    const isSamePageAnchor = url.pathname === window.location.pathname && url.hash;

    if (!isLocalPage || isSamePageAnchor || link.target === '_blank' || reduceMotion) return;

    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.body.classList.add('is-leaving');
      window.setTimeout(() => {
        window.location.href = link.href;
      }, 360);
    });
  });
})();
<!-- variable-proximity.html -->
<div id="stage" style="display:grid;place-items:center;min-height:100vh;"><span class="pres" id="out"></span></div>
<style>
  body{ margin:0; background:#0A0A0B; }
  .pres{ font-family:'Inter',sans-serif; font-size:clamp(44px,8.2vw,110px);
    line-height:1; letter-spacing:-.02em; color:#F4F2EC; }
  .pres span{ display:inline-block; font-variation-settings:'wght' 400;
    transition:font-variation-settings .08s linear; will-change:font-variation-settings; }
</style>
<script>
  const stage = document.getElementById('stage'), el = document.getElementById('out');
  const text = 'PROXIMITY', radius = 100, wghtMin = 200, wghtMax = 800, falloff = 1.6;
  [...text].forEach(ch => { const s = document.createElement('span'); s.textContent = ch === ' ' ? '\u00A0' : ch; el.appendChild(s); });
  const p = { x:-9999, y:-9999, active:false };
  stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); p.x = e.clientX - r.left; p.y = e.clientY - r.top; p.active = true; });
  stage.addEventListener('pointerleave', () => { p.active = false; });
  // each frame: distance from pointer -> soft falloff -> font weight
  (function loop(){
    requestAnimationFrame(loop);
    const sr = stage.getBoundingClientRect();
    for (const span of el.children){
      const r = span.getBoundingClientRect();
      const cx = (r.left + r.right)/2 - sr.left, cy = (r.top + r.bottom)/2 - sr.top;
      let force = 0;
      if (p.active){
        const d = Math.hypot(cx - p.x, cy - p.y);
        force = Math.pow(Math.max(0, 1 - d/radius), falloff);
      }
      const wght = wghtMin + (wghtMax - wghtMin) * force;
      span.style.fontVariationSettings = `'wght' ${wght.toFixed(0)}`;
    }
  })();
</script>