// Loads <div data-include="path.html"> placeholders by fetching the partial
// and replacing the placeholder with the fetched markup.
//
// Templating: any data-* attribute on the placeholder (other than data-include
// and data-svc-current) becomes a {{var}} substitution inside the partial.
// Example:
//   <div data-include="partials/cta-band.html"
//        data-title="Hello <span class='grad-text'>world</span>"></div>
// In partial: <h2>{{title}}</h2>  -->  <h2>Hello <span ...>world</span></h2>
//
// Filtering: data-svc-current="<slug>" on the placeholder removes any element
// inside the loaded partial that has [data-svc="<slug>"]. Used by the
// "Explore More Services" partial to hide the card for the current page.
//
// Exposes window.__partialsReady (a Promise) so main.js can wait before
// binding to elements that live inside the injected markup.
(function () {
  function currentPage() {
    var p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return p === '' ? 'index.html' : p;
  }

  function applyVars(html, el) {
    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (attr.name.indexOf('data-') !== 0) continue;
      if (attr.name === 'data-include' || attr.name === 'data-svc-current') continue;
      var key = attr.name.slice(5); // strip "data-"
      html = html.split('{{' + key + '}}').join(attr.value);
    }
    return html;
  }

  async function loadPartials() {
    var placeholders = document.querySelectorAll('[data-include]');

    await Promise.all(
      Array.prototype.map.call(placeholders, async function (el) {
        var url = el.getAttribute('data-include');
        try {
          var res = await fetch(url);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          var html = await res.text();
          html = applyVars(html, el);

          var tmp = document.createElement('div');
          tmp.innerHTML = html;

          var current = el.getAttribute('data-svc-current');
          if (current) {
            tmp.querySelectorAll('[data-svc="' + current + '"]').forEach(function (n) {
              n.remove();
            });
          }

          var parent = el.parentNode;
          while (tmp.firstChild) {
            parent.insertBefore(tmp.firstChild, el);
          }
          parent.removeChild(el);
        } catch (err) {
          console.error('[includes] Failed to load partial:', url, err);
        }
      })
    );

    var page = currentPage();

    // When already on index.html, strip the "index.html" prefix from in-page
    // hash links so Lenis smooth-scrolls them (it only matches href^="#").
    if (page === 'index.html') {
      document.querySelectorAll('a[href^="index.html#"]').forEach(function (a) {
        a.setAttribute('href', a.getAttribute('href').slice('index.html'.length));
      });
    }

    // Mark the active nav item(s) declared via data-active-on="page1.html page2.html"
    document.querySelectorAll('[data-active-on]').forEach(function (el) {
      var matches = el.getAttribute('data-active-on').toLowerCase().split(/\s+/);
      if (matches.indexOf(page) === -1) return;

      el.classList.add('active');

      // Dropdown items: swap hover styling for the brand-orange active styling
      // used in the existing service pages.
      if (el.tagName === 'A' && el.closest('ul')) {
        el.classList.remove(
          'text-navy-900',
          'hover:bg-navy-50',
          'hover:text-brand-orange'
        );
        el.classList.add('text-brand-orange', 'bg-navy-50/70');
      }
    });

    // Render Lucide icons that were just injected.
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  window.__partialsReady = loadPartials();
})();
