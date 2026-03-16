(function () {
  var input = document.getElementById('issue-search');
  var countEl = document.getElementById('search-count');
  if (!input) return;

  var items = Array.from(document.querySelectorAll('.faq-item'));
  var total = items.length;
  var quickNav = document.querySelector('.quick-nav');
  var heroImage = document.querySelector('.hero-image');
  var faqSection = document.getElementById('faq');

  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();
    var visible = 0;

    // Hide/show the Quick Problem Finder and hero when searching
    if (quickNav) quickNav.style.display = q ? 'none' : '';
    if (heroImage) heroImage.style.display = q ? 'none' : '';

    items.forEach(function (item) {
      var text = item.textContent.toLowerCase();
      var match = !q || text.indexOf(q) !== -1;
      item.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    countEl.textContent = q ? 'Showing ' + visible + ' of ' + total + ' issues' : '';

    // Scroll to FAQ section when search starts
    if (q && faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

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
