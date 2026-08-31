import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useStoreBranding } from '../services/storeBranding';

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const { branding } = useStoreBranding();
  const [activeSection, setActiveSection] = useState('all');

  const brand = branding.storeName || 'Tin-TopUp';
  const facebookUrl = branding.facebookPage || 'https://facebook.com';
  const facebookName = branding.facebookPageName || 'Official Facebook Page';
  const telegramUrl = branding.telegramUrl || 'https://t.me/Peak_Deth';
  const telegramHandle = branding.telegramUsername || '@Peak_Deth';

  // Multi-language legal terms dictionary
  const legalData = {
    km: {
      badge: "📜 ឯកសារច្បាប់ & គោលការណ៍ឯកជនភាពផ្លូវការ",
      title: "លក្ខខណ្ឌ និងកិច្ចព្រមព្រៀងសេវាកម្ម",
      updated: "កាលបរិច្ឆេទធ្វើបច្ចុប្បន្នភាព៖",
      date: "៣១ សីហា ២០២៦",
      jurisdiction: "យុត្តាធិការ៖",
      country: "ព្រះរាជាណាចក្រកម្ពុជា",
      allBtn: "លក្ខខណ្ឌទាំងអស់ (១ - ៧)",
      qTitle: "មានចម្ងល់អំពីលក្ខខណ្ឌសេវាកម្ម?",
      qDesc: "ប្រសិនបើលោកអ្នកមានសំណួរអំពីលក្ខខណ្ឌ និងការទូទាត់ សូមទាក់ទងមកកាន់ផេកហ្វេសប៊ុកផ្លូវការ ឬក្រុមការងារជំនួយរបស់យើង ២៤/៧។",
      fbBtn: "ទស្សនា Facebook Page ផ្លូវការ",
      tgBtn: `ទាក់ទងជំនួយតាម Telegram (${telegramHandle})`,
      topupBtn: "ត្រឡប់ទៅបញ្ចូលពេជ្រ",
      sections: [
        {
          id: '1',
          title: '១. សេចក្តីផ្តើម (INTRODUCTION)',
          icon: '📜',
          content: (
            <div className="space-y-3 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                សូមស្វាគមន៍មកកាន់ <strong className="text-amber-400">{brand}</strong> (&ldquo;យើងខ្ញុំ,&rdquo; &ldquo;ពួកយើង,&rdquo; ឬ &ldquo;ក្រុមហ៊ុន&rdquo;)។ លក្ខខណ្ឌ និងកិច្ចព្រមព្រៀងទាំងនេះ គ្រប់គ្រងលើការចូលប្រើប្រាស់ និងការប្រើប្រាស់គេហទំព័រ និងទំព័រ Facebook ផ្លូវការ{' '}
                <a href={facebookUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline hover:text-cyan-300 font-semibold inline-flex items-center gap-1">
                  <span>📘 {facebookName}</span>
                </a>{' '}
                ព្រមទាំងសេវាកម្មបញ្ចូលទឹកប្រាក់ហ្គេមរបស់យើងខ្ញុំ។
              </p>
              <p>
                តាមរយៈការចូលប្រើប្រាស់ ការស្វែងរក ឬការប្រើប្រាស់គេហទំព័ររបស់យើង លោកអ្នកបានទទួលស្គាល់ថាបានអាន យល់ច្បាស់ និងយល់ព្រមគោរពតាមលក្ខខណ្ឌទាំងនេះ ព្រមទាំងច្បាប់ និងបទប្បញ្ញត្តិជាធរមានទាំងអស់។ ប្រសិនបើលោកអ្នកមិនយល់ព្រមលើផ្នែកណាមួយនៃលក្ខខណ្ឌទាំងនេះទេ សូមកុំប្រើប្រាស់សេវាកម្មរបស់យើង។
              </p>
            </div>
          ),
        },
        {
          id: '2',
          title: '២. សេវាកម្មរបស់យើង (OUR SERVICE)',
          icon: '🎮',
          content: (
            <div className="space-y-3 text-slate-300 text-sm sm:text-base">
              <p>
                <strong className="text-white">{brand}</strong> ផ្តល់សេវាកម្មបញ្ចូលហ្គេមឌីជីថល រួមមាន៖
              </p>
              <ul className="space-y-2 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold text-base mt-0.5">⚡</span>
                  <span>សេវាបញ្ចូលគ្រាប់ពេជ្រ និងកញ្ចប់ពិសេសសម្រាប់ Mobile Legends: Bang Bang (MLBB) និងហ្គេមជាច្រើនទៀត</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold text-base mt-0.5">💎</span>
                  <span>ការទិញរូបិយប័ណ្ណនិម្មិត និងសំបុត្រប្រចាំសប្តាហ៍ (Weekly Diamond Pass)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold text-base mt-0.5">🏦</span>
                  <span>ការទូទាត់ស្វ័យប្រវត្តិតាមរយៈ Bakong KHQR គ្មានកម្រៃសេវា ២៤ ម៉ោង</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-purple-400 font-bold text-base mt-0.5">🌟</span>
                  <span>សេវាកម្មពិនិត្យផ្ទៀងផ្ទាត់ឈ្មោះ Player ID ក្នុងហ្គេមស្វ័យប្រវត្តិមុនពេលទូទាត់</span>
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: '3',
          title: '៣. ការទទួលខុសត្រូវរបស់អ្នកប្រើប្រាស់ (USER RESPONSIBILITIES)',
          icon: '👤',
          content: (
            <div className="space-y-4 text-slate-300 text-sm sm:text-base">
              <div>
                <h4 className="text-white font-bold mb-1.5 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono">៣.១</span>
                  <span>ព័ត៌មានគណនីហ្គេម</span>
                </h4>
                <ul className="space-y-1.5 pl-6 list-disc marker:text-cyan-400">
                  <li>លោកអ្នកមានទំនួលខុសត្រូវទាំងស្រុងក្នុងការបញ្ចូល Player ID និង Server Zone ID ឱ្យបានត្រឹមត្រូវ។</li>
                  <li>សូមផ្ទៀងផ្ទាត់ឈ្មោះក្នុងហ្គេម (In-game Nickname) មុនពេលបន្តស្កេនទូទាត់។</li>
                  <li>យើងខ្ញុំមិនទទួលខុសត្រូវចំពោះការខាតបង់ដែលបណ្តាលមកពីការបញ្ចូល ID ខុសរបស់អ្នកប្រើប្រាស់ឡើយ។</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <h4 className="text-white font-bold mb-1.5 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono">៣.២</span>
                  <span>ការប្រើប្រាស់ត្រឹមត្រូវ</span>
                </h4>
                <ul className="space-y-1.5 pl-6 list-disc marker:text-cyan-400">
                  <li>លោកអ្នកត្រូវតែប្រើប្រាស់គណនីធនាគារស្របច្បាប់ក្នុងការទូទាត់។</li>
                  <li>ហាមឃាត់ដាច់ខាតនូវរាល់សកម្មភាពបន្លំ ការប្រើប្រាស់មធ្យោបាយទូទាត់មិនស្របច្បាប់ ឬការប៉ុនប៉ងជ្រៀតជ្រែកប្រព័ន្ធ។</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          id: '4',
          title: '៤. ការបញ្ជាទិញ និងការទូទាត់ប្រាក់ (ORDERS AND PAYMENTS)',
          icon: '💳',
          content: (
            <div className="space-y-4 text-slate-300 text-sm sm:text-base">
              <div>
                <h4 className="text-white font-bold mb-1.5 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono">៤.១</span>
                  <span>លក្ខខណ្ឌបញ្ជាទិញ</span>
                </h4>
                <p className="pl-6">
                  រាល់ការបញ្ជាទិញទាំងអស់គឺជាការសម្រេចចុងក្រោយ។ ដោយសារលក្ខណៈនៃការបញ្ចូលពេជ្រស្វ័យប្រវត្តិចូលហ្គេមផ្ទាល់ ការបញ្ជាទិញដែលបានដំណើរការរួចមិនអាចលុបចោល ឬស្នើសុំប្រាក់វិញបានឡើយ។
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <h4 className="text-white font-bold mb-1.5 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono">៤.២</span>
                  <span>តម្លៃ និងការទូទាត់</span>
                </h4>
                <ul className="space-y-1.5 pl-6 list-disc marker:text-amber-400">
                  <li>តម្លៃកញ្ចប់ពេជ្រអាចមានការប្រែប្រួលទៅតាមការកំណត់ផ្លូវការដោយពុំចាំបាច់ជូនដំណឹងជាមុន។</li>
                  <li>ការទូទាត់ត្រូវតែធ្វើឡើងតាមរយៈ Bakong KHQR ដែលមានសុវត្ថិភាពនៅលើគេហទំព័រ។</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          id: '5',
          title: '៥. ការដឹកជញ្ជូន និងបញ្ជូនពេជ្រ (DELIVERY)',
          icon: '🚀',
          content: (
            <div className="space-y-2 pl-2 text-slate-300 text-sm sm:text-base">
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>យើងខ្ញុំខិតខំផ្តល់ជូននូវការបញ្ជូនគ្រាប់ពេជ្រភ្លាមៗក្នុងរយៈពេល <strong>១០ ទៅ ៣០ វិនាទី</strong> បន្ទាប់ពីទូទាត់រួច។</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>ពេលវេលានៃការបញ្ជូនអាចប្រែប្រួលតិចតួចអាស្រ័យលើស្ថានភាព Server របស់ក្រុមហ៊ុនហ្គេមដើម។</span>
              </p>
            </div>
          ),
        },
        {
          id: '6',
          title: '៦. ការកំណត់ការទទួលខុសត្រូវ (LIMITATION OF LIABILITY)',
          icon: '⚖️',
          content: (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-sm sm:text-base leading-relaxed">
              យើងខ្ញុំមិនទទួលខុសត្រូវចំពោះការខូចខាតដោយប្រយោល ឬការរអាក់រអួលដែលបណ្តាលមកពីការដាច់ចរន្តអគ្គិសនី ឬបញ្ហា Server របស់ក្រុមហ៊ុនហ្គេមដើមឡើយ។ ការទទួលខុសត្រូវអតិបរមារបស់យើងខ្ញុំគឺមិនលើសពីចំនួនទឹកប្រាក់ដែលលោកអ្នកបានទូទាត់សម្រាប់ការបញ្ជាទិញជាក់ស្តែងនោះទេ។
            </div>
          ),
        },
        {
          id: '7',
          title: '៧. ច្បាប់គ្រប់គ្រង (GOVERNING LAW)',
          icon: '🏛️',
          content: (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-sm sm:text-base leading-relaxed">
              លក្ខខណ្ឌទាំងនេះត្រូវគ្រប់គ្រង និងបកស្រាយស្របតាមច្បាប់នៃ <strong className="text-white">ព្រះរាជាណាចក្រកម្ពុជា</strong>។ រាល់វិវាទដែលកើតឡើងនឹងស្ថិតនៅក្រោមយុត្តាធិការផ្តាច់មុខនៃតុលាការមានសមត្ថកិច្ចនៃព្រះរាជាណាចក្រកម្ពុជា។
            </div>
          ),
        },
        {
          id: 'privacy-notice',
          title: 'ការការពារទិន្នន័យ & ឯកជនភាព (PRIVACY & SECURITY)',
          icon: '🔒',
          content: (
            <div className="space-y-3 text-slate-300 text-sm sm:text-base">
              <p>
                យើងខ្ញុំយកចិត្តទុកដាក់ខ្ពស់បំផុតលើសុវត្ថិភាពទិន្នន័យរបស់អ្នក៖
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <span>🛡️</span> មិនរក្សាទុកលេខសម្ងាត់ (Password)
                  </span>
                  <p className="text-xs text-slate-400">
                    យើងខ្ញុំមិនដែលទាមទារ ឬរក្សាទុកលេខសម្ងាត់ហ្គេម ឬគណនី Moonton របស់អ្នកឡើយ។
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>🏦</span> ការពារសុវត្ថិភាព KHQR កម្រិតខ្ពស់
                  </span>
                  <p className="text-xs text-slate-400">
                    រាល់ប្រតិបត្តិការទូទាត់ទាំងអស់ត្រូវបានការពារដោយប្រព័ន្ធសុវត្ថិភាព Bakong របស់ធនាគារជាតិនៃកម្ពុជា។
                  </p>
                </div>
              </div>
            </div>
          ),
        },
      ]
    },
    en: {
      badge: "📜 Official Legal & Privacy Policy",
      title: "TERMS AND CONDITIONS",
      updated: "Last Updated:",
      date: "August 31, 2026",
      jurisdiction: "Jurisdiction:",
      country: "Cambodia",
      allBtn: "All Terms (1 - 7)",
      qTitle: "Questions About Our Terms?",
      qDesc: "If you have any questions regarding these terms, please contact our official Facebook Page or 24/7 support team.",
      fbBtn: "Official Facebook Page",
      tgBtn: `Telegram Support (${telegramHandle})`,
      topupBtn: "Back to Top Up",
      sections: [
        {
          id: '1',
          title: '1. INTRODUCTION',
          icon: '📜',
          content: (
            <div className="space-y-3 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                Welcome to <strong className="text-amber-400">{brand}</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our,&rdquo; or &ldquo;Company&rdquo;). These Terms and Conditions govern your access to and use of our website, our official Facebook Page{' '}
                <a href={facebookUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline hover:text-cyan-300 font-semibold inline-flex items-center gap-1">
                  <span>📘 {facebookName}</span>
                </a>, and digital gaming recharge services (the &ldquo;Site&rdquo; or &ldquo;Service&rdquo;).
              </p>
              <p>
                By accessing, browsing, or using our Site, you acknowledge that you have read, understood, and agree to be bound by these Terms and all applicable laws and regulations. If you do not agree with any part of these Terms, you must not use our Service.
              </p>
            </div>
          ),
        },
        {
          id: '2',
          title: '2. OUR SERVICE',
          icon: '🎮',
          content: (
            <div className="space-y-3 text-slate-300 text-sm sm:text-base">
              <p>
                <strong className="text-white">{brand}</strong> provides digital gaming services, including but not limited to:
              </p>
              <ul className="space-y-2 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold text-base mt-0.5">⚡</span>
                  <span>Instant diamond top-up services for Mobile Legends: Bang Bang (MLBB) and various online games</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold text-base mt-0.5">💎</span>
                  <span>Weekly Diamond Passes, Starlight Passes, and special event bundle purchases</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold text-base mt-0.5">🏦</span>
                  <span>Zero-fee automated payments via National Bank of Cambodia Bakong KHQR</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-purple-400 font-bold text-base mt-0.5">🌟</span>
                  <span>Real-time in-game Player ID verification before payment</span>
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: '3',
          title: '3. USER RESPONSIBILITIES',
          icon: '👤',
          content: (
            <div className="space-y-4 text-slate-300 text-sm sm:text-base">
              <div>
                <h4 className="text-white font-bold mb-1.5 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono">3.1</span>
                  <span>Account Information</span>
                </h4>
                <ul className="space-y-1.5 pl-6 list-disc marker:text-cyan-400">
                  <li>You are solely responsible for providing accurate Player ID and Zone ID for the delivery of purchased items.</li>
                  <li>You must verify your in-game nickname on the check screen before paying.</li>
                  <li>We are not liable for any losses resulting from incorrect Player ID provided by you.</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <h4 className="text-white font-bold mb-1.5 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono">3.2</span>
                  <span>Acceptable Use</span>
                </h4>
                <ul className="space-y-1.5 pl-6 list-disc marker:text-cyan-400">
                  <li>You must use valid payment accounts authorized for your use.</li>
                  <li>You agree to use the Site in accordance with all applicable Cambodian and international regulations.</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          id: '4',
          title: '4. ORDERS AND PAYMENTS',
          icon: '💳',
          content: (
            <div className="space-y-4 text-slate-300 text-sm sm:text-base">
              <div>
                <h4 className="text-white font-bold mb-1.5 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono">4.1</span>
                  <span>Order Terms</span>
                </h4>
                <p className="pl-6">
                  All orders are final and binding. Because diamond top-ups are automatically dispatched in real-time, no cancellations, modifications, or refunds are permitted once an order has been completed.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <h4 className="text-white font-bold mb-1.5 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono">4.2</span>
                  <span>Pricing and Payment</span>
                </h4>
                <ul className="space-y-1.5 pl-6 list-disc marker:text-amber-400">
                  <li>Prices are subject to change without prior notice based on official publisher updates.</li>
                  <li>Payment must be made through available secure methods (Bakong KHQR) on the Site.</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          id: '5',
          title: '5. DELIVERY',
          icon: '🚀',
          content: (
            <div className="space-y-2 pl-2 text-slate-300 text-sm sm:text-base">
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>We strive to provide automated instant delivery within <strong>10 to 30 seconds</strong> to your game account.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Delivery times may occasionally vary depending on publisher game server load and maintenance.</span>
              </p>
            </div>
          ),
        },
        {
          id: '6',
          title: '6. LIMITATION OF LIABILITY',
          icon: '⚖️',
          content: (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-sm sm:text-base leading-relaxed">
              We shall not be liable for any indirect, incidental, or consequential damages resulting from upstream game server maintenance or incorrect ID input. Our total liability shall not exceed the amount paid for the specific order.
            </div>
          ),
        },
        {
          id: '7',
          title: '7. GOVERNING LAW',
          icon: '🏛️',
          content: (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-sm sm:text-base leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of <strong className="text-white">Cambodia</strong>. Any disputes shall be subject to the exclusive jurisdiction of the courts of Cambodia.
            </div>
          ),
        },
        {
          id: 'privacy-notice',
          title: 'PRIVACY & DATA PROTECTION',
          icon: '🔒',
          content: (
            <div className="space-y-3 text-slate-300 text-sm sm:text-base">
              <p>
                We take your privacy seriously. Here is how your data is handled:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <span>🛡️</span> Zero Passwords Stored
                  </span>
                  <p className="text-xs text-slate-400">
                    We never ask for or store your game passwords, email credentials, or private Moonton keys.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>🏦</span> Encrypted KHQR Transactions
                  </span>
                  <p className="text-xs text-slate-400">
                    All payments are processed securely via National Bank of Cambodia Bakong KHQR with end-to-end security.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
      ]
    },
    zh: {
      badge: "📜 官方法律条款与隐私保护政策",
      title: "服务条款与隐私政策",
      updated: "最后更新日期：",
      date: "2026年8月31日",
      jurisdiction: "司法管辖区：",
      country: "柬埔寨王国",
      allBtn: "全部条款 (1 - 7)",
      qTitle: "关于服务条款有任何疑问？",
      qDesc: "如果您对条款或充值流程有任何疑问，请随时联系我们的官方 Facebook 主页或 24/7 客服团队。",
      fbBtn: "官方 Facebook 粉丝主页",
      tgBtn: `Telegram 客服 (${telegramHandle})`,
      topupBtn: "返回充值首页",
      sections: [
        {
          id: '1',
          title: '1. 引言 (INTRODUCTION)',
          icon: '📜',
          content: (
            <div className="space-y-3 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                欢迎使用 <strong className="text-amber-400">{brand}</strong>（以下简称“我们”或“公司”）。本《服务条款与条件》适用于您访问和使用我们的网站平台以及官方 Facebook 专页{' '}
                <a href={facebookUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline hover:text-cyan-300 font-semibold inline-flex items-center gap-1">
                  <span>📘 {facebookName}</span>
                </a>{' '}
                及各项游戏充值服务。
              </p>
              <p>
                访问、浏览或使用本网站，即表示您已阅读、理解并同意受本条款及所有适用法律法规的约束。如果您不同意本条款的任何部分，请勿使用我们的服务。
              </p>
            </div>
          ),
        },
        {
          id: '2',
          title: '2. 我们的服务 (OUR SERVICE)',
          icon: '🎮',
          content: (
            <div className="space-y-3 text-slate-300 text-sm sm:text-base">
              <p>
                <strong className="text-white">{brand}</strong> 提供数字游戏增值服务，包括但不限于：
              </p>
              <ul className="space-y-2 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold text-base mt-0.5">⚡</span>
                  <span>Mobile Legends: Bang Bang (MLBB) 及主流热门在线游戏的秒级钻石直充</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold text-base mt-0.5">💎</span>
                  <span>周卡 (Weekly Diamond Pass)、星光会员卡及各类活动特惠礼包直充</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold text-base mt-0.5">🏦</span>
                  <span>通过柬埔寨国家银行 Bakong KHQR 实现 0 手续费全自动扫码结算</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-purple-400 font-bold text-base mt-0.5">🌟</span>
                  <span>付款前实时核对游戏 Player ID 昵称防填错服务</span>
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: '3',
          title: '3. 用户责任 (USER RESPONSIBILITIES)',
          icon: '👤',
          content: (
            <div className="space-y-4 text-slate-300 text-sm sm:text-base">
              <div>
                <h4 className="text-white font-bold mb-1.5 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono">3.1</span>
                  <span>账号信息准确性</span>
                </h4>
                <ul className="space-y-1.5 pl-6 list-disc marker:text-cyan-400">
                  <li>您对提供正确的 Player ID 和 Zone ID 负有全部责任。</li>
                  <li>请在扫码支付前仔细核对核显的游戏角色昵称。</li>
                  <li>因用户提供错误 ID 导致的充值损失，本平台概不承担责任。</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <h4 className="text-white font-bold mb-1.5 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono">3.2</span>
                  <span>合规使用</span>
                </h4>
                <ul className="space-y-1.5 pl-6 list-disc marker:text-cyan-400">
                  <li>您必须使用拥有合法使用权的银行账户进行付款。</li>
                  <li>严禁任何欺诈、洗钱或恶意攻击系统的违法行为。</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          id: '4',
          title: '4. 订单与支付 (ORDERS AND PAYMENTS)',
          icon: '💳',
          content: (
            <div className="space-y-4 text-slate-300 text-sm sm:text-base">
              <div>
                <h4 className="text-white font-bold mb-1.5 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono">4.1</span>
                  <span>订单约束力</span>
                </h4>
                <p className="pl-6">
                  所有订单均为最终交易。由于数字商品全自动秒级直充的特殊性，订单一旦发货完成，不可撤销、更改或退款。
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <h4 className="text-white font-bold mb-1.5 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono">4.2</span>
                  <span>价格与付款</span>
                </h4>
                <ul className="space-y-1.5 pl-6 list-disc marker:text-amber-400">
                  <li>商品价格可能会根据官方汇率与渠道调整而变动，恕不另行通知。</li>
                  <li>所有款项须通过本平台支持的 Bakong KHQR 渠道安全支付。</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          id: '5',
          title: '5. 发货与到账 (DELIVERY)',
          icon: '🚀',
          content: (
            <div className="space-y-2 pl-2 text-slate-300 text-sm sm:text-base">
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>我们承诺在付款成功后 <strong>10 至 30 秒</strong> 内自动直充至您的游戏账号内。</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>若遇游戏官方服务器维护或网络拥堵，到账时间可能会略有延迟。</span>
              </p>
            </div>
          ),
        },
        {
          id: '6',
          title: '6. 责任限制 (LIMITATION OF LIABILITY)',
          icon: '⚖️',
          content: (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-sm sm:text-base leading-relaxed">
              我们不对因游戏官方维护、网络中断或用户误填 ID 引起的间接损失负责。我们的最高责任赔偿金额不超过该笔订单实际收取的款项总额。
            </div>
          ),
        },
        {
          id: '7',
          title: '7. 适用法律 (GOVERNING LAW)',
          icon: '🏛️',
          content: (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-sm sm:text-base leading-relaxed">
              本条款受 <strong className="text-white">柬埔寨王国</strong> 法律管辖并按其解释。由此产生的任何争议均应提交柬埔寨有管辖权的法院专属裁决。
            </div>
          ),
        },
        {
          id: 'privacy-notice',
          title: '隐私安全与数据保护 (PRIVACY & SECURITY)',
          icon: '🔒',
          content: (
            <div className="space-y-3 text-slate-300 text-sm sm:text-base">
              <p>
                我们高度重视您的隐私安全：
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <span>🛡️</span> 零密码存储
                  </span>
                  <p className="text-xs text-slate-400">
                    我们绝不索取或存储您的游戏登录密码、邮箱密码或任何个人凭证。
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>🏦</span> KHQR 金融级加密传输
                  </span>
                  <p className="text-xs text-slate-400">
                    所有交易通过柬埔寨国家银行 Bakong 官方通道加密处理，安全无忧。
                  </p>
                </div>
              </div>
            </div>
          ),
        },
      ]
    }
  };

  const currentData = legalData[language] || legalData['en'];
  const sections = currentData.sections;

  const displayedSections = activeSection === 'all'
    ? sections
    : sections.filter((s) => s.id === activeSection);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3">
          <span>📜</span>
          <span>{currentData.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {currentData.title}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs font-semibold text-slate-400">
          <span>📅 {currentData.updated} <strong className="text-amber-400">{currentData.date}</strong></span>
          <span>•</span>
          <span>📍 {currentData.jurisdiction} <strong className="text-white">{currentData.country}</strong></span>
          <span>•</span>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1 underline"
          >
            <span>📘</span>
            <span>{facebookName}</span>
          </a>
        </div>
      </div>

      {/* Section Quick Jump Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSection('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'all'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md font-black'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          {currentData.allBtn}
        </button>
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveSection(sec.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === sec.id
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>{sec.icon}</span>
            <span>{sec.title}</span>
          </button>
        ))}
      </div>

      {/* Main Content Cards */}
      <div className="space-y-6 mb-10">
        {displayedSections.map((section) => (
          <div
            key={section.id}
            id={`section-${section.id}`}
            className="card border border-slate-800/90 bg-[#0c101d]/90 p-5 sm:p-7 rounded-2xl shadow-xl hover:border-slate-700 transition-all"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80 mb-4">
              <span className="text-2xl">{section.icon}</span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                {section.title}
              </h2>
            </div>
            <div>
              {section.content}
            </div>
          </div>
        ))}
      </div>

      {/* Contact & Support Notice */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950 border border-slate-800 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-2xl mx-auto text-sky-400">
          🎧
        </div>
        <div>
          <h3 className="text-white font-bold text-base sm:text-lg">{currentData.qTitle}</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            {currentData.qDesc}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Facebook Page Button */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <span>📘</span>
            <span>{currentData.fbBtn}</span>
          </a>

          {/* Telegram Support Button */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <span>✈️</span>
            <span>{currentData.tgBtn}</span>
          </a>

          {/* Top Up Button */}
          <Link
            to="/topup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-glow-gold hover:scale-105 transition-all cursor-pointer"
          >
            <span>⚡</span>
            <span>{currentData.topupBtn}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
