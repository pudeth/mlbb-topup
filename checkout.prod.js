'use strict'

const _abaCheckoutStyle = document.createElement('style')
_abaCheckoutStyle.innerHTML =
  '.aba-checkout-desktop { position: fixed; top: 0; right: 0; bottom: 0; left: 0; overflow: auto; background: #081b3787; z-index: 99999; animation-name: modalAbaCheckout; animation-duration: 0.5s } .aba-checkout-desktop .aba-checkout-content .aba-close-button{ cursor: pointer; right: 24px; position: absolute; top: 34px; width: 12px !important; } .aba-checkout-desktop .aba-checkout-content { min-height: 264px; padding: 0px;  position: absolute; left: 0; width: 391px; border-radius: 12px; margin: 0 auto; right: 0; } @keyframes modalAbaCheckout { 0% { display: none; opacity: 0; } 100% { display: block; opacity: 1; } }' +
  '.aba-checkout-desktop .aba-checkout-modal-container {min-height: 100vh; display: flex; align-items: center; justify-content: center;}' +
  '.aba-checkout-mobile {position: absolute; width: 100%; top: -3px; border-top-left-radius: 23px; border-top-right-radius: 23px;}' +
  // "#aba_webservice_loading {position: absolute; height: 91%; top: 20px; right: 0; bottom: 0; left: 0; background: #fff; border-radius: 12px;} #aba_webservice_loading #aba_webservice_loader { left: 50%; margin-left: -4em; font-size: 10px; border: .8em solid rgba(218, 219, 223, 1); border-left: .8em solid rgba(58, 166, 165, 1); animation: abaSpin 1.1s infinite linear; } #aba_webservice_loading #aba_webservice_loader, #aba_webservice_loading #aba_webservice_loader:after { border-radius: 50%; width: 8em; height: 8em; display: block; position: absolute; top: 45%; margin-top: -4.05em; } @keyframes abaSpin { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }" +
  '#aba_webservice_loading {position: absolute; height: 91%; top: 20px; right: 0; bottom: 0; left: 0; background: #fff; border-radius: 12px;}' +
  '#aba_webservice_loading .loading-icon { width: 40px; left: 0; right: 0; position: absolute; margin: 0 auto; top: 40%; -webkit-animation: spin 1s linear infinite; animation: spin 1s linear infinite; } @-webkit-keyframes spin { 0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); } } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }' +
  '.cupertino-pane-wrapper {z-index: 2147483647;} .cupertino-pane-wrapper .draggable {height:10px;}' +
  '.aba-checkout-payment-options_item { cursor: pointer; position: relative; display: flex; margin-bottom: 10px; padding: 12px 30px; border-radius: 12px; box-shadow: 0 1px 4px rgb(183 190 203 / 36%); background: #fff; }' +
  '.aba-checkout-payment-options_logo {margin-right: 15px; width: 51px; height: 41px;}' +
  // ".aba-checkout-payment-options .item .arrow-right { width: 24px; height: 24px; background: #f2f3f7; border-radius: 4px; display: flex; justify-content: center; align-items: center; position: absolute; right: 15px; top: 20px; }" +
  '.aba-checkout-payment-options_left-radio { display: flex; justify-content: center; align-items: center; position: absolute; left: 5px; top: 23px; }' +
  '.aba-checkout-payment-options_title {font-weight: 400; color: #4a4a4a; font-size: 16px; font-family: sans-serif; margin: 0; margin-top: 12px;}' +
  '.aba-checkout-payment-options_sub_title {color: #8a8a8a; font-size: 13px; font-family: sans-serif; padding: 0; margin: 0;}' +
  '.aba-checkout-payment-options_btn_checkout_now {font-size: 15px; color: #fff; padding: 10px; width: fit-content; border-radius: 5px; font-family: sans-serif; background: #055E7C; cursor: pointer;}' +
  '.aba-checkout-payment-options_btn_checkout_now:hover {background: #055e7cd4 }' +
  ".aba_checkout_column { display: flex; flex-direction: column; } .aba_checkout_column.aba_checkout_items_center { align-items: center; } .aba_checkout_column.justify-center { justify-content: center; } .aba_checkout_column.aba_checkout_justify_end { justify-content: flex-end; } #aba_checkout_sheet { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999999; visibility: visible; transition: opacity 0.5s, visibility 0.5s; } #aba_checkout_sheet[aria-hidden='true'] { opacity: 0; visibility: hidden; pointer-events: none; } #aba_checkout_sheet .aba_checkout_overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: -1; background: #888; opacity: 0.5; } #aba_checkout_sheet .aba_checkout_contents { border-radius: 16px 16px 0 0; width: 100%; background: #fff; position: relative; overflow-y: inherit; transition:transform 0.5s, border-radius 0.5s; transform: translateY(0); max-height: 100vh; height: 0px; max-width: 70rem; box-sizing: border-box; } #aba_checkout_sheet .aba_checkout_contents:not(.not-selectable) { transition: transform 0.5s, border-radius 0.5s, height 0.5s; } #aba_checkout_sheet[aria-hidden='true'] .aba_checkout_contents { transform: translateY(100%); } #aba_checkout_sheet .aba_checkout_draggable_area { z-index: 100; position: relative; top: -3px; left: 0; right: 0; margin: auto; padding: 1rem; cursor: grab; width: 80%; padding-top: 14px; } #aba_checkout_sheet .aba_checkout_draggable-thumb { width: 44px; height: 4px; background: #dcdcdc; border-radius: 2px; position: absolute; margin: 0 auto; left: 0; right: 0; } #aba_checkout_sheet .close-sheet { position: absolute; right: 0; top: 0; border: none; } #aba_checkout_sheet .body { height: 100%; overflow-y: auto; gap: 1rem; }" +
  // mini app
  '#aba_checkout_open_exit_modal_mini_app {z-index: 99999999999999; width: 100%; height: 100%; position: fixed; visibility: visible; display: block; background-color: rgba(22,22,22,0.7); top: 0; left: 0; right: 0; bottom: 0; } #aba_checkout_close_exit_modal_mini_app { visibility: hidden; display: none; } .aba_checkout_open_mini_app { background: #fffffff7; margin: 0 auto; position: relative; z-index: 41; top: 25%; padding: 0; border-radius: 20px; width: 70%; height: 140px; } .aba_checkout_open_mini_app .merchant_name{ text-align: center; margin-bottom: -8px; padding: 15px; padding-top: 23px; font-size: 18px; font-weight: bold; } .aba_checkout_open_mini_app .msg_title{ text-align: center; margin-top: 0px; font-size: 12px; } .aba_checkout_open_mini_app .footer { display: flex; justify-content: center; align-items: center; position: absolute; width: 100%; bottom: 0; } .aba_checkout_open_mini_app .footer div { width: 50%; text-align: center; border: 1px solid #f1f1f1; border-left: 0; border-bottom: 0; height: 41px; font-weight: bold; padding-top: 9px; font-size: 14px; } .aba_checkout_open_mini_app .footer div:last-child { border-right: 0; color: red; }' +
  '.aba_checkout_column_header {padding: 0 !important; left: 0 !important; right: 0 !important; background: none !important; border: 0 !important; display: block !important;}'
// end mini app
const _abaCheckoutStyleRef = document.querySelector('script')
_abaCheckoutStyleRef.parentNode.insertBefore(_abaCheckoutStyle, _abaCheckoutStyleRef)

// helper with _ prefixs
function _abaCheckoutDevExisting(id) {
  const element = document.getElementById(id)
  return element
}
function _abaCheckoutDevExistingSelector(id) {
  const element = document.querySelector(id)
  return element
}

const _abaCheckoutUserAgent = navigator.userAgent.toLowerCase()
// const _abaCheckoutCheckAbaMobile = _abaCheckoutUserAgent.includes("mobile");
const _abaCheckoutCheckAbaMobile = _abaCheckoutUserAgent.includes('abamobile')

// initial bridge mini app
let $bridge = {}
try {
  $bridge = new VueJsBridgePlugin()
} catch (e) {
  $bridge = {}
}

// helper check device
function _abaCheckoutIsMobile() {
  const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPod/i, /BlackBerry/i, /Windows Phone/i]

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem)
  })
}

// send google token to gpay (webview)
function doPaymentFromMobile(data) {
  const iframeGPay = document.getElementById('aba_webservice')
  iframeGPay.contentWindow.postMessage({ gpay_token: data }, '*')
}
// end send google token to gpay

function _abaCheckoutHTTP(url, req) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response)
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        })
      }
    }
    xhr.onerror = function () {
      reject({
        status: xhr.status,
        statusText: xhr.statusText,
      })
    }

    xhr.send(JSON.stringify(req))
  })
}

// end helper

let _abaCheckoutCurrentScript = document.currentScript.src
let _abaCheckoutCloseParam = new URL(_abaCheckoutCurrentScript).searchParams
const _abaCheckoutIsHideClose = _abaCheckoutCloseParam.get('hide-close')

// generate container checkout
const _abaCheckoutExistAbaCheckout = _abaCheckoutDevExisting('aba-checkout')
if (_abaCheckoutExistAbaCheckout) {
  _abaCheckoutExistAbaCheckout.remove()
}
document.body.insertAdjacentHTML('beforeend', '<div id="aba-checkout"></div>')
// end genreate container checkout

// google analytic
;(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r
  ;((i[r] =
    i[r] ||
    function () {
      ;(i[r].q = i[r].q || []).push(arguments)
    }),
    (i[r].l = 1 * new Date()))
  ;((a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]))
  a.async = 1
  a.src = g
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga')

function createTracker(gaKey) {
  var fields = {
    title: `Payway - ${gaKey.page}`,
    page: `/${gaKey.page}`,
  }

  ga('create', gaKey.ua, 'auto', fields)
  // Google’s sample doesn’t do anything with the tracker
  // once created, but presumably you will want to send either a
  // GA pageview or event, like I have here.
  ga('send', 'pageview', fields)
}
// end google analytic

// mini app callback profile
let _abaCallbackOnGetProfileMiniApp = function () {}

let _abaCallbackOnSuccess = function () {}
let _abaCallbackOnError = function () {}
let _abaCheckoutIsAbapay = false
let _abaCheckoutIsAbapayKhqr = false
class AbaPay {
  // generate ui of select payment option
  async checkoutPaymentOptionUI(req) {
    console.log(req)
    const res = await _abaCheckoutHTTP(req)
    console.log(res)
    const checkoutPaymentOptionUI = _abaCheckoutDevExisting('checkoutPaymentOptionUI')
    if (checkoutPaymentOptionUI) {
      checkoutPaymentOptionUI.insertAdjacentHTML(
        'beforeend',
        `
        <div class="aba-checkout-payment-options">
        <ul style="list-style: none; padding: 0;">
         <label>
            <li class="aba-checkout-payment-options_item"> 
            <div class="aba-checkout-payment-options_left-radio"><input type="radio" name="aba_checkout_payment_option" value="abapay"></div>
            <img class="aba-checkout-payment-options_logo" src="https://checkout.payway.com.kh/images/aba-pay.svg"/>
            <div>
                <p class="aba-checkout-payment-options_title">ABA PAY</p>
            </div>
            </li>
          </label>
          <label>
            <li class="aba-checkout-payment-options_item">
              <div class="aba-checkout-payment-options_left-radio"><input type="radio" name="aba_checkout_payment_option" value="cards"></div>
              <img class="aba-checkout-payment-options_logo" src="https://checkout.payway.com.kh/images/credit-card.svg"/>
              <div>
                  <p class="aba-checkout-payment-options_title">Card Payment</p>
              </div>
            </li> 
          </label>
        </ul>
        `,
      )
    }
  }
  // end generate ui of select payment option

  // generate form
  setupForm(data) {
    const existAbaCheckoutForm = _abaCheckoutDevExisting('aba_merchant_request')
    if (existAbaCheckoutForm) {
      existAbaCheckoutForm.remove()
    }

    document.body.insertAdjacentHTML(
      'beforeend',
      `<form style="display:none;" method="POST" action="${data.form_url}" target="aba_webservice" id="aba_merchant_request"></form>`,
    )

    delete data.form_url

    const abaCheckoutMerchantRequest = document.getElementById('aba_merchant_request')

    let setPaymentOption = false
    Object.keys(data).forEach((key) => {
      if (key !== 'payment_option' || (key === 'payment_option' && data[key] !== '')) {
        abaCheckoutMerchantRequest.insertAdjacentHTML('beforeend', `<input type='hidden' name='${key}' value='${data[key]}'/>`)
      } else {
        setPaymentOption = true
      }
    })

    if (typeof data['payment_option'] === 'undefined' || setPaymentOption) {
      let paymentOptionValue = document.querySelector('input[name="aba_checkout_payment_option"]:checked')
      if (paymentOptionValue) {
        paymentOptionValue = paymentOptionValue.value

        abaCheckoutMerchantRequest.insertAdjacentHTML(
          'beforeend',
          `<input type='text' name='payment_option' value='${paymentOptionValue}'/>`,
        )
      }
    }

    // end genreate form
  }

  checkout(data = {}) {
    const _abaCheckoutForm = document.getElementById('aba_merchant_request')

    if (Object.keys(data).length > 0) {
      this.setupForm(data)

      _abaCallbackOnSuccess = data.onSuccess
      _abaCallbackOnError = data.onError
    }

    //  append an input for check type of using plugin
    let el = document.createElement('input')
    el.setAttribute('type', 'hidden')
    el.setAttribute('value', 'true')
    el.setAttribute('name', 'is_plugin_js')
    let addInput = document.getElementById('aba_merchant_request')
    addInput.appendChild(el)
    //  end append an input for check type of using plugin

    // mini app
    try {
      if (_abaCheckoutForm.querySelector('input[name=payment_option]') !== null) {
        _abaCheckoutIsAbapay = _abaCheckoutForm.querySelector('input[name=payment_option]').value === 'abapay'
        _abaCheckoutIsAbapayKhqr = _abaCheckoutForm.querySelector('input[name=payment_option]').value === 'abapay_khqr'
      }
    } catch (e) {}

    if (_abaCheckoutCheckAbaMobile && (_abaCheckoutIsAbapay || _abaCheckoutIsAbapayKhqr)) {
      // check bridge to mini app for abapay

      let _abaCheckoutFormUrl = _abaCheckoutForm.action

      _abaCheckoutFormUrl = new URL(_abaCheckoutFormUrl)

      _abaCheckoutFormUrl = `${_abaCheckoutFormUrl.origin}/api/mini-app/v1/payments/initial`

      const _abaCheckoutFormReq = []
      var _form_mini_app = _abaCheckoutForm
      for (let i_mini_app = 0; i_mini_app < _form_mini_app.length; i_mini_app++) {
        const name = _form_mini_app[i_mini_app].getAttribute('name')
        const value = _form_mini_app[i_mini_app].value
        _abaCheckoutFormReq[name] = value
      }

      _abaCheckoutFormReq['mini_app'] = true
      _abaCheckoutHTTP(_abaCheckoutFormUrl, Object.assign({}, _abaCheckoutFormReq))
        .then(function (res) {
          const _res = JSON.parse(res)

          //setup setting
          const _abaCheckoutMiniAppSetting = _abaCheckoutDevExisting('aba_checkout_miniapp_setting')
          if (_abaCheckoutMiniAppSetting) {
            _abaCheckoutMiniAppSetting.remove()
          }
          const abaCheckoutSettingData = `${_res.skip_success_screen}***${_res.continue_success_url}`
          document.body.insertAdjacentHTML(
            'beforeend',
            `<input value="${abaCheckoutSettingData}" type="hidden" id="aba_checkout_miniapp_setting"></input>`,
          )
          // end setuup setting

          $bridge
            .callHandler('doPayment', {
              amount: _res.amount,
              account: _abaCheckoutFormReq['tran_id'],
              currency: _res.currency,
              useDefault: false,
              uniqueId: _res.pw_key,
            })
            .catch((e) => {
              // handle error
              console.log(e)
            })
        })
        .catch((e) => {
          console.log(e)
        })
    } else {
      this.initPlugin('aba_merchant_request')
    }

    // end mini app
  }

  addCard() {
    this.initPlugin('aba_merchant_add_card')
  }

  addAccount = function () {
    this.initPluginAddAccount()
  }

  miniApp(data = {}) {
    if (_abaCheckoutCheckAbaMobile) {
      if (Object.keys(data).length > 0) {
        // add mini app exit modal

        if (data.useExitApp !== false) {
          window.document.body.insertAdjacentHTML(
            'afterbegin',
            '<div id="aba_checkout_close_exit_modal_mini_app"> <div class="aba_checkout_open_mini_app"> <h3 class="merchant_name">' +
              data.merchantName +
              '</h3> <p class="msg_title"> Do you want to quit? </p> <div class="footer"> <div onclick="AbaPayway.exitModalMiniApp(false)"> Cancel </div> <div class="btn_close" onclick="AbaPayway.exitModalMiniApp(true)"> Confirm </div> </div> </div>',
          )
        } else {
          window.document.body.insertAdjacentHTML(
            'afterbegin',
            `<input type="hidden" id="aba_payway_mini_app_req" value='${JSON.stringify(data)}'/>`,
          )
        }

        // set top bar styling
        $bridge
          .callHandler('setBarTitle', {
            title: data.barTitle.title,
            bgColor: data.barTitle.bgColor,
            color: data.barTitle.color,
            safeAreaColor: data.barTitle.safeAreaColor,
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
  }
  miniAppGetProfile(data = {}) {
    if (_abaCheckoutCheckAbaMobile) {
      if (Object.keys(data).length > 0) {
        _abaCallbackOnGetProfileMiniApp = data.callback
        $bridge
          .callHandler('getProfile', {})
          .then((res) => {
            _abaCallbackOnGetProfileMiniApp(res)
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
  }

  miniAppRegisterHandler(handlerName, param = {}) {
    return new Promise((resolve, reject) => {
      $bridge.registerHandler(handlerName, (res) => {
        resolve(res)
      })
    })
  }

  miniAppCallHandler(handlerName, param = {}) {
    return new Promise((resolve, reject) => {
      $bridge
        .callHandler(handlerName, param)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  miniAppExit() {
    document.body.style.overflowY = 'hidden' // disable scroll body
    const abaCheckoutExitModalMiniApp = document.getElementById('aba_checkout_close_exit_modal_mini_app')
    abaCheckoutExitModalMiniApp.id = 'aba_checkout_open_exit_modal_mini_app'
  }

  initPlugin(initType, param = null) {
    document.body.style.overflowY = 'hidden' // disable scroll body

    const abaCheckout = document.getElementById('aba-checkout')

    if (initType === 'mini_app_success') {
      const abaCheckout = document.getElementById('aba_checkout_app')

      setTimeout(() => {
        // call BS
        document.getElementById('aba_checkout_sheet').style.display = 'flex'
        setTimeout(() => {
          abaCheckoutSetSheetHeight(480)
          abaCheckoutSetIsSheetShown(true)
        }, 1000)
        // end call BS

        abaCheckout.classList.add('aba-checkout-mobile')

        // add loading for mobile
        abaCheckout.insertAdjacentHTML(
          'beforeend',
          `<div id="aba_webservice_loading"> 
                <img src="${_aba_checkout_baseUrl}/images/loading.svg" class="loading-icon"/>
                </div>`,
        )

        abaCheckout.insertAdjacentHTML(
          'beforeend',
          `<img style="position: fixed; top: -30px; margin: 0 auto; right: 20px; width: 118px !important;" src="${_aba_checkout_baseUrl}/images/payway-logo-white.svg"/>`,
        )

        let _abaCheckoutMiniAppFormUrl = document.getElementById('aba_merchant_request').action
        _abaCheckoutMiniAppFormUrl = new URL(_abaCheckoutMiniAppFormUrl)

        abaCheckout.insertAdjacentHTML(
          'beforeend',
          `<iframe allow="payment *" frameborder="0" width="100%" height="485" style="border-radius: 16px 16px 0px 0px;" scrolling="yes" src="${_abaCheckoutMiniAppFormUrl.origin}/app-success/?id=${param.uniqueId}" name="aba_webservice" id="aba_webservice"></iframe>`,
        )
      }, 300)
    } else if (_abaCheckoutIsMobile()) {
      const abaCheckout = document.getElementById('aba_checkout_app')

      setTimeout(() => {
        // call BS
        document.getElementById('aba_checkout_sheet').style.display = 'flex'
        setTimeout(() => {
          const sheetHeight = _abaCheckoutIsAbapay || _abaCheckoutIsAbapayKhqr ? 500 : 400
          abaCheckoutSetSheetHeight(sheetHeight)
          abaCheckoutSetIsSheetShown(true)
        }, 1000)
        // end call BS

        abaCheckout.classList.add('aba-checkout-mobile')

        // remove previouse request
        const existAbaCheckoutIframe = _abaCheckoutDevExisting('aba_webservice')
        if (existAbaCheckoutIframe) {
          existAbaCheckoutIframe.remove()

          const existAbaCheckoutLoading = _abaCheckoutDevExisting('aba_webservice_loading')
          if (existAbaCheckoutLoading) {
            existAbaCheckoutLoading.remove()
          }
        }
        // end remove previouse request

        // add loading for mobile
        // abaCheckout.insertAdjacentHTML(
        //   "beforeend",
        //   `<div id="aba_webservice_loading">
        //         <img src="${_aba_checkout_baseUrl}/images/loading.svg" class="loading-icon"/>
        //         </div>`
        // );

        abaCheckout.insertAdjacentHTML(
          'beforeend',
          `<img style="position: fixed; top: -30px; margin: 0 auto; right: 20px; width: 118px !important;" src="${_aba_checkout_baseUrl}/images/payway-logo-white.svg"/>`,
        )
        abaCheckout.insertAdjacentHTML(
          'beforeend',
          `<iframe allow="payment *" frameborder="0" width="100%" height="416" style="border-radius: 16px 16px 0px 0px;" scrolling="yes" src="" name="aba_webservice" id="aba_webservice"></iframe>`,
        )

        document.getElementById(initType).submit()
      }, 300)
    } else {
      const abaCheckout = document.getElementById('aba-checkout')

      // for desktop
      abaCheckout.classList.add('aba-checkout-desktop')

      abaCheckout.insertAdjacentHTML(
        'beforeend',
        `<div class='aba-checkout-modal-container'>
                    <div class='aba-checkout-content'>
                        <div id='aba_webservice_loading'> <img src="${_aba_checkout_baseUrl}/images/loading.svg" class="loading-icon"/> </div>
                    </div>
                </div>`,
      )

      const abaCheckoutContent = document.querySelector('.aba-checkout-content')

      abaCheckoutContent.insertAdjacentHTML(
        'beforeend',
        `<img style="right: 0; z-index: 100; position: absolute; top: -30px; width: 118px !important;" src="${_aba_checkout_baseUrl}/images/payway-logo-white.svg"/>`,
      )

      if (_abaCheckoutIsHideClose !== '1') {
        abaCheckoutContent.insertAdjacentHTML(
          'beforeend',
          `<img class='aba-close-button' onclick='AbaPayway.closeCheckout(true)' src='${_aba_checkout_baseUrl}/images/checkout_cross.svg'/>`,
        )
      }

      abaCheckout.style.display = 'block'

      abaCheckoutContent.insertAdjacentHTML(
        'beforeend',
        `<iframe allow="payment *" style="border-radius: 12px; background: #fff;transition: height 0.25s;overflow: hidden; max-height: 595px;" frameborder="0" width="100%" height="264" scrolling="yes" src="" name="aba_webservice" id="aba_webservice"></iframe>`,
      )

      document.getElementById(initType).submit()
    }
  }

  // for add account blank modal
  initPluginAddAccount() {
    const abaCheckout = document.getElementById('aba-checkout')

    abaCheckout.classList.add('aba-checkout-desktop')

    abaCheckout.insertAdjacentHTML(
      'beforeend',
      "<div class='aba-checkout-modal-container'><div class='aba-checkout-content'><div id='aba_webservice_loading'> <div id='aba_webservice_loader'></div> </div></div></div>",
    )

    const abaCheckoutContent = document.querySelector('.aba-checkout-content')

    abaCheckoutContent.insertAdjacentHTML(
      'beforeend',
      `<img style="right: 0; z-index: 100; position: absolute; top: -40px; width: 118px !important;" src="${_aba_checkout_baseUrl}/images/payway-logo-white.svg"/><img class='aba-close-button' onclick='AbaPayway.closeCheckout(true)' src='${_aba_checkout_baseUrl}/images/checkout_cross.svg'/>`,
    )

    abaCheckout.style.display = 'block'
  }

  // close modal on desktop style
  closeCheckout(isAsk) {
    if (isAsk) {
      if (confirm('Are you sure you want to close?')) {
        var existCancelUrl =
          document.getElementById('payway_cancel_url')?.value === undefined ? '' : document.getElementById('payway_cancel_url').value

        if (existCancelUrl !== '') {
          location.href = existCancelUrl
          document.getElementById('aba-checkout').style.display = 'none'
          document.getElementById('aba-checkout').innerHTML = ''
          document.body.style.overflowY = 'visible' // enable scroll body
        } else if (_abaCheckoutIsHideClose === '2') {
          document.getElementById('aba-checkout').style.display = 'none'
          document.getElementById('aba-checkout').innerHTML = ''
          document.body.style.overflowY = 'visible' // enable scroll body

          const existAbaCheckoutForm = _abaCheckoutDevExisting('aba_merchant_request')
          if (existAbaCheckoutForm) {
            // existAbaCheckoutForm.remove();
          }
        } else {
          location.reload()
        }
      }
    } else {
      location.reload()
      document.getElementById('aba-checkout').style.display = 'none'
      document.getElementById('aba-checkout').innerHTML = ''
      document.body.style.overflowY = 'visible' // enable scroll body
    }
  }

  // close by continue url = ''
  closeCheckoutByContinueUrl() {
    if (_abaCheckoutIsMobile()) {
      _abaCheckoutDestroyDrawer()
    } else {
      document.getElementById('aba-checkout').classList.remove('aba-checkout-desktop')
      document.body.style.overflowY = 'visible'
      document.getElementById('aba-checkout').innerHTML = ''
    }
  }

  // mini  app close  exit modal
  exitModalMiniApp(isExit) {
    if (isExit) {
      $bridge.callHandler('closeApp').catch((e) => {
        console.log(e)
      })
    } else {
      document.body.style.overflowY = 'visible' // enable scroll body
      const abaCheckoutExitModalMiniApp = document.getElementById('aba_checkout_open_exit_modal_mini_app')
      abaCheckoutExitModalMiniApp.id = 'aba_checkout_close_exit_modal_mini_app'
    }
  }

  // merchant telegram mini app url decoder
  getLink(url) {
    try {
      const urlObj = new URL(url)
      const urlPathName = decodeURIComponent(urlObj.pathname.substring(1))

      const objLink = JSON.parse(atob(urlPathName))
      delete objLink.render_qr_page

      const base64String = btoa(JSON.stringify(objLink))

      return `${urlObj.origin}/${base64String}`
    } catch (error) {
      console.error('Invalid URL or malformed data:', error)
      return null
    }
  }
}

// close cupertinoPane on mobile
function _abaCheckoutDestroyDrawer() {
  document.getElementById('aba-checkout').innerHTML = ''
  document.body.style.overflowY = 'visible' // enable scroll body

  abaCheckoutSetIsSheetShown(false)

  var existCancelUrl = document.getElementById('payway_cancel_url')
  if (existCancelUrl) {
    location.href = existCancelUrl.value
  }
}

const AbaPayway = new AbaPay()

// mini app check status
if (_abaCheckoutCheckAbaMobile) {
  $bridge.registerHandler('getStatus', (data) => {
    const abaCheckoutMiniAppSetting = document.getElementById('aba_checkout_miniapp_setting').value
    const abaCheckoutMiniAppSettingData = abaCheckoutMiniAppSetting.split('***')
    const skipSuccessScreen = abaCheckoutMiniAppSettingData[0]
    const continueScuessUrl = abaCheckoutMiniAppSettingData[1]
    if (skipSuccessScreen === '0') {
      AbaPayway.initPlugin('mini_app_success', data)
    } else {
      location.href = continueScuessUrl
    }
  })
}

// mini app check exit app
if (_abaCheckoutCheckAbaMobile) {
  $bridge.registerHandler('closeApp', (data, callback) => {
    let abaPaywayMiniAppReqUseExitApp = true
    const abaPaywayMiniAppReq = _abaCheckoutDevExisting('aba_payway_mini_app_req')
    if (abaPaywayMiniAppReq) {
      abaPaywayMiniAppReqUseExitApp = JSON.parse(abaPaywayMiniAppReq.value).useExitApp
    }

    if (abaPaywayMiniAppReqUseExitApp !== false) {
      document.body.style.overflowY = 'hidden' // disable scroll body
      const abaCheckoutExitModalMiniApp = document.getElementById('aba_checkout_close_exit_modal_mini_app')
      abaCheckoutExitModalMiniApp.id = 'aba_checkout_open_exit_modal_mini_app'
    }
  })
}

// listen the child in iframe
window.onmessage = (e) => {
  const resData = e.data

  // google analytic
  if (resData.hasOwnProperty('ga')) {
    var ga = { ua: resData.ua, page: resData.page }
    createTracker(ga)
  }
  // end google analytic

  // remove close button  when  success screen shown autoredirect === 0
  if (resData.hasOwnProperty('close')) {
    if (_abaCheckoutIsMobile()) {
      _abaCheckoutDestroyDrawer()
    } else {
      AbaPayway.closeCheckout(false) // close modal is false to none propmt asking
    }
  }

  // close when  click on invalid screens
  if (resData.hasOwnProperty('removeClose')) {
    var closeBtn = document.querySelector('.aba-close-button')
    if (closeBtn) {
      closeBtn.remove()
    }
  }

  if (resData.hasOwnProperty('cancel_url')) {
    // set cancel url to input to handle close modal behavior
    document
      .getElementById('aba-checkout')
      .insertAdjacentHTML('beforeend', `<input type="hidden" value="${resData.cancel_url}" id="payway_cancel_url"/>`)
  }

  if (resData.hasOwnProperty('openApp')) {
    window.location = resData.openApp // to open aba mobile
  }

  if (resData.hasOwnProperty('merchantUrl')) {
    // invoicing tool link
    const _abaCheckoutInvoicingTool = _abaCheckoutDevExistingSelector('.st-invoice-link')
    if (_abaCheckoutInvoicingTool) {
      location.reload()
    } else {
      if (resData.merchantUrl === '') {
        AbaPayway.closeCheckoutByContinueUrl()
      } else {
        setTimeout(() => {
          location.href = resData.merchantUrl
        }, 300)
      }
    }
  }

  // for mini app success url
  if (resData.hasOwnProperty('miniAppSuccessUrl')) {
    if (resData.miniAppSuccessUrl !== '') {
      location.href = resData.miniAppSuccessUrl
    }
  }

  if (resData.hasOwnProperty('frameHeight')) {
    // for only mobile to use it  [ to recalcuate hight of iframe ]
    if (_abaCheckoutIsMobile()) {
      // call BS
      // document.getElementById("aba_checkout_sheet").style.display = "flex";
      abaCheckoutSetSheetHeight(resData.frameHeight)
      // abaCheckoutSetIsSheetShown(true);
      // end call BS
    }

    const existAbaCheckoutLoading = _abaCheckoutDevExisting('aba_webservice_loading')
    if (existAbaCheckoutLoading) {
      existAbaCheckoutLoading.remove()
    }

    document.getElementById('aba_webservice').style.height = `${resData.frameHeight}px`
  }

  if (resData.hasOwnProperty('_abaCallbackOnSuccess')) {
    // for callback on success
    _abaCallbackOnSuccess(resData)
  }

  if (resData.hasOwnProperty('_abaCallbackOnError')) {
    // for callback on error
    _abaCallbackOnError(resData)
  }

  // share file in mobile
  async function abaCheckoutShareFile(share) {
    const response = await fetch(share.fileUrl)
    const blob = await response.blob()
    const file = new File([blob], share.title, { type: blob.type })

    await navigator
      .share({
        files: [file],
      })
      .catch((e) => {
        console.log(e)
      })
  }
  if (resData.hasOwnProperty('share')) {
    abaCheckoutShareFile(resData.share)
  }
}
