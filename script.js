(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // LAYOUT SETTINGS
  const page = document.body.dataset.page;
  document
    .querySelector("[data-header]")
    ?.replaceWith(
      document
        .createRange()
        .createContextualFragment(window.renderHeader?.(page)),
    );
  document
    .querySelector("[data-footer]")
    ?.replaceWith(
      document.createRange().createContextualFragment(window.renderFooter?.()),
    );
  document.querySelectorAll("[data-link-arrow]").forEach((node) => {
    node.replaceWith(
      document.createRange().createContextualFragment(window.linkArrow || "↗"),
    );
  });

  // PROJECT DATA
  const projects = window.projects || [];
  const homeCards = document.querySelector("[data-home-project-cards]");
  const workCards = document.querySelector("[data-project-cards]");

  if (homeCards && window.renderProjectCard) {
    const featured = projects.filter(({ id }) =>
      [
        "spatial-experiment",
        "editorial-system",
        "digital-product",
        "visual-identity",
      ].includes(id),
    );
    homeCards.innerHTML = featured
      .map((project, index) => window.renderProjectCard(project, index))
      .join("");
  }

  if (workCards && window.renderProjectCard) {
    const renderCards = (filter = "All Projects") => {
      const filtered =
        filter === "All Projects"
          ? projects
          : projects.filter((project) => project.category === filter);
      workCards.innerHTML = filtered
        .map((project, index) => window.renderProjectCard(project, index))
        .join("");
      window.i18n?.apply();
    };
    renderCards();

    // FILTERS
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll("[data-filter]")
          .forEach((item) =>
            item.classList.toggle("is-active", item === button),
          );
        renderCards(button.dataset.filter);
        document
          .querySelectorAll(".project-tile")
          .forEach((card) => card.classList.add("is-visible"));
      });
    });
  }

  const projectPage = document.querySelector("[data-project-page]");
  if (projectPage) {
    const id = new URLSearchParams(window.location.search).get("id");
    const project = projects.find((item) => item.id === id);
    if (!project) {
      projectPage.innerHTML = `<section class="project-not-found"><p class="eyebrow2" data-i18n="project.notFound">Project not found</p><a class="text-link" href="work.html"><span data-i18n="project.backToWork">Back to Work</span>${window.linkArrow}</a></section>`;
    } else {
      const setProjectTitle = () => {
        document.title = `${window.i18n?.t(`projects.${project.id}.title`) || project.title} - Anna Russkikh`;
      };
      setProjectTitle();
      window.addEventListener("languagechange", setProjectTitle);

      projectPage.innerHTML = `<section class="project-hero"><h1 class="reveal" data-i18n="projects.${project.id}.title">${project.title}</h1><p class="project-meta reveal reveal-delay-1"><span data-i18n="project.duration">Duration</span> ${project.duration} <span>/</span> <span data-i18n="project.year">Year</span> ${project.year}</p></section>${window.renderProjectGallery(project)}<section class="project-description"><div class="project-description__item reveal"><p class="eyebrow2" data-i18n="project.done">What was done</p><p data-i18n="projects.${project.id}.done">${project.description.done}</p></div><div class="project-description__item reveal"><p class="eyebrow2" data-i18n="project.task">Task</p><p data-i18n="projects.${project.id}.task">${project.description.task}</p></div><div class="project-description__item reveal"><p class="eyebrow2" data-i18n="project.result">Result</p><p data-i18n="projects.${project.id}.result">${project.description.result}</p></div></section>
      <section class="latest-work reveal"><p class="eyebrow2" data-i18n="project.latestWork">Latest Work</p><a class="text-link" href="work.html"><span data-i18n="project.work">Work</span>${window.linkArrow}</a></section>`;

      // GALLERY
      const image = projectPage.querySelector("[data-gallery-image]");
      const current = projectPage.querySelector("[data-gallery-current]");
      let imageIndex = 0;
      const setImage = (nextIndex) => {
        imageIndex =
          (nextIndex + project.images.length) % project.images.length;
        image.classList.add("is-changing");
        window.setTimeout(() => {
          image.src = project.images[imageIndex];
          current.textContent = imageIndex + 1;
          image.classList.remove("is-changing");
        }, 180);
      };
      const galleryFrame = projectPage.querySelector("[data-gallery-frame]");
      const galleryCursor = projectPage.querySelector("[data-gallery-cursor]");
      let isLeftSide = false;

      galleryFrame.addEventListener("pointermove", (event) => {
        const rectangle = galleryFrame.getBoundingClientRect();
        isLeftSide = event.clientX - rectangle.left < rectangle.width / 2;
        galleryCursor.style.left = `${event.clientX - rectangle.left}px`;
        galleryCursor.style.top = `${event.clientY - rectangle.top}px`;
        galleryCursor.textContent = isLeftSide ? "←" : "→";
        galleryCursor.setAttribute(
          "aria-label",
          window.i18n?.t(
            isLeftSide ? "project.previousImage" : "project.nextImage",
          ) || (isLeftSide ? "Previous image" : "Next image"),
        );
      });

      galleryCursor.addEventListener("click", () =>
        setImage(imageIndex + (isLeftSide ? -1 : 1)),
      );
      galleryFrame.addEventListener("click", (event) => {
        if (
          event.target === galleryCursor ||
          window.matchMedia("(pointer: fine)").matches
        )
          return;
        const rectangle = galleryFrame.getBoundingClientRect();
        setImage(
          imageIndex +
            (event.clientX - rectangle.left < rectangle.width / 2 ? -1 : 1),
        );
      });
    }
  }

  window.i18n?.init();

  // HOME PHOTO PARALLAX
  const mousePhotos = [...document.querySelectorAll("[data-mouse-depth]")];
  if (
    !reduceMotion &&
    mousePhotos.length &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    window.addEventListener(
      "pointermove",
      (event) => {
        const offsetX = event.clientX / window.innerWidth - 0.5;
        const offsetY = event.clientY / window.innerHeight - 0.5;
        mousePhotos.forEach((photo) => {
          const depth = Number(photo.dataset.mouseDepth);
          photo.style.setProperty("--mouse-x", `${offsetX * depth * 180}px`);
          photo.style.setProperty("--mouse-y", `${offsetY * depth * 180}px`);
        });
      },
      { passive: true },
    );
  }

  // Эффект Variable Proximity для главного заголовка.
  const proximityElements = document.querySelectorAll("[data-proximity]");

  proximityElements.forEach((element) => {
    const lines = element.querySelectorAll("[data-proximity-text]");

    const radius = 500;
    const minimumWeight = 200;
    const maximumWeight = 1200;
    const falloff = 1.6;

    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
    };

    // Разбиваем каждую строку на отдельные буквы.
    lines.forEach((line) => {
      const text = line.dataset.proximityText || "";

      line.textContent = "";

      Array.from(text).forEach((character) => {
        const letter = document.createElement("span");

        letter.className = "proximity-letter";
        letter.setAttribute("aria-hidden", "true");

        if (character === " ") {
          letter.classList.add("is-space");
          letter.textContent = "\u00A0";
        } else {
          letter.textContent = character;
        }

        line.appendChild(letter);
      });
    });

    element.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    });

    element.addEventListener("pointerenter", () => {
      pointer.active = true;
    });

    element.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    const updateLetters = () => {
      const letters = element.querySelectorAll(".proximity-letter");

      letters.forEach((letter) => {
        let force = 0;

        if (pointer.active) {
          const rectangle = letter.getBoundingClientRect();

          const centerX = rectangle.left + rectangle.width / 2;
          const centerY = rectangle.top + rectangle.height / 2;

          const distance = Math.hypot(centerX - pointer.x, centerY - pointer.y);

          const proximity = Math.max(0, 1 - distance / radius);
          force = Math.pow(proximity, falloff);
        }

        const weight = minimumWeight + (maximumWeight - minimumWeight) * force;

        letter.style.fontVariationSettings = `"wght" ${Math.round(weight)}`;

        letter.style.fontWeight = Math.round(weight);
      });

      requestAnimationFrame(updateLetters);
    };

    updateLetters();
  });

  // Автоматический год в футере.
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  // Плавное появление блоков во время скролла.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Параллакс фоновых объектов.
  const parallaxObjects = [...document.querySelectorAll("[data-speed]")];
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
    window.addEventListener(
      "scroll",
      () => {
        latestScrollY = window.scrollY;
        if (!parallaxFrame)
          parallaxFrame = requestAnimationFrame(updateParallax);
      },
      { passive: true },
    );
    updateParallax();
  }

  // Hover-превью проектов, плавно следующее за курсором.
  const preview = document.querySelector(".hover-preview");
  const previewImage = preview?.querySelector("img");
  const projectTargets = document.querySelectorAll("[data-image]");

  if (preview && previewImage && window.matchMedia("(hover: hover)").matches) {
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

    window.addEventListener(
      "mousemove",
      (event) => {
        const width = preview.offsetWidth || 420;
        const height = preview.offsetHeight || 315;
        targetX = Math.min(
          window.innerWidth - width * 0.42,
          Math.max(width * 0.42, event.clientX + 34),
        );
        targetY = Math.min(
          window.innerHeight - height * 0.42,
          Math.max(height * 0.42, event.clientY + 12),
        );
      },
      { passive: true },
    );

    projectTargets.forEach((target) => {
      target.addEventListener("mouseenter", () => {
        const nextImage = target.dataset.image;
        if (nextImage && previewImage.getAttribute("src") !== nextImage) {
          previewImage.src = nextImage;
        }
        preview.classList.add("is-visible");
      });
      target.addEventListener("mouseleave", () =>
        preview.classList.remove("is-visible"),
      );
    });
  }

  // Раскрытие описания кейса на странице Work.
  document.querySelectorAll(".work-row").forEach((row) => {
    row.addEventListener("click", (event) => {
      const item = row.closest(".work-item");
      if (!item) return;

      const wasOpen = item.classList.contains("is-open");
      document
        .querySelectorAll(".work-item.is-open")
        .forEach((openItem) => openItem.classList.remove("is-open"));
      if (!wasOpen) item.classList.add("is-open");

      if (history.replaceState) {
        history.replaceState(null, "", wasOpen ? "work.html" : `#${item.id}`);
      }

      // Оставляем обычное поведение ссылки только при открытии из другой страницы.
      if (
        window.location.pathname.endsWith("work.html") ||
        window.location.pathname.endsWith("/work")
      ) {
        event.preventDefault();
      }
    });
  });

  if (window.location.hash) {
    document.querySelector(window.location.hash)?.classList.add("is-open");
  }

  // Небольшой переход между локальными страницами.
  document.querySelectorAll("a[href]").forEach((link) => {
    const url = new URL(link.href, window.location.href);
    const isLocalPage =
      url.origin === window.location.origin &&
      /(?:index|work|about|project)\.html$/.test(url.pathname);
    const isSamePageAnchor =
      url.pathname === window.location.pathname && url.hash;

    if (
      !isLocalPage ||
      isSamePageAnchor ||
      link.target === "_blank" ||
      reduceMotion
    )
      return;

    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      document.body.classList.add("is-leaving");
      window.setTimeout(() => {
        window.location.href = link.href;
      }, 360);
    });
  });
})();
