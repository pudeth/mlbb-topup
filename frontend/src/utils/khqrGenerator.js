/**
 * Authentic EMVCo KHQR Generator for Cambodia (NBC Bakong & ABA Bank Standard)
 * Generates camera-scannable KHQR payload with CRC16-CCITT and MD5 hash.
 */

function md5cycle(x, k) {
  let a = x[0], b = x[1], c = x[2], d = x[3];
  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17,  606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12,  1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7,  1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7,  1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22,  1236535329);
  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14,  643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9,  38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5,  568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20,  1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14,  1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);
  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16,  1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11,  1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4,  681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23,  76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16,  530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);
  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10,  1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6,  1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6,  1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21,  1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15,  718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);
  x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);
}

function cmn(q, a, b, x, s, t) {
  a = add32(add32(a, q), add32(x, t));
  return add32((a << s) | (a >>> (32 - s)), b);
}
function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }

function md51(s) {
  const n = s.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  let i;
  for (i = 64; i <= s.length; i += 64) {
    md5cycle(state, md5blk(s.substring(i - 64, i)));
  }
  s = s.substring(i - 64);
  const tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
  for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  return state;
}

function md5blk(s) {
  const md5blks = [];
  for (let i = 0; i < 64; i += 4) {
    md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}

const hex_chr = '0123456789abcdef'.split('');
function rhex(n) {
  let s = '';
  for (let j = 0; j < 4; j++) s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
  return s;
}

function hex(x) {
  for (let i = 0; i < x.length; i++) x[i] = rhex(x[i]);
  return x.join('');
}

function add32(a, b) { return (a + b) & 0xFFFFFFFF; }

export function calculateMd5(string) {
  return hex(md51(string));
}

export function calculateEmvcoCrc16(data) {
  let crc = 0xFFFF;
  const polynomial = 0x1021;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);
  for (let i = 0; i < bytes.length; i++) {
    for (let j = 0; j < 8; j++) {
      const bit = ((bytes[i] >> (7 - j)) & 1) === 1;
      const c15 = ((crc >> 15) & 1) === 1;
      crc = (crc << 1) & 0xFFFF;
      if (c15 ^ bit) {
        crc ^= polynomial;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Generate standard EMVCo KHQR code string conforming to NBC Bakong & ABA Bank
 */
export function generateEmvcoKhqr({
  amount = 0.95,
  currency = 'USD',
  merchantName = 'DETH PHEAK',
  merchantCity = 'Phnom Penh',
  usdAccount = '004164074',
  khrAccount = '015499221',
  p2pId = 'BE4DE1A15BB7'
} = {}) {
  const isKhr = String(currency).toUpperCase() === 'KHR';
  const currencyCode = isKhr ? '116' : '840';
  const finalAmt = isKhr ? (amount < 100 ? Math.round(amount * 4100) : Math.round(amount)) : Number(amount);
  const amtStr = isKhr ? String(finalAmt) : Number(finalAmt).toFixed(2);

  let payload = '000201010212';
  const activeAcc = isKhr ? khrAccount : usdAccount;

  // Tag 29: ABA Bank Merchant Info
  const sub00 = '0016abaakhppxxx@abaa';
  const sub01 = '01' + String(activeAcc.length).padStart(2, '0') + activeAcc;
  const sub02 = '0208ABA Bank';
  const tag29 = sub00 + sub01 + sub02;
  payload += '29' + String(tag29.length).padStart(2, '0') + tag29;

  // Tag 40: ABA P2P Dual Account
  const sub40 = '0006abaP2P0112' + p2pId + '02' + String(khrAccount.length).padStart(2, '0') + khrAccount + '03' + String(usdAccount.length).padStart(2, '0') + usdAccount + '0404Dual';
  payload += '40' + String(sub40.length).padStart(2, '0') + sub40;

  payload += '52040000'; // Tag 52: MCC for ABA P2P
  payload += '5303' + currencyCode; // Tag 53: Currency
  payload += '54' + String(amtStr.length).padStart(2, '0') + amtStr; // Tag 54: Amount
  payload += '5802KH'; // Tag 58: Country
  payload += '59' + String(merchantName.length).padStart(2, '0') + merchantName; // Tag 59: Merchant Name
  const city = merchantCity || 'Phnom Penh';
  payload += '60' + String(city.length).padStart(2, '0') + city; // Tag 60: City

  // Tag 99: Bakong Expiration Timestamp (5 Minutes)
  const nowMs = Date.now();
  const expireMs = nowMs + 5 * 60 * 1000;
  const createdStr = String(nowMs);
  const expireStr = String(expireMs);
  const tag99 = '00' + String(createdStr.length).padStart(2, '0') + createdStr + '01' + String(expireStr.length).padStart(2, '0') + expireStr;
  payload += '99' + String(tag99.length).padStart(2, '0') + tag99;

  payload += '6304';
  const crc = calculateEmvcoCrc16(payload);
  const fullKhqr = payload + crc;
  const md5Hash = calculateMd5(fullKhqr);

  return {
    qrString: fullKhqr,
    md5Hash: md5Hash,
    deeplink: 'https://bakong.nbc.org.kh/pay?md5=' + md5Hash,
    abapayDeeplink: 'https://bakong.nbc.org.kh/pay?md5=' + md5Hash,
    amount: finalAmt,
    currency: isKhr ? 'KHR' : 'USD',
    merchantName: merchantName
  };
}
