function abaCheckoutInclude(file) {
  var script = document.createElement('script')
  script.src = file
  script.type = 'text/javascript'
  script.defer = true

  document.head.appendChild(script)
}

// url production
const _aba_checkout_baseUrl = 'https://checkout.payway.com.kh'

let _aba_checkout_src = document.currentScript.src

let _aba_checkout_params = new URL(_aba_checkout_src).searchParams

var _aba_checkout_noCatch = 168 //+new Date();

if (_aba_checkout_params.get('hide-close') === '1' || _aba_checkout_params.get('hide-close') === '2') {
  _aba_checkout_params = `?n=${_aba_checkout_noCatch}&hide-close=${_aba_checkout_params.get('hide-close')}`
} else {
  _aba_checkout_params = `?n=${_aba_checkout_noCatch}`
}

/* Include Many js files */
abaCheckoutInclude(`${_aba_checkout_baseUrl}/plugins/bs.js`)
abaCheckoutInclude(`${_aba_checkout_baseUrl}/plugins/bridge.js`)
setTimeout(() => {
  abaCheckoutInclude(`${_aba_checkout_baseUrl}/plugins/checkout.prod.js${_aba_checkout_params}`)
}, 1000)
