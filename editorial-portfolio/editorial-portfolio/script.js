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
document.querySelectorAll(".variable-text").forEach(text => {

  // Разбиваем текст на буквы
  text.innerHTML = text.innerHTML.replace(
    /([^\s<])/g,
    '<span class="letter">$1</span>'
  );

  const letters = text.querySelectorAll(".letter");

  document.addEventListener("mousemove", e => {

    letters.forEach(letter => {

      const rect = letter.getBoundingClientRect();

      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const distance = Math.hypot(
        e.clientX - x,
        e.clientY - y
      );

      const max = 180;

      const strength = Math.max(0, 1 - distance / max);

      const scale = 1 + strength * 0.35;

      letter.style.transform = `scale(${scale})`;

      letter.style.opacity = 0.55 + strength * 0.45;

    });

  });

});