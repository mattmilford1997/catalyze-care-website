(function () {
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.getElementById('primary-nav') || document.querySelector('.nav-links');
    if (!toggle || !links) return;
    if (!links.id) links.id = 'primary-nav';
    toggle.setAttribute('aria-controls', links.id);

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      links.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        setOpen(false);
      });
    });

    window.addEventListener('resize', function () {
      if (window.matchMedia('(min-width: 901px)').matches) setOpen(false);
    });
  }

  function initLeadEvents() {
    document.querySelectorAll('form[data-netlify="true"]').forEach(function (form) {
      var name = form.getAttribute('name') || '';
      if (name !== 'demo-request' && !/-inquiry$/.test(name)) return;
      form.addEventListener('submit', function () {
        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', { form_name: name });
        }
      });
    });
  }

  function start() {
    initNav();
    initLeadEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
