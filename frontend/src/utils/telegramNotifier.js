/**
 * Telegram Smart Balance Notification Service
 * Sends automated Khmer alerts to Telegram when supplier balances hit $20, $15, $10, $5, or $0.
 */

const DEFAULT_TELEGRAM_CONFIG = {
  botToken: '8516986555:AAH3enGgrbjWPKnQRPwXRQHKVfGgqiQ2Rhw',
  chatId: '-1004398577975',
  topicId: '35',
  enabled: true
};

const STORAGE_CONFIG_KEY = 'mlbb_topup_telegram_config_v1';
const STORAGE_ALERT_STATE_KEY = 'mlbb_topup_telegram_alert_state_v1';

// Threshold Definitions ($20, $15, $10, $5, $0)
export const BALANCE_THRESHOLDS = [
  {
    level: 20,
    title: '⚠️ អាទិភាពមធ្យម (Low Balance $20)',
    emoji: '⚠️',
    noticeKhmer: 'តុល្យភាពដើមទុននៅសល់ $20.00! សូមរៀបចំបញ្ចូលថវិកាបន្ថែមក្នុងកាបូបលុយ Supplier ដើម្បីការពារការកកស្ទះការលក់។',
    estimate: 'អាចទិញបានប្រមាណ ~10-15 កញ្ចប់ទៀត',
    urgency: 'Medium'
  },
  {
    level: 15,
    title: '⚠️ តុល្យភាពនៅសល់តិច (Low Balance $15)',
    emoji: '⚠️',
    noticeKhmer: 'តុល្យភាពដើមទុននៅសល់ត្រឹម $15.00! សូមប្រញាប់ Deposit ថវិកាបន្ថែមក្នុងកាបូបលុយ Supplier ឱ្យបានឆាប់។',
    estimate: 'អាចទិញបានប្រមាណ ~7-10 កញ្ចប់ទៀត',
    urgency: 'Warning'
  },
  {
    level: 10,
    title: '🚨 អាសន្នជិតអស់លុយ (Urgent Low $10)',
    emoji: '🚨',
    noticeKhmer: 'អាសន្ន! តុល្យភាពដើមទុនជិតអស់ហើយ (នៅសល់ $10.00)! អាចទិញបានត្រឹមតែ 4-6 កញ្ចប់ទៀតប៉ុណ្ណោះ!',
    estimate: 'អាចទិញបានប្រមាណ ~4-6 កញ្ចប់ទៀត',
    urgency: 'Urgent'
  },
  {
    level: 5,
    title: '🚨 អាសន្នបន្ទាន់ខ្លាំង (Critical Low $5)',
    emoji: '🚨',
    noticeKhmer: 'អាសន្នបន្ទាន់ខ្លាំង! តុល្យភាពនៅសល់ $5.00 ប៉ុណ្ណោះ! អាចបង្កឱ្យមានការបរាជ័យក្នុងការ TopUp អតិថិជន។',
    estimate: 'នៅសល់ប្រមាណ 1-3 កញ្ចប់តូចៗប៉ុណ្ណោះ!',
    urgency: 'Critical'
  },
  {
    level: 0,
    title: '⛔ អស់លុយទាំងស្រុង ($0) — ផ្អាកការលក់',
    emoji: '⛔',
    noticeKhmer: 'អាសន្នខ្ពស់បំផុត! តុល្យភាពដើមទុនបានអស់ទាំងស្រុង ($0.00)! ការលក់ត្រូវបានផ្អាក សូមបញ្ចូលលុយជាបន្ទាន់!',
    estimate: 'មិនអាចបំពេញ Order បានទេ (0 កញ្ចប់)',
    urgency: 'Empty'
  }
];

export const getTelegramConfig = () => {
  try {
    const cached = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (cached) {
      return { ...DEFAULT_TELEGRAM_CONFIG, ...JSON.parse(cached) };
    }
  } catch (_) {}
  return DEFAULT_TELEGRAM_CONFIG;
};

export const saveTelegramConfig = (newConfig) => {
  const updated = { ...getTelegramConfig(), ...newConfig };
  try {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(updated));
  } catch (_) {}
  return updated;
};

const getAlertState = () => {
  try {
    const s = localStorage.getItem(STORAGE_ALERT_STATE_KEY);
    return s ? JSON.parse(s) : {};
  } catch (_) { return {}; }
};

const saveAlertState = (state) => {
  try {
    localStorage.setItem(STORAGE_ALERT_STATE_KEY, JSON.stringify(state));
  } catch (_) {}
};

/**
 * Sends formatted HTML Telegram Message directly to Telegram Bot API
 */
export async function sendTelegramMessage({ text, replyMarkup, customConfig }) {
  const cfg = customConfig || getTelegramConfig();
  if (!cfg.enabled || !cfg.botToken || !cfg.chatId) {
    console.warn('Telegram notifications disabled or missing credentials.');
    return { success: false, reason: 'Disabled or credentials missing' };
  }

  const url = `https://api.telegram.org/bot${cfg.botToken}/sendMessage`;
  const payload = {
    chat_id: cfg.chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: false
  };

  if (cfg.topicId) {
    payload.message_thread_id = Number(cfg.topicId);
  }

  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    return { success: json.ok, data: json };
  } catch (err) {
    console.error('Telegram API error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Smart Threshold Balance Alert Evaluator
 * Evaluates supplier balance against $20, $15, $10, $5, $0 threshold rules.
 */
export async function checkAndSendBalanceAlert({
  providerId = 'KhmerTopUp',
  providerName = 'Khmer TopUp',
  balanceUSD = 0,
  refillUrl = 'https://khmer-topup.com/wallet',
  forceAlert = false
}) {
  const currentBal = Number(balanceUSD) || 0;
  const khrEst = Math.round(currentBal * 4100).toLocaleString();
  const alertState = getAlertState();
  const provKey = `alert_${providerId}`;

  const lastAlertedLevel = alertState[provKey] !== undefined ? alertState[provKey] : 9999;

  // Reset threshold alert state if balance goes UP (e.g. Admin deposited money > $20)
  if (currentBal > 20 && lastAlertedLevel <= 20) {
    alertState[provKey] = 9999;
    saveAlertState(alertState);
    if (!forceAlert) return;
  }

  // Find matching threshold triggered (ordered highest to lowest: 20 -> 15 -> 10 -> 5 -> 0)
  let matchedThreshold = null;

  for (const t of BALANCE_THRESHOLDS) {
    if (currentBal <= t.level) {
      matchedThreshold = t;
    }
  }

  if (!matchedThreshold && !forceAlert) return;

  const targetThreshold = matchedThreshold || BALANCE_THRESHOLDS[0];

  // Anti-spam check: Only alert if current threshold is strictly lower than last alerted threshold
  if (!forceAlert && targetThreshold.level >= lastAlertedLevel) {
    return;
  }

  // Build Khmer Telegram Message
  const khmerMsg = `
${targetThreshold.emoji} <b>[ប្រព័ន្ធគ្រប់គ្រងសេវា SUPPLIER — ALERT តុល្យភាព]</b> ${targetThreshold.emoji}

🏦 <b>សេវាកម្មផ្គត់ផ្គង់:</b> <code>${providerName} (${providerId})</code>
💰 <b>តុល្យភាពបច្ចុប្បន្ន:</b> <b>$${currentBal.toFixed(2)} USD</b> (~${khrEst} KHR)
📊 <b>កម្រិតប្រកាសអាសន្ន:</b> ${targetThreshold.title}
📦 <b>ការប៉ាន់ស្មានស្តុក:</b> ${targetThreshold.estimate}

--------------------------------------------------
🔔 <b>សារជូនដំណឹងជូន ADMIN:</b>
${targetThreshold.noticeKhmer}
--------------------------------------------------

⏰ <b>កាលបរិច្ឆេទ:</b> ${new Date().toLocaleString()}
💡 <i>សូមចុចប៊ូតុងខាងក្រោមដើម្បី Deposit បញ្ចូលលុយបន្ថែមភ្លាមៗ!</i>
`.trim();

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: `💳 Deposit បញ្ចូលលុយទៅ ${providerName}`,
          url: refillUrl || 'https://khmer-topup.com/wallet'
        }
      ]
    ]
  };

  const res = await sendTelegramMessage({
    text: khmerMsg,
    replyMarkup: inlineKeyboard
  });

  if (res.success && !forceAlert) {
    // Record that we alerted for this threshold
    alertState[provKey] = targetThreshold.level;
    saveAlertState(alertState);
  }

  return res;
}
