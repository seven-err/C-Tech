(() => {
  const menu = document.querySelector('#mobile-menu');
  const openButton = document.querySelector('.hamburger');
  const closeButtons = menu?.querySelectorAll('.mobile-menu__overlay, .mobile-menu__close-btn');
  const menuLinks = menu?.querySelectorAll('.mobile-menu__link');

  if (!menu || !openButton || !closeButtons || !menuLinks) return;

  let savedScrollPosition = 0;

  const openMenu = () => {
    savedScrollPosition = window.scrollY;
    document.body.classList.add('menu-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollPosition}px`;
    document.body.style.width = '100%';
    menu.inert = false;
    menu.setAttribute('aria-hidden', 'false');
    openButton.setAttribute('aria-expanded', 'true');
    menu.querySelector('.mobile-menu__close-btn').focus();
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    document.body.classList.remove('menu-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScrollPosition);
    menu.setAttribute('aria-hidden', 'true');
    menu.inert = true;
    openButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) openButton.focus({ preventScroll: true });
  };

  openButton.addEventListener('click', openMenu);
  closeButtons.forEach((button) => button.addEventListener('click', () => closeMenu()));
  menuLinks.forEach((link) => link.addEventListener('click', () => closeMenu({ restoreFocus: false })));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu();
  });

  const sections = [...menuLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const highlightSection = (sectionId) => {
    menuLinks.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('mobile-menu__link--active', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visibleSection) highlightSection(visibleSection.target.id);
  }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.1, 0.5] });

  sections.forEach((section) => sectionObserver.observe(section));
})();
