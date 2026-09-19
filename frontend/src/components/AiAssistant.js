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
• *"How to top up step by step"*
Or tap one of the quick buttons below!`,

    topup_steps: `📋 **Step-by-Step: How to Top Up MLBB Diamonds**

**Step 1 — Find Your Player ID & Zone ID** 🎮
Open MLBB → tap your Avatar (top-left) → copy your **Player ID** and **Zone ID** (e.g. \`1225368571 (11446)\`)

**Step 2 — Select Your Game** 💎
Go to our website and click **"Mobile Legends"** from the game catalog.

**Step 3 — Enter Your Player ID** 📝
Paste your Player ID in the input field. Our system will verify your in-game username automatically.

**Step 4 — Choose a Diamond Package** 🛒
Pick your preferred package (e.g. 55 Diamonds \$0.95, or Weekly Diamond Pass \$1.55).

**Step 5 — Choose Payment Method** 🏦
Select **ABA PayWay** or **Bakong KHQR** and tap **"Proceed to Payment"**.

**Step 6 — Scan & Pay** 📱
Open your ABA Mobile / Wing / ACLEDA → scan the KHQR code → confirm payment.

**Step 7 — Done! Diamonds Delivered** ⚡
Within **10–30 seconds**, your diamonds will appear in your **MLBB in-game mailbox**. No password needed, 100% safe!

> 💡 **Tip:** Keep MLBB open to see the diamonds land in real time!`
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
• *"ដំណើរការបញ្ចូលពេជ្រជំហានដំបូង"*
ឬចុចលើប៊ូតុងសំណួររហ័សខាងក្រោម!`,

    topup_steps: `📋 **ដំណើរការបញ្ចូលគ្រាប់ពេជ្រ MLBB ជំហានដំបូង**

**ជំហានទី ១ — ស្វែងរក Player ID & Zone ID** 🎮
បើក MLBB → ចុចរូបអ្នក (ជ្រុងខាងឆ្វេងខាងលើ) → ចម្លង **Player ID** និង **Zone ID** (ឧ. \`1225368571 (11446)\`)

**ជំហានទី ២ — ជ្រើសរើសហ្គេម** 💎
ចូលគេហទំព័ររបស់យើង ហើយជ្រើស **"Mobile Legends"** ពីបញ្ជីហ្គេម។

**ជំហានទី ៣ — បញ្ចូល Player ID** 📝
បិទភ្ជាប់ Player ID ក្នុងប្រអប់ = ប្រព័ន្ធនឹងផ្ទៀងផ្ទាត់ ឈ្មោះក្នុងហ្គេមស្វ័យប្រវត្តិ។

**ជំហានទី ៤ — ជ្រើសរើសកញ្ចប់ពេជ្រ** 🛒
ជ្រើសកញ្ចប់ដែលអ្នកចង់បាន (ឧ. 55 ពេជ្រ \$0.95 ឬ Weekly Diamond Pass \$1.55)។

**ជំហានទី ៥ — ជ្រើសវិធីទូទាត់** 🏦
ជ្រើស **ABA PayWay** ឬ **Bakong KHQR** រួចចុច **"ទូទាត់"**។

**ជំហានទី ៦ — ស្កេន & ទូទាត់** 📱
បើក ABA Mobile / Wing / ACLEDA → ស្កេន KHQR code → ឆ្លើយតប confirm ការបង់ប្រាក់។

**ជំហានទី ៧ — រួចរាល់! ពេជ្រចូលហើយ** ⚡
ក្នុងរយៈ **១០–៣០ វិនាទី** ពេជ្រ នឹងបង្ហាញក្នុង **ប្រអប់សំបុត្រ MLBB** របស់អ្នក។ មិនត្រូវការ Password ១០០% ។

> 💡 **គន្លឹះ:** បើក MLBB ដើរក្រោយ ដើម្បីឃើញពេជ្រចូលភ្លាមៗ!`
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
• *"充值详细步骤教学"*
或直接点击下方的快捷问题按钮！`,

    topup_steps: `📋 **MLBB 钻石充值详细步骤教学**

**第 1 步 — 找到您的玩家 ID 和区服 ID** 🎮
打开 MLBB → 点击左上角**头像** → 复制您的 **Player ID** 和 **Zone ID**（如：\`1225368571 (11446)\`）

**第 2 步 — 选择游戏** 💎
进入我们的充值网站，点击 **"Mobile Legends"** 进入充值页面。

**第 3 步 — 输入玩家 ID** 📝
将 Player ID 粘贴到输入框，系统将自动验证您的游戏昵称。

**第 4 步 — 选择钻石套餐** 🛒
选择您需要的套餐（如 55 钻石 \$0.95，或每周钻石通行证 \$1.55）。

**第 5 步 — 选择付款方式** 🏦
选择 **ABA PayWay** 或 **Bakong KHQR** 扫码支付，点击 **"去支付"**。

**第 6 步 — 扫码支付** 📱
打开 ABA Mobile / Wing / ACLEDA → 扫 KHQR 二维码 → 确认付款。

**第 7 步 — 完成！钻石到账** ⚡
**10–30 秒内**，钻石将发送至您的 **MLBB 游戏内邮箱**。无需密码，100% 安全！

> 💡 **小提示：** 充值时保持 MLBB 在线，可以即时看到钻石到账！`
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

  // 6. Top Up Steps / How To Guide — checked FIRST before pricing to avoid false matches
  const stepsKeywords = ['step', 'how to', 'how do i', 'guide', 'tutorial', 'process', 'procedure', 'topup', 'top up', 'top-up', 'recharge', 'start', 'begin', 'ជំហាន', 'ដំណើរការ', 'របៀប', 'វិធីសាស្ត្រ', 'ចាប់ផ្ដើម', 'ពន្យល់', '步骤', '怎么充', '如何充', '充值教程', '充值流程', '怎么买', '教一下', 'ជំហានបញ្ចូលពេជ្រ', '充值步骤教学'];
  if (stepsKeywords.some(k => q.includes(k))) {
    return { type: 'text', reply: KNOWLEDGE_BASE[lang].topup_steps };
  }

  // 7. Pricing & Packages
  const priceKeywords = ['price', 'how much', 'cost', 'dollar', 'khr', 'cheap', 'discount', 'bonus', 'pass', 'weekly', 'package', 'promo', 'rate', 'pricing', 'diamond price', 'diamond cost', 'តម្លៃ', 'ប៉ុន្មាន', 'ថ្លៃ', 'កញ្ចប់', 'ប្រូម៉ូសិន', 'ប្រចាំសប្តាហ៍', '多少钱', '价格', '周卡', '月卡', '充值表', '优惠', '首充', '钻石套餐'];
  if (priceKeywords.some(k => q.includes(k))) {
    return { type: 'text', reply: KNOWLEDGE_BASE[lang].pricing };
  }

  // 8. Safety, Ban & Password
  const safeKeywords = ['safe', 'safety', 'ban', 'password', 'hack', 'scam', 'legal', 'official', 'moonton', 'trust', 'secure', 'សុវត្ថិភាព', 'លេខសម្ងាត់', 'បាត់', 'ត្រូវគេបោក', 'ផ្លូវការ', '安全', '封号', '要密码吗', '密码', '会封号吗', '官方', '靠谱吗'];
  if (safeKeywords.some(k => q.includes(k))) {
    return { type: 'text', reply: KNOWLEDGE_BASE[lang].security };
  }

  // 9. Order Issues & Support
  const supportKeywords = ['problem', 'error', 'failed', 'issue', 'not received', "didn't receive", 'missing', 'wrong id', 'help', 'support', 'telegram', 'contact', 'admin', 'call', 'បញ្ហា', 'អត់ចូល', 'បាត់ពេជ្រ', 'ខុស id', 'ជួយ', 'ជំនួយ', 'តេឡេក្រាម', '没到账', '充值失败', '未到账', '填错', '客服', '联系客服', '售后'];
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
      {/* Clean Floating AI Trigger - No background, just the icon */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="ai-assistant-widget fixed bottom-5 right-4 sm:right-5 z-40 w-16 h-16 sm:w-20 sm:h-20 hover:scale-110 active:scale-95 transition-all duration-300 group select-none cursor-pointer bg-transparent border-0 outline-none p-0"
        aria-label="Open AI Assistant"
      >
        {/* MLBB Bot Badge - Full icon, no wrapper box */}
        <div className="relative w-full h-full">
          <img
            src="/ai-bot-icon.png"
            alt="AI Assistant"
            className="w-full h-full object-contain transition-all duration-300"
          />
        </div>
      </button>

      {/* AI Assistant Chat Modal Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-2 sm:right-5 w-[95vw] sm:w-[400px] max-h-[620px] h-[80vh] z-50 flex flex-col rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-fadeIn border border-slate-800/60">

          {/* ── HEADER (Messenger style) ── */}
          <div className="bg-[#0f1724] px-4 py-3 flex items-center gap-3 border-b border-slate-800/60 shrink-0">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img src="/ai-bot-icon.png" alt="AI" className="w-11 h-11 object-contain" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0f1724]"></span>
            </div>
            {/* Name & status */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-sm leading-none truncate">{t('ai_title')}</p>
              <p className="text-emerald-400 text-[11px] font-medium mt-0.5">● Online • ឆ្លើយតបភ្លាមៗ</p>
            </div>
            {/* Language pills + close */}
            <div className="flex items-center gap-1">
              {[{code:'en',label:'EN'},{code:'km',label:'ខ្មែរ'},{code:'zh',label:'中文'}].map(l => (
                <button key={l.code} type="button" onClick={() => setLanguage(l.code)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === l.code ? 'bg-[#4f9de8] text-white' : 'text-slate-400 hover:text-white'}`}>
                  {l.label}
                </button>
              ))}
              <button type="button" onClick={() => setIsOpen(false)}
                className="ml-1 w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          {/* ── MESSAGES AREA ── */}
          <div
            className="flex-1 overflow-y-auto px-3 py-4 space-y-2 text-[13px]"
            style={{ background: 'linear-gradient(180deg, #0b1120 0%, #0d1526 100%)' }}
          >
            {/* Subtle dot pattern overlay */}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {/* AI avatar on left */}
                {msg.sender === 'ai' && (
                  <img src="/ai-bot-icon.png" alt="AI" className="w-8 h-8 object-contain shrink-0 mb-0.5" />
                )}
                {/* Bubble */}
                <div className={`relative max-w-[78%] px-3.5 py-2.5 leading-relaxed whitespace-pre-line break-words ${
                  msg.sender === 'user'
                    ? 'bg-[#4f9de8] text-white rounded-[18px] rounded-br-[4px] shadow-md'
                    : 'bg-[#1e2d45] text-slate-100 rounded-[18px] rounded-bl-[4px] shadow-md border border-slate-700/30'
                }`}>
                  {msg.text}
                </div>
                {/* User avatar on right */}
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#4f9de8]/20 border border-[#4f9de8]/40 flex items-center justify-center shrink-0 mb-0.5">
                    <svg className="w-4 h-4 text-[#4f9de8]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-2 justify-start">
                <img src="/ai-bot-icon.png" alt="AI" className="w-8 h-8 object-contain shrink-0 mb-0.5" />
                <div className="bg-[#1e2d45] border border-slate-700/30 rounded-[18px] rounded-bl-[4px] px-4 py-3 flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ── QUICK CHIPS ── */}
          <div className="bg-[#0f1724] px-3 py-2 border-t border-slate-800/40 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
            {[
              { label: t('ai_quick_1'), icon: '🔍', color: 'text-cyan-300 border-cyan-700/50' },
              { label: t('ai_quick_2'), icon: '⚡', color: 'text-amber-300 border-amber-700/50' },
              { label: t('ai_quick_3'), icon: '🏦', color: 'text-emerald-300 border-emerald-700/50' },
              { label: language === 'km' ? 'ជំហានបញ្ចូលពេជ្រ' : language === 'zh' ? '充值步骤教学' : 'Top Up Steps', icon: '📋', color: 'text-violet-300 border-violet-700/50' },
            ].map(q => (
              <button key={q.label} type="button" onClick={() => handleSend(q.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/60 border ${q.color} text-[11px] font-semibold whitespace-nowrap hover:bg-slate-700/60 transition-all shrink-0`}>
                <span>{q.icon}</span><span>{q.label}</span>
              </button>
            ))}
            <Link to="/topup" onClick={() => setIsOpen(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/90 text-slate-950 text-[11px] font-black whitespace-nowrap hover:bg-amber-400 transition-all shrink-0">
              💎 {t('nav_topup')}
            </Link>
          </div>

          {/* ── INPUT BAR ── */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="bg-[#0f1724] px-3 pb-3 pt-2 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('ai_ask_placeholder')}
              className="flex-1 bg-[#1e2d45] border border-slate-700/50 rounded-full px-4 py-2.5 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:border-[#4f9de8]/60 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-[#4f9de8] hover:bg-[#3b8fd8] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md shrink-0"
            >
              <svg className="w-4 h-4 text-white -rotate-45" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
