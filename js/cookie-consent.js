(function () {
  var STORAGE_KEY = 'catalyze_cookie_consent';

  function hasConsent() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch (err) {
      return false;
    }
  }

  function saveConsent() {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch (err) {
      /* private mode: banner may return on the next visit */
    }
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        functionality_storage: 'granted',
        security_storage: 'granted'
      });
    }
  }

  function hide(bar) {
    if (!bar || !bar.parentNode) return;
    bar.parentNode.removeChild(bar);
    document.body.classList.remove('has-cookie-consent');
  }

  function showBanner() {
    if (hasConsent() || document.getElementById('cookie-consent')) return;

    var bar = document.createElement('div');
    bar.id = 'cookie-consent';
    bar.className = 'cookie-consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie notice');
    bar.setAttribute('aria-describedby', 'cookie-consent-text');

    var text = document.createElement('p');
    text.id = 'cookie-consent-text';
    text.appendChild(document.createTextNode('This site uses cookies for analytics and security (reCAPTCHA). See '));

    var privacy = document.createElement('a');
    privacy.href = '/privacy';
    privacy.textContent = 'Privacy';
    text.appendChild(privacy);
    text.appendChild(document.createTextNode('.'));

    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'cookie-consent-accept';
    accept.textContent = 'Accept';

    accept.addEventListener('click', function () {
      saveConsent();
      hide(bar);
    });

    bar.appendChild(text);
    bar.appendChild(accept);
    document.body.appendChild(bar);
    document.body.classList.add('has-cookie-consent');
  }

  function start() {
    showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
