// HEADER COMPONENT
window.linkArrow = `<svg class="link-arrow" viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M2 1h7v7M9 1 1 9" /></svg>`;

window.renderHeader = (activePage) => {
  const links = [
    ["index.html", "nav.home", "Home", "home"],
    ["work.html", "nav.work", "Work", "work"],
    ["about.html", "nav.about", "About", "about"]
  ];

  return `<header class="site-header"><a class="home-flower" href="index.html" aria-label="Back to home" data-i18n-attr="aria-label:nav.homeAria">✿</a><div class="header-actions"><nav class="main-nav" aria-label="Main navigation">${links.map(([href, key, label, page]) => `<a class="nav-link ${activePage === page ? "is-active" : ""}" href="${href}" data-i18n="${key}">${label}</a>`).join("")}</nav><div class="language-switch" aria-label="Language switch"><button type="button" data-language-option="ru">RU</button><span>/</span><button type="button" data-language-option="en">EN</button></div></div></header>`;
};
