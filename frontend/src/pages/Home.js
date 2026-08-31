import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import GameSelection from '../components/GameSelection';
import EventBannerSlider from '../components/EventBannerSlider';

const Home = () => {
  const { t, language } = useLanguage();
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = {
    en: [
      {
        q: "How fast will I receive my MLBB Diamonds?",
        a: "Our automated system delivers diamonds directly to your Mobile Legends account within 10 to 30 seconds after your Bakong KHQR payment is confirmed."
      },
      {
        q: "Do I need to give my MLBB account password?",
        a: "Never! We only need your Player ID and Zone / Server ID. We will never ask for your password or Moonton login credentials."
      },
      {
        q: "Which banking apps can I use to pay with KHQR?",
        a: "You can pay using any Cambodian bank or mobile payment app supporting KHQR, including ABA Mobile, Wing Bank, ACLEDA, Canadia, TrueMoney, Chip Mong, and 30+ others."
      },
      {
        q: "What should I do if I entered the wrong Player ID?",
        a: "Our system includes real-time MLBB account verification that checks your username before payment. If you still have an issue, our 24/7 Telegram support team will help you immediately."
      }
    ],
    km: [
      {
        q: "តើខ្ញុំនឹងទទួលបានគ្រាប់ពេជ្រ MLBB លឿនប៉ុណ្ណា?",
        a: "ប្រព័ន្ធស្វ័យប្រវត្តិនឹងបញ្ជូនគ្រាប់ពេជ្រចូលទៅក្នុងគណនី Mobile Legends របស់អ្នកក្នុងរយៈពេលពី ១០ ទៅ ៣០ វិនាទី បន្ទាប់ពីការទូទាត់តាម Bakong KHQR ត្រូវបានបញ្ជាក់។"
      },
      {
        q: "តើខ្ញុំត្រូវការផ្តល់លេខសម្ងាត់ (Password) នៃគណនី MLBB ដែរឬទេ?",
        a: "មិនដែលត្រូវការទេ! យើងត្រូវការតែ Player ID និង Zone / Server ID របស់អ្នកប៉ុណ្ណោះ។ យើងនឹងមិនទាមទារលេខសម្ងាត់ ឬព័ត៌មាន Moonton របស់អ្នកជាដាច់ខាត។"
      },
      {
        q: "តើខ្ញុំអាចប្រើកម្មវិធីធនាគារណាខ្លះដើម្បីទូទាត់តាម KHQR?",
        a: "អ្នកអាចទូទាត់ប្រាក់ដោយប្រើធនាគារនៅកម្ពុជា ឬកម្មវិធីទូទាត់ប្រាក់តាមទូរស័ព្ទដែលគាំទ្រ KHQR ទាំងអស់ រួមមាន ABA Mobile, Wing, ACLEDA, Canadia, TrueMoney, Chip Mong និង 30+ ផ្សេងទៀត។"
      },
      {
        q: "តើខ្ញុំត្រូវធ្វើដូចម្តេចប្រសិនបើខ្ញុំបញ្ចូល Player ID ខុស?",
        a: "ប្រព័ន្ធរបស់យើងមានមុខងារផ្ទៀងផ្ទាត់គណនី MLBB ក្នុងពេលជាក់ស្តែងដើម្បីពិនិត្យឈ្មោះរបស់អ្នកមុនទូទាត់។ ប្រសិនបើមានបញ្ហា ក្រុមការងារ Telegram 24/7 របស់យើងនឹងជួយអ្នកភ្លាមៗ។"
      }
    ],
    zh: [
      {
        q: "充值后多久能收到 MLBB 钻石？",
        a: "我们的自动化系统将在您的 Bakong KHQR 扫码付款确认后的 10 至 30 秒内，直接将钻石发送至您的 Mobile Legends 游戏邮箱中。"
      },
      {
        q: "我需要提供我的 MLBB 账号密码吗？",
        a: "绝对不需要！我们仅需要您的玩家 ID (Player ID) 和区服 ID (Zone ID)。我们绝不会索取您的游戏密码或任何 Moonton 账号登录凭据。"
      },
      {
        q: "我可以使用哪些手机银行 App 进行 KHQR 支付？",
        a: "您可以使用柬埔寨所有支持 Bakong KHQR 的银行或电子钱包，包括 ABA Mobile、Wing 银行、ACLEDA、加华银行、TrueMoney、集茂银行等 30 多家金融机构。"
      },
      {
        q: "如果我不小心填错了 Player ID 该怎么办？",
        a: "系统在支付前具备实时核对游戏昵称功能。如果您在支付后仍需协助，我们的 24/7 Telegram 在线客服团队会随时为您处理。"
      }
    ]
  };

  const currentFaqs = faqs[language] || faqs.en;

  return (
    <div className="animate-fadeIn">
      {/* Hero Section (Desktop Only - Hidden on Mobile) */}
      <section className="hidden lg:block relative overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-20 border-b border-slate-800">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-bold text-cyan-300 shadow-glow-cyan">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span>{t('hero_badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                {t('hero_title_1')}{' '}
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                  {t('hero_title_highlight')}
                </span>{' '}
                {t('hero_title_2')}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
                {t('hero_desc')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4 pt-2">
                <Link
                  to="/topup"
                  className="btn btn-gold text-sm sm:text-base px-8 py-3.5 sm:py-4 rounded-2xl shadow-glow-gold hover:scale-105 transition-all w-full sm:w-auto font-black uppercase tracking-wider"
                >
                  ⚡ {t('hero_btn_topup')}
                </Link>
                <Link
                  to="/support"
                  className="btn btn-secondary text-xs sm:text-sm px-6 py-3.5 sm:py-4 rounded-2xl w-full sm:w-auto font-semibold"
                >
                  🎧 {t('hero_btn_support')}
                </Link>
              </div>

              {/* Trust Metric Chips */}
              <div className="pt-5 sm:pt-6 grid grid-cols-3 gap-3 sm:gap-4 border-t border-slate-800/80">
                <div>
                  <div className="text-xl sm:text-3xl font-black text-cyan-400">10s</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase">{t('hero_stat_delivery')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-black text-amber-400">100k+</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase">{t('hero_stat_orders')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-black text-emerald-400">4.9/5 ⭐</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase">{t('hero_stat_trust')}</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card (Hidden on Mobile) */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative rounded-3xl p-1 bg-gradient-to-br from-cyan-500 via-indigo-500 to-amber-500 shadow-2xl">
                <div className="bg-slate-950 rounded-[22px] p-5 sm:p-8 space-y-5 sm:space-y-6">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border-2 border-amber-400/70 p-0.5 shadow-glow-gold flex items-center justify-center shrink-0">
                        <img
                          src="/mlbb-logo.png"
                          alt="Mobile Legends"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/mlbb-logo.png';
                          }}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-sm sm:text-base">{t('card_game_title')}</h3>
                        <span className="text-xs text-emerald-400 font-semibold">🟢 {t('card_api_ready')}</span>
                      </div>
                    </div>
                    <span className="badge badge-warning text-[9px] sm:text-[10px]">Hot</span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 sm:space-y-3 text-xs text-slate-300">
                    <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-cyan-400 text-base">⚡</span>
                      <div>
                        <strong className="text-white block text-xs sm:text-sm">{t('card_feat_1_title')}</strong>
                        <span className="text-slate-400 text-[11px]">{t('card_feat_1_desc')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-emerald-400 text-base">🏦</span>
                      <div>
                        <strong className="text-white block text-xs sm:text-sm">{t('card_feat_2_title')}</strong>
                        <span className="text-slate-400 text-[11px]">{t('card_feat_2_desc')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-amber-400 text-base">🛡️</span>
                      <div>
                        <strong className="text-white block text-xs sm:text-sm">{t('card_feat_3_title')}</strong>
                        <span className="text-slate-400 text-[11px]">{t('card_feat_3_desc')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Action */}
                  <Link
                    to="/topup"
                    className="btn btn-primary w-full text-center py-3.5 rounded-xl font-bold tracking-wide shadow-glow-cyan flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    <span>🎮 {t('card_goto_topup')}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News of Event Game Banner Slider */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg">📢</span>
              <h2 className="text-sm sm:text-lg font-black text-white uppercase tracking-wider">
                {t('event_banner_title')}
              </h2>
            </div>
            <span className="text-[10px] sm:text-xs text-amber-400 font-bold hidden sm:inline">
              {t('event_banner_badge')}
            </span>
          </div>

          <EventBannerSlider />
        </div>
      </section>

      {/* Customer Game Selection Section */}
      <GameSelection />
    </div>
  );
};

export default Home;
