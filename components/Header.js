// HEADER COMPONENT
window.renderHeader = (activePage) => {
  const links = [["index.html", "Home", "home"], ["work.html", "Work", "work"], ["about.html", "About", "about"]];
  return `<header class="site-header"><a class="home-flower" href="index.html" aria-label="Back to home">✿</a><nav class="main-nav" aria-label="Main navigation">${links.map(([href, label, page]) => `<a class="nav-link ${activePage === page ? "is-active" : ""}" href="${href}">${label}</a>`).join("")}</nav></header>`;
};
