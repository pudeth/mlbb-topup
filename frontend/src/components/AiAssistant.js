import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const KNOWLEDGE_BASE = {
  en: {
    greeting: (name = "Player") => `👋 Hello ${name}! I am your MLBB Diamond AI Assistant.

I can help you with:
• 💎 Fast diamond recharge & prices
• 🔍 Finding your Player ID & Zone ID
• 🏦 Bakong KHQR payments (ABA, Wing, ACLEDA)
• ⚡ Checking delivery status within 10 seconds

How can I help you today?`,

    find_id: `🎮 **How to find your Mobile Legends IDs:**

1. Open MLBB and tap your **Avatar / Profile** in the top-left corner.
2. Under your character name, locate: **User ID: 1225368571 (11446)**.
3. The first number is your **Player ID**, and the number inside brackets is your **Server Zone ID**.

💡 **Pro Tip:** You can copy & paste the whole \`1225368571 (11446)\` into our Player ID box, and our system will split it automatically!`,

    speed: `⚡ **Delivery Speed & Guarantee:**

• **Average Delivery Time:** 10 to 30 seconds!
• **How it works:** As soon as your Bakong KHQR scan completes, our direct Moonton API automatically dispatches diamonds to your in-game mailbox.
• **No waiting:** No manual verification needed, 100% automated 24/7.`,

    banks: `🏦 **Supported Cambodian Banks & Wallets:**

You can scan and pay with **0% transaction fee** using any KHQR-enabled mobile app:
• **ABA Mobile**
• **Wing Bank**
• **ACLEDA Unity**
• **Canadia Bank**
• **TrueMoney Cambodia**
• **Chip Mong Bank**, **Sathapana**, **Prince Bank**, and 30+ other local banks!`,

    pricing: `💎 **Popular Diamond Packages & Pricing:**

• **50 💎** = $1.49 (~6,100 ៛)
• **110 💎 (+10 Bonus)** = $2.99 (~12,200 ៛)
• **240 💎 (+25 Bonus)** = $5.99 (~24,500 ៛) 🔥 *Popular*
• **625 💎 (+65 Bonus)** = $14.99 (~61,400 ៛)
• **1250 💎 (+150 Bonus)** = $29.99 (~122,900 ៛)
• **5000 💎 (+1,000 Bonus)** = $119.99 (~491,900 ៛)

👑 **Weekly Diamond Pass** is also supported with daily bonus claims!`,

    security: `🛡️ **100% Account Safety & Privacy:**

• **No Password Required:** We only need your public Player ID and Server Zone ID.
• **100% Anti-Ban Guarantee:** All diamonds are sourced directly through official Moonton top-up gateways.
• **Safe Payments:** All transactions are securely processed via National Bank of Cambodia Bakong KHQR.`,

    support: `🎧 **Need Help with an Order?**

If your payment went through or you need instant help:
1. Open your MLBB in-game mailbox to refresh diamond balance.
2. Note your **Order Reference Number** (e.g., \`MLBB00000X\`).
3. Message our 24/7 Telegram Support team for immediate assistance!`,

    general: `🤖 I'm here to help you recharge MLBB diamonds quickly and securely. You can ask me about:
• *"How to find Player ID"*
• *"How fast is delivery"*
• *"Supported bank apps"*
• *"Diamond prices and packages"*
• Or tap one of the quick buttons below!`
  },

  km: {
    greeting: (name = "អ្នកលេង") => `👋 សួស្តី ${name}! ខ្ញុំជាជំនួយការឆ្លាតវៃ MLBB AI។

ខ្ញុំអាចជួយលោកអ្នកអំពី៖
• 💎 ការបញ្ចូលគ្រាប់ពេជ្រ និងតម្លៃ
• 🔍 របៀបស្វែងរក Player ID និង Zone ID
• 🏦 ការទូទាត់តាម Bakong KHQR (ABA, Wing, ACLEDA)
• ⚡ ការពិនិត្យល្បឿនដឹកជញ្ជូនក្នុង ១០ វិនាទី

តើមានអ្វីដែលខ្ញុំអាចជួយលោកអ្នកនៅថ្ងៃនេះ?`,

    find_id: `🎮 **របៀបស្វែងរក ID ហ្គេម Mobile Legends របស់អ្នក៖**

១. បើកហ្គេម MLBB ហើយចុចលើរូប **Avatar (កម្រងរូបភាព)** នៅជ្រុងខាងឆ្វេងខាងលើ។
២. នៅខាងក្រោមឈ្មោះតួអង្គរបស់អ្នក រកមើល៖ **User ID: 1225368571 (11446)**។
៣. លេខខាងមុខគឺជា **Player ID** ហើយលេខនៅក្នុងវង់ក្រចកគឺជា **Server Zone ID**។

💡 **គន្លឹះពិសេស៖** អ្នកអាចចម្លងអក្សរ \`1225368571 (11446)\` ទាំងមូលមកបិទភ្ជាប់ក្នុងប្រអប់ Player ID បាន ប្រព័ន្ធនឹងបំបែកវាស្វ័យប្រវត្តិ!`,

    speed: `⚡ **ល្បឿននៃការបញ្ចូលពេជ្រ & ការធានា៖**

• **ល្បឿនជាមធ្យម៖** ត្រឹមតែ ១០ ទៅ ៣០ វិនាទីប៉ុណ្ណោះ!
• **ដំណើរការ៖** ភ្លាមៗបន្ទាប់ពីអ្នកស្កេនទូទាត់ Bakong KHQR ជោគជ័យ ប្រព័ន្ធស្វ័យប្រវត្តិនឹងបញ្ជូនគ្រាប់ពេជ្រចូលក្នុងប្រអប់សំបុត្រហ្គេម MLBB របស់អ្នកភ្លាមៗ។
• **គ្មានការរង់ចាំ៖** ដំណើរការស្វ័យប្រវត្តិ ២៤ ម៉ោងលើ ២៤ ម៉ោង។`,

    banks: `🏦 **ធនាគារ និងកាបូបអេឡិចត្រូនិកដែលគាំទ្រ៖**

អ្នកអាចស្កេនទូទាត់ដោយ **ឥតគិតថ្លៃសេវា 0%** ជាមួយកម្មវិធីធនាគារកម្ពុជាទាំងអស់៖
• **ABA Mobile**
• **Wing Bank**
• **ACLEDA Unity**
• **Canadia Bank (ធនាគារ កាណាឌីយ៉ា)**
• **TrueMoney Cambodia**
• **Chip Mong Bank**, **Sathapana**, **Prince Bank** និងធនាគារជាង 30+ ផ្សេងទៀត!`,

    pricing: `💎 **កញ្ចប់គ្រាប់ពេជ្រ និងតម្លៃពេញនិយម៖**

• **50 💎** = $1.49 (~6,100 ៛)
• **110 💎 (+10 បន្ថែម)** = $2.99 (~12,200 ៛)
• **240 💎 (+25 បន្ថែម)** = $5.99 (~24,500 ៛) 🔥 *លក់ដាច់បំផុត*
• **625 💎 (+65 បន្ថែម)** = $14.99 (~61,400 ៛)
• **1250 💎 (+150 បន្ថែម)** = $29.99 (~122,900 ៛)
• **5000 💎 (+1,000 បន្ថែម)** = $119.99 (~491,900 ៛)

👑 **កញ្ចប់ពេជ្រប្រចាំសប្តាហ៍ (Weekly Diamond Pass)** ក៏មានការគាំទ្រផងដែរ!`,

    security: `🛡️ **សុវត្ថិភាពគណនី ១០០% & ភាពឯកជន៖**

• **មិនត្រូវការលេខសម្ងាត់ (Password)៖** យើងត្រូវការតែ Player ID និង Zone ID សាធារណៈប៉ុណ្ណោះ។
• **ធានាអត់ Ban គណនី ១០០%៖** ពេជ្រទាំងអស់ត្រូវបានបញ្ជូនតាមច្រកផ្លូវការរបស់ Moonton។
• **ការទូទាត់មានសុវត្ថិភាព៖** ដំណើរការតាមរយៈ Bakong KHQR របស់ធនាគារជាតិនៃកម្ពុជា។`,

    support: `🎧 **ត្រូវការជំនួយលើការបញ្ជាទិញ?**

ប្រសិនបើលោកអ្នកបានទូទាត់រួចរាល់ ឬត្រូវការជំនួយបន្ទាន់៖
១. សូមបើកប្រអប់សំបុត្រក្នុងហ្គេម MLBB ដើម្បី Refresh មើលចំនួនពេជ្រ។
២. កត់ចំណាំ **លេខយោងការបញ្ជាទិញ (Ref No)** (ឧទាហរណ៍៖ \`MLBB00000X\`)។
៣. ផ្ញើសារមកកាន់ក្រុមការងារ Telegram Support 24/7 ដើម្បីទទួលបានការជួយភ្លាមៗ!`,

    general: `🤖 ខ្ញុំនៅទីនេះដើម្បីជួយអ្នកបញ្ចូលគ្រាប់ពេជ្រ MLBB យ៉ាងរហ័សនិងមានសុវត្ថិភាព។ អ្នកអាចសួរខ្ញុំអំពី៖
• *"របៀបស្វែងរក Player ID"*
• *"តើការទូទាត់ចូលលឿនទេ"*
• *"ធនាគារណាខ្លះអាចបង់បាន"*
• *"តម្លៃគ្រាប់ពេជ្រ"*
ឬចុចលើប៊ូតុងសំណួររហ័សខាងក្រោម!`
  },

  zh: {
    greeting: (name = "玩家") => `👋 您好 ${name}！我是您的 MLBB 无尽对决钻石智能 AI 助手。

我可以为您提供以下帮助：
• 💎 钻石秒级充值与套餐价格
• 🔍 查看与核对玩家 ID 与区服 Zone ID
• 🏦 柬埔寨 Bakong KHQR 扫码支付 (ABA, Wing, ACLEDA)
• ⚡ 10 秒极速自动到账查询

请问今天有什么可以为您效劳？`,

    find_id: `🎮 **如何查看您的 Mobile Legends 游戏 ID：**

1. 打开 MLBB 游戏，点击左上角的 **个人头像** 进入资料页。
2. 在角色昵称下方查看：**User ID: 1225368571 (11446)**。
3. 前面的数字是您的 **Player ID (玩家ID)**，括号内的数字是 **Server Zone ID (区服ID)**。

💡 **贴心提示：** 您可以直接复制完整的 \`1225368571 (11446)\` 粘贴到我们的 Player ID 输入框中，系统会自动拆分识别！`,

    speed: `⚡ **充值到账速度与保障：**

• **平均到账时间：** 仅需 10 到 30 秒！
• **直充原理：** 当您的 Bakong KHQR 扫码完成后，官方直连接口会自动将钻石发送至您的游戏内邮箱。
• **全天候运行：** 7×24 小时全自动系统，无需人工漫长等待。`,

    banks: `🏦 **支持的柬埔寨银行与电子钱包：**

支持使用以下任意支持 KHQR 的手机银行扫码付款，**0 手续费**：
• **ABA Mobile (ABA 银行)**
• **Wing Bank (永旺/Wing 银行)**
• **ACLEDA Unity (爱喜利达银行)**
• **Canadia Bank (加华银行)**
• **TrueMoney Cambodia (真实货币)**
• **Chip Mong Bank (集茂银行)**、**Sathapana**、**太子银行 (Prince Bank)** 等 30 多家本地银行！`,

    pricing: `💎 **热销钻石套餐与价格一览：**

• **50 💎** = $1.49 (~6,100 ៛)
• **110 💎 (+10 赠送)** = $2.99 (~12,200 ៛)
• **240 💎 (+25 赠送)** = $5.99 (~24,500 ៛) 🔥 *最热销*
• **625 💎 (+65 赠送)** = $14.99 (~61,400 ៛)
• **1250 💎 (+150 赠送)** = $29.99 (~122,900 ៛)
• **5000 💎 (+1,000 赠送)** = $119.99 (~491,900 ៛)

👑 现已支持 **每周钻石通行证 (Weekly Diamond Pass)**！`,

    security: `🛡️ **100% 账号安全与防封保障：**

• **无需提供密码：** 仅需提供公开的 Player ID 与 Zone ID，绝不索取任何密码。
• **官方正品保障：** 所有钻石均经由 Moonton 官方授权渠道直充，100% 防封号。
• **安全支付：** 由柬埔寨国家银行 Bakong KHQR 提供安全清算。`,

    support: `🎧 **订单售后与帮助：**

如果您在付款后遇到任何疑问：
1. 请打开 MLBB 游戏内邮箱查收并刷新钻石余额。
2. 记下您的 **订单参考号 (Ref No)**（例如：\`MLBB00000X\`）。
3. 随时联系我们的 24/7 Telegram 在线客服，我们将立即为您协助解决！`,

    general: `🤖 我是您的专属游戏充值 AI 智能助手。您可以询问我：
• *"如何查看玩家 ID"*
• *"充值多久能到账"*
• *"支持哪些银行付款"*
• *"钻石价格与周卡优惠"*
或直接点击下方的快捷问题按钮！`
  }
};

const matchIntent = (query, currentLang) => {
  const q = query.toLowerCase().trim();
  const lang = currentLang in KNOWLEDGE_BASE ? currentLang : 'en';

  // 1. Language Switching Commands
  if (q.includes('khmer') || q.includes('ភាសាខ្មែរ') || q.includes('ខ្មែរ')) {
    return { type: 'switch_lang', targetLang: 'km', reply: '✅ បានប្តូរភាសាទៅជា ភាសាខ្មែរ រួចរាល់ហើយ! តើមានអ្វីដែលខ្ញុំអាចជួយលោកអ្នកបន្ថែម?' };
  }
  if (q.includes('chinese') || q.includes('中文') || q.includes('china') || q.includes('华语')) {
    return { type: 'switch_lang', targetLang: 'zh', reply: '✅ 语言已成功切换为 中文！请问有什么可以帮助您的？' };
  }
  if (q.includes('english') || q.includes('eng')) {
    return { type: 'switch_lang', targetLang: 'en', reply: '✅ Language switched to English! How can I assist you today?' };
  }

  // 2. Greetings
  const greetings = ['hi', 'hello', 'hey', 'yo', 'halo', 'hallo', 'morning', 'evening', 'good', 'សួស្តី', 'ជំរាបសួរ', 'សួស្ដី', '你好', '哈喽', '您好', '早', '嗨'];
  if (greetings.some(g => q === g || q.startsWith(g + ' ') || q.endsWith(' ' + g))) {
    return { type: 'text', reply: KNOWLEDGE_BASE[lang].greeting() };
  }

  // 3. ID / Zone ID Questions
  const idKeywords = ['id', 'player id', 'zone id', 'server id', 'user id', 'find id', 'where is id', 'រក id', 'ស្វែងរក', 'មើល id', 'លេខសម្គាល់', 'តើ id នៅឯណា', '怎么找id', '玩家id', '区服', '查看id', '怎么看id', '账号id'];
  if (idKeywords.some(k => q.includes(k))) {
    return { type: 'text', reply: KNOWLEDGE_BASE[lang].find_id };
  }

  // 4. Delivery Speed & Time
  const speedKeywords = ['fast', 'speed', 'instant', 'how long', 'when', 'time', 'minute', 'second', 'លឿន', 'ប៉ុន្មាននាទី', 'យូរទេ', 'ចូលភ្លាមៗ', 'ពេលណា', '多久', '到账', '多长时间', '几分钟', '秒到', '充值速度'];
  if (speedKeywords.some(k => q.includes(k))) {
    return { type: 'text', reply: KNOWLEDGE_BASE[lang].speed };
  }

  // 5. Payment Methods & Banks
  const bankKeywords = ['bank', 'aba', 'wing', 'acleda', 'canadia', 'truemoney', 'khqr', 'bakong', 'pay', 'payment', 'method', 'qr', 'scan', 'ធនាគារ', 'ទូទាត់', 'បង់លុយ', 'ស្កេន', 'វិធី', 'កាត', '付款', '支付', '银行', '扫码', '加华', '怎么付'];
  if (bankKeywords.some(k => q.includes(k))) {
    return { type: 'text', reply: KNOWLEDGE_BASE[lang].banks };
  }

  // 6. Pricing & Packages
  const priceKeywords = ['price', 'how much', 'cost', 'diamond', 'dollar', 'khr', 'cheap', 'discount', 'bonus', 'pass', 'weekly', 'package', 'promo', 'rate', 'តម្លៃ', 'ប៉ុន្មាន', 'ថ្លៃ', 'កញ្ចប់', 'ប្រូម៉ូសិន', 'ប្រចាំសប្តាហ៍', '多少钱', '价格', '周卡', '月卡', '充值表', '优惠', '首充', '钻石套餐'];
  if (priceKeywords.some(k => q.includes(k))) {
    return { type: 'text', reply: KNOWLEDGE_BASE[lang].pricing };
  }

  // 7. Safety, Ban & Password
  const safeKeywords = ['safe', 'safety', 'ban', 'password', 'hack', 'scam', 'legal', 'official', 'moonton', 'trust', 'secure', 'សុវត្ថិភាព', 'លេខសម្ងាត់', 'បាត់', 'ត្រូវគេបោក', 'ផ្លូវការ', '安全', '封号', '要密码吗', '密码', '会封号吗', '官方', '靠谱吗'];
  if (safeKeywords.some(k => q.includes(k))) {
    return { type: 'text', reply: KNOWLEDGE_BASE[lang].security };
  }

  // 8. Order Issues & Support
  const supportKeywords = ['problem', 'error', 'failed', 'issue', 'not received', 'didn\'t receive', 'missing', 'wrong id', 'help', 'support', 'telegram', 'contact', 'admin', 'call', 'បញ្ហា', 'អត់ចូល', 'បាត់ពេជ្រ', 'ខុស id', 'ជួយ', 'ជំនួយ', 'តេឡេក្រាម', '没到账', '充值失败', '未到账', '填错', '客服', '联系客服', '售后'];
  if (supportKeywords.some(k => q.includes(k))) {
    return { type: 'text', reply: KNOWLEDGE_BASE[lang].support };
  }

  // Default fallback
  return { type: 'text', reply: KNOWLEDGE_BASE[lang].general };
};

// Futuristic Vector AI Core Logo Component
const AiLogoIcon = ({ className = "w-6 h-6", glowing = true }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="aiCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="35%" stopColor="#F59E0B" />
        <stop offset="70%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="aiOrbRing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#818CF8" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
      </linearGradient>
      <radialGradient id="aiInnerGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
      </radialGradient>
      <filter id="aiGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Background Glow Circle */}
    <circle cx="24" cy="24" r="21" fill="url(#aiInnerGlow)" />
    
    {/* Outer Tech Orbit Ring */}
    <circle
      cx="24"
      cy="24"
      r="21"
      stroke="url(#aiOrbRing)"
      strokeWidth="1.5"
      strokeDasharray="4 3"
      className="animate-spin-slow opacity-80"
    />

    {/* Dynamic Hexagon / Diamond Shield Frame */}
    <path
      d="M24 6L38 14V34L24 42L10 34V14L24 6Z"
      stroke="url(#aiOrbRing)"
      strokeWidth="1.2"
      fill="rgba(15, 23, 42, 0.75)"
      strokeLinejoin="round"
    />

    {/* Main 4-Point AI Starburst (Glowing) */}
    <path
      d="M24 10C24 16.5 28.5 21 35 24C28.5 27 24 31.5 24 38C24 31.5 19.5 27 13 24C19.5 21 24 16.5 24 10Z"
      fill="url(#aiCoreGrad)"
      filter={glowing ? "url(#aiGlowFilter)" : undefined}
    />

    {/* Top Right Mini Star */}
    <path
      d="M34 11C34 13 35.5 14.5 37.5 15.5C35.5 16.5 34 18 34 20C34 18 32.5 16.5 30.5 15.5C32.5 14.5 34 13 34 11Z"
      fill="#FDE047"
    />
    
    {/* Bottom Left Mini Star */}
    <path
      d="M14 28C14 29.5 15 30.5 16.5 31.5C15 32.5 14 33.5 14 35C14 33.5 13 32.5 11.5 31.5C13 30.5 14 29.5 14 28Z"
      fill="#38BDF8"
    />

    {/* Central Core Bright Diamond Highlight */}
    <circle cx="24" cy="24" r="2.5" fill="#FFFFFF" className="animate-pulse" />
  </svg>
);

const AiAssistant = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: t('ai_welcome')
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: t('ai_welcome')
      }
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    // Append user message immediately
    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Ultra-fast simulated intelligence (150ms)
    setTimeout(() => {
      const match = matchIntent(query, language);

      if (match.type === 'switch_lang') {
        setLanguage(match.targetLang);
      }

      setMessages(prev => [...prev, { sender: 'ai', text: match.reply }]);
      setIsTyping(false);
    }, 180);
  };

  return (
    <>
      {/* Futuristic Floating AI Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="ai-assistant-widget fixed bottom-5 right-4 sm:right-6 z-40 p-2 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0D1527] to-slate-950 border border-cyan-500/50 hover:border-amber-400 text-white font-black shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(251,191,36,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 group select-none backdrop-blur-xl cursor-pointer"
        aria-label="Open AI Assistant"
      >
        {/* Animated AI Orb Container */}
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-amber-500/20 border border-cyan-400/40 group-hover:border-amber-400/60 p-1 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
          <AiLogoIcon className="w-full h-full transform group-hover:scale-110 transition-transform duration-300" />
          
          {/* Pulsing Live Dot */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-emerald-400 to-cyan-400 border border-slate-950"></span>
          </span>
        </div>

        {/* Text for Desktop / Tablet */}
        <div className="text-left hidden xs:block pr-1 leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-cyan-300 via-white to-amber-300 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:to-yellow-200">
              {language === 'km' ? 'ជំនួយការ AI' : language === 'zh' ? 'AI 智能助手' : 'AI Assistant'}
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold uppercase">
              24/7
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-medium block">
            {language === 'km' ? 'ឆ្លើយតបរហ័ស 10s' : language === 'zh' ? '秒级智能解答' : 'Instant Help & Top-Up'}
          </span>
        </div>
      </button>

      {/* AI Assistant Chat Modal Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-2 sm:right-6 w-[95vw] sm:w-[440px] max-h-[600px] h-[82vh] bg-slate-950/95 backdrop-blur-2xl border-2 border-cyan-500/40 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 p-3.5 sm:p-4 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900/90 border border-cyan-400/50 p-1 flex items-center justify-center shadow-glow-cyan shrink-0">
                <AiLogoIcon className="w-full h-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-white text-xs sm:text-sm">{t('ai_title')}</h3>
                  <span className="badge badge-info text-[7px] sm:text-[8px] px-1.5 py-0.5">{t('ai_badge')}</span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 block">{t('ai_sub')}</span>
              </div>
            </div>

            {/* Quick Language Switcher Inside AI */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${language === 'en' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'}`}
                title="English"
              >
                🇬🇧 EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('km')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${language === 'km' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'}`}
                title="Khmer"
              >
                🇰🇭 ខ្មែរ
              </button>
              <button
                type="button"
                onClick={() => setLanguage('zh')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${language === 'zh' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'}`}
                title="Chinese"
              >
                🇨🇳 中文
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-lg text-slate-400 hover:text-white flex items-center justify-center text-sm ml-0.5"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">
                    ✨
                  </div>
                )}
                <div
                  className={`p-3 sm:p-3.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold rounded-tr-none shadow-md'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-[11px]">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs shrink-0">
                  ✨
                </div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              type="button"
              onClick={() => handleSend(t('ai_quick_1'))}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <span>🔍</span> <span>{t('ai_quick_1')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSend(t('ai_quick_2'))}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <span>⚡</span> <span>{t('ai_quick_2')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSend(t('ai_quick_3'))}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-slate-700 whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <span>🏦</span> <span>{t('ai_quick_3')}</span>
            </button>
            <Link
              to="/topup"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold whitespace-nowrap"
            >
              💎 {t('nav_topup')}
            </Link>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 sm:p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('ai_ask_placeholder')}
              className="input text-xs py-2.5 sm:py-3 flex-1 bg-slate-900 border-slate-800"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn btn-primary text-xs py-2.5 sm:py-3 px-4 font-bold disabled:opacity-40"
            >
              {t('ai_send')}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
