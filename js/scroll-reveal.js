(() => {
  const items = [...document.querySelectorAll(
    '.feature-card, .cta-banner__content, .cta-banner__buttons'
  )];

  if (!items.length) return;

  items.forEach((item, index) => {
    item.classList.add('reveal-item');
    item.style.setProperty('--reveal-delay', `${(index % 4) * 55}ms`);
  });
  document.body.classList.add('reveal-ready');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px' });

  items.forEach((item) => observer.observe(item));
})();
