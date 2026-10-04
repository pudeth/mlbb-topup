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
