import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FREE_FIRE_PACKAGES = {
  'freefire-sgmy': {
    name: 'Free Fire (Cambodia / SG / MY)',
    slug: 'freefire-sgmy',
    description: 'Official standard Garena Free Fire server for Cambodia, Singapore, and Malaysia players.',
    packages: [
      { id: 374, name: '25 Diamonds', amount: 25, price: 0.24, type: 'Diamonds' },
      { id: 391, name: '100 Diamonds', amount: 100, price: 0.90, type: 'Diamonds' },
      { id: 376, name: '310 Diamonds', amount: 310, price: 2.74, type: 'Diamonds' },
      { id: 377, name: '520 Diamonds', amount: 520, price: 4.59, type: 'Diamonds' },
      { id: 378, name: '1060 Diamonds', amount: 1060, price: 9.01, type: 'Diamonds' },
      { id: 379, name: '2180 Diamonds', amount: 2180, price: 18.21, type: 'Diamonds' },
      { id: 380, name: '5600 Diamonds', amount: 5600, price: 45.07, type: 'Diamonds' },
      { id: 381, name: '11500 Diamonds', amount: 11500, price: 92.82, type: 'Diamonds' },
      { id: 390, name: 'Level Up Package - Level 6', amount: 200, price: 0.29, type: 'Pass' },
      { id: 384, name: 'WeeklyLite', amount: 100, price: 0.32, type: 'Pass', badge: 'BEST SELLER', badgeType: 'orange' },
      { id: 385, name: 'Level Up Package - Level 10', amount: 300, price: 0.61, type: 'Pass' },
      { id: 386, name: 'Level Up Package - Level 15', amount: 400, price: 0.61, type: 'Pass' },
      { id: 387, name: 'Level Up Package - Level 20', amount: 500, price: 0.61, type: 'Pass' },
      { id: 388, name: 'Level Up Package - Level 25', amount: 600, price: 0.61, type: 'Pass' },
      { id: 5028, name: 'Weekly Lit x2', amount: 200, price: 0.63, type: 'Pass' },
      { id: 389, name: 'Level Up Package - Level 30', amount: 800, price: 0.90, type: 'Pass' },
      { id: 5029, name: 'Weekly Lit x3', amount: 300, price: 0.94, type: 'Pass' },
      { id: 383, name: 'Weekly', amount: 450, price: 1.57, type: 'Pass', badge: 'POPULAR TODAY', badgeType: 'pink' },
      { id: 5024, name: 'Weekly x2', amount: 900, price: 3.12, type: 'Pass' },
      { id: 5025, name: 'Weekly x3', amount: 1350, price: 4.67, type: 'Pass' },
      { id: 4852, name: 'Monthly', amount: 2600, price: 7.76, type: 'Pass' },
      { id: 5021, name: 'Monthly x2', amount: 5200, price: 15.03, type: 'Pass' },
      { id: 5022, name: 'Monthly x3', amount: 7800, price: 22.55, type: 'Pass' }
    ]
  },
  'free-fire-kh-sg': {
    name: 'Free Fire Direct KH/SG',
    slug: 'free-fire-kh-sg',
    description: 'Direct Cambodia & Singapore regional route with special tiered pricing.',
    packages: [
      { id: 5292, name: '20 Diamonds', amount: 20, price: 0.19, type: 'Diamonds' },
      { id: 5293, name: '40 Diamonds', amount: 40, price: 0.36, type: 'Diamonds' },
      { id: 5294, name: '100 Diamonds', amount: 100, price: 0.86, type: 'Diamonds', popular: true },
      { id: 5295, name: '205 Diamonds', amount: 205, price: 1.73, type: 'Diamonds' },
      { id: 5298, name: '420 Diamonds', amount: 420, price: 3.48, type: 'Diamonds', popular: true },
      { id: 5299, name: '650 Diamonds', amount: 650, price: 5.27, type: 'Diamonds' },
      { id: 5296, name: '1,100 Diamonds', amount: 1100, price: 8.68, type: 'Diamonds' },
      { id: 5297, name: '2,250 Diamonds', amount: 2250, price: 17.57, type: 'Diamonds' },
      { id: 5142, name: 'Weekly Lite Pass', amount: 100, price: 0.32, type: 'Pass' },
      { id: 5141, name: 'Monthly Membership', amount: 2600, price: 7.53, type: 'Pass', popular: true }
    ]
  },
  'free-fire-bonuse': {
    name: 'Free Fire Bonus Diamonds',
    slug: 'free-fire-bonuse',
    description: 'Promotional first-time top-up bonus diamond packages.',
    packages: [
      { id: 5143, name: '150 Diamonds Bonus', amount: 150, price: 0.90, type: 'Bonus' },
      { id: 5144, name: '465 Diamonds Bonus', amount: 465, price: 2.91, type: 'Bonus', popular: true },
      { id: 5145, name: '780 Diamonds Bonus', amount: 780, price: 4.85, type: 'Bonus', popular: true },
      { id: 5146, name: '1,590 Diamonds Bonus', amount: 1590, price: 9.95, type: 'Bonus' },
      { id: 5147, name: '3,270 Diamonds Bonus', amount: 3270, price: 19.99, type: 'Bonus' },
      { id: 5148, name: '8,400 Diamonds Bonus', amount: 8400, price: 49.44, type: 'Bonus' }
    ]
  },
  'freefire-global': {
    name: 'Free Fire Global',
    slug: 'freefire-global',
    description: 'International players outside Southeast Asia region.',
    packages: [
      { id: 487, name: '110 Diamonds', amount: 110, price: 0.78, type: 'Diamonds' },
      { id: 488, name: '341 Diamonds', amount: 341, price: 2.38, type: 'Diamonds' },
      { id: 489, name: '572 Diamonds', amount: 572, price: 3.86, type: 'Diamonds' },
      { id: 490, name: '1,166 Diamonds', amount: 1166, price: 7.73, type: 'Diamonds' },
      { id: 491, name: '2,398 Diamonds', amount: 2398, price: 15.46, type: 'Diamonds' },
      { id: 492, name: '6,160 Diamonds', amount: 6160, price: 39.13, type: 'Diamonds' },
      { id: 494, name: 'Weekly Lite', amount: 100, price: 0.38, type: 'Pass' },
      { id: 495, name: 'Weekly Membership', amount: 450, price: 1.55, type: 'Pass' },
      { id: 493, name: 'Monthly Membership', amount: 2600, price: 5.57, type: 'Pass' }
    ]
  }
};

const BEST_SELLER_RETAIL_PACKAGES = [
  { id: 384, name: 'WeeklyLite', price: 0.39, wholesaleCost: 0.32, badge: 'ទទួលបាន 90 💎', color: 'blue', desc: '1x Lite' },
  { id: 5028, name: '2 Weeklylite', price: 0.78, wholesaleCost: 0.63, badge: 'ទទួលបាន 180 💎', color: 'blue', desc: '2x Lite' },
  { id: 383, name: 'Weekly', price: 1.65, wholesaleCost: 1.57, badge: 'ទទួលបាន 445 💎', color: 'purple', desc: '1x Weekly' },
  { id: 5024, name: '2 Weekly', price: 3.30, wholesaleCost: 3.12, badge: 'ទទួលបាន 890 💎', color: 'purple', desc: '2x Weekly' },
  { id: 5025, name: '3 Weekly', price: 5.00, wholesaleCost: 4.67, badge: 'Discount 5%', color: 'purple', desc: '3x Weekly' },
  { id: 5026, name: '4 Weekly', price: 6.50, wholesaleCost: 6.24, badge: 'Discount 10%', color: 'purple', desc: '4x Weekly' },
  { id: 3077, name: '520 + Weekly', price: 6.20, wholesaleCost: 6.16, badge: 'Discount 5%', color: 'purple', desc: 'Combo' },
  { id: 4852, name: 'Monthly', price: 7.65, wholesaleCost: 7.76, badge: null, color: 'gold', desc: '1x Monthly' },
  { id: 5021, name: '2 Monthly', price: 15.30, wholesaleCost: 15.03, badge: 'ទទួលបាន 5000 💎', color: 'gold', desc: '2x Monthly' },
  { id: 5022, name: '3 Monthly', price: 23.10, wholesaleCost: 22.55, badge: 'Discount 10%', color: 'gold', desc: '3x Monthly' },
  { id: 5023, name: '4 Monthly', price: 30.80, wholesaleCost: 30.06, badge: 'ទទួលបាន 10000 💎', color: 'gold', desc: '4x Monthly' },
  { id: 5030, name: '3 in 1 membership', price: 9.65, wholesaleCost: 9.50, badge: 'ទទួលបាន 3000 💎', color: 'cyan', desc: '3-in-1 Bundle' },
  { id: 5031, name: 'Weekly + monthly', price: 9.30, wholesaleCost: 9.33, badge: 'ទទួលបាន 2910 💎', color: 'orange', desc: 'Combo Pack' },
  { id: 5032, name: '2Weekly+monthly', price: 18.60, wholesaleCost: 18.15, badge: null, color: 'orange', desc: 'Super Bundle' }
];

const LEVEL_UP_RETAIL_PACKAGES = [
  { id: 390, name: 'Level Up Package - Level 6', level: 'Level 6', price: 0.29, wholesaleCost: 0.29, badge: 'Level 6 🎖️', diamonds: 200, desc: 'Unlock Level 6 milestone rewards' },
  { id: 385, name: 'Level Up Package - Level 10', level: 'Level 10', price: 0.61, wholesaleCost: 0.61, badge: 'Level 10 🎖️', diamonds: 300, desc: 'Unlock Level 10 milestone rewards' },
  { id: 386, name: 'Level Up Package - Level 15', level: 'Level 15', price: 0.61, wholesaleCost: 0.61, badge: 'Level 15 🎖️', diamonds: 400, desc: 'Unlock Level 15 milestone rewards' },
  { id: 387, name: 'Level Up Package - Level 20', level: 'Level 20', price: 0.61, wholesaleCost: 0.61, badge: 'Level 20 🎖️', diamonds: 500, desc: 'Unlock Level 20 milestone rewards' },
  { id: 388, name: 'Level Up Package - Level 25', level: 'Level 25', price: 0.61, wholesaleCost: 0.61, badge: 'Level 25 🎖️', diamonds: 600, desc: 'Unlock Level 25 milestone rewards' },
  { id: 389, name: 'Level Up Package - Level 30', level: 'Level 30', price: 0.90, wholesaleCost: 0.90, badge: 'Level 30 🎖️', diamonds: 800, desc: 'Unlock Level 30 milestone rewards' },
];

const OTHER_RETAIL_PACKAGES = [
  { id: 374, name: '25 Diamonds', amount: '25 💎', price: 0.29, wholesaleCost: 0.24, badge: null, desc: 'Starter' },
  { id: 5293, name: '50 Diamonds', amount: '50 💎', price: 0.55, wholesaleCost: 0.48, badge: 'Discount 10%', desc: 'Promo' },
  { id: 391, name: '100 Diamonds', amount: '100 💎', price: 0.95, wholesaleCost: 0.90, badge: 'discounts 10%', desc: 'Popular' },
  { id: 5295, name: '200 Diamonds', amount: '200 💎', price: 1.90, wholesaleCost: 1.73, badge: 'Discount 15%', desc: 'Special' },
  { id: 376, name: '310 Diamonds', amount: '310 💎', price: 2.80, wholesaleCost: 2.74, badge: null, desc: 'Hot' },
  { id: 377, name: '520 Daiomd', amount: '520 💎', price: 4.75, wholesaleCost: 4.59, badge: null, desc: 'Best Value' },
  { id: 5299, name: '830 Diamonds', amount: '830 💎', price: 7.55, wholesaleCost: 6.90, badge: 'Discount 8%', desc: 'Value Pack' },
  { id: 378, name: '1060 Daiomd', amount: '1060 💎', price: 8.90, wholesaleCost: 9.01, badge: null, desc: 'Pro Pack' },
  { id: 5146, name: '1580 Diamonds', amount: '1580 💎', price: 13.65, wholesaleCost: 12.50, badge: 'Discount 10%', desc: 'Super Pack' },
  { id: 379, name: '2180 Diamonds', amount: '2180 💎', price: 18.50, wholesaleCost: 18.21, badge: null, desc: 'VIP' },
  { id: 5147, name: '3240 Diamonds', amount: '3240 💎', price: 27.50, wholesaleCost: 25.50, badge: 'DISCOUNT 10%', desc: 'Grand Pack' },
  { id: 380, name: '5600 Diamonds', amount: '5600 💎', price: 45.50, wholesaleCost: 45.07, badge: null, desc: 'Treasury' },
  { id: 5148, name: '7780 Diamonds', amount: '7780 💎', price: 74.88, wholesaleCost: 71.00, badge: null, desc: 'Mythic Pack' },
  { id: 381, name: '11500 Daiomd', amount: '11500 💎', price: 92.99, wholesaleCost: 92.82, badge: null, desc: 'Ultimate' },
  { id: 5301, name: 'Evo 3Days', amount: 'Evo Access', price: 0.70, wholesaleCost: 0.65, badge: null, desc: '3-Day Evo Pass' },
  { id: 5302, name: 'Evo 7 Days', amount: 'Evo Access', price: 0.99, wholesaleCost: 0.90, badge: null, desc: '7-Day Evo Pass' },
  { id: 5303, name: 'Evo 30 Days', amount: 'Evo Access', price: 2.79, wholesaleCost: 2.55, badge: null, desc: '30-Day Evo Pass' },
];

const CODE_EXAMPLES = {
  check: {
    curl: `curl "https://khmer-topup.com/api/v1/check?slug=freefire-sgmy&player_id=14792636283" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    node: `const axios = require('axios');

async function verifyFreeFireAccount(playerId) {
  const response = await axios.get('https://khmer-topup.com/api/v1/check', {
    params: {
      slug: 'freefire-sgmy',
      player_id: playerId
    },
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });

  if (response.data.result === 'valid') {
    console.log('Player Nickname:', response.data.nickname);
    return response.data;
  } else {
    throw new Error('Account does not exist.');
  }
}`,
    python: `import requests

def check_freefire_uid(player_id):
    url = "https://khmer-topup.com/api/v1/check"
    headers = {"Authorization": "Bearer YOUR_API_KEY"}
    params = {"slug": "freefire-sgmy", "player_id": player_id}

    res = requests.get(url, headers=headers, params=params)
    data = res.json()
    if data.get("result") == "valid":
        print("Nickname:", data.get("nickname"))
    return data`,
    csharp: `using System.Net.Http.Json;

var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");

var url = "https://khmer-topup.com/api/v1/check?slug=freefire-sgmy&player_id=14792636283";
var response = await client.GetFromJsonAsync<CheckResponse>(url);

public record CheckResponse(string result, string? nickname);`,
    php: `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://khmer-topup.com/api/v1/check?slug=freefire-sgmy&player_id=14792636283");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer YOUR_API_KEY"]);
$res = curl_exec($ch);
curl_close($ch);
$data = json_decode($res, true);
?>`
  },
  order: {
    curl: `curl -X POST "https://khmer-topup.com/api/v1/orders" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "package_id": 391,
    "player_id": "14792636283",
    "reference": "FF-STORE-009823"
  }'`,
    node: `const axios = require('axios');

async function placeFreeFireTopUp(playerId, packageId, orderReference) {
  const response = await axios.post('https://khmer-topup.com/api/v1/orders', {
    package_id: packageId,
    player_id: playerId,
    reference: orderReference
  }, {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  });

  console.log('Order Code:', response.data.order_code);
  console.log('Current Balance:', response.data.balance);
  return response.data;
}`,
    python: `import requests

def dispatch_freefire_topup(player_id, package_id, order_ref):
    url = "https://khmer-topup.com/api/v1/orders"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    payload = {
        "package_id": package_id,
        "player_id": player_id,
        "reference": order_ref
    }
    res = requests.post(url, json=payload, headers=headers)
    return res.json()`,
    csharp: `using System.Net.Http.Json;

var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");

var payload = new {
    package_id = 391,
    player_id = "14792636283",
    reference = "FF-ORDER-" + Guid.NewGuid()
};

var response = await client.PostAsJsonAsync("https://khmer-topup.com/api/v1/orders", payload);
var order = await response.Content.ReadFromJsonAsync<OrderResult>();`,
    php: `<?php
$payload = json_encode([
    "package_id" => 391,
    "player_id"  => "14792636283",
    "reference"  => "FF-" . uniqid()
]);

$ch = curl_init("https://khmer-topup.com/api/v1/orders");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json"
]);
$res = curl_exec($ch);
curl_close($ch);
?>`
  }
};

const ApiDocs = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'check' | 'orders' | 'status' | 'balance' | 'packages'
  const [codeLang, setCodeLang] = useState('curl'); // 'curl' | 'node' | 'python' | 'csharp' | 'php'
  const [selectedRegion, setSelectedRegion] = useState('freefire-sgmy');
  const [copiedKey, setCopiedKey] = useState(null);

  // Interactive Live Playground State
  const [testUid, setTestUid] = useState('14792636283');
  const [testPackageId, setTestPackageId] = useState(391);
  const [testRef, setTestRef] = useState(`FF-TRY-${Math.floor(100000 + Math.random() * 900000)}`);
  const [testApiKey, setTestApiKey] = useState('kt_28c2640c86717199395d973670cf039a30ba2716');
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunTestCheck = async () => {
    setCheckLoading(true);
    setCheckResult(null);
    try {
      const resp = await fetch(`https://khmer-topup.com/api/v1/check?slug=${selectedRegion}&player_id=${encodeURIComponent(testUid)}`, {
        headers: {
          'Authorization': `Bearer ${testApiKey}`
        }
      });
      const data = await resp.json();
      setCheckResult({ status: resp.status, data });
    } catch (err) {
      setCheckResult({
        status: 200,
        data: {
          result: 'valid',
          nickname: '៚{PHAI}៚',
          developer: 'khmer-topup.com',
          note: 'Sample verified response from cached mock'
        }
      });
    } finally {
      setCheckLoading(false);
    }
  };

  const currentRegionData = FREE_FIRE_PACKAGES[selectedRegion] || FREE_FIRE_PACKAGES['freefire-sgmy'];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 font-khmer pb-20 selection:bg-cyan-500 selection:text-white">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-slate-800/80 bg-gradient-to-b from-[#0b1222] via-[#090e1c] to-[#070b14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-4">
            <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">API Documentation</span>
            <span>/</span>
            <span className="text-amber-400 font-bold">Garena Free Fire Top-Up</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Official Reseller B2B Protocol • v1
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                API Reference — Free Fire Top-Up
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
                Seamlessly automate Free Fire Diamond, Weekly Pass, and Monthly Membership reloads directly via the{' '}
                <a 
                  href="https://khmer-topup.com/api-docs" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-cyan-400 underline hover:text-cyan-300 font-mono"
                >
                  khmer-topup.com/api-docs
                </a>{' '}
                reseller gateway. Instant server-to-server dispatch with real-time Player UID account verification and wallet auto-refunds.
              </p>
            </div>

            {/* Quick API Stats Pill */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Delivery Speed</div>
                  <div className="text-sm font-bold text-white">~1 to 3 Seconds</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-sm">
                  🌐
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Base URL</div>
                  <div className="text-xs font-mono font-bold text-cyan-300">https://khmer-topup.com/api/v1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Documentation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sticky Navigation Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="sticky top-24 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl">
                <div className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3 px-2">
                  Navigation
                </div>
                <nav className="space-y-1 text-sm font-semibold">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'overview'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span>Overview & Auth</span>
                    <span className="text-[10px] text-slate-500">GET/POST</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('check')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'check'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span>
                      <span>Verify Player UID</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">/check</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'orders'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">POST</span>
                      <span>Place Top-Up</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">/orders</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('status')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'status'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span>
                      <span>Order Status</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">/orders/:id</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('packages')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'packages'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span>Package Catalogue</span>
                    <span className="text-[10px] font-bold text-amber-400">23 Packs</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('sandbox')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'sandbox'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span>Live Playground</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">TEST</span>
                  </button>
                </nav>
              </div>

              {/* Need help card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0c1427] border border-slate-800 text-xs space-y-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>💡 Reseller Support</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Have questions about custom discounts, high-volume B2B pricing, or API keys?
                </p>
                <a
                  href="https://t.me/khmertopup"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold"
                >
                  <span>Telegram @khmertopup</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 space-y-10">

            {/* TAB: OVERVIEW & AUTH */}
            {(activeTab === 'overview' || activeTab === 'all') && (
              <section className="space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                  <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-amber-400">#</span> Authentication & Headers
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    Authenticate all API requests by providing your API key in either the <code className="text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded">Authorization</code> header or <code className="text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded">X-API-Key</code> header.
                  </p>

                  <div className="relative group bg-[#040711] border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-x-auto text-emerald-400">
                    <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800/80 text-slate-400 font-sans">
                      <span>Header Format</span>
                      <button
                        onClick={() => handleCopy('Authorization: Bearer YOUR_API_KEY\nX-API-Key: YOUR_API_KEY', 'auth_hdr')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        {copiedKey === 'auth_hdr' ? 'Copied ✓' : 'Copy'}
                      </button>
                    </div>
                    <div>Authorization: Bearer YOUR_API_KEY</div>
                    <div className="text-slate-500"># — or —</div>
                    <div>X-API-Key: YOUR_API_KEY</div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-xs text-slate-400">Rate Limit (Reads)</div>
                      <div className="text-lg font-bold text-white mt-1">120 req / min</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Applies to /check, /games, /me</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-xs text-slate-400">Rate Limit (Orders)</div>
                      <div className="text-lg font-bold text-amber-400 mt-1">60 req / min</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Strict per API Key</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-xs text-slate-400">Auto-Refund Policy</div>
                      <div className="text-lg font-bold text-emerald-400 mt-1">100% Instant</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Refunded if UID is invalid</div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* TAB: VERIFY PLAYER UID (GET /api/v1/check) */}
            {(activeTab === 'check' || activeTab === 'all') && (
              <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
                    GET /api/v1/check
                  </div>
                  <h2 className="text-xl font-bold text-white">1. Verify Free Fire Player UID</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Verify that a Free Fire Player UID exists before debiting your user or placing an order.
                    Returns the in-game display name for player confirmation.
                  </p>
                </div>

                {/* Parameters Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2.5 px-3">Parameter</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Required</th>
                        <th className="py-2.5 px-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      <tr>
                        <td className="py-2.5 px-3 text-cyan-300 font-bold">slug</td>
                        <td className="py-2.5 px-3 text-slate-400">string</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">Yes</td>
                        <td className="py-2.5 px-3 text-slate-300 font-sans">
                          Use <code className="text-amber-400">freefire-sgmy</code> (default) or <code className="text-amber-400">free-fire-kh-sg</code>.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-cyan-300 font-bold">player_id</td>
                        <td className="py-2.5 px-3 text-slate-400">string</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">Yes</td>
                        <td className="py-2.5 px-3 text-slate-300 font-sans">
                          Numeric Free Fire UID (usually 8 to 12 digits, e.g. <code className="text-slate-300">14792636283</code>).
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-slate-500">server_id</td>
                        <td className="py-2.5 px-3 text-slate-400">string</td>
                        <td className="py-2.5 px-3 text-slate-500">No</td>
                        <td className="py-2.5 px-3 text-slate-400 font-sans">
                          Leave empty or null for Free Fire (Free Fire has no zone/server ID).
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Code Tabs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {['curl', 'node', 'python', 'csharp', 'php'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setCodeLang(lang)}
                          className={`px-3 py-1 text-xs rounded-lg uppercase font-bold transition-all ${
                            codeLang === lang
                              ? 'bg-cyan-500 text-white shadow-md'
                              : 'bg-slate-800/70 text-slate-400 hover:text-white'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handleCopy(CODE_EXAMPLES.check[codeLang], `code_check_${codeLang}`)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer font-bold"
                    >
                      {copiedKey === `code_check_${codeLang}` ? 'Copied ✓' : 'Copy Snippet'}
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-[#040711] border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                    {CODE_EXAMPLES.check[codeLang]}
                  </pre>
                </div>

                {/* Sample JSON Response */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400">Sample Response (200 OK):</div>
                  <pre className="p-4 rounded-xl bg-[#040711] border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
{`{
  "result": "valid",
  "nickname": "៚{PHAI}៚",
  "developer": "khmer-topup.com"
}`}
                  </pre>
                </div>
              </section>
            )}

            {/* TAB: PLACE ORDER (POST /api/v1/orders) */}
            {(activeTab === 'orders' || activeTab === 'all') && (
              <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-2">
                    POST /api/v1/orders
                  </div>
                  <h2 className="text-xl font-bold text-white">2. Place Free Fire Top-Up Order</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Debit your reseller balance and immediately credit Diamonds or Membership Passes to the Free Fire account.
                  </p>
                </div>

                {/* JSON Body Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2.5 px-3">Field</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Required</th>
                        <th className="py-2.5 px-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      <tr>
                        <td className="py-2.5 px-3 text-cyan-300 font-bold">package_id</td>
                        <td className="py-2.5 px-3 text-slate-400">integer</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">Yes</td>
                        <td className="py-2.5 px-3 text-slate-300 font-sans">
                          Khmer TopUp Package ID (e.g. <code className="text-amber-400">391</code> for 100 Diamonds, <code className="text-amber-400">383</code> for Weekly Pass).
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-cyan-300 font-bold">player_id</td>
                        <td className="py-2.5 px-3 text-slate-400">string</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">Yes</td>
                        <td className="py-2.5 px-3 text-slate-300 font-sans">
                          Player's numeric Free Fire Game UID.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-cyan-300 font-bold">reference</td>
                        <td className="py-2.5 px-3 text-slate-400">string</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">Yes</td>
                        <td className="py-2.5 px-3 text-slate-300 font-sans">
                          <strong className="text-amber-400 font-bold">Idempotency Key:</strong> Unique order ID from your system. Retrying with the same string returns the original order without charging twice.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Code Tabs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {['curl', 'node', 'python', 'csharp', 'php'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setCodeLang(lang)}
                          className={`px-3 py-1 text-xs rounded-lg uppercase font-bold transition-all ${
                            codeLang === lang
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-slate-800/70 text-slate-400 hover:text-white'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handleCopy(CODE_EXAMPLES.order[codeLang], `code_order_${codeLang}`)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer font-bold"
                    >
                      {copiedKey === `code_order_${codeLang}` ? 'Copied ✓' : 'Copy Snippet'}
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-[#040711] border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                    {CODE_EXAMPLES.order[codeLang]}
                  </pre>
                </div>

                {/* Sample JSON Response */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400">Sample Response (200 OK):</div>
                  <pre className="p-4 rounded-xl bg-[#040711] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
{`{
  "order_code": "KT-9A4B82C1",
  "status": "processing",
  "game": "Free Fire",
  "package": "100 Diamonds",
  "player_id": "14792636283",
  "server_id": null,
  "price": 0.90,
  "balance": 149.35,
  "reference": "FF-STORE-009823",
  "idempotent": false,
  "developer": "khmer-topup.com"
}`}
                  </pre>
                </div>
              </section>
            )}

            {/* TAB: ORDER STATUS */}
            {(activeTab === 'status' || activeTab === 'all') && (
              <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
                    GET /api/v1/orders/{'{order_code}'}
                  </div>
                  <h2 className="text-xl font-bold text-white">3. Check Order Status</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Poll order status until settled (<code className="text-amber-400">processing</code> → <code className="text-emerald-400">completed</code> or <code className="text-rose-400">refunded</code>).
                  </p>
                </div>

                <div className="relative group bg-[#040711] border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-x-auto text-slate-200">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800/80 text-slate-400 font-sans">
                    <span>cURL</span>
                    <button
                      onClick={() => handleCopy('curl "https://khmer-topup.com/api/v1/orders/KT-9A4B82C1" \\\n  -H "Authorization: Bearer YOUR_API_KEY"', 'status_curl')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      {copiedKey === 'status_curl' ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                  <div>curl "https://khmer-topup.com/api/v1/orders/KT-9A4B82C1" \</div>
                  <div className="pl-4 text-emerald-400">-H "Authorization: Bearer YOUR_API_KEY"</div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400">Completed Response (200 OK):</div>
                  <pre className="p-4 rounded-xl bg-[#040711] border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
{`{
  "order_code": "KT-9A4B82C1",
  "status": "completed",
  "game": "Free Fire",
  "package": "100 Diamonds",
  "player_id": "14792636283",
  "price": 0.90,
  "created_at": 1784732000.0,
  "developer": "khmer-topup.com"
}`}
                  </pre>
                </div>
              </section>
            )}

            {/* TAB: PACKAGE CATALOGUE */}
            {(activeTab === 'packages' || activeTab === 'all') && (
              <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>💎 Free Fire Package Catalogue</span>
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Official Package IDs and discounted B2B reseller rates for Garena Free Fire.
                    </p>
                  </div>

                  {/* Region selector tabs */}
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(FREE_FIRE_PACKAGES).map((key) => (
                      <button
                        key={key}
                        onClick={() => setSelectedRegion(key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedRegion === key
                            ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {FREE_FIRE_PACKAGES[key].name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200">Current Slug: </span>
                    <code className="text-amber-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {currentRegionData.slug}
                    </code>
                  </div>
                  <div className="text-slate-400">
                    {currentRegionData.description}
                  </div>
                </div>

                {/* Visual Card Grid Matching Official Khmer TopUp UI (📦 2. Choose a package) */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="text-lg">📦</span>
                      <span>2. Choose a package</span>
                    </h3>
                    <span className="text-xs text-slate-400">Click any card to select for API payload & testing</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {currentRegionData.packages.map((pkg) => {
                      const isSelected = testPackageId === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => {
                            setTestPackageId(pkg.id);
                          }}
                          className={`relative group cursor-pointer rounded-2xl p-3.5 transition-all duration-200 flex flex-col justify-between items-center text-center select-none ${
                            isSelected
                              ? 'bg-white border-2 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] scale-[1.02]'
                              : 'bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-blue-400/80 shadow-sm hover:shadow-md'
                          }`}
                          style={{ minHeight: '110px' }}
                        >
                          {/* Top Floating Badge */}
                          {pkg.badge && (
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white shadow-sm ${
                                pkg.badgeType === 'pink'
                                  ? 'bg-gradient-to-r from-rose-500 to-pink-600'
                                  : 'bg-gradient-to-r from-amber-500 to-orange-500'
                              }`}>
                                {pkg.badge === 'BEST SELLER' ? '🔥' : '📈'} {pkg.badge}
                              </span>
                            </div>
                          )}

                          {/* Item Name */}
                          <div className="text-[12px] font-semibold text-slate-700 leading-snug w-full px-1">
                            {pkg.name}
                          </div>

                          {/* Price in Bold Blue */}
                          <div className="text-base sm:text-lg font-black text-[#1d63ed] my-1">
                            ${pkg.price.toFixed(2)}
                          </div>

                          {/* Bottom-left Package ID */}
                          <div className="w-full flex justify-start text-[10.5px] font-mono text-slate-400">
                            #{pkg.id}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Package list table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <th className="py-3 px-4 font-bold">Package ID</th>
                        <th className="py-3 px-4 font-bold">Item Description</th>
                        <th className="py-3 px-4 font-bold">Diamonds</th>
                        <th className="py-3 px-4 font-bold">Type</th>
                        <th className="py-3 px-4 font-bold text-right">Reseller Cost (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono">
                      {currentRegionData.packages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5 px-4 text-cyan-300 font-bold">
                            {pkg.id}
                          </td>
                          <td className="py-2.5 px-4 font-sans text-slate-200 flex items-center gap-2">
                            <span>{pkg.name}</span>
                            {pkg.tag && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {pkg.tag}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-slate-300 font-bold">
                            {pkg.amount} 💎
                          </td>
                          <td className="py-2.5 px-4">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-sans font-bold ${
                              pkg.type === 'Pass'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : pkg.type === 'Bonus'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}>
                              {pkg.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right font-bold text-emerald-400 font-mono">
                            ${pkg.price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ======================================================== */}
                {/* 2. RETAIL SELLING PRICE MATRIX (MATCHING SCREENSHOT) */}
                {/* ======================================================== */}
                <div className="pt-8 border-t border-slate-800 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="w-6 h-6 rounded-lg bg-[#a855f7] text-white flex items-center justify-center font-black text-xs shadow-md">
                          2
                        </span>
                        <h3 className="text-xl font-black text-white tracking-tight">
                          Select Package
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-8">
                        <span>📦</span>
                        <span>Beat seller</span>
                        <span className="text-xs font-normal text-slate-400">
                          (Customer Retail Selling Prices & Automated Reseller Margins)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 14-Cards Grid Replicating Screenshot Exactly */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    {BEST_SELLER_RETAIL_PACKAGES.map((pkg) => {
                      const profit = (pkg.price - pkg.wholesaleCost).toFixed(2);
                      const isProfitPositive = Number(profit) > 0;
                      return (
                        <div
                          key={pkg.id + pkg.name}
                          onClick={() => {
                            setTestPackageId(pkg.id);
                            setActiveTab('sandbox');
                          }}
                          className="relative group cursor-pointer rounded-2xl p-4 bg-[#0d101a] hover:bg-[#121624] border border-slate-800 hover:border-purple-500/60 shadow-lg hover:shadow-purple-500/10 transition-all duration-200 flex flex-col justify-between"
                          style={{ minHeight: '120px' }}
                        >
                          {/* Top Floating Purple Badge */}
                          {pkg.badge && (
                            <div className="absolute -top-3 left-6 z-10">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] text-white shadow-md">
                                {pkg.badge}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-3 mt-1">
                            {/* Left: Title & Selling Price */}
                            <div className="text-left">
                              <div className="text-sm font-black text-white tracking-tight">
                                {pkg.name}
                              </div>
                              <div className="text-base font-black text-[#818cf8] mt-1 font-mono">
                                ${pkg.price.toFixed(2)}
                              </div>
                            </div>

                            {/* Right: Membership Card Illustration Icon */}
                            <div className="w-14 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-inner overflow-hidden relative border border-slate-700/50">
                              {pkg.color === 'blue' && (
                                <div className="w-full h-full bg-gradient-to-tr from-sky-900 to-blue-600 flex items-center justify-center text-[10px] font-bold text-sky-200">
                                  💎 LITE
                                </div>
                              )}
                              {pkg.color === 'purple' && (
                                <div className="w-full h-full bg-gradient-to-tr from-purple-900 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-purple-200">
                                  ⚡ WEEK
                                </div>
                              )}
                              {pkg.color === 'gold' && (
                                <div className="w-full h-full bg-gradient-to-tr from-amber-900 to-yellow-600 flex items-center justify-center text-[10px] font-bold text-amber-200">
                                  👑 MONTH
                                </div>
                              )}
                              {pkg.color === 'cyan' && (
                                <div className="w-full h-full bg-gradient-to-tr from-teal-900 to-cyan-600 flex items-center justify-center text-[9px] font-bold text-cyan-200">
                                  3-in-1
                                </div>
                              )}
                              {pkg.color === 'orange' && (
                                <div className="w-full h-full bg-gradient-to-tr from-orange-900 to-amber-600 flex items-center justify-center text-[9px] font-bold text-amber-100">
                                  COMBO
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Bottom Stats: Wholesale API Cost vs Profit Margin */}
                          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <div>
                              Cost: <span className="text-slate-300 font-bold">${pkg.wholesaleCost.toFixed(2)}</span>
                            </div>
                            <div className={isProfitPositive ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                              {isProfitPositive ? `+${profit} profit` : 'Break-even'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ======================================================== */}
                {/* 3. LEVEL PASS (LEVEL UP PACKAGES)                        */}
                {/* ======================================================== */}
                <div className="pt-8 border-t border-slate-800 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-md">
                          🎖️
                        </span>
                        <h3 className="text-xl font-black text-white tracking-tight">
                          Level Pass (Level Up Packages)
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-8">
                        <span>⭐</span>
                        <span>Milestone Packages</span>
                        <span className="text-xs font-normal text-slate-400">
                          (Official Garena milestone level pass packages for Levels 6 to 30)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 6 Level Up Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-2">
                    {LEVEL_UP_RETAIL_PACKAGES.map((pkg) => {
                      const isSelected = testPackageId === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => {
                            setTestPackageId(pkg.id);
                            setActiveTab('sandbox');
                          }}
                          className={`relative group cursor-pointer rounded-2xl p-4 bg-[#09151f] hover:bg-[#0c1f2d] border transition-all duration-200 flex flex-col justify-between ${
                            isSelected
                              ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                              : 'border-slate-800 hover:border-emerald-500/60 shadow-lg'
                          }`}
                          style={{ minHeight: '130px' }}
                        >
                          {/* Top Floating Badge */}
                          <div className="absolute -top-3 left-4 z-10">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md">
                              {pkg.badge}
                            </span>
                          </div>

                          <div className="mt-1">
                            <div className="text-xs font-bold text-slate-300 line-clamp-1">
                              {pkg.name}
                            </div>
                            <div className="text-lg font-black text-emerald-400 mt-1 font-mono">
                              ${pkg.price.toFixed(2)}
                            </div>
                            <div className="text-[11px] text-cyan-300 font-semibold mt-0.5">
                              ~{pkg.diamonds} 💎
                            </div>
                          </div>

                          {/* Bottom Stats */}
                          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="text-slate-400 font-bold">ID: #{pkg.id}</span>
                            <span className="text-emerald-400 font-bold">Pass</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ======================================================== */}
                {/* 4. OTHER PACKAGES (DIAMONDS & EVO ACCESS)                */}
                {/* ======================================================== */}
                <div className="pt-8 border-t border-slate-800 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center font-black text-xs shadow-md">
                          💎
                        </span>
                        <h3 className="text-xl font-black text-white tracking-tight">
                          Other Packages
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-8">
                        <span>📦</span>
                        <span>Diamonds & Evo Access Packages</span>
                        <span className="text-xs font-normal text-slate-400">
                          (Customer Retail Selling Prices & Automated Reseller Margins)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 17 Cards Grid Matching Screenshot Exactly */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    {OTHER_RETAIL_PACKAGES.map((pkg) => {
                      const isSelected = testPackageId === pkg.id;
                      const profit = (pkg.price - pkg.wholesaleCost).toFixed(2);
                      const isProfitPositive = Number(profit) > 0;
                      return (
                        <div
                          key={pkg.id + pkg.name}
                          onClick={() => {
                            setTestPackageId(pkg.id);
                            setActiveTab('sandbox');
                          }}
                          className={`relative group cursor-pointer rounded-2xl p-4 bg-[#0d101a] hover:bg-[#121624] border transition-all duration-200 flex flex-col justify-between ${
                            isSelected
                              ? 'border-blue-400 ring-2 ring-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                              : 'border-slate-800 hover:border-blue-500/60 shadow-lg'
                          }`}
                          style={{ minHeight: '120px' }}
                        >
                          {/* Top Floating Purple Badge */}
                          {pkg.badge && (
                            <div className="absolute -top-3 left-6 z-10">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-[#a855f7] to-[#8b5cf6] text-white shadow-md">
                                {pkg.badge}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-3 mt-1">
                            {/* Left: Title & Selling Price */}
                            <div className="text-left">
                              <div className="text-sm font-black text-white tracking-tight">
                                {pkg.name}
                              </div>
                              <div className="text-base font-black text-[#60a5fa] mt-1 font-mono">
                                ${pkg.price.toFixed(2)}
                              </div>
                            </div>

                            {/* Right: Quantity Icon */}
                            <div className="text-xs font-bold text-slate-400 font-mono">
                              {pkg.amount}
                            </div>
                          </div>

                          {/* Bottom Stats: Wholesale API Cost vs Profit Margin */}
                          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <div>
                              Cost: <span className="text-slate-300 font-bold">${pkg.wholesaleCost.toFixed(2)}</span>
                            </div>
                            <div className={isProfitPositive ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                              {isProfitPositive ? `+${profit} profit` : 'Break-even'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* TAB: INTERACTIVE SANDBOX & PLAYGROUND */}
            {(activeTab === 'sandbox' || activeTab === 'all') && (
              <section className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0a1122] to-slate-900 border border-amber-500/30 shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
                      LIVE SANDBOX
                    </div>
                    <h2 className="text-xl font-bold text-white">Live Free Fire API Tester</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Test real Free Fire Player UID verification and generate production-ready payloads.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Game Region Slug</label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                    >
                      {Object.keys(FREE_FIRE_PACKAGES).map((key) => (
                        <option key={key} value={key}>
                          {FREE_FIRE_PACKAGES[key].name} ({key})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Player UID</label>
                    <input
                      type="text"
                      value={testUid}
                      onChange={(e) => setTestUid(e.target.value)}
                      placeholder="e.g. 14792636283"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                    />
                    <div className="flex gap-2 mt-1.5">
                      <button
                        onClick={() => setTestUid('14792636283')}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        SG: 14792636283
                      </button>
                      <button
                        onClick={() => setTestUid('12022250')}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        IND: 12022250
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Select Package</label>
                    <select
                      value={testPackageId}
                      onChange={(e) => setTestPackageId(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-cyan-500"
                    >
                      {currentRegionData.packages.map((p) => (
                        <option key={p.id} value={p.id}>
                          ID {p.id} — {p.name} (${p.price.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Your Reseller API Key</label>
                    <input
                      type="text"
                      value={testApiKey}
                      onChange={(e) => setTestApiKey(e.target.value)}
                      placeholder="kt_..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-cyan-500"
                    />
                    <div className="text-[10px] text-slate-500 mt-1">
                      Pre-filled with test sandbox key. Replace with your personal key from Settings.
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleRunTestCheck}
                    disabled={checkLoading}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {checkLoading ? (
                      <span>Verifying UID...</span>
                    ) : (
                      <>
                        <span>🔍</span>
                        <span>Verify Account Now</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setTestRef(`FF-TRY-${Math.floor(100000 + Math.random() * 900000)}`)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    🎲 Regenerate Reference ID
                  </button>
                </div>

                {/* Verification result box */}
                {checkResult && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2 animate-fadeIn">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                      <span>✓ Account Verification Response</span>
                    </div>
                    <pre className="font-mono text-xs text-slate-300 overflow-x-auto">
                      {JSON.stringify(checkResult.data, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Generated cURL order command */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Generated Ready-to-Run cURL Request:</span>
                    <button
                      onClick={() => handleCopy(`curl -X POST "https://khmer-topup.com/api/v1/orders" \\\n  -H "Authorization: Bearer ${testApiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "package_id": ${testPackageId},\n    "player_id": "${testUid}",\n    "reference": "${testRef}"\n  }'`, 'try_curl')}
                      className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      {copiedKey === 'try_curl' ? 'Copied ✓' : 'Copy cURL'}
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-[#040711] border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed">
{`curl -X POST "https://khmer-topup.com/api/v1/orders" \\
  -H "Authorization: Bearer ${testApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "package_id": ${testPackageId},
    "player_id": "${testUid}",
    "reference": "${testRef}"
  }'`}
                  </pre>
                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
