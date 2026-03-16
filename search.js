(function () {
  var input = document.getElementById('issue-search');
  var countEl = document.getElementById('search-count');
  if (!input) return;

  var items = Array.from(document.querySelectorAll('.faq-item'));
  var total = items.length;

  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();
    var visible = 0;

    items.forEach(function (item) {
      var text = item.textContent.toLowerCase();
      var match = !q || text.indexOf(q) !== -1;
      item.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    countEl.textContent = q
      ? 'Showing ' + visible + ' of ' + total + ' issues'
      : '';

    // GA4 search tracking — fires after 800ms of no typing
    clearTimeout(input._searchTimer);
    if (q.length >= 3) {
      input._searchTimer = setTimeout(function () {
        if (typeof gtag === 'function') {
          gtag('event', 'search', { search_term: q });
        }
      }, 800);
    }
  });
})();
