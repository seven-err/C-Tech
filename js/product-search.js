(() => {
  const search = document.querySelector('#product-search');
  const input = search?.querySelector('.search-bar__input');
  const mobileButton = document.querySelector('.mobile-search-btn');
  const productSection = document.querySelector('#products');
  const cards = [...document.querySelectorAll('.product-card')];
  const status = document.querySelector('.product-search-status');

  if (!search || !input || !mobileButton || !productSection || !cards.length || !status) return;

  const closeMobileSearch = () => {
    search.classList.remove('search-bar--open');
    mobileButton.setAttribute('aria-expanded', 'false');
    mobileButton.setAttribute('aria-label', 'Open product search');
  };

  const filterProducts = () => {
    const query = input.value.trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    let matches = 0;

    cards.forEach((card) => {
      const searchableText = card.textContent.toLowerCase();
      const isMatch = terms.every((term) => searchableText.includes(term));
      card.hidden = !isMatch;
      if (isMatch) matches += 1;
    });

    status.textContent = query
      ? matches
        ? `${matches} product${matches === 1 ? '' : 's'} found for “${input.value.trim()}”.`
        : `No products found for “${input.value.trim()}”.`
      : '';
  };

  input.addEventListener('input', filterProducts);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      filterProducts();
      productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (event.key === 'Escape') {
      input.value = '';
      filterProducts();
      closeMobileSearch();
      mobileButton.focus();
    }
  });

  mobileButton.addEventListener('click', () => {
    const willOpen = !search.classList.contains('search-bar--open');
    search.classList.toggle('search-bar--open', willOpen);
    mobileButton.setAttribute('aria-expanded', String(willOpen));
    mobileButton.setAttribute('aria-label', willOpen ? 'Close product search' : 'Open product search');
    if (willOpen) input.focus();
  });

  document.addEventListener('click', (event) => {
    if (!search.contains(event.target) && !mobileButton.contains(event.target)) closeMobileSearch();
  });
})();
