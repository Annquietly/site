(() => {
  const storageKey = "portfolio-language";
  const defaultLanguage = "ru";
  const translations = window.translations || {};

  const getNestedValue = (source, key) =>
    key.split(".").reduce((value, part) => (value && value[part] !== undefined ? value[part] : undefined), source);

  const getLanguage = () => {
    const saved = localStorage.getItem(storageKey);
    return translations[saved] ? saved : defaultLanguage;
  };

  const t = (key, language = getLanguage()) =>
    getNestedValue(translations[language], key) ??
    getNestedValue(translations[defaultLanguage], key) ??
    key;

  const buildProximityText = (line) => {
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
  };

  const apply = (language = getLanguage()) => {
    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n, language);
    });

    document.querySelectorAll("[data-i18n-proximity]").forEach((node) => {
      node.dataset.proximityText = t(node.dataset.i18nProximity, language);
      buildProximityText(node);
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
      node.dataset.i18nAttr.split(",").forEach((item) => {
        const [attribute, key] = item.split(":").map((part) => part.trim());
        if (attribute && key) node.setAttribute(attribute, t(key, language));
      });
    });

    document.querySelectorAll("[data-language-option]").forEach((button) => {
      const active = button.dataset.languageOption === language;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    window.dispatchEvent(new CustomEvent("languagechange", { detail: { language } }));
  };

  const setLanguage = (language) => {
    if (!translations[language]) return;
    localStorage.setItem(storageKey, language);
    apply(language);
  };

  const init = () => {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-language-option]");
      if (!button) return;
      setLanguage(button.dataset.languageOption);
    });

    apply(getLanguage());
  };

  window.i18n = { apply, init, setLanguage, t, getLanguage };
})();
