// Global ABA PayWay Mobile & Desktop Bridge
(function () {
  'use strict';

  // Mobile Bottom Sheet Helper Bridges required by ABA PayWay checkout.prod.js on mobile devices
  window.abaCheckoutSetSheetHeight = window.abaCheckoutSetSheetHeight || function (val) {
    try {
      var contents = document.querySelector('#aba_checkout_sheet .aba_checkout_contents');
      if (contents) contents.style.height = (val || 520) + 'px';
    } catch (e) {}
  };

  window.abaCheckoutSetIsSheetShown = window.abaCheckoutSetIsSheetShown || function (val) {
    try {
      var sheet = document.getElementById('aba_checkout_sheet');
      if (sheet) {
        sheet.setAttribute('aria-hidden', String(!val));
        sheet.style.display = val ? 'flex' : 'none';
      }
    } catch (e) {}
  };

  function bridgePayway() {
    try {
      if (typeof AbaPayway !== 'undefined' && AbaPayway) {
        window.AbaPayway = AbaPayway;
        return true;
      }
    } catch (e) {}
    return false;
  }

  // Intercept ABA PayWay postMessage to safely normalize continue_success_url (merchantUrl)
  // preventing browser DNS ERR_NAME_NOT_RESOLVED if a Base64 encoded string is received
  window.addEventListener('message', function (e) {
    try {
      if (e.data && typeof e.data === 'object' && e.data.merchantUrl) {
        var raw = String(e.data.merchantUrl).trim();
        // If it was Base64 encoded (e.g. aHR0cHM6Ly9tbGJiLXRvcHVw...)
        if (/^[A-Za-z0-9+/=]+$/.test(raw) && !raw.startsWith('http://') && !raw.startsWith('https://')) {
          try {
            var decoded = atob(raw);
            if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
              raw = decoded;
            }
          } catch (err) {}
        }

        // Keep customer on current site's /topup (or decoded path)
        try {
          var parsedUrl = new URL(raw, window.location.origin);
          e.data.merchantUrl = window.location.origin + (parsedUrl.pathname || '/topup') + (parsedUrl.search || '');
        } catch (err) {
          e.data.merchantUrl = window.location.origin + '/topup';
        }
      }
    } catch (ex) {}
  }, true);

  bridgePayway();
  var timer = setInterval(function () {
    if (bridgePayway()) {
      clearInterval(timer);
    }
  }, 100);
  setTimeout(function () {
    clearInterval(timer);
  }, 10000);
})();
