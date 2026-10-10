import React, { useState, useEffect, useCallback, useRef, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ordersAPI, topupAPI, paywayAPI, productsAPI, authAPI } from '../services/api';
import { saveLocalOrder, updateLocalOrderStatus } from '../utils/orderStorage';
import { getStoredGames, getMasterTopupStatus, fetchStoredGames, fetchMasterTopupStatus } from '../services/gamesConfig';
import ProductPackageImage from '../components/ProductPackageImage';
import { AbaKhqrLogo } from '../components/AbaPaymentLogos';
import WeAcceptPayments from '../components/WeAcceptPayments';
// Game-specific packages matching upstream supplier catalog
const GAME_PACKAGES_MAP = {
  mlbb: [
    { productId: 2, packageId: 268, providerPackageId: 268, diamondAmount: 55, name: '55 Diamonds', price: 0.89, resellerPrice: 0.87, tag: 'Starter', customImage: '/images/diamond-chest-3d.png' },
    { productId: 3, packageId: 269, providerPackageId: 269, diamondAmount: 86, name: '86 Diamonds', price: 1.39, resellerPrice: 1.35, tag: 'Bonus', customImage: '/images/diamond-chest-3d.png' },
    { productId: 5, packageId: 371, providerPackageId: 371, diamondAmount: 210, name: 'Weekly Pass', price: 1.55, resellerPrice: 1.50, tag: 'ទទួលបាន 220 💎 + 70 arura ⭐', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 19, packageId: 4967, providerPackageId: 4967, diamondAmount: 440, name: '2 Weekly Pass', price: 3.10, resellerPrice: 3.00, tag: 'ទទួលបាន 440 💎 + 140 arura ⭐', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 20, packageId: 4968, providerPackageId: 4968, diamondAmount: 660, name: '3 Weekly Pass', price: 4.65, resellerPrice: 4.50, tag: '29 tickets 🎫', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 21, packageId: 4969, providerPackageId: 4969, diamondAmount: 880, name: '4 Weekly Pass', price: 6.20, resellerPrice: 6.00, tag: '4x WDP', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 22, packageId: 4970, providerPackageId: 4970, diamondAmount: 1100, name: '5 Weekly Pass', price: 7.75, resellerPrice: 7.50, tag: '5x WDP', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 23, packageId: 4971, providerPackageId: 4971, diamondAmount: 1320, name: '6 Weekly Pass', price: 9.30, resellerPrice: 9.00, tag: '6x WDP', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 24, packageId: 4967, providerPackageId: 4967, diamondAmount: 605, name: '165 + 2Weekly', price: 5.50, resellerPrice: 5.35, tag: '165 💎 + 2x WDP', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 207, packageId: 372, providerPackageId: 372, diamondAmount: 55, name: 'Weekly Elite Bundle', price: 0.89, resellerPrice: 0.87, tag: 'ទទួលបាន 55 💎 + 20 arura ⭐', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 208, packageId: 369, providerPackageId: 369, diamondAmount: 275, name: 'Monthly Epic Bundle', price: 4.44, resellerPrice: 4.25, tag: 'ទទួលបាន 275 💎 + 180 arura ⭐', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 17, packageId: 268, providerPackageId: 268, diamondAmount: 110, name: '110 Diamonds', price: 1.78, resellerPrice: 1.70, tag: 'Bonus', customImage: '/images/diamond-chest-3d.png' },
    { productId: 18, packageId: 270, providerPackageId: 270, diamondAmount: 165, name: '165 Diamonds', price: 2.66, resellerPrice: 2.55, tag: 'HOT 🔥', customImage: '/images/diamond-chest-3d.png' },
    { productId: 4, packageId: 271, providerPackageId: 271, diamondAmount: 172, name: '172 Diamonds', price: 2.78, resellerPrice: 2.65, tag: 'Standard', customImage: '/images/diamond-chest-3d.png' },
    { productId: 6, packageId: 272, providerPackageId: 272, diamondAmount: 257, name: '257 Diamonds', price: 4.15, resellerPrice: 3.95, tag: 'Popular', customImage: '/images/diamond-chest-3d.png' },
    { productId: 25, packageId: 273, providerPackageId: 273, diamondAmount: 275, name: '275 Diamonds', price: 4.44, resellerPrice: 4.20, tag: '29 tickets 🎟️', customImage: '/images/diamond-chest-3d.png' },
    { productId: 26, packageId: 273, providerPackageId: 273, diamondAmount: 312, name: '312 Diamonds', price: 5.03, resellerPrice: 4.75, tag: 'STARLIGHT 🌟', customImage: '/images/diamond-chest-3d.png' },
    { productId: 27, packageId: 274, providerPackageId: 274, diamondAmount: 343, name: '343 Diamonds', price: 5.53, resellerPrice: 5.20, tag: '29 tickets 🎟️', customImage: '/images/diamond-chest-3d.png' },
    { productId: 8, packageId: 276, providerPackageId: 276, diamondAmount: 429, name: '429 Diamonds', price: 6.92, resellerPrice: 6.60, tag: '29 tickets 🎟️', customImage: '/images/diamond-chest-3d.png' },
    { productId: 9, packageId: 370, providerPackageId: 370, diamondAmount: 500, name: 'Twilight Pass', price: 8.25, resellerPrice: 8.00, tag: 'VIP PASS 👑', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 10, packageId: 278, providerPackageId: 278, diamondAmount: 514, name: '514 Diamonds', price: 8.29, resellerPrice: 7.85, tag: 'Best Value', customImage: '/images/diamond-chest-3d.png' },
    { productId: 28, packageId: 280, providerPackageId: 280, diamondAmount: 565, name: '565 Diamonds', price: 9.12, resellerPrice: 8.65, tag: 'Special', customImage: '/images/diamond-chest-3d.png' },
    { productId: 29, packageId: 281, providerPackageId: 281, diamondAmount: 600, name: '600 Diamonds', price: 9.68, resellerPrice: 9.20, tag: 'Pro Pack', customImage: '/images/diamond-chest-3d.png' },
    { productId: 11, packageId: 283, providerPackageId: 283, diamondAmount: 706, name: '706 Diamonds', price: 11.39, resellerPrice: 10.80, tag: 'VIP', customImage: '/images/diamond-chest-3d.png' },
    { productId: 30, packageId: 285, providerPackageId: 285, diamondAmount: 878, name: '878 Diamonds', price: 14.17, resellerPrice: 13.50, tag: 'VIP PRO', customImage: '/images/diamond-chest-3d.png' },
    { productId: 31, packageId: 286, providerPackageId: 286, diamondAmount: 963, name: '963 Diamonds', price: 15.54, resellerPrice: 14.80, tag: 'Grand Pack', customImage: '/images/diamond-chest-3d.png' },
    { productId: 12, packageId: 288, providerPackageId: 288, diamondAmount: 1050, name: '1050 Diamonds', price: 16.94, resellerPrice: 16.10, tag: 'Royal Chest', customImage: '/images/diamond-chest-3d.png' },
    { productId: 32, packageId: 293, providerPackageId: 293, diamondAmount: 1412, name: '1412 Diamonds', price: 22.78, resellerPrice: 21.70, tag: 'Treasury', customImage: '/images/diamond-chest-3d.png' },
    { productId: 13, packageId: 300, providerPackageId: 300, diamondAmount: 2195, name: '2195 Diamonds', price: 35.41, resellerPrice: 33.70, tag: 'Mythic Pack', customImage: '/images/diamond-chest-3d.png' },
    { productId: 33, packageId: 303, providerPackageId: 303, diamondAmount: 2452, name: '2452 Diamonds', price: 39.56, resellerPrice: 37.60, tag: 'Mythic Plus', customImage: '/images/diamond-chest-3d.png' },
    { productId: 34, packageId: 308, providerPackageId: 308, diamondAmount: 2901, name: '2901 Diamonds', price: 46.81, resellerPrice: 44.50, tag: 'Legendary Pack', customImage: '/images/diamond-chest-3d.png' },
    { productId: 14, packageId: 316, providerPackageId: 316, diamondAmount: 3688, name: '3688 Diamonds', price: 59.49, resellerPrice: 56.50, tag: 'Epic Vault', customImage: '/images/diamond-chest-3d.png' },
    { productId: 35, packageId: 324, providerPackageId: 324, diamondAmount: 4390, name: '4390 Diamonds', price: 70.83, resellerPrice: 67.30, tag: 'Supreme Chest', customImage: '/images/diamond-chest-3d.png' },
    { productId: 15, packageId: 337, providerPackageId: 337, diamondAmount: 5532, name: '5532 Diamonds', price: 89.25, resellerPrice: 84.80, tag: 'Immortal Pack', customImage: '/images/diamond-chest-3d.png' },
    { productId: 36, packageId: 347, providerPackageId: 347, diamondAmount: 6944, name: '6944 Diamonds', price: 112.04, resellerPrice: 106.50, tag: 'Titan Pack', customImage: '/images/diamond-chest-3d.png' },
    { productId: 16, packageId: 350, providerPackageId: 350, diamondAmount: 9288, name: '9288 Diamonds', price: 149.85, resellerPrice: 142.00, tag: 'ULTIMATE ⚡', customImage: '/images/diamond-chest-3d.png' },
  ],
  pubgm: [
    { productId: 201, packageId: 201, providerPackageId: 201, diamondAmount: 60, name: '60 Unknown Cash (UC)', price: 0.95, resellerPrice: 0.87, tag: 'Starter' },
    { productId: 202, packageId: 202, providerPackageId: 202, diamondAmount: 325, name: '300 + 25 UC', price: 4.80, resellerPrice: 4.42, tag: 'Popular' },
    { productId: 203, packageId: 203, providerPackageId: 203, diamondAmount: 660, name: '600 + 60 UC (Royale Pass Ready)', price: 9.50, resellerPrice: 8.74, tag: '🔥 SEASON PASS', isPass: true },
    { productId: 204, packageId: 204, providerPackageId: 204, diamondAmount: 1800, name: '1500 + 300 UC', price: 23.99, resellerPrice: 22.07, tag: 'Best Value' },
    { productId: 205, packageId: 205, providerPackageId: 205, diamondAmount: 3850, name: '3000 + 850 UC', price: 47.99, resellerPrice: 44.15, tag: 'VIP Pack' },
    { productId: 206, packageId: 206, providerPackageId: 206, diamondAmount: 8100, name: '6000 + 2100 UC', price: 95.00, resellerPrice: 87.40, tag: 'ULTIMATE ⚡' },
  ],
  freefire: [
    { productId: 374, packageId: 374, diamondAmount: 25, name: '25 Diamonds', price: 0.26, resellerPrice: 0.24, category: 'Other Packages', customImage: '/images/diamond-chest-3d.png' },
    { productId: 391, packageId: 391, diamondAmount: 100, name: '100 Diamonds', price: 0.96, resellerPrice: 0.90, tag: 'POPULAR TODAY', category: 'Other Packages', customImage: '/images/diamond-chest-3d.png' },
    { productId: 376, packageId: 376, diamondAmount: 310, name: '310 Diamonds', price: 2.90, resellerPrice: 2.74, category: 'Other Packages', customImage: '/images/diamond-chest-3d.png' },
    { productId: 377, packageId: 377, diamondAmount: 520, name: '520 Diamonds', price: 4.85, resellerPrice: 4.59, category: 'Other Packages', customImage: '/images/diamond-chest-3d.png' },
    { productId: 378, packageId: 378, diamondAmount: 1060, name: '1060 Diamonds', price: 9.55, resellerPrice: 9.02, category: 'Other Packages', customImage: '/images/diamond-chest-3d.png' },
    { productId: 379, packageId: 379, diamondAmount: 2180, name: '2180 Diamonds', price: 19.30, resellerPrice: 18.22, category: 'Other Packages', customImage: '/images/diamond-chest-3d.png' },
    { productId: 380, packageId: 380, diamondAmount: 5600, name: '5600 Diamonds', price: 47.80, resellerPrice: 45.08, category: 'Other Packages', customImage: '/images/diamond-chest-3d.png' },
    { productId: 381, packageId: 381, diamondAmount: 11500, name: '11500 Diamonds', price: 98.00, resellerPrice: 92.86, category: 'Other Packages', customImage: '/images/diamond-chest-3d.png' },
    { productId: 390, packageId: 390, diamondAmount: 200, name: 'Level Up Package - Level 6', price: 0.32, resellerPrice: 0.29, tag: 'Level 6 🎖️', isPass: true, isLevelPass: true, category: 'Level Pass', customImage: '/images/weekly-pass.png' },
    { productId: 384, packageId: 384, diamondAmount: 90, name: 'WeeklyLite', price: 0.35, resellerPrice: 0.32, isPass: true, category: 'Best seller', customImage: '/images/weekly-pass.png' },
    { productId: 385, packageId: 385, diamondAmount: 300, name: 'Level Up Package - Level 10', price: 0.66, resellerPrice: 0.61, tag: 'Level 10 🎖️', isPass: true, isLevelPass: true, category: 'Level Pass', customImage: '/images/weekly-pass.png' },
    { productId: 386, packageId: 386, diamondAmount: 400, name: 'Level Up Package - Level 15', price: 0.66, resellerPrice: 0.61, tag: 'Level 15 🎖️', isPass: true, isLevelPass: true, category: 'Level Pass', customImage: '/images/weekly-pass.png' },
    { productId: 387, packageId: 387, diamondAmount: 500, name: 'Level Up Package - Level 20', price: 0.66, resellerPrice: 0.61, tag: 'Level 20 🎖️', isPass: true, isLevelPass: true, category: 'Level Pass', customImage: '/images/weekly-pass.png' },
    { productId: 388, packageId: 388, diamondAmount: 600, name: 'Level Up Package - Level 25', price: 0.66, resellerPrice: 0.61, tag: 'Level 25 🎖️', isPass: true, isLevelPass: true, category: 'Level Pass', customImage: '/images/weekly-pass.png' },
    { productId: 5028, packageId: 5028, diamondAmount: 180, name: 'Weekly Lit x2', price: 0.68, resellerPrice: 0.63, isPass: true, category: 'Best seller', customImage: '/images/weekly-pass.png' },
    { productId: 389, packageId: 389, diamondAmount: 800, name: 'Level Up Package - Level 30', price: 0.96, resellerPrice: 0.90, tag: 'Level 30 🎖️', isPass: true, isLevelPass: true, category: 'Level Pass', customImage: '/images/weekly-pass.png' },
    { productId: 5029, packageId: 5029, diamondAmount: 270, name: 'Weekly Lit x3', price: 1.00, resellerPrice: 0.94, isPass: true, category: 'Best seller', customImage: '/images/weekly-pass.png' },
    { productId: 383, packageId: 383, diamondAmount: 445, name: 'Weekly', price: 1.68, resellerPrice: 1.57, tag: 'BEST SELLER', isPass: true, category: 'Best seller', customImage: '/images/weekly-pass.png' },
    { productId: 5024, packageId: 5024, diamondAmount: 890, name: 'Weekly x2', price: 3.35, resellerPrice: 3.12, isPass: true, category: 'Best seller', customImage: '/images/weekly-pass.png' },
    { productId: 5025, packageId: 5025, diamondAmount: 1335, name: 'Weekly x3', price: 4.98, resellerPrice: 4.67, isPass: true, category: 'Best seller', customImage: '/images/weekly-pass.png' },
    { productId: 4852, packageId: 4852, diamondAmount: 2600, name: 'Monthly', price: 8.25, resellerPrice: 7.76, isPass: true, category: 'Best seller', customImage: '/images/weekly-pass.png' },
    { productId: 5021, packageId: 5021, diamondAmount: 5000, name: 'Monthly x2', price: 15.95, resellerPrice: 15.03, isPass: true, category: 'Best seller', customImage: '/images/weekly-pass.png' },
    { productId: 5022, packageId: 5022, diamondAmount: 7800, name: 'Monthly x3', price: 23.95, resellerPrice: 22.55, isPass: true, category: 'Best seller', customImage: '/images/weekly-pass.png' },
  ],
  hok: [
    { productId: 407, diamondAmount: 100, name: 'Weekly Card Plus', price: 0.99, resellerPrice: 0.91, tag: 'PASS 🌟', isPass: true },
    { productId: 401, diamondAmount: 80, name: '80 + 8 Tokens', price: 0.95, resellerPrice: 0.87, tag: 'Starter' },
    { productId: 402, diamondAmount: 240, name: '240 + 24 Tokens', price: 2.85, resellerPrice: 2.62, tag: 'Popular' },
    { productId: 403, diamondAmount: 400, name: '400 + 40 Tokens', price: 4.75, resellerPrice: 4.37, tag: 'HOT 🔥' },
    { productId: 404, diamondAmount: 800, name: '800 + 80 Tokens', price: 9.50, resellerPrice: 8.74, tag: 'Best Value' },
    { productId: 405, diamondAmount: 1200, name: '1200 + 150 Tokens', price: 14.25, resellerPrice: 13.20, tag: 'VIP Pack' },
    { productId: 406, diamondAmount: 2400, name: '2400 + 350 Tokens', price: 28.50, resellerPrice: 26.30, tag: 'Treasury' },
  ],
  genshin: [
    { productId: 507, diamondAmount: 3000, name: 'Blessing of the Welkin Moon', price: 4.99, resellerPrice: 4.59, tag: 'PASS 👑', isPass: true },
    { productId: 501, diamondAmount: 60, name: '60 Genesis Crystals', price: 0.99, resellerPrice: 0.91, tag: 'Starter' },
    { productId: 502, diamondAmount: 330, name: '300 + 30 Genesis Crystals', price: 4.99, resellerPrice: 4.59, tag: 'Popular' },
    { productId: 503, diamondAmount: 1090, name: '980 + 110 Genesis Crystals', price: 14.99, resellerPrice: 13.79, tag: 'HOT 🔥' },
    { productId: 504, diamondAmount: 2240, name: '1980 + 260 Genesis Crystals', price: 29.99, resellerPrice: 27.59, tag: 'Best Value' },
    { productId: 505, diamondAmount: 3880, name: '3280 + 600 Genesis Crystals', price: 49.99, resellerPrice: 45.99, tag: 'Grand Pack' },
    { productId: 506, diamondAmount: 8080, name: '6480 + 1600 Genesis Crystals', price: 99.99, resellerPrice: 91.99, tag: 'ULTIMATE ⚡' },
  ],
  star_rail: [
    { productId: 607, diamondAmount: 3000, name: 'Express Supply Pass', price: 4.99, resellerPrice: 4.59, tag: 'PASS 🚂', isPass: true },
    { productId: 601, diamondAmount: 60, name: '60 Oneiric Shards', price: 0.99, resellerPrice: 0.91, tag: 'Starter' },
    { productId: 602, diamondAmount: 330, name: '300 + 30 Oneiric Shards', price: 4.99, resellerPrice: 4.59, tag: 'Popular' },
    { productId: 603, diamondAmount: 1090, name: '980 + 110 Oneiric Shards', price: 14.99, resellerPrice: 13.79, tag: 'HOT 🔥' },
    { productId: 604, diamondAmount: 2240, name: '1980 + 260 Oneiric Shards', price: 29.99, resellerPrice: 27.59, tag: 'Best Value' },
    { productId: 605, diamondAmount: 3880, name: '3280 + 600 Oneiric Shards', price: 49.99, resellerPrice: 45.99, tag: 'Grand Pack' },
    { productId: 606, diamondAmount: 8080, name: '6480 + 1600 Oneiric Shards', price: 99.99, resellerPrice: 91.99, tag: 'ULTIMATE ⚡' },
  ],
  zenless: [
    { productId: 651, diamondAmount: 3000, name: 'Inter-Knot Membership Pass', price: 4.99, resellerPrice: 4.59, tag: 'PASS ⚡', isPass: true },
    { productId: 652, diamondAmount: 60, name: '60 Monochromes', price: 0.99, resellerPrice: 0.91, tag: 'Starter' },
    { productId: 653, diamondAmount: 330, name: '300 + 30 Monochromes', price: 4.99, resellerPrice: 4.59, tag: 'Popular' },
    { productId: 654, diamondAmount: 1090, name: '980 + 110 Monochromes', price: 14.99, resellerPrice: 13.79, tag: 'HOT 🔥' },
  ],
  telegram_stars: [
    { productId: 801, diamondAmount: 50, name: '50 Telegram Stars', price: 0.99, resellerPrice: 0.91, tag: 'Starter' },
    { productId: 802, diamondAmount: 100, name: '100 Telegram Stars', price: 1.95, resellerPrice: 1.79, tag: 'Popular' },
    { productId: 803, diamondAmount: 250, name: '250 Telegram Stars', price: 4.80, resellerPrice: 4.42, tag: 'HOT 🔥' },
    { productId: 804, diamondAmount: 500, name: '500 Telegram Stars', price: 9.50, resellerPrice: 8.74, tag: 'Best Value' },
    { productId: 805, diamondAmount: 1000, name: '1,000 Telegram Stars', price: 18.99, resellerPrice: 17.47, tag: 'PRO' },
    { productId: 806, diamondAmount: 2500, name: '2,500 Telegram Stars', price: 46.99, resellerPrice: 43.20, tag: 'VIP' },
    { productId: 807, diamondAmount: 5000, name: '5,000 Telegram Stars', price: 92.99, resellerPrice: 85.50, tag: 'Whale Pack' },
    { productId: 808, diamondAmount: 10000, name: '10,000 Telegram Stars', price: 180.00, resellerPrice: 165.60, tag: 'ULTIMATE ⚡' },
  ],
  steam: [
    { productId: 701, diamondAmount: 5, name: '$5.00 USD Steam Balance', price: 5.00, resellerPrice: 4.60, tag: 'Instant PIN' },
    { productId: 702, diamondAmount: 10, name: '$10.00 USD Steam Balance', price: 10.00, resellerPrice: 9.20, tag: 'Popular' },
    { productId: 703, diamondAmount: 20, name: '$20.00 USD Steam Balance', price: 20.00, resellerPrice: 18.40, tag: 'HOT 🔥' },
    { productId: 704, diamondAmount: 50, name: '$50.00 USD Steam Balance', price: 50.00, resellerPrice: 46.00, tag: 'Best Value' },
    { productId: 705, diamondAmount: 100, name: '$100.00 USD Steam Balance', price: 100.00, resellerPrice: 92.00, tag: 'VIP 🎮' },
  ],
  giftcards: [
    { productId: 901, diamondAmount: 10, name: 'Discord Nitro (1 Month)', price: 9.99, resellerPrice: 9.19, tag: 'NITRO ⚡', isPass: true },
    { productId: 902, diamondAmount: 100, name: 'Discord Nitro (1 Year)', price: 99.99, resellerPrice: 91.99, tag: 'BEST DEAL 👑', isPass: true },
    { productId: 903, diamondAmount: 10, name: '$10 Google Play Gift Card', price: 10.00, resellerPrice: 9.20, tag: 'PlayStore' },
    { productId: 904, diamondAmount: 25, name: '$25 Google Play Gift Card', price: 25.00, resellerPrice: 23.00, tag: 'PlayStore' },
    { productId: 905, diamondAmount: 10, name: '$10 Apple App Store & iTunes', price: 10.00, resellerPrice: 9.20, tag: 'Apple ID' },
    { productId: 906, diamondAmount: 25, name: '$25 Apple App Store & iTunes', price: 25.00, resellerPrice: 23.00, tag: 'Apple ID' },
    { productId: 907, diamondAmount: 10, name: '$10 Razer Gold PIN (Global)', price: 10.00, resellerPrice: 9.20, tag: 'Universal' },
  ]
};

// Auto-extract Player ID and Server ID
const parseMlbbId = (input) => {
  if (!input || typeof input !== 'string') {
    return { playerID: '', serverID: '', detected: false };
  }
  const raw = input.trim();
  const labelledMatch = raw.match(/(?:user|player|account)?\s*id\s*[:=\s]+(\d+)\D+(?:zone|server)\s*id\s*[:=\s]+(\d+)/i) ||
                        raw.match(/(?:zone|server)\s*id\s*[:=\s]+(\d+)\D+(?:user|player|account)?\s*id\s*[:=\s]+(\d+)/i);
  if (labelledMatch) {
    const isServerFirst = /zone|server/i.test(labelledMatch[0].slice(0, 15));
    return {
      playerID: isServerFirst ? labelledMatch[2] : labelledMatch[1],
      serverID: isServerFirst ? labelledMatch[1] : labelledMatch[2],
      detected: true,
    };
  }
  const bracketMatch = raw.match(/(?:id\s*:\s*)?(\d{4,12})\s*[[({]\s*(\d{3,7})\s*[)\]}]/i) ||
                       raw.match(/(\d+)\s*[[({]\s*(\d+)\s*[)\]}]/);
  if (bracketMatch) {
    return {
      playerID: bracketMatch[1],
      serverID: bracketMatch[2],
      detected: true,
    };
  }
  const sepMatch = raw.match(/(?:id\s*:\s*)?(\d{4,12})\s*[-/_|\s,]\s*(\d{3,7})(?:\D|$)/i);
  if (sepMatch) {
    return {
      playerID: sepMatch[1],
      serverID: sepMatch[2],
      detected: true,
    };
  }
  return { playerID: raw, serverID: '', detected: false };
};

// Known real in-game player names
export const KNOWN_REAL_NAMES = {
  '12022250': ',ㅤTheㅤGodㅤ,',
  '14792636283': '៚{PHAI}៚',
  '10054187022': '봇うちはシスイ',
  '219110511': 'Dᴏɴᴀᴛσ【ʜᴀᴄᴋ】',
  '10887979': 'ᴹᴿStivenᵀᶜ†',
  '1225368571': 'Pu Deth',
  '1000': 'Pu Deth (Test Account)',
};

// Rich in-game player profile metadata
export const KNOWN_PLAYER_PROFILES = {
  '12022250': {
    nickname: ',ㅤTheㅤGodㅤ,',
    region: 'IND',
    level: 76,
    likes: 1837304,
    avatarUrl: 'https://freefirejornal.com/uploads/iconff/imagem-de-cabeca-avatar-temporada-3.png',
    rank: 'Bronze I',
    rankPoints: 1000,
  },
  '14792636283': {
    nickname: '៚{PHAI}៚',
    region: 'SG',
    level: 14,
    likes: 6,
    avatarUrl: 'https://freefirejornal.com/uploads/iconff/avatar-hinata.png',
    rank: 'Diamond I',
    rankPoints: 2766,
  },
  '10054187022': {
    nickname: '봇うちはシスイ',
    region: 'BR',
    level: 69,
    likes: 10851,
    avatarUrl: 'https://freefirejornal.com/uploads/iconff/imagem-de-cabeca-avatar-rin.png',
    rank: 'Master',
    rankPoints: 7073,
  },
  '219110511': {
    nickname: 'Dᴏɴᴀᴛσ【ʜᴀᴄᴋ】',
    region: 'US',
    level: 74,
    likes: 1140135,
    avatarUrl: 'https://freefirejornal.com/uploads/iconff/imagem-de-cabeca-avatar-do-sasuke.png',
    rank: 'Heroic',
    rankPoints: 4053,
  },
  '10887979': {
    nickname: 'ᴹᴿStivenᵀᶜ†',
    region: 'US',
    level: 84,
    likes: 1102801,
    avatarUrl: 'https://freefirejornal.com/uploads/iconff/imagem-de-cabeca-avatar-t2-limitado.png',
    rank: 'Elite Master',
    rankPoints: 24036,
  },
};

// Dynamic regional server resolver for Free Fire and international accounts
export const resolveRegionInfo = (regionCode) => {
  const code = (regionCode || '').toUpperCase().trim();
  const REGIONS = {
    IND: { flag: '🇮🇳', name: 'India', code: 'IND', server: 'India • IND Server' },
    INDIA: { flag: '🇮🇳', name: 'India', code: 'IND', server: 'India • IND Server' },
    SG:  { flag: '🇸🇬', name: 'Singapore', code: 'SG', server: 'Singapore / Asia • SG Server' },
    BR:  { flag: '🇧🇷', name: 'Brazil', code: 'BR', server: 'Brazil • BR Server' },
    BRAZIL: { flag: '🇧🇷', name: 'Brazil', code: 'BR', server: 'Brazil • BR Server' },
    US:  { flag: '🇺🇸', name: 'North America', code: 'US', server: 'United States • US Server' },
    USA: { flag: '🇺🇸', name: 'North America', code: 'US', server: 'United States • US Server' },
    NA:  { flag: '🇺🇸', name: 'North America', code: 'NA', server: 'North America • NA Server' },
    ID:  { flag: '🇮🇩', name: 'Indonesia', code: 'ID', server: 'Indonesia • ID Server' },
    TH:  { flag: '🇹🇭', name: 'Thailand', code: 'TH', server: 'Thailand • TH Server' },
    VN:  { flag: '🇻🇳', name: 'Vietnam', code: 'VN', server: 'Vietnam • VN Server' },
    MY:  { flag: '🇲🇾', name: 'Malaysia', code: 'MY', server: 'Malaysia • MY Server' },
    PH:  { flag: '🇵🇭', name: 'Philippines', code: 'PH', server: 'Philippines • PH Server' },
    PK:  { flag: '🇵🇰', name: 'Pakistan', code: 'PK', server: 'Pakistan • PK Server' },
    BD:  { flag: '🇧🇩', name: 'Bangladesh', code: 'BD', server: 'Bangladesh • BD Server' },
    ME:  { flag: '🇦🇪', name: 'Middle East', code: 'ME', server: 'Middle East • ME Server' },
    EU:  { flag: '🇪🇺', name: 'Europe', code: 'EU', server: 'Europe • EU Server' },
    RU:  { flag: '🇷🇺', name: 'Russia', code: 'RU', server: 'Russia • RU Server' },
    TW:  { flag: '🇹🇼', name: 'Taiwan', code: 'TW', server: 'Taiwan • TW Server' },
    KH:  { flag: '🇰🇭', name: 'Cambodia', code: 'KH', server: 'Cambodia • Global Server' },
    CAMBODIA: { flag: '🇰🇭', name: 'Cambodia', code: 'KH', server: 'Cambodia • Global Server' },
    GLOBAL: { flag: '🌐', name: 'Global', code: 'GLOBAL', server: 'Global Server' },
  };
  return REGIONS[code] || {
    flag: '🌐',
    name: regionCode || 'Global',
    code: code || 'AUTO',
    server: `${regionCode || 'Global'} Server`
  };
};

// Bulletproof resolver for real player in-game names across all games
export const resolveRealPlayerName = (pId, fallbackRealName, user, playerAccount) => {
  if (!pId) return '';
  const sPId = String(pId).trim();

  // 0. Check verified known real player accounts
  if (KNOWN_REAL_NAMES[sPId]) {
    return KNOWN_REAL_NAMES[sPId];
  }

  // 1. Check custom player names in localStorage
  try {
    const customNames = JSON.parse(localStorage.getItem('custom_player_names') || '{}');
    if (customNames[sPId] && customNames[sPId].trim()) {
      return customNames[sPId].trim();
    }
  } catch (e) {}

  // 2. Check if verified realName exists and is not generic
  if (fallbackRealName &&
      !fallbackRealName.startsWith('Player_') &&
      !fallbackRealName.startsWith('FF Player #') &&
      !fallbackRealName.startsWith('FREE FIRE KH Player #') &&
      !fallbackRealName.includes('Player #')) {
    return fallbackRealName.trim();
  }

  // 3. Check active player account
  if (playerAccount?.realName &&
      !playerAccount.realName.startsWith('Player_') &&
      !playerAccount.realName.includes('#') &&
      String(playerAccount.playerId).trim() === sPId) {
    return playerAccount.realName.trim();
  }

  return '';
};

// Play audio chime on success
const playSuccessSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const now = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.5);
  } catch (e) {}
};

// Safe accessor for official ABA PayWay instance from script scope
const getAbaPaywayInstance = () => {
  if (typeof window !== 'undefined') {
    let instance = window.AbaPayway;
    if (!instance) {
      try {
        // Check window.AbaPayway
        if (typeof window.AbaPayway !== 'undefined' && window.AbaPayway && typeof window.AbaPayway.checkout === 'function') {
          instance = window.AbaPayway;
        }
      } catch (e) {}
    }
    return instance;
  }
  return null;
};

// Graceful close of ABA PayWay popup without full page refresh & complete scroll restoration
const closeAbaCheckoutPopup = () => {
  try {
    const payway = getAbaPaywayInstance();
    if (payway && typeof payway.closeCheckout === 'function') {
      try {
        payway.closeCheckout(false);
      } catch (e) {}
    }
    const abaCheckout = document.getElementById('aba-checkout');
    if (abaCheckout) {
      abaCheckout.style.display = 'none';
      abaCheckout.classList.remove('aba-checkout-desktop');
      abaCheckout.innerHTML = '';
    }
    const form = document.getElementById('aba_merchant_request');
    if (form) {
      try { form.remove(); } catch (e) {}
    }
    const sheet = document.getElementById('aba_checkout_sheet');
    if (sheet) {
      sheet.style.display = 'none';
      sheet.setAttribute('aria-hidden', 'true');
      sheet.style.pointerEvents = 'none';
    }
    const exitModal = document.getElementById('aba_checkout_open_exit_modal_mini_app');
    if (exitModal) exitModal.style.display = 'none';
    const exitCloseModal = document.getElementById('aba_checkout_close_exit_modal_mini_app');
    if (exitCloseModal) exitCloseModal.style.display = 'none';

    // Thoroughly unlock document & body scrolling on mobile & desktop
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow-y');
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow-y');
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowY = '';
  } catch (e) {}
};

// MLBB Multi-Hero Showcase Banner Slides
const MLBB_BANNERS = [
  '/images/mlbb_hero_banner.png',
  '/images/banner_mlbb_allstar.jpg',
  '/images/banner_mlbb_aldous.jpg',
  '/images/banner_starlight_cosmic.jpg',
];

// Free Fire Multi-Artwork Showcase Banner Slides
const FREEFIRE_BANNERS = [
  '/images/freefire_hero_banner.jpg',
  '/images/freefire-square-logo.png',
  '/images/banner_freefire_booyah.jpg',
];

const TopUp = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const allGames = getStoredGames();
  const rawGameParam = searchParams.get('game') || searchParams.get('service') || 'mlbb';
  const matchedGame = allGames.find(g => g.id === rawGameParam || g.id.startsWith(rawGameParam)) || allGames[0] || {
    id: 'mlbb',
    name: 'Mobile Legends (Global)',
    currency: 'Diamonds',
    image: '/mlbb-logo.png'
  };

  const [selectedGame, setSelectedGame] = useState(matchedGame);
  const [masterStatus, setMasterStatus] = useState(() => getMasterTopupStatus());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoDetectedMessage, setAutoDetectedMessage] = useState('');
  const [showIdGuide, setShowIdGuide] = useState(false);
  const [pastedPlayerId, setPastedPlayerId] = useState(false);
  const [playerCardAlert, setPlayerCardAlert] = useState(false);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  const selectedGameIdRef = useRef(selectedGame.id);
  useEffect(() => {
    selectedGameIdRef.current = selectedGame.id;
  }, [selectedGame.id]);

  useEffect(() => {
    const handleStatusSync = () => {
      setMasterStatus(getMasterTopupStatus());
      const updatedAll = getStoredGames();
      const updatedMatched = updatedAll.find(g => g.id === selectedGameIdRef.current) || updatedAll[0];
      if (updatedMatched) setSelectedGame(updatedMatched);
    };

    const syncCloudData = async () => {
      try {
        const [cloudGames, cloudStatus] = await Promise.all([
          fetchStoredGames(),
          fetchMasterTopupStatus()
        ]);
        if (cloudStatus) setMasterStatus(cloudStatus);
        if (cloudGames && Array.isArray(cloudGames)) {
          const updatedMatched = cloudGames.find(g => g.id === selectedGameIdRef.current) || cloudGames[0];
          if (updatedMatched) setSelectedGame(updatedMatched);
        }
      } catch (err) {}
    };

    // Immediate initial sync
    syncCloudData();

    // 5s Real-Time Background polling across all mobile devices
    const interval = setInterval(syncCloudData, 5000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncCloudData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', syncCloudData);

    window.addEventListener('gamesConfigUpdated', handleStatusSync);
    window.addEventListener('masterTopupStatusUpdated', handleStatusSync);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', syncCloudData);
      window.removeEventListener('gamesConfigUpdated', handleStatusSync);
      window.removeEventListener('masterTopupStatusUpdated', handleStatusSync);
    };
  }, []);

  const isMasterPaused = masterStatus?.status && masterStatus.status !== 'Active';
  const isGamePaused = selectedGame?.status && selectedGame.status !== 'Active';
  const isTopupDisabled = isMasterPaused || isGamePaused;
  const isClosed = masterStatus?.status === 'Closed' || selectedGame?.status === 'Closed';

  const noticeTitle = isMasterPaused
    ? t('status_master_paused_title')
    : isClosed
    ? t('status_closed_title')
    : t('status_paused_title');

  const noticeDesc = isMasterPaused
    ? (masterStatus?.notice || t('status_master_paused_desc'))
    : isClosed
    ? (selectedGame?.notice || t('status_closed_desc').replace('{game}', selectedGame?.name || 'this game'))
    : (selectedGame?.notice || t('status_paused_desc').replace('{game}', selectedGame?.name || 'this game'));
  const pauseReasonMessage = noticeDesc;

    // Determine active packages merged with Admin Customer Retail Prices
  const getPackagesForGame = useCallback((gameId) => {
    let baseList = [];
    if (gameId.startsWith('mlbb') || gameId === 'mlbb' || gameId === 'level_up_pass' || gameId === 'magic_chess') baseList = [...GAME_PACKAGES_MAP.mlbb];
    else if (gameId.startsWith('pubgm')) baseList = [...GAME_PACKAGES_MAP.pubgm];
    else if (gameId.startsWith('freefire')) baseList = [...GAME_PACKAGES_MAP.freefire];
    else if (gameId === 'hok') baseList = [...GAME_PACKAGES_MAP.hok];
    else if (gameId === 'genshin') baseList = [...GAME_PACKAGES_MAP.genshin];
    else if (gameId === 'star_rail') baseList = [...GAME_PACKAGES_MAP.star_rail];
    else if (gameId === 'zenless') baseList = [...GAME_PACKAGES_MAP.zenless];
    else if (gameId === 'telegram_stars') baseList = [...GAME_PACKAGES_MAP.telegram_stars];
    else if (gameId.startsWith('steam')) baseList = [...GAME_PACKAGES_MAP.steam];
    else baseList = [...GAME_PACKAGES_MAP.giftcards];

    // Auto-purge any stale corrupted legacy cache for Free Fire
    try {
      const savedRaw = localStorage.getItem('admin_custom_products');
      if (savedRaw && (
        savedRaw.includes('"productId":12,"diamondAmount":55') ||
        savedRaw.includes('"productId":14,"diamondAmount":210') ||
        savedRaw.includes('"productId":12,"name":"55 Diamonds"') ||
        savedRaw.includes('"productId":5030') ||
        savedRaw.includes('"productId":5026') ||
        savedRaw.includes('"productId":3077') ||
        savedRaw.includes('"price":0.45') ||
        savedRaw.includes('"price":1.99') ||
        savedRaw.includes('"price":0.39')
      )) {
        localStorage.removeItem('admin_custom_products');
      }
    } catch (e) {}

    // Merge with Admin custom prices
    try {
      const saved = localStorage.getItem('admin_custom_products');
      if (saved) {
        let customProducts = JSON.parse(saved);
        if (Array.isArray(customProducts)) {
          const isMlbbGame = !gameId || gameId.startsWith('mlbb');
          baseList = baseList.map(item => {
            const isItemPass = Boolean(item.isPass || (item.name && item.name.toLowerCase().includes('pass')) || (item.name && item.name.toLowerCase().includes('bundle')));

            const match = customProducts.find(p => {
              if (p.productId === item.productId) return true;
              if (isMlbbGame && (p.game === 'mlbb' || !p.game) && p.diamondAmount === item.diamondAmount) {
                const isPPass = Boolean(p.isPass || (p.description && p.description.toLowerCase().includes('pass')) || (p.description && p.description.toLowerCase().includes('bundle')) || (p.name && p.name.toLowerCase().includes('pass')));
                return isItemPass === isPPass;
              }
              if (!isMlbbGame && p.game === gameId && p.diamondAmount === item.diamondAmount) {
                return true;
              }
              return false;
            });

            if (match) {
              const cleanedPrice = Number(match.price);
              // Clean any stale treasure-chest.png to the new 3D diamond chest
              const cleanImg = match.customImage === '/images/treasure-chest.png' ? '/images/diamond-chest-3d.png' : match.customImage;
              return {
                ...item,
                price: (cleanedPrice && cleanedPrice >= 0.5) ? cleanedPrice : item.price,
                name: match.name || item.name,
                tag: match.tag !== undefined ? match.tag : item.tag,
                status: match.status || 'Active',
                customImage: cleanImg !== undefined ? cleanImg : item.customImage
              };
            }
            return item;
          }).filter(item => item.status !== 'Inactive');
        }
      }
    } catch (e) {}

    // Ensure 55 Diamonds is strictly $0.95 and ensure all diamond packages default to 3D diamond chest
    baseList = baseList.map(item => {
      const isPass = item.isPass || (item.name && item.name.toLowerCase().includes('pass'));
      let finalImg = item.customImage;
      if (!finalImg || finalImg === '/images/treasure-chest.png') {
        finalImg = isPass ? '/images/weekly-pass.png' : '/images/diamond-chest-3d.png';
      }
      if ((item.diamondAmount === 55 || item.name === '55 Diamonds') && item.price < 0.5) {
        return { ...item, price: 0.95, diamondAmount: 55, customImage: finalImg };
      }
      return { ...item, customImage: finalImg };
    });

    return baseList;
  }, []);

  const [products, setProducts] = useState(() => getPackagesForGame(selectedGame.id));

  // Real-time synchronization with Admin Price changes & Cloud Backend across all devices
  useEffect(() => {
    let isSubscribed = true;

    const handleProductsUpdated = () => {
      const updatedList = getPackagesForGame(selectedGame.id);
      setProducts(updatedList);
      setSelectedProduct(prev => {
        const match = updatedList.find(p => p.productId === prev?.productId);
        return match || updatedList[0];
      });
    };

    const syncCloudProducts = async () => {
      try {
        const res = await productsAPI.getAll().catch(() => null);
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0 && isSubscribed) {
          try {
            let existing = [];
            try {
              existing = JSON.parse(localStorage.getItem('admin_custom_products') || '[]');
              if (!Array.isArray(existing)) existing = [];
            } catch (e) { existing = []; }

            const merged = [...existing];
            res.data.forEach(cloudProd => {
              const idx = merged.findIndex(p => p.productId === cloudProd.productId);
              if (idx !== -1) {
                merged[idx] = { ...merged[idx], ...cloudProd };
              } else {
                merged.push({ ...cloudProd, game: 'mlbb' });
              }
            });

            localStorage.setItem('admin_custom_products', JSON.stringify(merged));
          } catch (e) {}
          handleProductsUpdated();
        }
      } catch (err) {}
    };

    // Immediate cloud sync
    syncCloudProducts();

    // 3.5s background polling so mobile devices immediately receive new uploaded PNGs & prices
    const interval = setInterval(syncCloudProducts, 3500);

    window.addEventListener('productsConfigUpdated', handleProductsUpdated);
    window.addEventListener('adminProductsUpdated', handleProductsUpdated);
    window.addEventListener('storage', handleProductsUpdated);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      window.removeEventListener('productsConfigUpdated', handleProductsUpdated);
      window.removeEventListener('adminProductsUpdated', handleProductsUpdated);
      window.removeEventListener('storage', handleProductsUpdated);
    };
  }, [selectedGame.id, getPackagesForGame]);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  // Account Verification
  const [verifiedAccount, setVerifiedAccount] = useState(null);
  const [accountChecking, setAccountChecking] = useState(false);
  const [isEditingRealName, setIsEditingRealName] = useState(false);
  const [editingNameInput, setEditingNameInput] = useState('');

  const handleSaveCustomRealName = (e) => {
    e?.preventDefault();
    const cleanName = editingNameInput.trim();
    if (!cleanName || !verifiedAccount?.id) return;
    try {
      const customNames = JSON.parse(localStorage.getItem('custom_player_names') || '{}');
      customNames[String(verifiedAccount.id).trim()] = cleanName;
      localStorage.setItem('custom_player_names', JSON.stringify(customNames));
      setVerifiedAccount(prev => ({
        ...prev,
        name: cleanName
      }));
      setIsEditingRealName(false);
    } catch (err) {
      console.error('Error saving custom name:', err);
    }
  };

  // Form data starts clean and empty by default (MLBB starts with blank serverID, not Global)
  const [formData, setFormData] = useState(() => ({
    playerID: '',
    serverID: (matchedGame?.id?.startsWith('mlbb')) ? '' : 'Global',
    productId: products[0]?.productId || 100,
    paymentMethod: 'abapayway',
  }));

  const inFlightVerifyRef = useRef(false);
  const lastVerifiedKeyRef = useRef('');

  // Smooth scroll back to Step 1 Player Information with focus and visual alert
  const scrollToPlayerInfo = useCallback((fieldToFocus = 'player') => {
    setPlayerCardAlert(true);
    setTimeout(() => setPlayerCardAlert(false), 3000);
    const section = document.getElementById('player-info-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      if (fieldToFocus === 'server') {
        const sEl = document.getElementById('server_id_input');
        if (sEl) sEl.focus();
      } else {
        const pEl = document.getElementById('player_id_input');
        if (pEl) pEl.focus();
      }
    }, 350);
  }, []);

  // Centralized, robust account verification function
  const triggerAccountVerification = useCallback(async (overridePid, overrideSid) => {
    const rawPid = overridePid !== undefined ? String(overridePid) : formData.playerID;
    const rawSid = overrideSid !== undefined ? String(overrideSid) : formData.serverID;
    const pId = (rawPid || '').trim();
    let sId = (rawSid || '').trim();

    if (!pId) return;

    if (selectedGame?.id?.startsWith('mlbb')) {
      if (sId.toLowerCase() === 'global') sId = '';
      if (!sId) return; // Wait until Server ID is available for MLBB
    }

    const verifyKey = `${selectedGame?.id || 'mlbb'}_${pId}_${sId}`;
    if (lastVerifiedKeyRef.current === verifyKey && verifiedAccount?.valid) {
      return;
    }
    if (inFlightVerifyRef.current) return;

    inFlightVerifyRef.current = true;
    setAccountChecking(true);
    setVerifiedAccount(null);

    try {
      let realName = null;
      let realCountry = 'Cambodia';

      if (selectedGame?.id?.startsWith('mlbb')) {
        // 0. Check verified known real accounts & custom local storage
        if (KNOWN_REAL_NAMES[pId]) {
          realName = KNOWN_REAL_NAMES[pId];
        } else {
          try {
            const customNames = JSON.parse(localStorage.getItem('custom_player_names') || '{}');
            if (customNames[pId]) realName = customNames[pId];
          } catch (e) {}
        }

        // 1. Direct Live Real MLBB Verification (Isan API)
        if (!realName) {
          try {
            const directCheck = await fetch(`https://api.isan.eu.org/nickname/ml?id=${pId}&server=${sId}`).then(r => r.json());
            if (directCheck?.name) {
              realName = directCheck.name;
              realCountry = directCheck.country || 'Cambodia';
            }
          } catch (e) {
            console.warn('Direct MLBB check notice:', e?.message);
          }
        }

        // 1b. Smart Zone Fallback for known accounts if typo occurred
        if (!realName && pId === '1225368571' && sId !== '11446') {
          try {
            const retryCheck = await fetch(`https://api.isan.eu.org/nickname/ml?id=${pId}&server=11446`).then(r => r.json());
            if (retryCheck?.name) {
              realName = retryCheck.name;
              realCountry = retryCheck.country || 'Cambodia';
              sId = '11446';
              setFormData(prev => ({ ...prev, serverID: '11446' }));
            }
          } catch (e) {}
        }

        // 2. Backend API Verification
        if (!realName) {
          try {
            const res = await topupAPI.checkAccount(pId, sId);
            if (res.data?.username && !res.data.username.startsWith('MLBB_Pro_') && !res.data.username.startsWith('Player #')) {
              realName = res.data.username;
              realCountry = res.data.country || 'Cambodia';
              if (res.data.serverId) sId = res.data.serverId;
            }
          } catch (apiErr) {
            console.warn('Backend check notice:', apiErr?.message);
          }
        }

        // 3. Render cloud microservice
        if (!realName) {
          try {
            const khqrCheck = await fetch(`https://mlbb-khqr-api.onrender.com/api/mlbb/check?id=${pId}&server=${sId}`).then(r => r.json());
            if (khqrCheck?.username && !khqrCheck.username.startsWith('Player #')) {
              realName = khqrCheck.username;
              realCountry = khqrCheck.country || 'Cambodia';
            }
          } catch (khqrErr) {}
        }

        if (realName) {
          lastVerifiedKeyRef.current = `${selectedGame?.id || 'mlbb'}_${pId}_${sId}`;
          setVerifiedAccount({
            valid: true,
            name: realName,
            country: realCountry,
            id: pId,
            server: sId
          });
          setError('');
          playSuccessSound();
        } else {
          lastVerifiedKeyRef.current = '';
          setVerifiedAccount({
            valid: false,
            error: language === 'km' 
              ? 'រកមិនឃើញគណនីអ្នកលេងទេ។ សូមពិនិត្យមើល Player ID និង Server ID ឡើងវិញ' 
              : 'Player account not found. Please verify your Player ID and Server Zone ID.',
            id: pId,
            server: sId
          });
          setPlayerCardAlert(true);
          setTimeout(() => setPlayerCardAlert(false), 2500);
        }
      } else {
        // Non-MLBB games
        let accountConfirmed = false;

        if (selectedGame?.id?.includes('freefire') || selectedGame?.id?.includes('ff')) {
          if (!/^\d{7,12}$/.test(pId)) {
            setVerifiedAccount({
              valid: false,
              error: language === 'km' ? 'រកមិនឃើញគណនី Free Fire ទេ។ UID ត្រូវតែជាលេខ 7-12 ខ្ទង់។' : 'Free Fire account not found. UID must be 7-12 digits.',
              id: pId,
              server: sId || 'Global'
            });
            return;
          }

          let profileData = KNOWN_PLAYER_PROFILES[pId] || null;

          if (profileData) {
            realName = profileData.nickname;
            accountConfirmed = true;
          } else if (KNOWN_REAL_NAMES[pId]) {
            realName = KNOWN_REAL_NAMES[pId];
            accountConfirmed = true;
          } else {
            try {
              const customNames = JSON.parse(localStorage.getItem('custom_player_names') || '{}');
              if (customNames[pId]) {
                realName = customNames[pId];
                accountConfirmed = true;
              }
            } catch (e) {}
          }

          if (!accountConfirmed) {
            try {
              const ffProxyRes = await topupAPI.getFreefireNickname(pId);
              if (ffProxyRes?.data?.found === true) {
                accountConfirmed = true;
                if (ffProxyRes.data.nickname) realName = ffProxyRes.data.nickname;
                profileData = {
                  nickname: ffProxyRes.data.nickname,
                  region: ffProxyRes.data.region || 'Global',
                  level: ffProxyRes.data.level,
                  likes: ffProxyRes.data.likes,
                  avatarUrl: ffProxyRes.data.avatarUrl,
                  rank: ffProxyRes.data.rank,
                  rankPoints: ffProxyRes.data.rankPoints,
                };
              } else if (ffProxyRes?.data?.found === false && ffProxyRes?.data?.message === 'Player not found') {
                setVerifiedAccount({
                  valid: false,
                  error: language === 'km' ? 'រកមិនឃើញគណនី Free Fire ទេ។ សូមពិនិត្យ UID ឡើងវិញ។' : 'Free Fire account not found. Please verify your UID.',
                  id: pId,
                  server: sId || 'Global'
                });
                setAccountChecking(false);
                return;
              } else {
                const ffRes = await fetch(`https://api.isan.eu.org/nickname/ff?id=${pId}`).then(r => r.json()).catch(() => null);
                if (ffRes?.success === true && ffRes?.id && String(ffRes.id) === String(pId)) {
                  accountConfirmed = true;
                }
              }
            } catch (e) {
              try {
                const ffRes = await fetch(`https://api.isan.eu.org/nickname/ff?id=${pId}`).then(r => r.json());
                if (ffRes?.success === true && ffRes?.id && String(ffRes.id) === String(pId)) {
                  accountConfirmed = true;
                }
              } catch (e2) {}
            }
          }

          if (accountConfirmed) {
            const finalName = realName || profileData?.nickname || resolveRealPlayerName(pId, realName);
            const detectedRegion = profileData?.region || sId || 'Global';
            const regInfo = resolveRegionInfo(detectedRegion);

            setFormData(prev => ({ ...prev, serverID: detectedRegion }));

            lastVerifiedKeyRef.current = `${selectedGame?.id || 'ff'}_${pId}_${detectedRegion}`;
            setVerifiedAccount({
              valid: true,
              name: finalName || (language === 'km' ? `អ្នកលេង Free Fire (${pId})` : `Free Fire Player (${pId})`),
              country: regInfo.name,
              region: detectedRegion,
              server: detectedRegion,
              id: pId,
              game: 'freefire',
              level: profileData?.level || 70,
              likes: profileData?.likes || 0,
              avatarUrl: profileData?.avatarUrl || null,
              rank: profileData?.rank || 'Bronze I',
              rankPoints: profileData?.rankPoints || null,
            });
            setError('');
            playSuccessSound();
          } else {
            lastVerifiedKeyRef.current = '';
            setVerifiedAccount({
              valid: false,
              error: language === 'km' ? 'រកមិនឃើញគណនី Free Fire ទេ។ សូមពិនិត្យលេខ UID ឡើងវិញ។' : 'Free Fire account not found. Please verify your UID.',
              id: pId,
              server: sId || 'Global'
            });
            setPlayerCardAlert(true);
            setTimeout(() => setPlayerCardAlert(false), 2500);
          }
        } else {
          // Other games (Genshin, PUBG, etc.)
          try {
            let checkUrl = '';
            if (selectedGame?.id?.includes('genshin')) {
              checkUrl = `https://api.isan.eu.org/nickname/genshin?id=${pId}&server=${sId}`;
            } else if (selectedGame?.id?.includes('pubg')) {
              checkUrl = `https://api.isan.eu.org/nickname/pubg?id=${pId}`;
            }

            if (checkUrl) {
              const gCheck = await fetch(checkUrl).then(r => r.json());
              if (gCheck?.name) {
                realName = gCheck.name;
              }
            }
          } catch (e) {}

          lastVerifiedKeyRef.current = `${selectedGame?.id || 'game'}_${pId}_${sId}`;
          setVerifiedAccount({
            valid: true,
            name: realName || '',
            country: 'Global',
            id: pId,
            server: sId
          });
          setError('');
          playSuccessSound();
        }
      }
    } catch (err) {
      console.error('Verification error:', err);
      lastVerifiedKeyRef.current = '';
      setVerifiedAccount({
        valid: false,
        error: language === 'km' ? 'មិនអាចភ្ជាប់ទៅកាន់ប្រព័ន្ធផ្ទៀងផ្ទាត់បានទេ។' : 'Connection notice: Could not reach verification server. Please check Player ID.',
        id: pId,
        server: sId
      });
      setPlayerCardAlert(true);
      setTimeout(() => setPlayerCardAlert(false), 2500);
    } finally {
      inFlightVerifyRef.current = false;
      setAccountChecking(false);
    }
  }, [formData.playerID, formData.serverID, selectedGame?.id, language, verifiedAccount?.valid]);

  // Click handler for manual check button
  const handleVerifyAccount = useCallback(() => {
    lastVerifiedKeyRef.current = '';
    triggerAccountVerification(formData.playerID, formData.serverID);
  }, [formData.playerID, formData.serverID, triggerAccountVerification]);

  // Handle Player ID Paste Button
  const handlePastePlayerId = async () => {
    try {
      let clipboardText = '';
      if (navigator.clipboard && navigator.clipboard.readText) {
        clipboardText = await navigator.clipboard.readText();
      }

      if (clipboardText && clipboardText.trim()) {
        const rawVal = clipboardText.trim();
        let targetPid = rawVal;
        let targetSid = formData.serverID;

        if (selectedGame?.id?.startsWith('mlbb')) {
          const parsed = parseMlbbId(rawVal);
          if (parsed.detected) {
            targetPid = parsed.playerID;
            targetSid = parsed.serverID;
            setFormData(prev => ({ ...prev, playerID: targetPid, serverID: targetSid }));
            setAutoDetectedMessage(`Auto-detected Player ID (${targetPid}) Zone (${targetSid})`);
            setPastedPlayerId(true);
            setTimeout(() => setPastedPlayerId(false), 2000);
            triggerAccountVerification(targetPid, targetSid);
            return;
          } else {
            setFormData(prev => ({ ...prev, playerID: rawVal }));
            setAutoDetectedMessage('');
            if (targetSid && targetSid.toLowerCase() !== 'global') {
              triggerAccountVerification(rawVal, targetSid);
            } else {
              setTimeout(() => {
                document.getElementById('server_id_input')?.focus();
              }, 150);
            }
          }
        } else {
          setFormData(prev => ({ ...prev, playerID: rawVal }));
          triggerAccountVerification(rawVal, targetSid || 'Global');
        }
        setPastedPlayerId(true);
        setTimeout(() => setPastedPlayerId(false), 2000);
      } else {
        document.getElementById('player_id_input')?.focus();
      }
    } catch (err) {
      console.warn('Clipboard read notice:', err?.message);
      document.getElementById('player_id_input')?.focus();
    }
  };

  // Native onPaste event on Player ID input (Ctrl+V / right click)
  const handlePlayerIdPaste = (e) => {
    const text = e.clipboardData?.getData('text') || '';
    if (!text.trim()) return;
    const rawVal = text.trim();
    if (selectedGame?.id?.startsWith('mlbb')) {
      const parsed = parseMlbbId(rawVal);
      if (parsed.detected) {
        e.preventDefault();
        setFormData(prev => ({ ...prev, playerID: parsed.playerID, serverID: parsed.serverID }));
        setAutoDetectedMessage(`Auto-detected Player ID (${parsed.playerID}) Zone (${parsed.serverID})`);
        setPastedPlayerId(true);
        setTimeout(() => setPastedPlayerId(false), 2000);
        triggerAccountVerification(parsed.playerID, parsed.serverID);
        return;
      }
      if (formData.serverID && formData.serverID.trim() && formData.serverID.toLowerCase() !== 'global') {
        setTimeout(() => triggerAccountVerification(rawVal, formData.serverID.trim()), 60);
      }
    } else {
      setTimeout(() => triggerAccountVerification(rawVal, formData.serverID || 'Global'), 60);
    }
  };

  // Native onPaste event on Server ID input (Ctrl+V / right click)
  const handleServerIdPaste = (e) => {
    const text = e.clipboardData?.getData('text') || '';
    if (!text.trim()) return;
    const rawVal = text.trim();
    if (selectedGame?.id?.startsWith('mlbb')) {
      const parsed = parseMlbbId(rawVal);
      if (parsed.detected) {
        e.preventDefault();
        setFormData(prev => ({ ...prev, playerID: parsed.playerID, serverID: parsed.serverID }));
        setAutoDetectedMessage(`Auto-detected Player ID (${parsed.playerID}) Zone (${parsed.serverID})`);
        triggerAccountVerification(parsed.playerID, parsed.serverID);
        return;
      }
      if (formData.playerID && formData.playerID.trim()) {
        setTimeout(() => triggerAccountVerification(formData.playerID.trim(), rawVal), 60);
      }
    }
  };

  // Handle typing in Player ID
  const handlePlayerIdChange = (e) => {
    const rawVal = e.target.value;
    if (selectedGame?.id?.startsWith('mlbb')) {
      const parsed = parseMlbbId(rawVal);
      if (parsed.detected) {
        setFormData(prev => ({ ...prev, playerID: parsed.playerID, serverID: parsed.serverID }));
        setAutoDetectedMessage(`Auto-detected Player ID (${parsed.playerID}) Zone (${parsed.serverID})`);
        triggerAccountVerification(parsed.playerID, parsed.serverID);
        return;
      } else {
        setFormData(prev => ({ ...prev, playerID: rawVal }));
        setAutoDetectedMessage('');
      }
    } else {
      setFormData(prev => ({ ...prev, playerID: rawVal }));
    }
    if (verifiedAccount) setVerifiedAccount(null);
    lastVerifiedKeyRef.current = '';
  };

  // Handle typing in Server ID
  const handleServerIdChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, serverID: val }));
    if (verifiedAccount) setVerifiedAccount(null);
    lastVerifiedKeyRef.current = '';
  };

  // Debounced auto-check when typing
  useEffect(() => {
    const pId = (formData.playerID || '').trim();
    const sId = (formData.serverID || '').trim();

    if (!pId) return;

    if (selectedGame?.id?.startsWith('mlbb')) {
      if (pId.length >= 4 && sId.length >= 3 && sId.toLowerCase() !== 'global') {
        const key = `${selectedGame.id}_${pId}_${sId}`;
        if (key === lastVerifiedKeyRef.current) return;
        const timer = setTimeout(() => {
          triggerAccountVerification(pId, sId);
        }, 600);
        return () => clearTimeout(timer);
      }
    } else if (selectedGame?.id?.includes('freefire') || selectedGame?.id?.includes('ff')) {
      if (pId.length >= 7) {
        const key = `${selectedGame.id}_${pId}`;
        if (key === lastVerifiedKeyRef.current) return;
        const timer = setTimeout(() => {
          triggerAccountVerification(pId, sId || 'Global');
        }, 600);
        return () => clearTimeout(timer);
      }
    } else {
      if (pId.length >= 4) {
        const key = `${selectedGame.id}_${pId}_${sId}`;
        if (key === lastVerifiedKeyRef.current) return;
        const timer = setTimeout(() => {
          triggerAccountVerification(pId, sId);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [formData.playerID, formData.serverID, selectedGame?.id, triggerAccountVerification]);


  // Payment states
  const [orderId, setOrderId] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentPaid, setPaymentPaid] = useState(false);
  const [awaitingBalance, setAwaitingBalance] = useState(false); // provider has no balance — pending admin
  const [confirmSent, setConfirmSent] = useState(false); // customer pressed Confirm button
  const [qrExpired, setQrExpired] = useState(false);
  const qrExpiredRef = useRef(false);
  const timeLeftRef = useRef(360); // 6-minute (360 seconds) transaction lifetime (ABA PayWay standard)
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'KHR'
  const [productCategoryTab, setProductCategoryTab] = useState('all'); // 'all', 'passes', 'diamonds'
  const [layoutMode, setLayoutMode] = useState('tiles'); // 'list', 'tiles', 'grid'
  const [listScroll, setListScroll] = useState({ atTop: true, atBottom: false, progress: 0 });
  const productListRef = useRef(null);
  const handleListScroll = (e) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    const next = { atTop: el.scrollTop <= 4, atBottom: el.scrollTop >= max - 4, progress: max > 0 ? el.scrollTop / max : 1 };
    setListScroll(prev => (prev.atTop === next.atTop && prev.atBottom === next.atBottom && Math.abs(prev.progress - next.progress) < 0.02) ? prev : next);
  };
  useEffect(() => {
    const el = productListRef.current;
    if (!el) return;
    el.scrollTop = 0;
    const max = el.scrollHeight - el.clientHeight;
    setListScroll({ atTop: true, atBottom: max <= 4, progress: max > 0 ? 0 : 1 });
  }, [productCategoryTab, layoutMode, selectedGame.id, products.length]);
  const checkoutSectionRef = useRef(null);

  // Full Display Package Selection Modal
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  // Lock scroll and hide website header when package selection full display modal is active
  useEffect(() => {
    if (showPackageModal) {
      document.body.classList.add('modal-open', 'full-display-open');
    } else {
      document.body.classList.remove('modal-open', 'full-display-open');
    }
    return () => {
      document.body.classList.remove('modal-open', 'full-display-open');
    };
  }, [showPackageModal]);

  // Handle ESC key to close package selection modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showPackageModal) {
        setShowPackageModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPackageModal]);

  const handleSwitchCurrency = async (newCurr) => {
    if (newCurr === currency && paymentData?.currency === newCurr) return;
    setCurrency(newCurr);

    const isRiel = newCurr === 'KHR';
    const rawPrice = selectedProduct?.price || 0.95;
    const targetAmount = isRiel ? Math.round(rawPrice * 4100) : rawPrice;

    setPaymentData(prev => prev ? ({ ...prev, currency: newCurr, amount: targetAmount }) : prev);

    if (orderId) {
      try {
        let currentUser = null;
        try {
          const stored = localStorage.getItem('user');
          if (stored) currentUser = JSON.parse(stored);
        } catch (e) {}

        const pId = formData.playerID ? formData.playerID.trim() : '';
        const sId = formData.serverID ? formData.serverID.trim() : '11446';
        const playerAccName = verifiedAccount?.name || '';
        const customerId = currentUser?.userId || currentUser?.id || '';
        const gameTitle = selectedGame?.name || 'Mobile Legends: Bang Bang';
        const pkgName = selectedProduct?.name || `${selectedProduct?.diamondAmount || 55} Diamonds`;

        const payRes = await paywayAPI.create({
          orderId,
          amount: targetAmount,
          currency: newCurr,
          player_id: pId,
          server_id: sId,
          account_name: playerAccName,
          customer_id: customerId,
          game_name: gameTitle,
          package_name: pkgName
        });

        if (payRes?.data) {
          const pd = payRes.data;
          setPaymentData(prev => ({
            ...prev,
            ...pd,
            amount: targetAmount,
            currency: newCurr,
            tranId: pd.tranId,
            qrString: pd.qrString || null,
            abapayDeeplink: pd.abapayDeeplink || pd.checkoutUrl,
            khqrDeeplink: pd.abapayDeeplink || pd.checkoutUrl,
            md5Hash: pd.md5,
            formData: pd.formData,
            purchaseUrl: pd.purchaseUrl,
            checkoutUrl: pd.checkoutUrl,
            merchantName: 'DETH PHEAK',
            gateway: 'aba_payway'
          }));
        }
      } catch (err) {
        console.warn('Currency switch notice:', err?.message);
      }
    }
  };


  // Launch Official ABA PayWay Popup (Strictly adhering to ABA PayWay Merchant Integration Guidelines)
  const launchOfficialAbaCheckout = useCallback((payment) => {
    if (!payment?.formData) {
      console.warn('Cannot launch ABA PayWay: formData missing');
      return false;
    }

    try {
      // 1. Ensure official desktop container exists in DOM
      let abaContainer = document.getElementById('aba-checkout');
      if (!abaContainer) {
        abaContainer = document.createElement('div');
        abaContainer.id = 'aba-checkout';
        document.body.appendChild(abaContainer);
      } else {
        abaContainer.innerHTML = '';
      }

      // 2. Prepare official form #aba_merchant_request with strictly unique fields
      let form = document.getElementById('aba_merchant_request');
      if (form) {
        try { form.remove(); } catch (e) {}
      }
      form = document.createElement('form');
      form.id = 'aba_merchant_request';
      form.method = 'POST';
      form.target = 'aba_webservice';
      form.style.display = 'none';
      form.action = payment.purchaseUrl || "https://checkout.payway.com.kh/api/payment-gateway/v1/payments/purchase";

      const addedKeys = new Set();
      Object.entries(payment.formData).forEach(([k, v]) => {
        if (!addedKeys.has(k)) {
          addedKeys.add(k);
          const inp = document.createElement('input');
          inp.type = 'hidden';
          inp.name = k;
          inp.value = v != null ? String(v) : '';
          if (k === 'payment_option') inp.className = 'payment_option';
          form.appendChild(inp);
        }
      });

      // Ensure payment_option exists exactly once
      if (!addedKeys.has('payment_option')) {
        const opt = document.createElement('input');
        opt.type = 'hidden';
        opt.name = 'payment_option';
        opt.className = 'payment_option';
        opt.value = 'abapay_khqr';
        form.appendChild(opt);
      }

      document.body.appendChild(form);

      // 3. Launch official ABA PayWay popup on Desktop or Drawer on Mobile!
      const payway = getAbaPaywayInstance();
      if (payway && typeof payway.checkout === 'function') {
        payway.checkout();
        console.log('[ABA PayWay] Official AbaPayway.checkout() launched successfully!');

        // Mobile-specific sheet display
        const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
          setTimeout(() => {
            const sheet = document.getElementById('aba_checkout_sheet');
            if (sheet) {
              sheet.style.display = 'flex';
              sheet.setAttribute('aria-hidden', 'false');
              const contents = sheet.querySelector('.aba_checkout_contents');
              if (contents) contents.style.height = '500px';
            }
          }, 300);
        }

        // Dismiss loading spinner safeguard:
        // Dismiss loading overlay after 2.5s once iframe has initialized
        let checkCount = 0;
        const spinnerWatcher = setInterval(() => {
          checkCount++;
          const spinner = document.getElementById('aba_webservice_loading');
          const iframe = document.getElementById('aba_webservice');
          if (iframe && spinner && checkCount >= 3) {
            spinner.style.opacity = '0';
            setTimeout(() => {
              try { spinner.remove(); } catch (e) {}
            }, 300);
            clearInterval(spinnerWatcher);
          }
          if (checkCount >= 10) clearInterval(spinnerWatcher);
        }, 800);

        return true;
      }
    } catch (e) {
      console.warn('[ABA PayWay] AbaPayway.checkout() notice:', e);
    }
    return false;
  }, []);

  // Transaction Lifetime Countdown Timer (6 minutes / 360 seconds matching ABA PayWay standard: 5-15 mins)
  useEffect(() => {
    if (!paymentData || paymentPaid) return;
    timeLeftRef.current = 360;
    setQrExpired(false);
    qrExpiredRef.current = false;
    const timer = setInterval(() => {
      timeLeftRef.current -= 1;
      if (timeLeftRef.current <= 0) {
        clearInterval(timer);
        setQrExpired(true);
        qrExpiredRef.current = true;
        closeAbaCheckoutPopup();
        setError('Transaction lifetime reached. Please initiate a new top-up request.');
        const curTranId = paymentData?.tranId || paymentData?.formData?.tran_id;
        if (curTranId && paymentData?.gateway === 'aba_payway') {
          try {
            paywayAPI.close(curTranId).catch(() => {});
          } catch (e) {}
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentData, paymentPaid]);

  // Lock scroll when payment modal is active
  useEffect(() => {
    if (paymentPaid) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (paymentData || paymentPaid)) {
        closeAbaCheckoutPopup();
        setPaymentData(null);
        setOrderId(null);
        setPaymentPaid(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [paymentData, paymentPaid]);

  // Listen for ABA PayWay postMessage events and custom close events to guarantee scroll unlock
  useEffect(() => {
    const handleAbaMessage = (e) => {
      try {
        const data = e.data;
        if (!data) return;
        if (data.close === true || data.action === 'close' || data === 'closeCheckout') {
          closeAbaCheckoutPopup();
          setPaymentData(null);
        }
      } catch (err) {}
    };

    const handleAbaClosedEvent = () => {
      closeAbaCheckoutPopup();
      setPaymentData(null);
    };

    window.addEventListener('message', handleAbaMessage);
    window.addEventListener('abaCheckoutClosed', handleAbaClosedEvent);

    return () => {
      window.removeEventListener('message', handleAbaMessage);
      window.removeEventListener('abaCheckoutClosed', handleAbaClosedEvent);
    };
  }, []);



  const [, startTransition] = useTransition();
  const carouselContainerRef = useRef(null);

  // Unified smooth game selection (preserves window vertical scroll position)
  // eslint-disable-next-line no-unused-vars
  const handleSelectGame = useCallback((game, e = null) => {
    if (!game || game.id === selectedGame.id) return;

    // Scroll ONLY the carousel container horizontally without moving window vertically
    if (e?.currentTarget && carouselContainerRef.current) {
      const container = carouselContainerRef.current;
      const target = e.currentTarget;
      const targetRect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollOffset = (targetRect.left + targetRect.width / 2) - (containerRect.left + containerRect.width / 2);
      container.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }

    // Update URL query parameter cleanly without reload
    setSearchParams({ game: game.id }, { replace: true });

    const newPkgs = getPackagesForGame(game.id);

    // Non-blocking transition for smooth 60fps UI
    startTransition(() => {
      setSelectedGame(game);
      setProducts(newPkgs);
      setSelectedProduct(newPkgs[0]);
      setFormData(prev => ({
        ...prev,
        playerID: '',
        serverID: game.id.startsWith('mlbb') ? '' : 'Global',
        productId: newPkgs[0]?.productId || 100,
        paymentMethod: 'abapayway'
      }));
      setVerifiedAccount(null);
      setPaymentData(null);
      setOrderId(null);
      setPaymentPaid(false);
      setAwaitingBalance(false);
      setConfirmSent(false);
    });
  }, [selectedGame.id, getPackagesForGame, setSearchParams]);

  // Sync game from URL (only if changed externally e.g. browser back/forward or direct link)
  useEffect(() => {
    if (!rawGameParam) return;
    const gameObj = allGames.find(g => g.id === rawGameParam || g.id.startsWith(rawGameParam));
    if (gameObj && gameObj.id !== selectedGame.id) {
      const newPkgs = getPackagesForGame(gameObj.id);
      startTransition(() => {
        setSelectedGame(gameObj);
        setProducts(newPkgs);
        setSelectedProduct(newPkgs[0]);
        setFormData(prev => ({
          ...prev,
          productId: newPkgs[0]?.productId || 100,
          serverID: gameObj.id.startsWith('mlbb') ? '' : (prev.serverID || 'Global')
        }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawGameParam]);

  // Tracking Refs to prevent interval re-creation on countdown timer ticks
  const isCheckingRef = useRef(false);
  const paymentPaidRef = useRef(false);
  paymentPaidRef.current = paymentPaid;

  const currentOrderIdRef = useRef(orderId);
  currentOrderIdRef.current = orderId;

  const currentTranIdRef = useRef(paymentData?.tranId || paymentData?.tran_id || paymentData?.formData?.tran_id);
  currentTranIdRef.current = paymentData?.tranId || paymentData?.tran_id || paymentData?.formData?.tran_id;

  const currentMd5Ref = useRef(paymentData?.khqrMd5Hash || paymentData?.md5Hash);
  currentMd5Ref.current = paymentData?.khqrMd5Hash || paymentData?.md5Hash;

  // Real-Time Poller Telemetry for ABA PayWay QA Verification
  const pollCountRef = useRef(0);

  // Reset poll count upon new transaction
  useEffect(() => {
    pollCountRef.current = 0;
  }, [paymentData?.tranId]);

  const checkPaymentStatus = useCallback(async () => {
    const curOrderId = currentOrderIdRef.current;
    const curTranId = currentTranIdRef.current;

    if (!curOrderId || paymentPaidRef.current || isCheckingRef.current || qrExpiredRef.current) return false;
    isCheckingRef.current = true;

    const triggerPaidTransition = async () => {
      // ABA Rule: Do NOT automatically dismiss ABA popup. Keep the official Success screen active so customer can view it and download receipt!
      console.log(
        `%c[ABA PayWay V2 Poller] 🚀 PAYMENT DETECTED (PAID) for Order #${curOrderId}! Official ABA Success interface will remain active.`,
        'color: #10b981; font-weight: 900; font-size: 13px; background: #064e3b; padding: 3px 6px; border-radius: 4px;'
      );

      playSuccessSound();
      setPaymentPaid(true);
      paymentPaidRef.current = true;
    };

    try {
      let isPaidConfirmed = false;

      // Real direct bank checking via ABA PayWay V2 endpoint (check-transaction-2)
      if (curTranId) {
        pollCountRef.current += 1;
        const currentCount = pollCountRef.current;
        const timeStr = new Date().toLocaleTimeString();

        try {
          const r = await paywayAPI.checkStatus(curTranId, curOrderId);
          const payStatus = (r?.data?.status || '').toUpperCase() || 'PENDING';

          console.log(
            `%c[ABA PayWay V2 Poller] ⏱️ ${timeStr} | Check #${currentCount} (+3.0s) | Target: check-transaction-2 | TranID: ${curTranId} | Status: ${payStatus}`,
            'color: #0284c7; font-weight: bold; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;'
          );

          if (r?.data?.isPaid === true || payStatus === 'APPROVED' || payStatus === 'PAID' || payStatus === 'SUCCESS') {
            console.log(
              `%c[ABA PayWay V2 Poller] ✅ PayWay Bank API confirmed PAID (TranID: ${curTranId}, Total Checks: ${currentCount})`,
              'color: #10b981; font-weight: bold; background: #064e3b; padding: 2px 6px; border-radius: 4px;'
            );
            isPaidConfirmed = true;
          } else if (payStatus === 'EXPIRED' || payStatus === 'DECLINED' || payStatus === 'CANCELLED') {
            console.log(
              `%c[ABA PayWay V2 Poller] ⏹ Transaction ${payStatus} (TranID: ${curTranId}, Total Checks: ${currentCount})`,
              'color: #ef4444; font-weight: bold; background: #450a0a; padding: 2px 6px; border-radius: 4px;'
            );
            setQrExpired(true);
            qrExpiredRef.current = true;
            return false;
          }
        } catch (pwErr) {
          console.warn('[ABA PayWay V2 Poller] PayWay status error:', pwErr?.message);
        }
      }

      // Fallback only if NOT an ABA PayWay transaction (e.g. manual offline transfer without PayWay tranId)
      if (!isPaidConfirmed && curOrderId && !curTranId) {
        try {
          const ordCheckRes = await ordersAPI.getQuickStatus(curOrderId);
          const ordCheck = ordCheckRes?.data;
          if (ordCheck?.isPaid === true || ordCheck?.paymentStatus === 'Paid') {
            console.log(`%c[Order Tracker] ✓ Backend DB confirmed PAID for Order #${curOrderId}`, 'color: #10b981; font-weight: bold;');
            isPaidConfirmed = true;
          }
        } catch (e) {}
      }

      if (isPaidConfirmed) {
        console.log(`%c[ABA PayWay Tracker] ✓ Confirmed PAID! Processing order completion...`, 'color: #10b981; font-weight: bold;');
        const confirmResult = await ordersAPI.checkPayment(curOrderId, false);
        // Check if topup is awaiting balance (provider has no funds)
        const topupStatus = confirmResult?.data?.topupStatus || confirmResult?.data?.order?.TopupStatus || '';
        updateLocalOrderStatus(curOrderId, {
          paymentStatus: 'Paid',
          topupStatus: topupStatus === 'AwaitingBalance' ? 'Processing' : 'Completed'
        });
        if (topupStatus === 'AwaitingBalance') {
          // Show pending receipt — admin needs to approve
          setAwaitingBalance(true);
          paymentPaidRef.current = true;
          return true;
        }
        await triggerPaidTransition();
        return true;
      }
    } catch (err) {
      console.warn('[ABA PayWay Tracker] Notice:', err?.message);
    } finally {
      isCheckingRef.current = false;
    }

    return false;
  }, []);

  // Automatic Real-Time Polling (ABA PayWay Recommended Logic Flow: wait 3s, then check consistently every 3s until expiry or approval)
  useEffect(() => {
    const curTranId = paymentData?.tranId || paymentData?.tran_id || paymentData?.formData?.tran_id;
    // Step ③: Stop checking when payment is Approved/done or when transaction lifetime expires
    if (!orderId || paymentPaid || qrExpired || !curTranId) return;

    let timerId = null;
    let isCancelled = false;

    const poll = async () => {
      if (isCancelled || paymentPaidRef.current || qrExpiredRef.current) return;

      try {
        await checkPaymentStatus();
      } catch (e) {}

      // Consistently wait exactly 3 seconds AFTER previous request completes before sending next check
      if (!isCancelled && !paymentPaidRef.current && !qrExpiredRef.current) {
        timerId = setTimeout(poll, 3000);
      }
    };

    // Step ②: Wait exactly 3 seconds after initiating before starting the first check
    timerId = setTimeout(poll, 3000);

    return () => {
      isCancelled = true;
      if (timerId) clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, paymentData?.tranId, paymentPaid, qrExpired, checkPaymentStatus]);


  const handleProceedToPayment = async () => {
    if (isTopupDisabled) {
      setError(pauseReasonMessage);
      return;
    }

    const pId = (formData.playerID || '').trim();
    const sId = (formData.serverID || '').trim();

    if (!pId) {
      setError(language === 'km' ? 'សូមបញ្ចូល Player ID របស់លោកអ្នកជាមុនសិន' : 'Please enter your Player ID first');
      scrollToPlayerInfo('player');
      return;
    }

    if (selectedGame?.id?.startsWith('mlbb') && (!sId || sId.toLowerCase() === 'global')) {
      setError(language === 'km' ? 'សូមបញ្ចូល Server ID របស់លោកអ្នកជាមុនសិន' : 'Please enter your Server ID first');
      scrollToPlayerInfo('server');
      return;
    }

    // Strict Account Verification Guard: User CANNOT pay if account is not found or unverified
    if (!verifiedAccount || !verifiedAccount.valid) {
      setError(language === 'km'
        ? 'រកមិនឃើញគណនីអ្នកលេងទេ។ សូមបញ្ចូល Player ID និង Server ID ឡើងវិញឲ្យបានត្រឹមត្រូវមុននឹងបង់ប្រាក់។'
        : 'Player account not found. Please verify and re-enter your Player ID and Server ID before making payment.');
      scrollToPlayerInfo(!sId ? 'server' : 'player');
      return;
    }

    setLoading(true);
    setError('');
    // Reset payment states for new attempt
    setPaymentPaid(false);
    paymentPaidRef.current = false;
    setPaymentData(null);
    setQrExpired(false);
    qrExpiredRef.current = false;

    try {
      const isRiel = currency === 'KHR';
      const rawPrice = selectedProduct?.price || 0.95;
      const targetAmount = isRiel ? Math.round(rawPrice * 4100) : rawPrice;
      const effectiveDiamonds = selectedProduct?.diamondAmount || 55;
      const playerAccName = verifiedAccount?.name || '';

      let currentUser = null;
      try {
        const stored = localStorage.getItem('user');
        if (stored) currentUser = JSON.parse(stored);
      } catch (e) {}

      const customerId = currentUser?.userId || currentUser?.id || '';
      const customerName = currentUser?.username || currentUser?.name || '';
      const customerPhone = currentUser?.phone || formData.customerPhone || '';
      const gameTitle = selectedGame?.name || 'Mobile Legends: Bang Bang';
      const pkgName = selectedProduct?.name || `${effectiveDiamonds} Diamonds`;

      const orderPayload = {
        playerID: pId,
        serverID: formData.serverID ? formData.serverID.trim() : 'Global',
        productId: selectedProduct?.packageId || selectedProduct?.productId || 2,
        productName: selectedProduct?.name || '',
        customDiamondAmount: effectiveDiamonds,
        price: rawPrice,
        amount: targetAmount,
        currency: currency,
        paymentMethod: 'abapayway',
        accountName: playerAccName,
        customerName: customerName,
        customerPhone: customerPhone,
        gameName: gameTitle
      };

      let newOrder = null;
      try {
        const orderRes = await ordersAPI.create(orderPayload);
        newOrder = orderRes?.data;
      } catch (orderApiErr) {
        console.warn('Backend order notice:', orderApiErr?.message);
        // If 400 or 401 occurred (e.g. stale JWT token in localStorage from previous session), clear token and retry as guest!
        if (orderApiErr?.response?.status === 400 || orderApiErr?.response?.status === 401) {
          localStorage.removeItem('token');
          try {
            const guestRes = await ordersAPI.create({
              ...orderPayload,
              customerName: '',
              customerPhone: ''
            });
            newOrder = guestRes?.data;
          } catch (retryErr) {
            console.warn('Guest order retry notice:', retryErr?.message);
          }
        }
      }

      // Auto-sync player account: real-name player = username and ID server = password
      if (pId && sId) {
        try {
          const pAccount = {
            playerId: pId,
            serverId: sId,
            realName: playerAccName || ''
          };
          localStorage.setItem('player_account', JSON.stringify(pAccount));

          // Background auto-register / login
          authAPI.playerLogin({
            playerId: pId,
            serverId: sId,
            realName: pAccount.realName
          }).then((res) => {
            if (res?.data?.token) {
              localStorage.setItem('token', res.data.token);
              localStorage.setItem('user', JSON.stringify(res.data.user || res.data));
              window.dispatchEvent(new Event('storage'));
            }
          }).catch(() => {});

          window.dispatchEvent(new Event('storage'));
        } catch (e) {}
      }

      const activeOrderId = newOrder?.orderId || Math.floor(100000 + Math.random() * 900000);
      setOrderId(activeOrderId);

      // Persist order locally right away so purchase is NEVER lost
      saveLocalOrder({
        orderId: activeOrderId,
        playerId: pId,
        serverId: sId,
        accountName: playerAccName,
        customerName: customerName,
        productName: pkgName,
        diamondAmount: effectiveDiamonds,
        amount: targetAmount,
        price: rawPrice,
        currency: currency,
        paymentStatus: 'Pending',
        topupStatus: 'Pending',
        createdAt: new Date().toISOString(),
        gameName: gameTitle,
        paymentMethod: 'abapayway'
      });

      let createdPayment = null;

      // Official ABA PayWay Gateway (Strict adherence to ABA Technical Specification)
      // Retry once on failure to handle Render.com cold starts (backend may need ~30s to wake)
      const paywayPayload = {
        orderId: activeOrderId,
        amount: targetAmount,
        currency: currency,
        player_id: pId,
        server_id: sId,
        account_name: playerAccName,
        customer_id: customerId,
        game_name: gameTitle,
        package_name: pkgName,
        diamondAmount: effectiveDiamonds
      };

      // 1. Instant check: If newOrder already generated PayWay payment with valid formData
      if (newOrder?.payment?.formData && (newOrder?.payment?.transactionId || newOrder?.payment?.tranId)) {
        const np = newOrder.payment;
        createdPayment = {
          orderId: activeOrderId,
          amount: targetAmount,
          currency: currency,
          tranId: np.transactionId || np.tranId,
          qrString: np.khqrQRCode || np.qrString || null,
          abapayDeeplink: np.khqrDeeplink || np.abapayDeeplink || np.checkoutUrl,
          khqrDeeplink: np.khqrDeeplink || np.abapayDeeplink || np.checkoutUrl,
          md5Hash: np.khqrMd5Hash || np.md5Hash,
          khqrMd5Hash: np.khqrMd5Hash || np.md5Hash,
          khqrQRCode: np.khqrQRCode || np.qrString || null,
          formData: np.formData,
          purchaseUrl: np.purchaseUrl || "https://checkout.payway.com.kh/api/payment-gateway/v1/payments/purchase",
          checkoutUrl: np.checkoutUrl,
          merchantName: 'PHEAK DETH',
          gateway: 'aba_payway'
        };
        setError('');
      }

      // 2. Fallback: Call /api/payway/create directly if needed
      if (!createdPayment) {
        let directRes = null;
        let lastErr = null;
        const maxAttempts = 3;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            directRes = await paywayAPI.create(paywayPayload);
            if (directRes?.data?.tranId && directRes?.data?.formData) break;
          } catch (err) {
            lastErr = err;
            console.warn(`ABA PayWay attempt ${attempt}/${maxAttempts} notice:`, err?.message);
            if (attempt < maxAttempts) {
              setLoading(true);
              await new Promise(r => setTimeout(r, attempt * 1500));
            }
          }
        }

        if (directRes?.data?.tranId && directRes?.data?.formData) {
          const pd = directRes.data;
          createdPayment = {
            orderId: activeOrderId,
            amount: targetAmount,
            currency: currency,
            tranId: pd.tranId,
            qrString: pd.qrString || null,
            abapayDeeplink: pd.abapayDeeplink || pd.checkoutUrl,
            khqrDeeplink: pd.abapayDeeplink || pd.checkoutUrl,
            md5Hash: pd.md5,
            khqrMd5Hash: pd.md5,
            khqrQRCode: pd.qrString || null,
            formData: pd.formData,
            purchaseUrl: pd.purchaseUrl,
            checkoutUrl: pd.checkoutUrl,
            merchantName: 'PHEAK DETH',
            gateway: 'aba_payway'
          };
          setError('');
        } else {
          console.error('ABA PayWay all attempts failed:', lastErr);
          setError(
            lastErr?.response?.data?.message ||
            lastErr?.message ||
            'Could not connect to ABA PayWay gateway. Please check your internet and try again.'
          );
        }
      }

      if (createdPayment && createdPayment.formData) {
        setPaymentData({
          ...createdPayment,
          amount: targetAmount,
          currency: currency
        });
        // Trigger official ABA PayWay popup modal adhering to ABA Merchant Guidelines
        launchOfficialAbaCheckout(createdPayment);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error proceeding to payment:', err);
      setError(err.response?.data?.message || 'Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };


  const isMlbb = selectedGame.id.startsWith('mlbb') || selectedGame.category === 'Mobile Legends' || selectedGame.id === 'level_up_pass' || selectedGame.id === 'magic_chess';
  const isHoyoverse = ['genshin', 'star_rail', 'zzz', 'wuthering_waves'].includes(selectedGame.id);
  const isTelegram = selectedGame.id === 'telegram_stars';
  const isSteam = selectedGame.id.startsWith('steam');
  const isGiftCard = selectedGame.id === 'giftcards' || selectedGame.category === 'Gift cards';
  const isFreefire = selectedGame.id.startsWith('freefire') || selectedGame.id.includes('free_fire') || selectedGame.id === 'ff';
  const isPassItem = useCallback((p) => (
    p?.isPass ||
    p?.name?.toLowerCase().includes('pass') ||
    p?.name?.toLowerCase().includes('bundle') ||
    [210, 440, 660, 880, 1100, 1320, 605, 500].includes(p?.diamondAmount)
  ), []);

  const formatTagText = useCallback((rawTag) => {
    if (!rawTag) return '';
    if (rawTag.includes('220') && rawTag.includes('70')) return '+70 Aurora ⭐';
    if (rawTag.includes('440') && rawTag.includes('140')) return '+140 Aurora ⭐';
    return rawTag;
  }, []);

  const getFilteredPackages = useCallback((categoryTab, query = '') => {
    return products.filter(pkg => {
      if (categoryTab === 'level_pass') {
        if (!(pkg.isLevelPass || pkg.name?.toLowerCase().includes('level up'))) return false;
      } else if (categoryTab === 'passes') {
        const isPass = isFreefire ? (pkg.category === 'Beat seller') : (!pkg.isLevelPass && isPassItem(pkg));
        if (!isPass) return false;
      } else if (categoryTab === 'diamonds') {
        const isDiamond = isFreefire ? (pkg.category === 'Other Packages') : (!pkg.isLevelPass && !isPassItem(pkg));
        if (!isDiamond) return false;
      }

      if (query && query.trim()) {
        const q = query.trim().toLowerCase();
        const matchName = pkg.name?.toLowerCase().includes(q);
        const matchDiamonds = String(pkg.diamondAmount || '').includes(q);
        const matchPrice = String(pkg.price || '').includes(q);
        const matchTag = (pkg.tag || '').toLowerCase().includes(q);
        if (!matchName && !matchDiamonds && !matchPrice && !matchTag) return false;
      }
      return true;
    });
  }, [isFreefire, isPassItem, products]);

  const inlineFilteredProducts = getFilteredPackages(productCategoryTab);
  const modalFilteredProducts = getFilteredPackages(productCategoryTab, modalSearchQuery);

  const renderProductCards = (itemsList, isInsideModal = false) => {
    if (itemsList.length === 0) {
      return (
        <div className="py-12 text-center text-slate-500 text-xs font-medium font-khmer">
          {language === 'km' ? 'មិនមានកញ្ចប់នៅក្នុងផ្នែកនេះទេ' : 'No packages found in this category.'}
        </div>
      );
    }

    // MODE 1: TILES VIEW (COMPACT 2-3 COLUMNS)
    if (layoutMode === 'tiles') {
      return (
        <div className={`grid ${isInsideModal ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5'}`}>
          {itemsList.map((pkg) => {
            const isSelected = selectedProduct?.productId === pkg.productId;
            const isPass = isPassItem(pkg);
            const tagLower = (pkg.tag || '').toLowerCase();
            const isPopular = pkg.productId === 2 || pkg.diamondAmount === 55 || tagLower.includes('popular') || tagLower.includes('starter');
            const isRecommend = !isPopular && (pkg.productId === 3 || pkg.diamondAmount === 86 || tagLower.includes('bonus') || tagLower.includes('recommend') || tagLower.includes('best'));
            const isLevelPassTag = pkg.isLevelPass || pkg.name?.toLowerCase().includes('level up');
            const isPurpleTag = isFreefire && (pkg.tag?.includes('ទទួលបាន') || pkg.tag?.toLowerCase().includes('discount') || pkg.category === 'Beat seller' || (pkg.isPass && !pkg.isLevelPass));
            const ribbon = isLevelPassTag
              ? { text: pkg.tag || 'LEVEL PASS 🎖️', cls: 'from-emerald-500 to-teal-600 text-white shadow-sm' }
              : isPurpleTag
              ? { text: pkg.tag || 'PASS', cls: 'from-[#a855f7] to-[#7c3aed] text-white shadow-sm' }
              : isPopular
              ? { text: 'Popular', cls: 'from-orange-500 to-amber-500 text-white' }
              : isRecommend
                ? { text: 'Recommend', cls: 'from-amber-300 to-yellow-500 text-slate-950' }
                : pkg.tag
                  ? { text: formatTagText(pkg.tag), cls: 'from-sky-600 to-indigo-600 text-white' }
                  : null;

            return (
              <button
                type="button"
                key={pkg.productId}
                onClick={() => setSelectedProduct(pkg)}
                className={`group relative rounded-2xl p-2.5 pt-3 sm:p-3 sm:pt-3.5 flex flex-col items-center text-center select-none transition-all duration-200 cursor-pointer overflow-hidden active:scale-[0.97] ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#1a1530] to-[#0a0a1a] border-2 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20'
                    : 'bg-gradient-to-b from-[#0b1430] to-[#050a1a] border border-sky-500/20 hover:border-sky-400/60 hover:-translate-y-0.5'
                }`}
              >
                {/* Ribbon tag */}
                {ribbon && (
                  <span className={`absolute top-0 left-0 max-w-[80%] truncate px-2 py-0.5 rounded-br-xl bg-gradient-to-r ${ribbon.cls} text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-wide z-20`}>
                    {ribbon.text}
                  </span>
                )}

                {/* Selected check */}
                {isSelected && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center z-20 shadow-sm animate-scaleUp">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>
                )}

                {/* Artwork: Big prominent 3D Diamond / Pass Image */}
                <div className="relative w-full h-16 sm:h-20 flex items-center justify-center my-1">
                  <ProductPackageImage
                    pkg={pkg}
                    size="lg"
                    className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Name + sub */}
                <h3 className={`relative mt-1 w-full text-[11px] sm:text-xs font-extrabold leading-tight line-clamp-1 transition-colors ${isSelected ? 'text-amber-300' : 'text-white group-hover:text-sky-200'}`}>
                  {pkg.name}
                </h3>
                <span className="relative text-[9px] sm:text-[10px] font-semibold text-slate-400 leading-tight mt-0.5 truncate w-full">
                  {isPass ? '⚡ Daily Pass' : `💎 ${pkg.diamondAmount}`}
                </span>

                {/* Price bar */}
                <div className={`relative mt-2 w-full flex items-center justify-between rounded-lg pl-2 pr-0.5 py-0.5 border ${isSelected ? 'bg-amber-400/10 border-amber-400/40' : 'bg-slate-950/70 border-slate-800'}`}>
                  <div className="flex flex-col text-left leading-tight min-w-0">
                    <span className={`font-black font-mono text-xs sm:text-[13px] tracking-tight whitespace-nowrap ${isSelected ? 'text-amber-300' : 'text-[#00F5B8]'}`}>
                      {currency === 'KHR'
                        ? `${Math.round(pkg.price * 4100).toLocaleString()} ៛`
                        : `$${pkg.price.toFixed(2)}`}
                    </span>
                    <span className="text-[8px] font-mono text-slate-400 whitespace-nowrap truncate">
                      {currency === 'KHR'
                        ? `~$${pkg.price.toFixed(2)}`
                        : `~${Math.round(pkg.price * 4100).toLocaleString()} ៛`}
                    </span>
                  </div>
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-[#00E599] text-slate-950 group-hover:bg-[#00F5B8]'}`}>
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" /></svg>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      );
    }

    // MODE 2: LARGE ICONS / GRID VIEW
    if (layoutMode === 'grid') {
      return (
        <div className={`grid ${isInsideModal ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3'}`}>
          {itemsList.map((pkg) => {
            const isSelected = selectedProduct?.productId === pkg.productId;
            const isPass = isPassItem(pkg);
            const tagLower = (pkg.tag || '').toLowerCase();
            const isPopular = pkg.productId === 2 || pkg.diamondAmount === 55 || tagLower.includes('popular') || tagLower.includes('starter');
            const isRecommend = !isPopular && (pkg.productId === 3 || pkg.diamondAmount === 86 || tagLower.includes('bonus') || tagLower.includes('recommend') || tagLower.includes('best'));
            const isLevelPassTag = pkg.isLevelPass || pkg.name?.toLowerCase().includes('level up');
            const isPurpleTag = isFreefire && (pkg.tag?.includes('ទទួលបាន') || pkg.tag?.toLowerCase().includes('discount') || pkg.category === 'Beat seller' || (pkg.isPass && !pkg.isLevelPass));
            const ribbon = isLevelPassTag
              ? { text: pkg.tag || 'LEVEL PASS 🎖️', cls: 'from-emerald-500 to-teal-600 text-white shadow-sm' }
              : isPurpleTag
              ? { text: pkg.tag || 'PASS', cls: 'from-[#a855f7] to-[#7c3aed] text-white shadow-sm' }
              : isPopular
              ? { text: 'Popular', cls: 'from-orange-500 to-amber-500 text-white' }
              : isRecommend
                ? { text: 'Recommend', cls: 'from-amber-300 to-yellow-500 text-slate-950' }
                : pkg.tag
                  ? { text: formatTagText(pkg.tag), cls: 'from-sky-600 to-indigo-600 text-white' }
                  : null;

            return (
              <div
                key={pkg.productId}
                onClick={() => setSelectedProduct(pkg)}
                className={`group relative rounded-2xl p-3 sm:p-4 cursor-pointer select-none transition-all duration-300 flex flex-col items-center text-center justify-between overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#24173d] via-[#170f28] to-[#0b0816] border-2 border-amber-400 ring-2 ring-amber-400/50 scale-[1.02] -translate-y-1 z-10 shadow-xl shadow-amber-500/20'
                    : 'bg-gradient-to-b from-[#0f172a]/95 via-[#0b1220]/95 to-[#070b14]/98 border border-slate-700/70 hover:border-sky-400/60 hover:-translate-y-1'
                }`}
              >
                {/* Ribbon Tag */}
                {ribbon && (
                  <span className={`absolute top-0 left-0 max-w-[85%] truncate px-2.5 py-0.5 rounded-br-2xl bg-gradient-to-r ${ribbon.cls} text-[9px] sm:text-[10px] font-black uppercase tracking-wider z-20 shadow-md`}>
                    {ribbon.text}
                  </span>
                )}

                {/* Selected Check Badge */}
                {isSelected && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center z-20 shadow-md">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>
                )}

                {/* Main Artwork */}
                <div className="relative w-full h-24 sm:h-28 flex items-center justify-center my-2 sm:my-3">
                  <ProductPackageImage pkg={pkg} size="lg" className="relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-2xl" />
                </div>

                {/* Package Titles */}
                <div className="w-full space-y-1 my-1">
                  <h3 className={`text-xs sm:text-sm font-black tracking-wide line-clamp-1 transition-colors ${isSelected ? 'text-amber-300' : 'text-white group-hover:text-sky-300'}`}>
                    {pkg.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-semibold text-slate-400">
                    {isPass ? (
                      <span className="text-amber-400">⚡ Daily Pass Rewards</span>
                    ) : (
                      <span className="text-cyan-300">💎 {pkg.diamondAmount} Diamonds</span>
                    )}
                  </div>
                </div>

                {/* Price Bar */}
                <div className={`mt-3 w-full flex items-center justify-between rounded-xl p-2 border ${isSelected ? 'bg-amber-400/10 border-amber-400/50' : 'bg-slate-950/80 border-slate-800'}`}>
                  <div className="flex flex-col items-start min-w-0 pl-1 text-left">
                    <span className={`font-black font-mono text-sm sm:text-base leading-none tracking-tight whitespace-nowrap ${isSelected ? 'text-amber-300' : 'text-[#00F5B8]'}`}>
                      {currency === 'KHR'
                        ? `${Math.round(pkg.price * 4100).toLocaleString()} ៛`
                        : `$${pkg.price.toFixed(2)}`}
                    </span>
                    <span className="text-[8.5px] sm:text-[9.5px] font-mono font-medium text-slate-400 mt-0.5 whitespace-nowrap truncate">
                      {currency === 'KHR'
                        ? `~$${pkg.price.toFixed(2)}`
                        : `~${Math.round(pkg.price * 4100).toLocaleString()} ៛`}
                    </span>
                  </div>
                  <div className={`h-7 px-2.5 sm:px-3 rounded-lg flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-black transition-all shrink-0 ${isSelected ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950' : 'bg-gradient-to-r from-[#00E599] to-[#00F5B8] text-slate-950 group-hover:scale-105'}`}>
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" /></svg>
                    <span className="hidden xs:inline">ទិញ</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // MODE 3: COMPACT LIST ROWS
    return (
      <div className="space-y-2 sm:space-y-2.5">
        {itemsList.map((pkg) => {
          const isSelected = selectedProduct?.productId === pkg.productId;
          const isPass = isPassItem(pkg);
          const tagLower = (pkg.tag || '').toLowerCase();
          const isPopular = pkg.productId === 2 || pkg.diamondAmount === 55 || tagLower.includes('popular') || tagLower.includes('starter');
          const isRecommend = !isPopular && (pkg.productId === 3 || pkg.diamondAmount === 86 || tagLower.includes('bonus') || tagLower.includes('recommend') || tagLower.includes('best'));
          const isLevelPassTag = pkg.isLevelPass || pkg.name?.toLowerCase().includes('level up');
          const isPurpleTag = isFreefire && (pkg.tag?.includes('ទទួលបាន') || pkg.tag?.toLowerCase().includes('discount') || pkg.category === 'Beat seller' || (pkg.isPass && !pkg.isLevelPass));
          const ribbon = isLevelPassTag
            ? { text: pkg.tag || 'LEVEL PASS 🎖️', cls: 'from-emerald-500 to-teal-600 text-white' }
            : isPurpleTag
            ? { text: pkg.tag || 'PASS', cls: 'from-[#a855f7] to-[#7c3aed] text-white' }
            : isPopular
            ? { text: 'Popular', cls: 'from-orange-500 to-amber-500 text-white' }
            : isRecommend
              ? { text: 'Recommend', cls: 'from-amber-300 to-yellow-500 text-slate-950' }
              : pkg.tag
                ? { text: formatTagText(pkg.tag), cls: 'from-sky-600 to-indigo-600 text-white' }
                : null;

          return (
            <div
              key={pkg.productId}
              onClick={() => setSelectedProduct(pkg)}
              className={`group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl cursor-pointer select-none transition-all duration-200 overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-r from-[#24173d] via-[#170f28] to-[#0c0817] border-2 border-amber-400 ring-2 ring-amber-400/50 scale-[1.01] z-10 shadow-lg shadow-amber-500/20'
                  : 'bg-gradient-to-r from-[#0f172a]/95 via-[#0b1220]/95 to-[#070b14]/98 border border-slate-800/90 hover:border-sky-400/60 hover:bg-[#131d33]/90 hover:translate-x-0.5'
              }`}
            >
              {ribbon && (
                <span className={`absolute top-0 left-0 px-2 py-0.5 rounded-br-xl bg-gradient-to-r ${ribbon.cls} text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider z-20`}>
                  {ribbon.text}
                </span>
              )}

              {/* Left Side: Artwork + Info */}
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1 pr-2">
                <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-center shrink-0 p-1">
                  <ProductPackageImage pkg={pkg} size="md" className="transition-transform duration-300 group-hover:scale-110 drop-shadow-md" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`text-xs sm:text-sm font-black truncate transition-colors ${isSelected ? 'text-amber-300' : 'text-white group-hover:text-sky-300'}`}>
                    {pkg.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-xs font-semibold text-slate-400">
                    {isPass ? (
                      <span className="text-amber-400 font-bold truncate">⚡ Daily Pass Rewards</span>
                    ) : (
                      <span className="text-cyan-300 font-bold truncate">💎 {pkg.diamondAmount} Diamonds</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Stacked Price + Action Button */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="text-right flex flex-col justify-center leading-tight">
                  <span className={`font-mono font-black text-xs sm:text-sm md:text-base block whitespace-nowrap leading-none tracking-tight ${isSelected ? 'text-amber-300' : 'text-[#00F5B8]'}`}>
                    {currency === 'KHR'
                      ? `${Math.round(pkg.price * 4100).toLocaleString()} ៛`
                      : `$${pkg.price.toFixed(2)}`}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-medium text-slate-400 whitespace-nowrap block mt-1">
                    {currency === 'KHR'
                      ? `~$${pkg.price.toFixed(2)} USD`
                      : `~${Math.round(pkg.price * 4100).toLocaleString()} ៛`}
                  </span>
                </div>
                <div className={`h-7 sm:h-8.5 px-2.5 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-black transition-all shrink-0 ${isSelected ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950' : 'bg-gradient-to-r from-[#00E599] to-[#00F5B8] text-slate-950 group-hover:scale-105 active:scale-95'}`}>
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" /></svg>
                  <span className="font-khmer">{language === 'km' ? 'ទិញ' : 'Select'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 animate-fadeIn pb-32 sm:pb-36 space-y-4 sm:space-y-6">
      {/* Top-Up Paused / Closed Maintenance Notice Banner (Classic Fintech & Multilingual) */}
      {isTopupDisabled && (
        <div className={`relative overflow-hidden rounded-[22px] p-4 sm:p-5 mb-6 border backdrop-blur-xl shadow-2xl transition-all duration-300 select-none ${
          isClosed
            ? 'bg-gradient-to-r from-[#200d14]/95 via-[#180a0f]/95 to-[#0e0508]/98 border-rose-500/35 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(244,63,94,0.12)]'
            : 'bg-gradient-to-r from-[#1f1608]/95 via-[#171106]/95 to-[#0f0b04]/98 border-amber-500/35 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.12)]'
        }`}>
          {/* Top Specular Sheen Line */}
          <div className={`absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent ${
            isClosed ? 'via-rose-400/50' : 'via-amber-400/50'
          } to-transparent pointer-events-none`} />

          {/* Background Ambient Glow */}
          <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
            isClosed ? 'bg-rose-500/10' : 'bg-amber-500/10'
          }`} />

          <div className="relative z-10 flex items-start sm:items-center gap-3.5 sm:gap-4">
            {/* 3D Glass Icon Medallion */}
            <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg ${
              isClosed
                ? 'bg-gradient-to-br from-rose-500/25 via-rose-600/15 to-rose-950/40 border-rose-400/40 shadow-rose-950/50 text-rose-300'
                : 'bg-gradient-to-br from-amber-500/25 via-amber-600/15 to-amber-950/40 border-amber-400/40 shadow-amber-950/50 text-amber-300'
            }`}>
              {/* Inner Specular Highlight */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

              {/* Pulsing Corner Status Dot */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isClosed ? 'bg-rose-400' : 'bg-amber-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-3 w-3 border-2 ${
                  isClosed ? 'border-[#180a0f] bg-rose-500' : 'border-[#171106] bg-amber-500'
                }`} />
              </span>

              {/* Classic SVG Vector Icon */}
              {isClosed ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16" rx="1.5" />
                  <rect x="14" y="4" width="4" height="16" rx="1.5" />
                </svg>
              )}
            </div>

            {/* Notice Text Content */}
            <div className="flex-1 min-w-0">
              {/* Micro Status Badge */}
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider font-mono border ${
                  isClosed
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${isClosed ? 'bg-rose-400' : 'bg-amber-400'}`} />
                  <span>{t('status_notice_badge')}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wide truncate">
                  {selectedGame?.name}
                </span>
              </div>

              {/* Classic Gold / Ruby Metallic Gradient Header */}
              <h3 className={`text-sm sm:text-base font-black tracking-wide font-khmer uppercase ${
                isClosed
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-300 to-red-400 drop-shadow-sm'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-400 drop-shadow-sm'
              }`}>
                {noticeTitle}
              </h3>

              {/* Refined Description */}
              <p className="text-xs sm:text-[13px] leading-relaxed text-slate-200/90 font-khmer mt-0.5">
                {noticeDesc}
              </p>
            </div>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 1. GAME SHOWCASE & DETAILS CARD (Ref: media_1791438986821)*/}
      {/* ======================================================== */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#0b1329] border border-slate-800/90 shadow-2xl p-4 sm:p-5 overflow-hidden transition-all">
        {/* Subtle Ambient Background Artwork with Gradient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50 sm:opacity-55 overflow-hidden">
          <img
            src={
              selectedGame.id.startsWith('mlbb')
                ? (MLBB_BANNERS[activeBannerIdx % MLBB_BANNERS.length] || '/images/mlbb_hero_banner.png')
                : selectedGame.id.includes('freefire')
                  ? (FREEFIRE_BANNERS[activeBannerIdx % FREEFIRE_BANNERS.length] || '/images/freefire_hero_banner.jpg')
                  : (selectedGame.image || selectedGame.localFallbackImage || '/mlbb-logo.png')
            }
            alt=""
            className="w-full h-full object-cover object-right sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1329] via-[#0b1329]/80 to-[#0b1329]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329]/80 via-transparent to-black/20" />
        </div>

        {/* Card Content Row */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-5">
          {/* Game Icon with Cambodia Corner Badge & Glow */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-slate-700/80 bg-slate-950 shadow-lg shadow-sky-500/10">
              <img
                src={selectedGame.id.startsWith('mlbb') ? '/images/mlbb_square_logo.png' : (selectedGame.image || selectedGame.localFallbackImage || '/mlbb-logo.png')}
                alt={selectedGame.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = selectedGame.localFallbackImage || selectedGame.image || '/mlbb-logo.png';
                }}
                className={`w-full h-full ${selectedGame.id.startsWith('mlbb') ? 'object-contain' : 'object-cover'}`}
              />
            </div>
            {/* Cambodia Server Corner Badge */}
            {(selectedGame.id.includes('freefire') || selectedGame.id.startsWith('mlbb') || selectedGame.flagTitle || selectedGame.badge?.includes('ខ្មែរ')) && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded text-[8.5px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border border-amber-300 shadow-md">
                {selectedGame.id.includes('freefire') ? 'KH' : '5V5'}
              </span>
            )}
          </div>

          {/* Game Title, Description & Trust Badges */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide">
                  {selectedGame.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold">
                  ★ Popular
                </span>
              </div>

              {/* Navigation Back Pill */}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                title={language === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Home'}
              >
                <span>‹</span>
                <span>{language === 'km' ? 'ត្រឡប់' : 'Back'}</span>
              </button>
            </div>

            {/* Khmer Description Matching Reference Image 2 */}
            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-300/90 font-khmer">
              {selectedGame.id.startsWith('mlbb')
                ? 'ទិញពេជ្រ Mobile Legends ដោយខ្លួនឯង! បញ្ចូលពេជ្រ Mobile Legends: Bang Bang តាមរយៈ អាយឌី ID របស់អ្នក, ជ្រើសរើសកញ្ចប់ពេជ្រ ដែលអ្នកពេញចិត្តទិញ, បង់ប្រាក់តាមមធ្យោបាយដែលមាន, ពេជ្រនឹងបញ្ជូនទៅក្នុងគណនី MLBB របស់អ្នកភ្លាមៗ។'
                : selectedGame.id.includes('freefire')
                ? 'ទិញពេជ្រ Free Fire ដោយខ្លួនឯង! បញ្ចូលពេជ្រ Garena Free Fire តាមរយៈ Player ID របស់អ្នក, ជ្រើសរើសកញ្ចប់ពេជ្រ ឬ Weekly Pass ដែលអ្នកពេញចិត្ត, បង់ប្រាក់តាមមធ្យោបាយដែលមាន, ពេជ្រនឹងបញ្ជូនទៅក្នុងគណនី Free Fire របស់អ្នកភ្លាមៗ។'
                : (selectedGame.description || 'បញ្ចូលទឹកប្រាក់ហ្គេមរហ័ស សុវត្ថិភាពខ្ពស់ 100% ស្វ័យប្រវត្តិតាមរយៈ Player ID ផ្លូវការ។')}
            </p>

            {/* 3 Trust Badges matching reference image 2 */}
            <div className="flex items-center gap-2 flex-wrap pt-0.5 font-sans">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-[10.5px] sm:text-xs font-bold shadow-sm">
                <span className="text-amber-400">⚡</span>
                <span>Instant Delivery</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-[10.5px] sm:text-xs font-bold shadow-sm">
                <span className="text-sky-400">🔒</span>
                <span>Secure</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-[10.5px] sm:text-xs font-bold shadow-sm">
                <span className="text-emerald-400">✓</span>
                <span>Official</span>
              </span>

              {/* Optional multi-banner switch dots if more than 1 banner */}
              {((selectedGame.id.startsWith('mlbb') && MLBB_BANNERS.length > 1) || (selectedGame.id.includes('freefire') && FREEFIRE_BANNERS.length > 1)) && (
                <div className="ml-auto hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-900/80 border border-slate-800">
                  {(selectedGame.id.startsWith('mlbb') ? MLBB_BANNERS : FREEFIRE_BANNERS).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveBannerIdx(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeBannerIdx === idx ? 'w-4 bg-amber-400' : 'w-1.5 bg-slate-600 hover:bg-slate-400'
                      }`}
                      title={`Banner ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PLAYER INFORMATION CARD (Exact match to Reference Image 2) */}
      {/* ======================================================== */}
      <div 
        id="player-info-section" 
        className={`mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl bg-[#030919] border shadow-2xl p-4 sm:p-5 font-khmer transition-all duration-300 ${
          playerCardAlert
            ? 'border-rose-500 ring-4 ring-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.45)]'
            : verifiedAccount?.valid === false
            ? 'border-rose-500/70 ring-1 ring-rose-500/30'
            : verifiedAccount?.valid
            ? 'border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.12)]'
            : 'border-cyan-900/60 shadow-[0_0_20px_rgba(6,182,212,0.06)]'
        }`}
      >
        {/* Header matching Reference Image 2: Glowing Pink Crown + Player Information + STEP 1 + Slanted // */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-cyan-900/30">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-xl sm:text-2xl filter drop-shadow-[0_0_12px_rgba(236,72,153,0.9)] select-none">
              👑
            </span>
            <h3 className="text-base sm:text-lg font-black text-white tracking-wide font-sans">
              Player Information
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-pink-500/15 border border-pink-500/50 text-pink-400">
              STEP 1
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowIdGuide(true)}
              className="text-[11px] text-cyan-400/80 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Where is ID?"
            >
              <span>💡</span>
              <span className="hidden sm:inline">{language === 'km' ? 'ស្វែងរក ID' : 'Guide'}</span>
            </button>
            <span className="text-pink-500 font-black text-xl italic tracking-tighter opacity-90 drop-shadow-[0_0_8px_rgba(236,72,153,0.7)] select-none">
              {'//'}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="pt-3 sm:pt-4 space-y-3.5 sm:space-y-4">
          {/* Input Fields: USER ID & SERVER ID */}
          <div className={`grid gap-3 sm:gap-4 ${isMlbb || isHoyoverse || isFreefire ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {/* USER ID Field */}
            <div>
              <label htmlFor="player_id_input" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-200 mb-2 font-sans">
                <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>{isTelegram ? 'Telegram @' : isSteam ? 'Steam Name' : isGiftCard ? 'Email' : 'User ID'}</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="player_id_input"
                  type="text"
                  inputMode={isTelegram || isSteam || isGiftCard ? 'text' : 'numeric'}
                  value={formData.playerID}
                  onChange={handlePlayerIdChange}
                  onPaste={handlePlayerIdPaste}
                  onBlur={() => {
                    if (formData.playerID && formData.serverID && formData.serverID.toLowerCase() !== 'global') {
                      triggerAccountVerification(formData.playerID, formData.serverID);
                    }
                  }}
                  placeholder={isTelegram ? '@username' : isSteam ? 'steam_username' : isGiftCard ? 'email@domain.com' : 'User ID'}
                  className={`w-full h-11 sm:h-12 bg-[#04091a] border rounded-xl pl-3.5 pr-28 text-sm sm:text-base font-mono font-bold text-white placeholder-slate-500 focus:outline-none transition-all ${
                    verifiedAccount?.valid === false
                      ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : verifiedAccount?.valid
                      ? 'border-emerald-500/70 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-cyan-900/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                  }`}
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {formData.playerID && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, playerID: '' }));
                        setAutoDetectedMessage('');
                        setVerifiedAccount(null);
                        lastVerifiedKeyRef.current = '';
                      }}
                      className="w-6 h-6 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                      title="Clear"
                    >
                      ✕
                    </button>
                  )}
                  {/* Single Paste button */}
                  <button
                    type="button"
                    onClick={handlePastePlayerId}
                    className="h-8 px-2.5 sm:px-3 rounded-lg bg-[#270e28] hover:bg-[#38143a] border border-pink-500/80 text-pink-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(236,72,153,0.2)]"
                    title="Paste Player ID"
                  >
                    {pastedPlayerId ? (
                      <>
                        <span className="text-emerald-400 text-xs">✓</span>
                        <span className="text-emerald-400 font-bold text-[11px]">{language === 'km' ? 'បានដាក់' : 'Pasted'}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span className="font-bold text-[11px] tracking-wide">Paste</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* SERVER ID Field (NO PASTE BUTTON - only clear ✕) */}
            {isMlbb && (
              <div>
                <label htmlFor="server_id_input" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-200 mb-2 font-sans">
                  <svg className="w-4 h-4 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 3.34 2 5v14c0 1.66 4.48 3 10 3s10-1.34 10-3V5c0-1.66-4.48-3-10-3zm0 2c4.42 0 8 .9 8 1.99s-3.58 2.01-8 2.01S4 7.08 4 5.99 7.58 4 12 4zm0 16c-4.42 0-8-.9-8-1.99V16.7c1.94 1.05 4.85 1.7 8 1.7s6.06-.65 8-1.7v1.31c0 1.09-3.58 1.99-8 1.99zm0-4.5c-4.42 0-8-.9-8-1.99V12.2c1.94 1.05 4.85 1.7 8 1.7s6.06-.65 8-1.7v1.31c0 1.09-3.58 1.99-8 1.99zm0-4.5c-4.42 0-8-.9-8-1.99V7.7c1.94 1.05 4.85 1.7 8 1.7s6.06-.65 8-1.7v1.31c0 1.09-3.58 1.99-8 1.99z"/>
                  </svg>
                  <span>Server ID</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="server_id_input"
                    type="text"
                    inputMode="numeric"
                    value={formData.serverID}
                    onChange={handleServerIdChange}
                    onPaste={handleServerIdPaste}
                    onBlur={() => {
                      if (formData.playerID && formData.serverID && formData.serverID.toLowerCase() !== 'global') {
                        triggerAccountVerification(formData.playerID, formData.serverID);
                      }
                    }}
                    placeholder="Server ID"
                    className={`w-full h-11 sm:h-12 bg-[#04091a] border rounded-xl pl-3.5 pr-9 text-sm sm:text-base font-mono font-bold text-white placeholder-slate-500 focus:outline-none transition-all ${
                      verifiedAccount?.valid === false
                        ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : verifiedAccount?.valid
                        ? 'border-emerald-500/70 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        : 'border-cyan-900/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                    }`}
                  />
                  {formData.serverID && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, serverID: '' }));
                        setVerifiedAccount(null);
                        lastVerifiedKeyRef.current = '';
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                      title="Clear"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}

            {isFreefire && (() => {
              const currentRegionCode = verifiedAccount?.region || verifiedAccount?.server || formData.serverID || 'Global';
              const regInfo = resolveRegionInfo(currentRegionCode);
              return (
                <div>
                  <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-200 mb-2 font-sans">
                    <svg className="w-4 h-4 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 3.34 2 5v14c0 1.66 4.48 3 10 3s10-1.34 10-3V5c0-1.66-4.48-3-10-3zm0 2c4.42 0 8 .9 8 1.99s-3.58 2.01-8 2.01S4 7.08 4 5.99 7.58 4 12 4zm0 16c-4.42 0-8-.9-8-1.99V16.7c1.94 1.05 4.85 1.7 8 1.7s6.06-.65 8-1.7v1.31c0 1.09-3.58 1.99-8 1.99zm0-4.5c-4.42 0-8-.9-8-1.99V12.2c1.94 1.05 4.85 1.7 8 1.7s6.06-.65 8-1.7v1.31c0 1.09-3.58 1.99-8 1.99zm0-4.5c-4.42 0-8-.9-8-1.99V7.7c1.94 1.05 4.85 1.7 8 1.7s6.06-.65 8-1.7v1.31c0 1.09-3.58 1.99-8 1.99z"/>
                    </svg>
                    <span>SERVER REGION</span>
                  </label>
                  <div className={`w-full h-11 sm:h-12 bg-[#04091a] border rounded-xl px-3.5 flex items-center justify-between gap-2 transition-all ${
                    verifiedAccount?.valid ? 'border-emerald-500/50' : 'border-cyan-900/70'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{regInfo.flag}</span>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {regInfo.server}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                      verifiedAccount?.valid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {regInfo.code}
                    </span>
                  </div>
                </div>
              );
            })()}

            {isHoyoverse && (
              <div>
                <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-200 mb-2 font-sans">
                  <svg className="w-4 h-4 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 3.34 2 5v14c0 1.66 4.48 3 10 3s10-1.34 10-3V5c0-1.66-4.48-3-10-3zm0 2c4.42 0 8 .9 8 1.99s-3.58 2.01-8 2.01S4 7.08 4 5.99 7.58 4 12 4zm0 16c-4.42 0-8-.9-8-1.99V16.7c1.94 1.05 4.85 1.7 8 1.7s6.06-.65 8-1.7v1.31c0 1.09-3.58 1.99-8 1.99zm0-4.5c-4.42 0-8-.9-8-1.99V12.2c1.94 1.05 4.85 1.7 8 1.7s6.06-.65 8-1.7v1.31c0 1.09-3.58 1.99-8 1.99zm0-4.5c-4.42 0-8-.9-8-1.99V7.7c1.94 1.05 4.85 1.7 8 1.7s6.06-.65 8-1.7v1.31c0 1.09-3.58 1.99-8 1.99z"/>
                  </svg>
                  <span>SERVER</span>
                </label>
                <select
                  value={formData.serverID}
                  onChange={(e) => setFormData(prev => ({ ...prev, serverID: e.target.value }))}
                  className="w-full h-11 sm:h-12 bg-[#04091a] border border-cyan-900/70 rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                >
                  <option value="Asia">Asia</option>
                  <option value="America">America</option>
                  <option value="Europe">Europe</option>
                  <option value="TW/HK/MO">TW/HK/MO</option>
                </select>
              </div>
            )}
          </div>

          {/* Auto-detected message notice matching Image 2 */}
          {autoDetectedMessage && (
            <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 pt-0.5">
              <span>⚡</span>
              <span>{autoDetectedMessage}</span>
            </div>
          )}

          {/* Prominent Account Not Found Warning Card */}
          {verifiedAccount && !verifiedAccount.valid && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-rose-950/80 border border-rose-500/60 text-rose-200 text-xs sm:text-sm flex items-start gap-3 shadow-xl animate-fadeIn">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 text-base shrink-0 font-bold">
                ✕
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="font-black text-rose-300 text-sm flex items-center justify-between">
                  <span>{language === 'km' ? 'រកមិនឃើញគណនីអ្នកលេងទេ (Account Not Found)' : 'Player Account Not Found'}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/25 text-rose-300 font-bold border border-rose-500/40">
                    {language === 'km' ? 'មិនអាចទូទាត់បាន' : 'Payment Blocked'}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-rose-200/90 leading-relaxed font-khmer">
                  {language === 'km'
                    ? 'សូមពិនិត្យមើល Player ID និង Server ID នៅក្នុង Profile ហ្គេមរបស់អ្នកឡើងវិញ រួចចុច Paste ឬបញ្ចូលម្តងទៀត។ ប្រព័ន្ធមិនអនុញ្ញាតឲ្យបង់ប្រាក់ទេ ប្រសិនបើគ្មានគណនីត្រឹមត្រូវ។'
                    : 'Please double-check your Player ID and Server ID from your in-game profile, then paste or re-enter them. Payment cannot proceed until account is verified.'}
                </p>
              </div>
            </div>
          )}

          {/* Account Verified Banner (When Verified) or Check ID Button (When Not Verified) */}
          {verifiedAccount?.valid ? (
            <div className="w-full h-12 sm:h-13 rounded-xl bg-gradient-to-r from-[#00d084] via-[#00e599] to-[#00d084] text-white flex items-center justify-between px-4 sm:px-6 relative overflow-hidden shadow-[0_0_20px_rgba(0,229,153,0.35)] select-none">
              <div className="flex items-center gap-2.5 z-10">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#00d084] font-black text-sm shadow">
                  ✓
                </div>
                <span className="font-black text-sm sm:text-base tracking-wider text-white uppercase font-sans">
                  ACCOUNT VERIFIED
                </span>
              </div>
              {/* Translucent checkmark watermark on the right */}
              <div className="absolute -right-1 -bottom-2 text-white/20 pointer-events-none select-none">
                <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleVerifyAccount}
              disabled={accountChecking || !formData.playerID.trim() || (isMlbb && !formData.serverID.trim())}
              className={`w-full h-11 sm:h-12 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-[0.985] disabled:cursor-not-allowed ${
                formData.playerID.trim()
                  ? 'bg-gradient-to-r from-[#ec4899] via-[#f43f5e] to-[#ec4899] hover:opacity-95 text-white shadow-pink-500/25'
                  : 'bg-slate-800/80 border border-slate-700 text-slate-400 opacity-60'
              }`}
            >
              {accountChecking ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === 'km' ? 'កំពុងពិនិត្យឈ្មោះ...' : 'Checking Player Name...'}</span>
                </>
              ) : (
                <>
                  <span>CHECK ID</span>
                  <span className="text-[11px] opacity-80 font-normal">
                    ({language === 'km' ? 'ពិនិត្យឈ្មោះ' : 'Check Name'})
                  </span>
                </>
              )}
            </button>
          )}

          {/* Helper Tip Note matching Reference Image 2 */}
          <div className="flex items-center gap-2 text-xs sm:text-[13px] text-slate-300 font-khmer pt-0.5">
            <span className="text-amber-400 text-base shrink-0">💡</span>
            <span>{language === 'km' ? 'សូមបញ្ចូលលេខសម្គាល់ Player ID និង Server ID ឱ្យបានត្រឹមត្រូវ ដើម្បីធ្វើការបញ្ជាក់អត្តសញ្ញាណគណនីរបស់អ្នក' : 'Please enter the correct Player ID and Server ID to verify your account identity.'}</span>
          </div>

          {/* Verified Account Showcase when Account is verified (matching Image 2) */}
          {verifiedAccount?.valid && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#020717] border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.12)] space-y-3 animate-fadeIn">
              <div className="flex items-center gap-3.5">
                {/* Circular Golden Glowing Crown Avatar */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.55)] bg-gradient-to-br from-yellow-500/25 via-[#060810] to-yellow-950/60 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl filter drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] select-none">👑</span>
                  </div>
                  {/* Circular checkmark badge at bottom-right corner */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#020717] flex items-center justify-center text-white text-[10px] font-black shadow-[0_0_8px_#10b981]">
                    ✓
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  {isEditingRealName ? (
                    <form onSubmit={handleSaveCustomRealName} className="flex items-center gap-1.5 py-0.5">
                      <input
                        type="text"
                        value={editingNameInput}
                        onChange={(e) => setEditingNameInput(e.target.value)}
                        placeholder="Edit display name"
                        className="h-7 px-2 text-xs bg-[#030817] border border-pink-400 rounded text-white font-bold focus:outline-none"
                        autoFocus
                      />
                      <button type="submit" className="h-7 px-2.5 text-[10.5px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded transition-colors cursor-pointer">
                        {language === 'km' ? 'រក្សាទុក' : 'Save'}
                      </button>
                      <button type="button" onClick={() => setIsEditingRealName(false)} className="h-7 px-1.5 text-[10px] text-slate-400 hover:text-white cursor-pointer">
                        ✕
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-white text-base sm:text-lg tracking-wide truncate font-sans">
                        {verifiedAccount.name && !verifiedAccount.name.startsWith('Player_') && !verifiedAccount.name.includes('Player #') && verifiedAccount.name !== 'Verified Player'
                          ? verifiedAccount.name
                          : (KNOWN_REAL_NAMES[verifiedAccount.id] || (language === 'km' ? `អ្នកលេង ${selectedGame.name} (${verifiedAccount.id})` : `${selectedGame.name} Player (${verifiedAccount.id})`))}
                      </h4>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-emerald-950/70 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        REAL NAME
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingRealName(true);
                          setEditingNameInput(verifiedAccount.name || '');
                        }}
                        className="text-slate-400 hover:text-pink-300 p-0.5 transition-colors cursor-pointer"
                        title="Edit display name"
                      >
                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 pt-1 font-mono">
                    <span className="flex items-center gap-1 text-cyan-400 font-bold">
                      <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      ID: {verifiedAccount.id}
                    </span>
                    <span className="text-cyan-800 font-normal">|</span>
                    <span className="flex items-center gap-1 text-cyan-400 font-bold">
                      <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 3.34 2 5v14c0 1.66 4.48 3 10 3s10-1.34 10-3V5c0-1.66-4.48-3-10-3zm0 2c4.42 0 8 .9 8 1.99s-3.58 2.01-8 2.01S4 7.08 4 5.99 7.58 4 12 4zm0 16c-4.42 0-8-.9-8-1.99V16.7c1.94 1.05 4.85 1.7 8 1.7s6.06-.65 8-1.7v1.31c0 1.09-3.58 1.99-8 1.99zm0-4.5c-4.42 0-8-.9-8-1.99V12.2c1.94 1.05 4.85 1.7 8 1.7s6.06-.65 8-1.7v1.31c0 1.09-3.58 1.99-8 1.99zm0-4.5c-4.42 0-8-.9-8-1.99V7.7c1.94 1.05 4.85 1.7 8 1.7s6.06-.65 8-1.7v1.31c0 1.09-3.58 1.99-8 1.99z"/>
                      </svg>
                      Zone: {verifiedAccount.server || (formData.serverID ? formData.serverID : resolveRegionInfo(verifiedAccount.region).name)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Free Fire Authentic Stat Rows Table */}
              {isFreefire && (
                <div className="divide-y divide-slate-800/80 text-xs font-medium pt-1 border-t border-slate-800/80">
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-400">Battle Royale</span>
                    <div className="flex items-center gap-2 font-bold text-white">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/35">🛡️</span>
                      <span>{verifiedAccount.rank || 'Bronze I'}</span>
                    </div>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-400 uppercase tracking-wide text-[11px]">CLASH SQUAD</span>
                    <div className="flex items-center gap-2 font-bold text-white">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/35">⚔️</span>
                      <span>{verifiedAccount.rankPoints ? `${verifiedAccount.rankPoints.toLocaleString()} pts` : (verifiedAccount.rank || 'Bronze I')}</span>
                    </div>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-400">Likes</span>
                    <span className="font-extrabold text-white font-mono text-sm">{(verifiedAccount.likes ?? 1837304).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* ======================================================== */}
      {/* STEP 2: SELECT RECHARGE PACKAGE (DIAMONDS & PASSES)      */}
      {/* ======================================================== */}
      <div id="packages-section" className="mt-4 sm:mt-6 space-y-6">
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-[24px] p-3.5 sm:p-5 shadow-2xl backdrop-blur-md space-y-5">
            
            {/* Step 2 Header Title */}
            <div className="flex items-center justify-between gap-2 pb-1 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-[9px] sm:text-[11px] uppercase tracking-wider shadow-sm shrink-0">
                  {language === 'km' ? 'ជំហានទី ២' : 'STEP 2'}
                </span>
                <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 font-khmer truncate">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9z" /><path d="M2 9h20M12 21L8 9l4-6 4 6-4 12" /></svg>
                  <span>{language === 'km' ? 'ជ្រើសរើសចំនួនពេជ្រ & កញ្ចប់' : 'Select Diamond Package'}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Button Select Size (Quick Full Display Popup) */}
                <button
                  type="button"
                  onClick={() => setShowPackageModal(true)}
                  className="inline-flex items-center gap-1.5 py-1 px-2.5 sm:px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/60 text-slate-200 hover:text-cyan-300 font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95 group font-khmer"
                  title="Select Size / Full display"
                >
                  <svg className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                  <span>{language === 'km' ? 'បង្ហាញទាំងអស់' : 'Show All'}</span>
                  <span className="hidden sm:inline text-[10px] text-cyan-400/80 font-mono">⛶</span>
                </button>

                <span className="text-[11px] font-semibold text-slate-400 font-mono">
                  {products.length} {language === 'km' ? 'កញ្ចប់' : 'items'}
                </span>
              </div>
            </div>

            {/* Controls Bar: Symmetrical 50/50 2-Column Grid for Category & Layout Dropdowns */}
            <div className="grid grid-cols-2 gap-2 py-0.5">
              {/* 1. Category Dropdown List */}
              <div className="relative">
                <select
                  value={productCategoryTab}
                  onChange={(e) => setProductCategoryTab(e.target.value)}
                  className="w-full appearance-none bg-[#0a1024] hover:bg-[#0f1733] border border-slate-700/80 hover:border-slate-600 focus:border-cyan-400 text-slate-200 text-xs font-bold rounded-xl pl-3 pr-7 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all font-khmer shadow-sm truncate"
                  aria-label="Filter packages category"
                >
                  <option value="all" className="bg-slate-900 text-white">
                    🌐 {t('tab_all_pkgs')} ({products.length})
                  </option>
                  <option value="passes" className="bg-slate-900 text-white">
                    🔥 {isFreefire ? 'Beat seller' : t('tab_pass_pkgs')} ({getFilteredPackages('passes').length})
                  </option>
                  {isFreefire && (
                    <option value="level_pass" className="bg-slate-900 text-white">
                      🎖️ {language === 'km' ? 'កញ្ចប់ Level Pass' : 'Level Pass'} ({getFilteredPackages('level_pass').length})
                    </option>
                  )}
                  <option value="diamonds" className="bg-slate-900 text-white">
                    💎 {isFreefire ? 'Other Packages' : t('tab_diamond_pkgs')} ({getFilteredPackages('diamonds').length})
                  </option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              {/* 2. Layout & Size Mode Dropdown List */}
              <div className="relative">
                <select
                  value={layoutMode}
                  onChange={(e) => {
                    if (e.target.value === 'modal') {
                      setShowPackageModal(true);
                    } else {
                      setLayoutMode(e.target.value);
                    }
                  }}
                  className="w-full appearance-none bg-[#0a1024] hover:bg-[#0f1733] border border-slate-700/80 hover:border-slate-600 focus:border-cyan-400 text-cyan-300 text-xs font-bold rounded-xl pl-3 pr-7 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all font-khmer shadow-sm truncate"
                  aria-label="Select layout size"
                >
                  <option value="tiles" className="bg-slate-900 text-white">
                    ⊞ {language === 'km' ? 'ក្រឡា (Tiles)' : 'Tiles View'}
                  </option>
                  <option value="grid" className="bg-slate-900 text-white">
                    ⊟ {language === 'km' ? 'រូបធំ (Large)' : 'Large View'}
                  </option>
                  <option value="list" className="bg-slate-900 text-white">
                    ≡ {language === 'km' ? 'បញ្ជី (List)' : 'List View'}
                  </option>
                  <option value="modal" className="bg-slate-900 text-cyan-300 font-bold">
                    ↗ {language === 'km' ? 'បង្ហាញទាំងអស់ (ផ្ទាំងពេញ)' : 'Show All (Full Display)'}
                  </option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-cyan-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
  
            {/* ===== Scrollable Product Frame ===== */}
            <div className="relative rounded-2xl border border-slate-800 bg-[#060d24] overflow-hidden">
              {/* Frame header */}
              <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-800 bg-[#071232]/80 backdrop-blur">
                <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-sky-200">
                  <svg className="w-3.5 h-3.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9z" /><path d="M2 9h20M12 21L8 9l4-6 4 6-4 12" /></svg>
                  <span>{language === 'km' ? 'កញ្ចប់' : 'Packages'}</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-sky-500/15 border border-sky-400/30 text-[10px] font-mono text-sky-300">
                    {inlineFilteredProducts.length}
                  </span>
                </span>
                
                <span className={`flex items-center gap-1 text-[10px] font-semibold transition-opacity ${listScroll.atBottom && listScroll.atTop ? 'opacity-0' : 'opacity-100'} text-slate-400 font-khmer`}>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                  <span>{language === 'km' ? 'អូសមើល' : 'Scroll'}</span>
                </span>
              </div>
              {/* Scroll progress bar */}
              <div className="h-[2px] bg-slate-800/60">
                <div className="h-full bg-cyan-400 transition-[width] duration-150" style={{ width: `${Math.round(listScroll.progress * 100)}%` }} />
              </div>
              {/* Top fade */}
              <div className={`pointer-events-none absolute left-0 right-0 top-[38px] h-6 z-10 bg-gradient-to-b from-[#060d24] to-transparent transition-opacity duration-200 ${listScroll.atTop ? 'opacity-0' : 'opacity-100'}`} />
              <div
                ref={productListRef}
                onScroll={handleListScroll}
                className="product-scroll-frame max-h-[56vh] sm:max-h-[600px] overflow-y-auto overscroll-contain p-2 sm:p-3"
              >
                {renderProductCards(inlineFilteredProducts, false)}
              </div>
              {/* Bottom fade + scroll-down hint */}
              <div className={`pointer-events-none absolute left-0 right-0 bottom-0 h-14 z-10 bg-gradient-to-t from-[#030817] via-[#030817]/80 to-transparent flex items-end justify-center pb-1.5 transition-opacity duration-200 ${listScroll.atBottom ? 'opacity-0' : 'opacity-100'}`}>
                <span className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 animate-bounce">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                </span>
              </div>
            </div>

            {/* Bottom Helper Note */}
            <div className="text-center pt-1 text-[10px] text-slate-500 font-medium">
              Click any item to select and proceed to instant checkout.
            </div>

            {/* Selected Item & Total Summary Box (Moved directly above Step 3) */}
            <div ref={checkoutSectionRef} className="pt-3 font-khmer">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#0b1220] border border-slate-700/80 shadow-xl space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
                {/* Product Summary */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block font-khmer">
                      {language === 'km' ? 'កញ្ចប់ដែលបានជ្រើសរើស & សរុប' : 'Selected Item & Total'}
                    </span>
                    {selectedProduct.tag && (
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 font-khmer">
                        {selectedProduct.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <ProductPackageImage pkg={selectedProduct} size="xs" />
                    <span className="font-black text-amber-300 text-sm sm:text-base tracking-wide font-khmer">
                      {selectedProduct.name}
                    </span>
                  </div>
                </div>
                
                {/* Currency Switcher & Price Display */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {/* Currency Switcher Pill */}
                  <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-700/90 shadow-inner">
                    <button
                      type="button"
                      onClick={() => handleSwitchCurrency('USD')}
                      className={`py-1 px-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        currency === 'USD'
                          ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchCurrency('KHR')}
                      className={`py-1 px-2.5 rounded-lg text-xs font-black transition-all cursor-pointer font-khmer ${
                        currency === 'KHR'
                          ? 'bg-emerald-400 text-slate-950 shadow-md font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      KHR (៛)
                    </button>
                  </div>

                  {/* Price Block */}
                  <div className="text-right">
                    <span className="font-mono font-black text-emerald-400 text-xl sm:text-2xl block leading-tight drop-shadow-sm">
                      {currency === 'KHR'
                        ? <span>{Math.round(selectedProduct.price * 4100).toLocaleString()} <span className="font-khmer font-bold">៛</span></span>
                        : `$${selectedProduct.price.toFixed(2)} USD`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {currency === 'KHR'
                        ? `~$${selectedProduct.price.toFixed(2)} USD`
                        : <span>~{Math.round(selectedProduct.price * 4100).toLocaleString()} <span className="font-khmer">៛</span></span>}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* STEP 3: SELECT PAYMENT METHOD (ABA PAYWAY COMPLIANCE v2.11) */}
            {/* Strictly adhering to Figma Guideline Node 18242-814 */}
            {/* ======================================================== */}
            <div className="pt-4 border-t border-slate-800/90 space-y-3.5 font-khmer">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-sky-500/25 shrink-0">
                    3
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white tracking-wide flex items-center gap-1.5 flex-wrap font-khmer">
                      <span>{language === 'km' ? 'ជ្រើសរើសវិធីសាស្ត្រទូទាត់' : 'Select Payment Method'}</span>
                      <span className="text-[11px] text-sky-400 font-semibold font-khmer">
                        {language === 'km' ? '(Payment Methods)' : '(វិធីសាស្ត្រទូទាត់)'}
                      </span>
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] sm:text-[11px] font-bold shrink-0 font-khmer">
                  ⚡ {language === 'km' ? 'ឥតគិតថ្លៃសេវា 0%' : '0% Fee'}
                </span>
              </div>

              {/* Single Official ABA KHQR Payment Method - Press Directly to Pay */}
              <div className="flex flex-wrap items-center">
                <button
                  type="button"
                  id="checkout_button"
                  onClick={() => {
                    if (loading || isTopupDisabled) return;
                    if (!formData.playerID || !formData.playerID.trim()) {
                      setError(language === 'km' ? 'សូមបញ្ចូល Player ID របស់លោកអ្នកជាមុនសិន' : 'Please enter your Player ID first');
                      scrollToPlayerInfo('player');
                      return;
                    }
                    if (selectedGame?.id?.startsWith('mlbb') && (!formData.serverID || !formData.serverID.trim() || formData.serverID.trim().toLowerCase() === 'global')) {
                      setError(language === 'km' ? 'សូមបញ្ចូល Server ID របស់លោកអ្នកជាមុនសិន' : 'Please enter your Server ID first');
                      scrollToPlayerInfo('server');
                      return;
                    }
                    if (!verifiedAccount || !verifiedAccount.valid) {
                      setError(language === 'km'
                        ? 'រកមិនឃើញគណនីអ្នកលេងទេ។ សូមបញ្ចូល Player ID និង Server ID ឡើងវិញឲ្យបានត្រឹមត្រូវមុននឹងបង់ប្រាក់។'
                        : 'Player account not found. Please verify and re-enter your Player ID and Server ID before making payment.');
                      scrollToPlayerInfo(!formData.serverID ? 'server' : 'player');
                      return;
                    }
                    handleProceedToPayment();
                  }}
                  disabled={loading || isTopupDisabled}
                  style={{
                    opacity: isTopupDisabled ? 0.6 : 1,
                  }}
                  title={isTopupDisabled ? 'Top-Up Temporarily Paused' : 'Click to pay with ABA KHQR'}
                  className={`relative w-full sm:w-[320px] md:w-[340px] h-[64px] rounded-2xl px-3.5 py-2.5 bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#0b1220] border border-slate-700/90 hover:border-sky-400/80 shadow-lg hover:shadow-[0_0_20px_rgba(14,165,233,0.18)] transition-all select-none active:scale-[0.985] flex items-center justify-between text-left group ${
                    loading ? 'cursor-wait opacity-90' : isTopupDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-[10px] min-w-0">
                    <AbaKhqrLogo
                      alt="ABA KHQR"
                      style={{ width: '40px', height: '40px', borderRadius: '8px' }}
                      className="shrink-0 object-contain shadow-sm"
                    />
                    <div className="flex flex-col justify-center text-left min-w-0">
                      <span className="text-[14px] font-bold text-white group-hover:text-sky-300 leading-none tracking-tight transition-colors">
                        ABA KHQR
                      </span>
                      <span
                        className="text-[11px] leading-tight font-medium truncate font-khmer text-slate-400 mt-1"
                      >
                        {loading
                          ? (language === 'km' ? 'កំពុងភ្ជាប់ទៅកាន់ ABA...' : 'Connecting to ABA...')
                          : (language === 'km' ? 'ស្កេនទូទាត់តាមធនាគារជាសមាជិក' : 'Scan to pay with any banking app')}
                      </span>
                    </div>
                  </div>

                  {/* Right Action / Mobile Tap to Pay Badge & Chevron Button */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 px-2 py-0.5 rounded-lg lg:hidden shadow-sm">
                      {language === 'km' ? 'ចុចទូទាត់' : 'Pay'}
                    </span>
                    <div className="w-7 h-7 rounded-md bg-slate-800/90 border border-slate-700/80 group-hover:border-sky-400/50 flex items-center justify-center text-slate-300 group-hover:text-sky-300 transition-colors">
                      {loading ? (
                        <svg className="animate-spin w-3.5 h-3.5 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              </div>


              {error && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2 animate-pulse font-khmer">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Footer Trust Row: We Accept Marks & Terms (Figma: width 326px, height 18px, gap 4px) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80 font-khmer">
                <WeAcceptPayments />

                {/* Terms & Privacy Link */}
                <div className="flex items-center justify-end text-[10.5px] text-slate-400 px-1 font-khmer">
                  <Link to="/privacy" target="_blank" className="text-slate-500 hover:text-cyan-400 transition-colors font-khmer">
                    {language === 'km' ? 'លក្ខខណ្ឌ & ឯកជនភាព' : 'Terms & Privacy Policy'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* ======================================================== */}
      {/* MOBILE STICKY BOTTOM "PAY NOW" ACTION DOCK (lg:hidden)     */}
      {/* High-converting, sticky payment bar on mobile & tablet    */}
      {/* ======================================================== */}
      <aside
        aria-label="Mobile Payment Bar"
        className="lg:hidden fixed left-1/2 -translate-x-1/2 z-40 w-[calc(100%-28px)] max-w-md select-none font-khmer pointer-events-none"
        style={{ bottom: 'max(16px, calc(env(safe-area-inset-bottom, 0px) + 12px))' }}
      >
        <div className="relative overflow-hidden flex items-center justify-between gap-2 p-2 pl-3 sm:p-2.5 sm:pl-3.5 bg-gradient-to-r from-[#031d1d]/95 via-[#042827]/95 to-[#02222e]/95 backdrop-blur-2xl border border-[#00F5A0]/45 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.92),0_0_24px_rgba(0,245,160,0.24),inset_0_1px_1px_rgba(0,245,160,0.35)] ring-1 ring-[#00F5A0]/20 pointer-events-auto">
          
          {/* Ambient Highlight Glow Layers matching Pay Now button */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00F5A0]/10 via-[#00E5B0]/5 to-[#00D4FF]/15 pointer-events-none rounded-full" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-44 h-16 bg-[#00F5A0]/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute left-1 top-1/2 -translate-y-1/2 w-28 h-12 bg-[#00D4FF]/15 rounded-full blur-xl pointer-events-none" />

          {/* Selected Package Thumbnail & Total Price Summary */}
          <div className="flex-1 flex items-center gap-2 min-w-0 pl-0.5 relative z-10">
            {/* Mini Package Chest / Icon with matching highlight border */}
            <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-full bg-[#021818]/90 border border-[#00F5A0]/40 p-0.5 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
              <ProductPackageImage pkg={selectedProduct || {}} size="xs" />
            </div>

            {/* Package Name & Price */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[11px] sm:text-xs font-black text-white truncate">
                  {selectedProduct?.name || (language === 'km' ? 'ជ្រើសរើសកញ្ចប់' : 'Select Package')}
                </span>
                {selectedProduct?.tag && (
                  <span className="hidden xs:inline-block px-1.5 py-0.2 rounded-full bg-[#00F5A0]/20 text-[#00F5A0] border border-[#00F5A0]/40 text-[8.5px] font-black shrink-0">
                    {selectedProduct.tag}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-[10px] text-emerald-200/70 font-medium">
                  {language === 'km' ? 'សរុប:' : 'Total:'}
                </span>
                <span className="text-sm sm:text-base font-black text-[#00F5A0] tracking-tight leading-none drop-shadow-[0_0_10px_rgba(0,245,160,0.6)] font-mono">
                  {currency === 'KHR'
                    ? `${Math.round((selectedProduct?.price || 0.95) * 4100).toLocaleString()} ៛`
                    : `$${(selectedProduct?.price || 0.95).toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>

          {/* High-Converting Instant "Pay Now" Button with Professional Emojis */}
          <button
            type="button"
            id="mobile_sticky_pay_button"
            onClick={() => {
              if (loading || isTopupDisabled) return;
              if (!formData.playerID || !formData.playerID.trim()) {
                setError(language === 'km' ? 'សូមបញ្ចូល Player ID របស់លោកអ្នកជាមុនសិន' : 'Please enter your Player ID first');
                scrollToPlayerInfo('player');
                return;
              }
              if (selectedGame?.id?.startsWith('mlbb') && (!formData.serverID || !formData.serverID.trim() || formData.serverID.trim().toLowerCase() === 'global')) {
                setError(language === 'km' ? 'សូមបញ្ចូល Server ID របស់លោកអ្នកជាមុនសិន' : 'Please enter your Server ID first');
                scrollToPlayerInfo('server');
                return;
              }
              if (!verifiedAccount || !verifiedAccount.valid) {
                setError(language === 'km'
                  ? 'រកមិនឃើញគណនីអ្នកលេងទេ។ សូមបញ្ចូល Player ID និង Server ID ឡើងវិញឲ្យបានត្រឹមត្រូវមុននឹងបង់ប្រាក់។'
                  : 'Player account not found. Please verify and re-enter your Player ID and Server ID before making payment.');
                scrollToPlayerInfo(!formData.serverID ? 'server' : 'player');
                return;
              }
              handleProceedToPayment();
            }}
            disabled={loading || isTopupDisabled}
            className={`relative z-10 px-3.5 xs:px-4 sm:px-5 py-2 xs:py-2.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0 select-none group border border-white/40 ${
              loading
                ? 'bg-sky-600/70 text-white cursor-wait opacity-90'
                : isTopupDisabled
                ? 'bg-slate-700/80 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#00F5A0] via-[#00E5B0] to-[#00D4FF] hover:from-[#00F5B0] hover:to-[#00E5FF] text-slate-950 shadow-[0_4px_18px_rgba(0,245,160,0.42),inset_0_1px_0_rgba(255,255,255,0.7)] cursor-pointer'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-1.5 px-1">
                <svg className="animate-spin w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-[11px] font-black text-slate-950">{language === 'km' ? 'កំពុងភ្ជាប់...' : 'Connecting...'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base leading-none shrink-0 filter drop-shadow-sm">💳</span>
                <span className="font-black text-xs sm:text-sm text-slate-950 tracking-wider">
                  {language === 'km' ? 'ទូទាត់ឥឡូវ' : 'PAY NOW'}
                </span>
                <span className="text-xs leading-none text-slate-950/80">⚡</span>
                <span className="w-4 h-4 xs:w-4.5 xs:h-4.5 rounded-full bg-slate-950/20 text-slate-950 flex items-center justify-center text-[11px] font-black shrink-0 transition-transform group-hover:translate-x-0.5">
                  ›
                </span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* PAYMENT CONFIRMED — OFFICIAL RECEIPT MODAL */}
      {/* ======================================================== */}
      {paymentPaid && !awaitingBalance && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-[#0f172a] border border-emerald-500/40 rounded-3xl max-w-sm sm:max-w-md w-full p-6 shadow-2xl text-center space-y-4 animate-scaleUp relative overflow-hidden my-auto">
            
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 text-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              ✓
            </div>

            <div className="space-y-1">
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black uppercase tracking-widest inline-flex items-center gap-1.5">
                Payment Received
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">Diamonds Delivering!</h3>
              <p className="text-xs text-slate-300">
                Thank you! Your ABA PayWay payment was confirmed and diamonds are being delivered directly to your account.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#111728] border border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-bold text-amber-300">#{orderId || paymentData?.orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Player ID:</span>
                <span className="font-mono text-white">
                  {formData.playerID} {formData.serverID ? `(${formData.serverID})` : ''}
                </span>
              </div>
              {verifiedAccount?.name && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Account Name:</span>
                  <span className="text-white font-semibold">{verifiedAccount.name}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Package:</span>
                <span className="text-white font-bold">{selectedProduct?.name || 'Diamonds'}</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-slate-800">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-black text-emerald-400">
                  {paymentData?.currency === 'KHR'
                    ? `${Number(paymentData?.amount || 0).toLocaleString()} ៛`
                    : `$${Number(paymentData?.amount || 0).toFixed(2)}`}
                </span>
              </div>
              {paymentData?.tranId && (
                <div className="flex justify-between items-center pt-1 border-t border-slate-800/50">
                  <span className="text-slate-400 text-[11px]">ABA Tran ID:</span>
                  <span className="font-mono text-[10px] text-slate-300 bg-slate-800/60 px-1.5 py-0.5 rounded">
                    {paymentData.tranId}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/order-history"
                onClick={() => {
                  closeAbaCheckoutPopup();
                  setPaymentData(null);
                  setOrderId(null);
                  setPaymentPaid(false);
                  setAwaitingBalance(false);
                  setConfirmSent(false);
                }}
                className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>📜</span>
                <span>{language === 'km' ? 'មើលប្រវត្តិ' : 'Order History'}</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  closeAbaCheckoutPopup();
                  setPaymentData(null);
                  setOrderId(null);
                  setPaymentPaid(false);
                  setAwaitingBalance(false);
                  setConfirmSent(false);
                }}
                className="py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <span>✓</span>
                <span>{language === 'km' ? 'រួចរាល់' : 'Done'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* AWAITING BALANCE — PENDING RECEIPT (provider low balance) */}
      {/* ======================================================== */}
      {awaitingBalance && !paymentPaid && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg overflow-y-auto animate-fadeIn">
          <div className="bg-[#0B0F19] border-2 border-amber-500/70 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-amber-500/20 text-center space-y-5 animate-scaleUp relative overflow-hidden my-auto">

            {/* Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 text-4xl flex items-center justify-center mx-auto shadow-lg">
              ✅
            </div>

            <div className="space-y-1 relative">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Payment Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white pt-1">Your Payment is Confirmed!</h2>
              <p className="text-xs sm:text-sm text-slate-300">
                We have received your payment. Your diamonds will be delivered shortly.
              </p>
            </div>

            {/* Order Receipt */}
            <div className="p-4 rounded-2xl bg-[#111728] border border-slate-700 text-left space-y-2.5 text-xs shadow-inner">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Order Number:</span>
                <span className="font-mono font-black text-amber-300 text-sm">#{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Player ID:</span>
                <span className="font-mono text-white">{formData.playerID}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Package:</span>
                <span className="text-white font-bold">{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-black text-emerald-400">${paymentData?.amount?.toFixed(2) || '—'}</span>
              </div>
            
                {paymentData?.tranId && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
                    <span className="text-slate-400">ABA Transaction ID:</span>
                    <span className="font-mono text-[10px] text-slate-300 bg-slate-800/50 px-2 py-0.5 rounded">{paymentData.tranId}</span>
                  </div>
                )}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="flex items-center gap-1.5 opacity-60">
                    <span className="text-[10px] text-slate-500 font-medium">Processed securely by</span>
                    <img src="https://checkout.payway.com.kh/images/payway-logo-white.svg" alt="ABA PayWay" className="h-3" />
                  </div>
                </div>
              </div>

            {/* Status Badge */}
            <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-amber-950/40 border border-amber-500/30">
              <span className="text-2xl">⏳</span>
              <div className="text-left">
                <p className="text-amber-300 font-black text-sm">Topup Diamond Pending</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  We are sorry, our team will check and complete your order in a few minutes.
                </p>
              </div>
            </div>

            {/* Confirm Button */}
            {!confirmSent ? (
              <button
                onClick={async () => {
                  try {
                    await ordersAPI.confirmPaid(orderId);
                    updateLocalOrderStatus(orderId, {
                      paymentStatus: 'Paid',
                      topupStatus: 'Processing'
                    });
                    setConfirmSent(true);
                  } catch {
                    updateLocalOrderStatus(orderId, {
                      paymentStatus: 'Paid',
                      topupStatus: 'Processing'
                    });
                    setConfirmSent(true); // still mark as sent on error
                  }
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>✅</span>
                <span>I Have Paid — Confirm & Alert Admin</span>
              </button>
            ) : (
              <div className="w-full py-3 px-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-center gap-2">
                <span>✅</span>
                <span className="text-emerald-400 font-black text-sm">Admin Has Been Notified!</span>
              </div>
            )}

            <p className="text-[10px] text-slate-500 leading-relaxed">
              After confirming, our admin will be alerted immediately and your 💎 diamonds will be delivered as soon as possible. Thank you for your patience!
            </p>
          </div>
        </div>
      )}



      {/* ======================================================== */}
            {/* ======================================================== */}
      {/* FULL DISPLAY PACKAGE SELECTION MODAL (Portalled to body)   */}
      {/* "Press to Select - Full Display with Easy Scrolling & Close" */}
      {/* ======================================================== */}
      {showPackageModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[999999] bg-[#030713] flex flex-col select-none overflow-hidden h-[100dvh] w-full animate-fadeIn font-khmer">
          {/* 1. Modal Top Bar (Sticky, Safe-Area Top Aware) */}
          <header
            className="shrink-0 px-3 sm:px-6 py-2.5 sm:py-3 bg-[#060e22] border-b border-slate-800/90 shadow-xl flex flex-col gap-2 z-20"
            style={{ paddingTop: 'max(10px, env(safe-area-inset-top, 0px))' }}
          >
            {/* Row 1: Clean Navigation Header (Back + Title + Currency + Close) */}
            <div className="flex items-center justify-between gap-2">
              {/* Left: Back Button & Game Badge */}
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setShowPackageModal(false)}
                  className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700/80 hover:border-rose-400/50 text-rose-300 hover:text-white text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm shrink-0"
                  aria-label="Back to topup page"
                >
                  <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  <span>{language === 'km' ? 'ត្រឡប់' : 'Back'}</span>
                </button>

                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs sm:text-sm font-black text-white truncate">
                    {language === 'km' ? 'ជ្រើសរើសកញ្ចប់' : 'Select Package'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 text-[9px] font-mono font-bold shrink-0">
                    {modalFilteredProducts.length}
                  </span>
                </div>
              </div>

              {/* Right: Currency Toggle Pill + Close X */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex items-center p-0.5 bg-slate-900/90 rounded-xl border border-slate-700/80 shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleSwitchCurrency('USD')}
                    className={`py-1 px-2 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      currency === 'USD'
                        ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    USD
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchCurrency('KHR')}
                    className={`py-1 px-2 rounded-lg text-[10px] font-black transition-all cursor-pointer font-khmer ${
                      currency === 'KHR'
                        ? 'bg-emerald-400 text-slate-950 font-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    KHR
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPackageModal(false)}
                  className="w-7 h-7 rounded-xl bg-slate-900/90 hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-all cursor-pointer border border-slate-700/80 text-xs font-bold"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Row 2: Perfectly Balanced Symmetrical 50/50 Dropdown Filters */}
            <div className="grid grid-cols-2 gap-2">
              {/* 1. Category Dropdown */}
              <div className="relative">
                <select
                  value={productCategoryTab}
                  onChange={(e) => setProductCategoryTab(e.target.value)}
                  className="w-full appearance-none bg-[#0a1024] hover:bg-[#0f1733] border border-slate-700/80 hover:border-slate-600 focus:border-cyan-400 text-slate-200 text-xs font-bold rounded-xl pl-3 pr-7 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all font-khmer shadow-sm truncate"
                  aria-label="Filter packages category"
                >
                  <option value="all" className="bg-slate-900 text-white">
                    🌐 {t('tab_all_pkgs')} ({products.length})
                  </option>
                  <option value="passes" className="bg-slate-900 text-white">
                    🔥 {isFreefire ? 'Beat seller' : t('tab_pass_pkgs')} ({getFilteredPackages('passes').length})
                  </option>
                  {isFreefire && (
                    <option value="level_pass" className="bg-slate-900 text-white">
                      🎖️ {language === 'km' ? 'កញ្ចប់ Level Pass' : 'Level Pass'} ({getFilteredPackages('level_pass').length})
                    </option>
                  )}
                  <option value="diamonds" className="bg-slate-900 text-white">
                    💎 {isFreefire ? 'Other Packages' : t('tab_diamond_pkgs')} ({getFilteredPackages('diamonds').length})
                  </option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              {/* 2. Layout Mode Dropdown (KEEP THIS BUTTON) */}
              <div className="relative">
                <select
                  value={layoutMode}
                  onChange={(e) => setLayoutMode(e.target.value)}
                  className="w-full appearance-none bg-[#0a1024] hover:bg-[#0f1733] border border-slate-700/80 hover:border-slate-600 focus:border-cyan-400 text-cyan-300 text-xs font-bold rounded-xl pl-3 pr-7 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all font-khmer shadow-sm truncate"
                  aria-label="Select layout size"
                >
                  <option value="tiles" className="bg-slate-900 text-white">
                    ⊞ {language === 'km' ? 'ក្រឡា (Tiles)' : 'Tiles View'}
                  </option>
                  <option value="grid" className="bg-slate-900 text-white">
                    ⊟ {language === 'km' ? 'រូបធំ (Large)' : 'Large View'}
                  </option>
                  <option value="list" className="bg-slate-900 text-white">
                    ≡ {language === 'km' ? 'បញ្ជី (List)' : 'List View'}
                  </option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-cyan-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </header>

          {/* 2. Compact Search Bar inside Full Display */}
          <div className="shrink-0 bg-[#050b1a] border-b border-slate-800/80 px-3 sm:px-6 py-2">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                value={modalSearchQuery}
                onChange={(e) => setModalSearchQuery(e.target.value)}
                placeholder={language === 'km' ? 'ស្វែងរកកញ្ចប់ (ឧ. Weekly, 50, 100)...' : 'Search packages (e.g. Weekly, 100)...'}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-khmer"
              />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              {modalSearchQuery && (
                <button
                  type="button"
                  onClick={() => setModalSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 3. Modal Scrollable Area (EASY SCROLLING) */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-6 pb-28 product-scroll-frame bg-[#040816]">
            {modalFilteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <div className="text-3xl">🔍</div>
                <div className="text-sm font-bold text-slate-300 font-khmer">
                  {language === 'km' ? 'រកមិនឃើញកញ្ចប់នេះទេ' : 'No packages found matching your search.'}
                </div>
                <button
                  type="button"
                  onClick={() => { setModalSearchQuery(''); setProductCategoryTab('all'); }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-sky-400 hover:bg-slate-700 cursor-pointer font-khmer"
                >
                  {language === 'km' ? 'បង្ហាញទាំងអស់ឡើងវិញ' : 'Reset filters'}
                </button>
              </div>
            ) : (
              renderProductCards(modalFilteredProducts, true)
            )}
          </div>

          {/* 4. Modal Bottom Sticky Footer Bar (Safe-Area Bottom Aware) */}
          <footer
            className="shrink-0 bg-[#071126]/98 backdrop-blur-xl border-t border-slate-800/90 p-3 sm:px-6 shadow-2xl flex items-center justify-between gap-3"
            style={{ paddingBottom: 'max(12px, calc(env(safe-area-inset-bottom, 0px) + 8px))' }}
          >
            {/* Selected Item Info */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-amber-400/50 p-0.5 flex items-center justify-center shrink-0">
                <ProductPackageImage pkg={selectedProduct} size="xs" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider truncate font-khmer">
                  {language === 'km' ? 'បានជ្រើសរើស' : 'Selected'}:
                </div>
                <div className="text-xs sm:text-sm font-black text-amber-300 truncate font-khmer">
                  {selectedProduct.name}
                </div>
                <div className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                  {currency === 'KHR'
                    ? `${Math.round(selectedProduct.price * 4100).toLocaleString()} ៛`
                    : `$${selectedProduct.price.toFixed(2)} USD`}
                </div>
              </div>
            </div>

            {/* Buttons: Close & Confirm */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowPackageModal(false)}
                className="py-2 px-3 sm:px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-black transition-all cursor-pointer active:scale-95 border border-slate-700 font-khmer"
              >
                {language === 'km' ? 'បិទ' : 'Close'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPackageModal(false);
                  if (checkoutSectionRef.current) {
                    checkoutSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="py-2 px-3.5 sm:px-5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs sm:text-sm font-black transition-all cursor-pointer active:scale-95 shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 font-khmer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{language === 'km' ? 'ជ្រើសរើសរួចរាល់' : 'Done'}</span>
              </button>
            </div>
          </footer>
        </div>,
        document.body
      )}


      {/* ID GUIDE MODAL (z-[9999]) */}
      {/* ======================================================== */}
      {showIdGuide && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-[#0B0F19] border border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-base">
                How to find your {selectedGame.name} ID
              </h3>
              <button
                onClick={() => setShowIdGuide(false)}
                className="text-slate-400 hover:text-white text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>1. Open <strong className="text-white">{selectedGame.name}</strong> on your device.</p>
              <p>2. Tap your profile picture or avatar icon in the main menu.</p>
              <p>3. Look for the <strong className="text-amber-300">User ID / Player ID</strong> displayed on your profile card.</p>
              {isMlbb && (
                <p className="p-3 bg-[#111728] rounded-xl border border-slate-800 text-[11px]">
                  💡 <strong>Example:</strong> If your profile shows <code>1225368571 (11446)</code>, enter <code>1225368571</code> in Player ID and <code>11446</code> in Server ID.
                </p>
              )}
            </div>

            <button
              onClick={() => setShowIdGuide(false)}
              className="w-full py-2.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopUp;
