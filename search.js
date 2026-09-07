(function () {
  var input = document.getElementById('issue-search');
  var countEl = document.getElementById('search-count');
  if (!input || !countEl) return;

  var category = 'all', activeIndex = -1;
  var suggestions = [], matches = [], guideMatches = [];
  var wrapper = input.closest('.search-wrapper') || input.parentElement;
  var filterBar = document.getElementById('faq-filter-bar');
  var items = Array.from(document.querySelectorAll('.faq-item'));
  function normalize(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[-_]/g, ' ');
  }
  var itemData = items.map(function (item, index) {
    if (!item.id) item.id = 'issue-' + (index + 1);
    if (item.closest('#grinder-section')) item.dataset.category = 'grinder';
    if (item.closest('#superauto-section')) item.dataset.category = 'super-auto';
    var heading = item.querySelector('h2');
    return { el: item, title: heading ? heading.textContent.replace(/^\d+\.\s*/, '').trim() : '',
      text: normalize(item.textContent), category: item.dataset.category, type: 'issue' };
  });
  var seen = new Set();
  var guides = Array.from(document.querySelectorAll('.quick-nav a[href]')).reduce(function (list, link) {
    var url = new URL(link.href, location.href);
    if (url.origin === location.origin && url.pathname.endsWith('.html') && !seen.has(url.pathname)) {
      seen.add(url.pathname);
      list.push({ title: link.textContent.trim(), href: url.href, type: 'guide',
        text: normalize(link.textContent + ' ' + url.pathname.replace(/\.html$/, '')) });
    }
    return list;
  }, []);
  var introductorySections = Array.from(document.querySelectorAll('.quick-nav, .hero-image, .shop-cta, .popular-videos')).map(function (el) {
    return { el: el, display: el.style.display };
  });
  var dropdown = document.createElement('ul');
  dropdown.id = 'search-dropdown';
  dropdown.hidden = true;
  dropdown.setAttribute('role', 'listbox');
  dropdown.setAttribute('aria-label', 'Search suggestions');
  wrapper.appendChild(dropdown);
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-controls', dropdown.id);
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-describedby', countEl.id);
  countEl.setAttribute('role', 'status');
  countEl.setAttribute('aria-live', 'polite');
  var reset = document.createElement('button');
  reset.id = 'search-reset';
  reset.type = 'button';
  reset.textContent = 'Clear search and filters';
  reset.hidden = true;
  countEl.insertAdjacentElement('afterend', reset);
  var guideResults = document.createElement('section');
  guideResults.id = 'guide-search-results';
  guideResults.setAttribute('aria-label', 'Matching guides');
  guideResults.hidden = true;
  if (filterBar) filterBar.insertAdjacentElement('afterend', guideResults);

  function hideDropdown() {
    dropdown.hidden = true;
    activeIndex = -1;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }
  function selectResult(result) {
    hideDropdown();
    if (result.type === 'guide') { window.location.assign(result.href); return; }
    result.el.classList.add('expanded');
    var button = result.el.querySelector('.faq-question') || result.el.querySelector('h2[role="button"]');
    if (button) {
      button.setAttribute('aria-expanded', 'true');
      button.focus({ preventScroll: true });
    }
    result.el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  function setActive(index) {
    activeIndex = index;
    Array.from(dropdown.children).forEach(function (option, i) { option.setAttribute('aria-selected', String(i === index)); });
    var option = dropdown.children[index];
    if (option) {
      input.setAttribute('aria-activedescendant', option.id);
      option.scrollIntoView({ block: 'nearest' });
    }
  }
  function showDropdown() {
    hideDropdown();
    dropdown.replaceChildren();
    if (input.value.trim().length < 2) return;
    suggestions = guideMatches.concat(matches).slice(0, 7);
    suggestions.forEach(function (result, index) {
      var option = document.createElement('li');
      option.id = 'search-option-' + index;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      var title = document.createElement('strong');
      title.textContent = result.title;
      var type = document.createElement('span');
      type.textContent = result.type === 'guide' ? 'Troubleshooting guide' : 'Issue and solution';
      option.append(title, type);
      option.addEventListener('mousedown', function (event) { event.preventDefault(); });
      option.addEventListener('click', function () { selectResult(result); });
      // Layout changes under a stationary pointer must not replace the keyboard selection.
      option.addEventListener('pointermove', function (event) {
        if (event.movementX || event.movementY) setActive(index);
      });
      dropdown.appendChild(option);
    });
    dropdown.hidden = suggestions.length === 0;
    input.setAttribute('aria-expanded', String(!dropdown.hidden));
  }
  function render(showSuggestions) {
    var query = normalize(input.value.trim());
    var tokens = query.split(/\s+/).filter(Boolean);
    function textMatches(text) { return tokens.every(function (token) { return text.includes(token); }); }
    matches = itemData.filter(function (item) {
      var visible = (category === 'all' || item.category === category) && textMatches(item.text);
      item.el.classList.toggle('hidden', !visible);
      item.el.style.display = visible ? '' : 'none';
      return visible;
    });
    guideMatches = query.length >= 2 && category === 'all' ? guides.filter(function (guide) { return textMatches(guide.text); }) : [];
    ['grinder-section', 'superauto-section'].forEach(function (id) {
      var section = document.getElementById(id);
      if (section) section.style.display = matches.some(function (item) { return section.contains(item.el); }) ? '' : 'none';
    });
    introductorySections.forEach(function (section) { section.el.style.display = query ? 'none' : section.display; });
    if (filterBar) filterBar.querySelectorAll('.filter-btn').forEach(function (button) {
      var selected = button.dataset.filter === category;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    guideResults.replaceChildren();
    guideResults.hidden = !guideMatches.length;
    if (guideMatches.length) {
      var heading = document.createElement('h2');
      heading.textContent = 'Matching guides';
      var list = document.createElement('ul');
      guideMatches.forEach(function (guide) {
        var item = document.createElement('li'), link = document.createElement('a');
        link.href = guide.href;
        link.textContent = guide.title;
        item.appendChild(link);
        list.appendChild(item);
      });
      guideResults.append(heading, list);
    }
    reset.hidden = !query && category === 'all';
    if (reset.hidden) countEl.textContent = '';
    else if (!matches.length && !guideMatches.length) countEl.textContent = 'No matches. Try another term or clear the filters.';
    else countEl.textContent = 'Showing ' + matches.length + ' of ' + items.length + ' issues' +
      (guideMatches.length ? ' and ' + guideMatches.length + (guideMatches.length === 1 ? ' guide' : ' guides') : '');
    if (showSuggestions) showDropdown(); else hideDropdown();
  }
  function trackSearch() {
    clearTimeout(input._searchTimer);
    var query = input.value.trim().toLowerCase();
    var visible = matches.length + guideMatches.length;
    if (query.length < 3) return;
    input._searchTimer = setTimeout(function () {
      if (typeof gtag === 'function') {
        gtag('event', 'search', { search_term: query });
        if (!visible) gtag('event', 'search_no_results', { search_term: query });
      }
      if (window.__SEARCH_LOG_URL) {
        var img = new Image();
        img.src = window.__SEARCH_LOG_URL + '?q=' + encodeURIComponent(query) +
          '&results=' + visible + '&total=' + (items.length + guides.length) + '&t=' + Date.now();
      }
    }, 1000);
  }
  input.addEventListener('input', function () { render(true); trackSearch(); });
  input.addEventListener('focus', showDropdown);
  input.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (dropdown.hidden) showDropdown();
      if (!dropdown.hidden) {
        var next = activeIndex < 0 ? (event.key === 'ArrowDown' ? 0 : suggestions.length - 1) :
          (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length;
        setActive(next);
      }
    } else if (event.key === 'Enter' && !dropdown.hidden && suggestions.length) {
      event.preventDefault();
      selectResult(suggestions[Math.max(activeIndex, 0)]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      if (!dropdown.hidden) hideDropdown();
      else { input.value = ''; render(false); clearTimeout(input._searchTimer); }
    } else if (event.key === 'Tab') hideDropdown();
  });
  document.addEventListener('mousedown', function (event) { if (!wrapper.contains(event.target)) hideDropdown(); });
  document.addEventListener('focusin', function (event) { if (!wrapper.contains(event.target)) hideDropdown(); });
  reset.addEventListener('click', function () {
    input.value = ''; category = 'all';
    clearTimeout(input._searchTimer);
    render(false);
    input.focus();
  });
  if (filterBar) filterBar.addEventListener('click', function (event) {
    var button = event.target.closest('.filter-btn');
    if (!button) return;
    category = button.dataset.filter;
    render(false);
    trackSearch();
  });
  render(false);
})();
