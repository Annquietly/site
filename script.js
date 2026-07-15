(() => {
    // Эффект Variable Proximity для главного заголовка.
  const proximityElements = document.querySelectorAll('[data-proximity]');

  proximityElements.forEach((element) => {
    const lines = element.querySelectorAll('[data-proximity-text]');

    const radius = 500;
    const minimumWeight = 200;
    const maximumWeight = 1200;
    const falloff = 1.6;

    const pointer = {
      x: -9999,
      y: -9999,
      active: false
    };

    // Разбиваем каждую строку на отдельные буквы.
    lines.forEach((line) => {
      const text = line.dataset.proximityText || '';

      line.textContent = '';

      Array.from(text).forEach((character) => {
        const letter = document.createElement('span');

        letter.className = 'proximity-letter';
        letter.setAttribute('aria-hidden', 'true');

        if (character === ' ') {
          letter.classList.add('is-space');
          letter.textContent = '\u00A0';
        } else {
          letter.textContent = character;
        }

        line.appendChild(letter);
      });
    });

    element.addEventListener('pointermove', (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    });

    element.addEventListener('pointerenter', () => {
      pointer.active = true;
    });

    element.addEventListener('pointerleave', () => {
      pointer.active = false;
    });

    const updateLetters = () => {
      const letters = element.querySelectorAll('.proximity-letter');

      letters.forEach((letter) => {
        let force = 0;

        if (pointer.active) {
          const rectangle = letter.getBoundingClientRect();

          const centerX = rectangle.left + rectangle.width / 2;
          const centerY = rectangle.top + rectangle.height / 2;

          const distance = Math.hypot(
            centerX - pointer.x,
            centerY - pointer.y
          );

          const proximity = Math.max(0, 1 - distance / radius);
          force = Math.pow(proximity, falloff);
        }

        const weight =
          minimumWeight +
          (maximumWeight - minimumWeight) * force;

        letter.style.fontVariationSettings =
          `"wght" ${Math.round(weight)}`;

        letter.style.fontWeight = Math.round(weight);
      });

      requestAnimationFrame(updateLetters);
    };

    updateLetters();
  });
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
