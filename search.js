(function () {
  var input = document.getElementById('issue-search');
  var countEl = document.getElementById('search-count');
  if (!input) return;

  var items = Array.from(document.querySelectorAll('.faq-item'));
  var total = items.length;

  // Build a data set from the FAQ items for the dropdown
  var itemData = items.map(function (item) {
    var h2 = item.querySelector('h2');
    var title = h2 ? h2.textContent.replace(/^\d+\.\s*/, '') : '';
    var causesEl = item.querySelector('.causes-list');
    var causes = causesEl ? causesEl.textContent.replace(/^(Common causes|Causes):\s*/i, '').trim() : '';
    return { el: item, title: title, causes: causes };
  });

  // Create the dropdown container
  var dropdown = document.createElement('ul');
  dropdown.id = 'search-dropdown';
  dropdown.setAttribute('role', 'listbox');
  dropdown.setAttribute('aria-label', 'Search suggestions');
  dropdown.style.cssText = [
    'position:absolute',
    'top:100%',
    'left:0',
    'right:0',
    'margin:4px 0 0',
    'padding:0',
    'list-style:none',
    'background:#fff',
    'border:1px solid #d0cdc8',
    'border-radius:8px',
    'box-shadow:0 8px 24px rgba(0,0,0,0.14)',
    'z-index:9999',
    'max-height:320px',
    'overflow-y:auto',
    'display:none'
  ].join(';');

  // Insert dropdown inside .search-wrapper so it inherits the positioning context
  var wrapper = input.closest('.search-wrapper') || input.parentElement;
  wrapper.style.position = 'relative';
  wrapper.appendChild(dropdown);

  function hideDropdown() {
    dropdown.style.display = 'none';
    while (dropdown.firstChild) dropdown.removeChild(dropdown.firstChild);
  }

  function makeLi(d) {
    var li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.style.cssText = 'padding:10px 14px;cursor:pointer;border-bottom:1px solid #f0ede8';

    var titleSpan = document.createElement('span');
    titleSpan.style.cssText = 'display:block;font-weight:600;font-size:0.92em;color:#2c1810';
    titleSpan.textContent = d.title;
    li.appendChild(titleSpan);

    if (d.causes) {
      var causeSpan = document.createElement('span');
      causeSpan.style.cssText = 'display:block;font-size:0.8em;color:#7a6a5a;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
      causeSpan.textContent = d.causes.length > 80 ? d.causes.substring(0, 80) + '\u2026' : d.causes;
      li.appendChild(causeSpan);
    }

    li.addEventListener('mouseenter', function () { li.style.background = '#fdf6f0'; });
    li.addEventListener('mouseleave', function () { li.style.background = ''; });
    li.addEventListener('mousedown', function (e) {
      e.preventDefault();
      hideDropdown();
      input.value = '';
      countEl.textContent = '';
      restoreAll();
      d.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      d.el.style.outline = '2px solid #c84b31';
      setTimeout(function () { d.el.style.outline = ''; }, 1500);
    });
    return li;
  }

  function showDropdown(matches) {
    while (dropdown.firstChild) dropdown.removeChild(dropdown.firstChild);
    if (!matches.length) { dropdown.style.display = 'none'; return; }
    matches.forEach(function (d) { dropdown.appendChild(makeLi(d)); });
    dropdown.style.display = 'block';
  }

  function restoreAll() {
    // Re-query every time to avoid stale closure references
    var qn = document.querySelector('.quick-nav');
    var hi = document.querySelector('.hero-image');
    if (qn) qn.style.display = '';
    if (hi) hi.style.display = '';
    items.forEach(function (item) { item.style.display = ''; });
  }

  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();

    // Re-query every time — avoids stale IIFE-closure reference bug
    var qn = document.querySelector('.quick-nav');
    var hi = document.querySelector('.hero-image');

    if (q) {
      if (qn) qn.style.display = 'none';
      if (hi) hi.style.display = 'none';
    } else {
      if (qn) qn.style.display = '';
      if (hi) hi.style.display = '';
      hideDropdown();
    }

    // Filter the full FAQ list (keeps count behavior)
    var visible = 0;
    items.forEach(function (item) {
      var text = item.textContent.toLowerCase();
      var match = !q || text.indexOf(q) !== -1;
      item.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    if (!q) {
      countEl.textContent = '';
      countEl.style.cssText = '';
    } else if (visible === 0) {
      countEl.innerHTML = 'No results for <strong>\u201c' + q.replace(/</g, '&lt;') + '\u201d</strong> &mdash; try a different term';
      countEl.style.cssText = 'color:#fff;font-size:1em;font-weight:500;margin-top:10px;opacity:1';
    } else {
      countEl.textContent = 'Showing ' + visible + ' of ' + total + ' issues';
      countEl.style.cssText = '';
    }

    // Dropdown: show up to 7 matching results when ≥2 chars typed
    if (q.length >= 2) {
      var matches = itemData.filter(function (d) {
        return d.title.toLowerCase().indexOf(q) !== -1 ||
               d.causes.toLowerCase().indexOf(q) !== -1 ||
               d.el.textContent.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 7);
      showDropdown(matches);
    } else {
      hideDropdown();
    }

    // Search tracking — fires after 1s of no typing (GA4 + Google Sheet)
    clearTimeout(input._searchTimer);
    if (q.length >= 3) {
      input._searchTimer = setTimeout(function () {
        // GA4: general search event
        if (typeof gtag === 'function') {
          gtag('event', 'search', { search_term: q });
          // GA4: dedicated no-results event for easier reporting
          if (visible === 0) {
            gtag('event', 'search_no_results', { search_term: q });
          }
        }
        // Google Sheet: log every search with result count
        if (window.__SEARCH_LOG_URL) {
          var img = new Image();
          img.src = window.__SEARCH_LOG_URL +
            '?q=' + encodeURIComponent(q) +
            '&results=' + visible +
            '&total=' + total +
            '&t=' + Date.now();
        }
      }, 1000);
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('mousedown', function (e) {
    if (!wrapper.contains(e.target)) hideDropdown();
  });

  // Close on Escape, clear search
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      hideDropdown();
      input.value = '';
      countEl.textContent = '';
      restoreAll();
    }
  });
})();
