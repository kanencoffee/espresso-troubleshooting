(function() {
  function getClickType(url) {
    var path = url.pathname;

    if (url.protocol === 'tel:') return 'phone';
    if (url.protocol === 'mailto:') return 'email';
    if (url.hostname !== 'kanencoffee.com') return null;
    if (path === '/pages/book-appointment') return 'booking';
    if (path === '/pages/repairs') return 'repair_info';

    return 'store';
  }

  document.addEventListener('click', function(event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link || typeof gtag !== 'function') return;

    try {
      var url = new URL(link.href, window.location.href);
      var clickType = getClickType(url);
      if (!clickType) return;

      gtag('event', 'help_site_conversion_click', {
        event_category: 'help_site',
        event_label: link.textContent.trim().slice(0, 100),
        link_url: link.href,
        click_type: clickType
      });
    } catch (error) {}
  });
})();
