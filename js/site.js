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

  /* GA4 generate_lead fires only after Netlify confirms the submission.
     Forms post natively; Netlify redirects a successful submission to /thank-you
     (the form action). On submit we park the form details in sessionStorage, and
     the thank-you page sends the event once. A blocked, failed or rejected post
     never reaches /thank-you, so no event is sent. */
  var LEAD_KEY = 'cc_pending_lead';
  var LEAD_TTL_MS = 30 * 60 * 1000;
  var LEAD_LOCATIONS = {
    'demo-request': 'home_contact_cta',
    'paid-ads-inquiry': 'paid_ads_contact_cta',
    'seo-inquiry': 'seo_contact_cta',
    'referral-inquiry': 'referral_contact_cta',
    'agency-inquiry': 'agency_contact_cta',
    'digital-marketing-inquiry': 'digital_marketing_contact_cta'
  };

  function initLeadEvents() {
    /* Netlify strips data-netlify at deploy, so match on the form-name field it keeps. */
    document.querySelectorAll('form').forEach(function (form) {
      if (!form.querySelector('input[name="form-name"]')) return;
      var name = form.getAttribute('name') || '';
      if (name !== 'demo-request' && !/-inquiry$/.test(name)) return;
      form.addEventListener('submit', function () {
        var section = form.closest('section');
        var lead = {
          form_name: name,
          page_path: window.location.pathname,
          form_location: LEAD_LOCATIONS[name] || ((section && section.id ? section.id : 'page') + '_form'),
          t: Date.now()
        };
        try {
          window.sessionStorage.setItem(LEAD_KEY, JSON.stringify(lead));
        } catch (err) {
          /* storage blocked: no event, the submission itself is unaffected */
        }
      });
    });
  }

  function sendConfirmedLead() {
    if (!document.body || !document.body.hasAttribute('data-lead-success')) return;
    var raw = null;
    try {
      raw = window.sessionStorage.getItem(LEAD_KEY);
      window.sessionStorage.removeItem(LEAD_KEY);
    } catch (err) {
      return;
    }
    if (!raw) return;
    var lead;
    try {
      lead = JSON.parse(raw);
    } catch (err) {
      return;
    }
    if (!lead || !lead.form_name || !lead.t || Date.now() - lead.t > LEAD_TTL_MS) return;
    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', {
        form_name: lead.form_name,
        page_path: lead.page_path,
        form_location: lead.form_location
      });
    }
  }

  /* First-touch landing, referrer, and UTM/gclid capture for Netlify forms.
     sessionStorage only: no cookies, no third-party calls, no PHI.
     Values are written once per session and never overwritten. */
  var ATTR_KEY = 'cc_form_attr';
  var ATTR_FIELDS = [
    'first_landing_page',
    'first_referrer',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid'
  ];
  var ATTR_PARAMS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid'
  ];

  function readAttr() {
    try {
      var raw = window.sessionStorage.getItem(ATTR_KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      return data && typeof data === 'object' ? data : {};
    } catch (err) {
      return {};
    }
  }

  function writeAttr(data) {
    try {
      window.sessionStorage.setItem(ATTR_KEY, JSON.stringify(data));
    } catch (err) {
      /* storage blocked: forms still submit; attribution fields stay empty */
    }
  }

  function referrerOriginPath(ref) {
    if (!ref) return '';
    try {
      var url = new URL(ref);
      return url.origin + url.pathname;
    } catch (err) {
      return '';
    }
  }

  function captureAttr() {
    var data = readAttr();
    /* First pageview only. An empty referrer is stored so a later same-site
       document.referrer cannot overwrite it. Already-stored values are kept. */
    if (Object.prototype.hasOwnProperty.call(data, 'first_landing_page')) return;

    data.first_landing_page = window.location.pathname || '/';
    data.first_referrer = referrerOriginPath(document.referrer);
    var params = new URLSearchParams(window.location.search);
    ATTR_PARAMS.forEach(function (key) {
      if (!data[key]) {
        var val = params.get(key);
        if (val) data[key] = val;
      }
    });
    writeAttr(data);
  }

  function fillAttrForms() {
    var data = readAttr();
    document.querySelectorAll('form').forEach(function (form) {
      if (!form.querySelector('input[name="form-name"]')) return;
      ATTR_FIELDS.forEach(function (name) {
        var input = form.querySelector('input[name="' + name + '"]');
        if (input) input.value = data[name] || '';
      });
    });
  }

  function start() {
    initNav();
    captureAttr();
    fillAttrForms();
    initLeadEvents();
    sendConfirmedLead();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
