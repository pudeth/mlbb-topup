import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI, bakongAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getStoredGames, saveStoredGames, resetToDefaultGames } from '../services/gamesConfig';
import { useStoreBranding } from '../services/storeBranding';
import { DEFAULT_EVENT_BANNERS } from '../components/EventBannerSlider';
import { CambodiaFlagSvg, CambodiaFlagFrame, CambodiaCornerBadge } from '../components/CambodiaFlagBadge';
import ProductPackageImage from '../components/ProductPackageImage';
import { uploadToCloudinary, getCloudinaryConfig, saveCloudinaryConfig } from '../services/cloudinary';

const AdminDashboard = () => {

  // All Game & Special Event Types for Admin Pricing Manager
  

// Comprehensive Catalog of Official Packages for All Games & Special Events with Dual Provider Wholesale Costs
const ALL_GAMES_CATALOG_LIST = [
  // Mobile Legends (MLBB)
  { productId: 12, game: 'mlbb', diamondAmount: 55, name: '55 Diamonds', price: 0.95, resellerPrice: 0.95, costPriceFazerCards: 0.74, costPriceKhmerTopUp: 0.78, tag: 'Starter', status: 'Active' },
  { productId: 13, game: 'mlbb', diamondAmount: 86, name: '86 Diamonds', price: 1.35, resellerPrice: 1.35, costPriceFazerCards: 1.17, costPriceKhmerTopUp: 1.20, tag: 'Bonus', status: 'Active' },
  { productId: 14, game: 'mlbb', diamondAmount: 210, name: 'Weekly Pass', price: 1.55, resellerPrice: 1.55, costPriceFazerCards: 1.45, costPriceKhmerTopUp: 1.50, tag: 'ទទួលបាន 220 💎 + 70 arura ⭐', isPass: true, status: 'Active' },
  { productId: 201, game: 'mlbb', diamondAmount: 440, name: '2 Weekly Pass', price: 3.10, resellerPrice: 3.10, costPriceFazerCards: 2.90, costPriceKhmerTopUp: 3.00, tag: 'ទទួលបាន 440 💎 + 140 arura ⭐', isPass: true, status: 'Active' },
  { productId: 202, game: 'mlbb', diamondAmount: 660, name: '3 Weekly Pass', price: 4.65, resellerPrice: 4.65, costPriceFazerCards: 4.35, costPriceKhmerTopUp: 4.50, tag: '29 tickets 🎫', isPass: true, status: 'Active' },
  { productId: 203, game: 'mlbb', diamondAmount: 880, name: '4 Weekly Pass', price: 6.20, resellerPrice: 6.20, costPriceFazerCards: 5.80, costPriceKhmerTopUp: 6.00, tag: '4x WDP', isPass: true, status: 'Active' },
  { productId: 204, game: 'mlbb', diamondAmount: 1100, name: '5 Weekly Pass', price: 7.75, resellerPrice: 7.75, costPriceFazerCards: 7.25, costPriceKhmerTopUp: 7.50, tag: '5x WDP', isPass: true, status: 'Active' },
  { productId: 205, game: 'mlbb', diamondAmount: 1320, name: '6 Weekly Pass', price: 9.30, resellerPrice: 9.30, costPriceFazerCards: 8.70, costPriceKhmerTopUp: 9.00, tag: '6x WDP', isPass: true, status: 'Active' },
  { productId: 206, game: 'mlbb', diamondAmount: 605, name: '165 + 2Weekly', price: 5.50, resellerPrice: 5.50, costPriceFazerCards: 5.12, costPriceKhmerTopUp: 5.30, tag: '165 💎 + 2x WDP', isPass: true, status: 'Active' },
  { productId: 207, game: 'mlbb', diamondAmount: 55, name: 'Weekly Elite Bundle', price: 0.85, resellerPrice: 0.85, costPriceFazerCards: 0.75, costPriceKhmerTopUp: 0.78, tag: 'ទទួលបាន 55 💎 + 20 arura ⭐', isPass: true, status: 'Active' },
  { productId: 208, game: 'mlbb', diamondAmount: 275, name: 'Monthly Epic Bundle', price: 4.25, resellerPrice: 4.25, costPriceFazerCards: 3.73, costPriceKhmerTopUp: 3.90, tag: 'ទទួលបាន 275 💎 + 180 arura ⭐', isPass: true, status: 'Active' },
  { productId: 2, game: 'mlbb', diamondAmount: 110, name: '110 Diamonds', price: 1.70, resellerPrice: 1.70, costPriceFazerCards: 1.45, costPriceKhmerTopUp: 1.50, tag: 'Bonus', status: 'Active' },
  { productId: 31, game: 'mlbb', diamondAmount: 165, name: '165 Diamonds', price: 2.40, resellerPrice: 2.40, costPriceFazerCards: 2.22, costPriceKhmerTopUp: 2.25, tag: 'HOT 🔥', status: 'Active' },
  { productId: 15, game: 'mlbb', diamondAmount: 172, name: '172 Diamonds', price: 2.50, resellerPrice: 2.50, costPriceFazerCards: 2.31, costPriceKhmerTopUp: 2.35, tag: 'Standard', status: 'Active' },
  { productId: 16, game: 'mlbb', diamondAmount: 257, name: '257 Diamonds', price: 3.69, resellerPrice: 3.69, costPriceFazerCards: 3.34, costPriceKhmerTopUp: 3.40, tag: 'Popular', status: 'Active' },
  { productId: 32, game: 'mlbb', diamondAmount: 275, name: '275 Diamonds', price: 3.85, resellerPrice: 3.85, costPriceFazerCards: 3.55, costPriceKhmerTopUp: 3.60, tag: '29 tickets 🎟️', status: 'Active' },
  { productId: 33, game: 'mlbb', diamondAmount: 312, name: '312 Diamonds', price: 4.55, resellerPrice: 4.55, costPriceFazerCards: 3.88, costPriceKhmerTopUp: 4.00, tag: 'STARLIGHT 🌟', status: 'Active' },
  { productId: 34, game: 'mlbb', diamondAmount: 343, name: '343 Diamonds', price: 4.99, resellerPrice: 4.99, costPriceFazerCards: 4.25, costPriceKhmerTopUp: 4.40, tag: '29 tickets 🎟️', status: 'Active' },
  { productId: 18, game: 'mlbb', diamondAmount: 429, name: '429 Diamonds', price: 6.30, resellerPrice: 6.30, costPriceFazerCards: 5.68, costPriceKhmerTopUp: 5.80, tag: '29 tickets 🎟️', status: 'Active' },
  { productId: 19, game: 'mlbb', diamondAmount: 500, name: 'Twilight Pass', price: 8.50, resellerPrice: 8.50, costPriceFazerCards: 7.64, costPriceKhmerTopUp: 8.00, tag: 'VIP PASS 👑', isPass: true, status: 'Active' },
  { productId: 20, game: 'mlbb', diamondAmount: 514, name: '514 Diamonds', price: 7.35, resellerPrice: 7.35, costPriceFazerCards: 6.28, costPriceKhmerTopUp: 6.45, tag: 'Best Value', status: 'Active' },
  { productId: 35, game: 'mlbb', diamondAmount: 565, name: '565 Diamonds', price: 7.80, resellerPrice: 7.80, costPriceFazerCards: 7.31, costPriceKhmerTopUp: 7.45, tag: 'Special', status: 'Active' },
  { productId: 36, game: 'mlbb', diamondAmount: 600, name: '600 Diamonds', price: 8.50, resellerPrice: 8.50, costPriceFazerCards: 7.25, costPriceKhmerTopUp: 7.45, tag: 'Pro Pack', status: 'Active' },
  { productId: 21, game: 'mlbb', diamondAmount: 706, name: '706 Diamonds', price: 9.99, resellerPrice: 9.99, costPriceFazerCards: 9.08, costPriceKhmerTopUp: 9.25, tag: 'VIP', status: 'Active' },
  { productId: 37, game: 'mlbb', diamondAmount: 878, name: '878 Diamonds', price: 12.80, resellerPrice: 12.80, costPriceFazerCards: 10.90, costPriceKhmerTopUp: 11.20, tag: 'VIP PRO', status: 'Active' },
  { productId: 38, game: 'mlbb', diamondAmount: 963, name: '963 Diamonds', price: 13.60, resellerPrice: 13.60, costPriceFazerCards: 11.60, costPriceKhmerTopUp: 11.90, tag: 'Grand Pack', status: 'Active' },
  { productId: 22, game: 'mlbb', diamondAmount: 1050, name: '1050 Diamonds', price: 15.50, resellerPrice: 15.50, costPriceFazerCards: 13.20, costPriceKhmerTopUp: 13.60, tag: 'Royal Chest', status: 'Active' },
  { productId: 39, game: 'mlbb', diamondAmount: 1412, name: '1412 Diamonds', price: 22.00, resellerPrice: 22.00, costPriceFazerCards: 18.80, costPriceKhmerTopUp: 19.20, tag: 'Treasury', status: 'Active' },
  { productId: 23, game: 'mlbb', diamondAmount: 2195, name: '2195 Diamonds', price: 29.99, resellerPrice: 29.99, costPriceFazerCards: 27.49, costPriceKhmerTopUp: 28.00, tag: 'Mythic Pack', status: 'Active' },
  { productId: 40, game: 'mlbb', diamondAmount: 2452, name: '2452 Diamonds', price: 32.50, resellerPrice: 32.50, costPriceFazerCards: 27.70, costPriceKhmerTopUp: 28.50, tag: 'Mythic Plus', status: 'Active' },
  { productId: 41, game: 'mlbb', diamondAmount: 2901, name: '2901 Diamonds', price: 39.99, resellerPrice: 39.99, costPriceFazerCards: 34.00, costPriceKhmerTopUp: 35.00, tag: 'Legendary Pack', status: 'Active' },
  { productId: 24, game: 'mlbb', diamondAmount: 3688, name: '3688 Diamonds', price: 49.99, resellerPrice: 49.99, costPriceFazerCards: 45.86, costPriceKhmerTopUp: 46.50, tag: 'Epic Vault', status: 'Active' },
  { productId: 42, game: 'mlbb', diamondAmount: 4390, name: '4390 Diamonds', price: 62.99, resellerPrice: 62.99, costPriceFazerCards: 53.60, costPriceKhmerTopUp: 55.00, tag: 'Supreme Chest', status: 'Active' },
  { productId: 25, game: 'mlbb', diamondAmount: 5532, name: '5532 Diamonds', price: 73.99, resellerPrice: 73.99, costPriceFazerCards: 69.24, costPriceKhmerTopUp: 70.00, tag: 'Immortal Pack', status: 'Active' },
  { productId: 43, game: 'mlbb', diamondAmount: 6944, name: '6944 Diamonds', price: 92.99, resellerPrice: 92.99, costPriceFazerCards: 79.20, costPriceKhmerTopUp: 81.00, tag: 'Titan Pack', status: 'Active' },
  { productId: 26, game: 'mlbb', diamondAmount: 9288, name: '9288 Diamonds', price: 125.00, resellerPrice: 125.00, costPriceFazerCards: 115.00, costPriceKhmerTopUp: 118.00, tag: 'ULTIMATE ⚡', status: 'Active' },

  // PUBG Mobile
  { productId: 201, game: 'pubgm', diamondAmount: 60, name: '60 Unknown Cash (UC)', price: 0.95, resellerPrice: 0.87, costPriceFazerCards: 0.78, costPriceKhmerTopUp: 0.82, tag: 'Starter', status: 'Active' },
  { productId: 202, game: 'pubgm', diamondAmount: 325, name: '300 + 25 UC', price: 4.80, resellerPrice: 4.42, costPriceFazerCards: 3.90, costPriceKhmerTopUp: 4.10, tag: 'Popular', status: 'Active' },
  { productId: 203, game: 'pubgm', diamondAmount: 660, name: 'Royale Pass Upgrade (660 UC)', price: 9.50, resellerPrice: 8.74, costPriceFazerCards: 7.80, costPriceKhmerTopUp: 8.20, tag: '🔥 SEASON PASS', isPass: true, status: 'Active' },
  { productId: 204, game: 'pubgm', diamondAmount: 1800, name: '1500 + 300 UC', price: 23.99, resellerPrice: 22.07, costPriceFazerCards: 19.50, costPriceKhmerTopUp: 20.50, tag: 'Best Value', status: 'Active' },
  { productId: 205, game: 'pubgm', diamondAmount: 3850, name: '3000 + 850 UC', price: 47.99, resellerPrice: 44.15, costPriceFazerCards: 39.00, costPriceKhmerTopUp: 41.00, tag: 'VIP Pack', status: 'Active' },
  { productId: 206, game: 'pubgm', diamondAmount: 8100, name: '6000 + 2100 UC', price: 95.00, resellerPrice: 87.40, costPriceFazerCards: 78.00, costPriceKhmerTopUp: 82.00, tag: 'ULTIMATE ⚡', status: 'Active' },

  // Free Fire
  { productId: 301, game: 'freefire', diamondAmount: 100, name: '100 + 10 Diamonds', price: 0.95, resellerPrice: 0.87, costPriceFazerCards: 0.78, costPriceKhmerTopUp: 0.82, tag: 'Starter', status: 'Active' },
  { productId: 302, game: 'freefire', diamondAmount: 310, name: '310 + 31 Diamonds', price: 2.85, resellerPrice: 2.62, costPriceFazerCards: 2.30, costPriceKhmerTopUp: 2.45, tag: 'Popular', status: 'Active' },
  { productId: 307, game: 'freefire', diamondAmount: 450, name: 'Weekly Membership Pass', price: 1.99, resellerPrice: 1.83, costPriceFazerCards: 1.50, costPriceKhmerTopUp: 1.65, tag: 'PASS 🌟', isPass: true, status: 'Active' },
  { productId: 303, game: 'freefire', diamondAmount: 520, name: '520 + 52 Diamonds', price: 4.75, resellerPrice: 4.37, costPriceFazerCards: 3.90, costPriceKhmerTopUp: 4.10, tag: 'HOT 🔥', status: 'Active' },
  { productId: 304, game: 'freefire', diamondAmount: 1060, name: '1060 + 106 Diamonds', price: 9.50, resellerPrice: 8.74, costPriceFazerCards: 7.80, costPriceKhmerTopUp: 8.20, tag: 'Best Value', status: 'Active' },
  { productId: 305, game: 'freefire', diamondAmount: 2180, name: '2180 + 218 Diamonds', price: 18.99, resellerPrice: 17.47, costPriceFazerCards: 15.50, costPriceKhmerTopUp: 16.30, tag: 'Pro Pack', status: 'Active' },
  { productId: 308, game: 'freefire', diamondAmount: 2600, name: 'Monthly Membership Pass', price: 7.99, resellerPrice: 7.35, costPriceFazerCards: 6.30, costPriceKhmerTopUp: 6.80, tag: 'VIP 👑', isPass: true, status: 'Active' },

  // Genshin Impact
  { productId: 507, game: 'genshin', diamondAmount: 3000, name: 'Blessing of the Welkin Moon', price: 4.99, resellerPrice: 4.59, costPriceFazerCards: 3.90, costPriceKhmerTopUp: 4.20, tag: 'PASS 🌙', isPass: true, status: 'Active' },
  { productId: 501, game: 'genshin', diamondAmount: 60, name: '60 Genesis Crystals', price: 0.99, resellerPrice: 0.91, costPriceFazerCards: 0.80, costPriceKhmerTopUp: 0.85, tag: 'Starter', status: 'Active' },
  { productId: 502, game: 'genshin', diamondAmount: 330, name: '300 + 30 Genesis Crystals', price: 4.99, resellerPrice: 4.59, costPriceFazerCards: 4.00, costPriceKhmerTopUp: 4.25, tag: 'Popular', status: 'Active' },
  { productId: 503, game: 'genshin', diamondAmount: 1090, name: '980 + 110 Genesis Crystals', price: 14.99, resellerPrice: 13.79, costPriceFazerCards: 12.20, costPriceKhmerTopUp: 12.80, tag: 'HOT 🔥', status: 'Active' },
  { productId: 504, game: 'genshin', diamondAmount: 2240, name: '1980 + 260 Genesis Crystals', price: 29.99, resellerPrice: 27.59, costPriceFazerCards: 24.50, costPriceKhmerTopUp: 25.80, tag: 'Best Value', status: 'Active' },
  { productId: 505, game: 'genshin', diamondAmount: 3880, name: '3280 + 600 Genesis Crystals', price: 49.99, resellerPrice: 45.99, costPriceFazerCards: 41.00, costPriceKhmerTopUp: 43.00, tag: 'Grand Pack', status: 'Active' },
  { productId: 506, game: 'genshin', diamondAmount: 8080, name: '6480 + 1600 Genesis Crystals', price: 99.99, resellerPrice: 91.99, costPriceFazerCards: 82.00, costPriceKhmerTopUp: 86.00, tag: 'ULTIMATE ⚡', status: 'Active' },

  // Honkai: Star Rail
  { productId: 607, game: 'star_rail', diamondAmount: 3000, name: 'Express Supply Pass', price: 4.99, resellerPrice: 4.59, costPriceFazerCards: 3.90, costPriceKhmerTopUp: 4.20, tag: 'PASS 🚂', isPass: true, status: 'Active' },
  { productId: 601, game: 'star_rail', diamondAmount: 60, name: '60 Oneiric Shards', price: 0.99, resellerPrice: 0.91, costPriceFazerCards: 0.80, costPriceKhmerTopUp: 0.85, tag: 'Starter', status: 'Active' },
  { productId: 602, game: 'star_rail', diamondAmount: 330, name: '300 + 30 Oneiric Shards', price: 4.99, resellerPrice: 4.59, costPriceFazerCards: 4.00, costPriceKhmerTopUp: 4.25, tag: 'Popular', status: 'Active' },
  { productId: 603, game: 'star_rail', diamondAmount: 1090, name: '980 + 110 Oneiric Shards', price: 14.99, resellerPrice: 13.79, costPriceFazerCards: 12.20, costPriceKhmerTopUp: 12.80, tag: 'HOT 🔥', status: 'Active' },
  { productId: 604, game: 'star_rail', diamondAmount: 2240, name: '1980 + 260 Oneiric Shards', price: 29.99, resellerPrice: 27.59, costPriceFazerCards: 24.50, costPriceKhmerTopUp: 25.80, tag: 'Best Value', status: 'Active' },
  { productId: 605, game: 'star_rail', diamondAmount: 3880, name: '3280 + 600 Oneiric Shards', price: 49.99, resellerPrice: 45.99, costPriceFazerCards: 41.00, costPriceKhmerTopUp: 43.00, tag: 'Grand Pack', status: 'Active' },
  { productId: 606, game: 'star_rail', diamondAmount: 8080, name: '6480 + 1600 Oneiric Shards', price: 99.99, resellerPrice: 91.99, costPriceFazerCards: 82.00, costPriceKhmerTopUp: 86.00, tag: 'ULTIMATE ⚡', status: 'Active' },

  // Zenless Zone Zero
  { productId: 651, game: 'zenless', diamondAmount: 3000, name: 'Inter-Knot Membership Pass', price: 4.99, resellerPrice: 4.59, costPriceFazerCards: 3.90, costPriceKhmerTopUp: 4.20, tag: 'PASS ⚡', isPass: true, status: 'Active' },
  { productId: 652, game: 'zenless', diamondAmount: 60, name: '60 Monochromes', price: 0.99, resellerPrice: 0.91, costPriceFazerCards: 0.80, costPriceKhmerTopUp: 0.85, tag: 'Starter', status: 'Active' },
  { productId: 653, game: 'zenless', diamondAmount: 330, name: '300 + 30 Monochromes', price: 4.99, resellerPrice: 4.59, costPriceFazerCards: 4.00, costPriceKhmerTopUp: 4.25, tag: 'Popular', status: 'Active' },
  { productId: 654, game: 'zenless', diamondAmount: 1090, name: '980 + 110 Monochromes', price: 14.99, resellerPrice: 13.79, costPriceFazerCards: 12.20, costPriceKhmerTopUp: 12.80, tag: 'HOT 🔥', status: 'Active' },

  // Honor of Kings
  { productId: 407, game: 'hok', diamondAmount: 100, name: 'Weekly Card Plus', price: 0.99, resellerPrice: 0.91, costPriceFazerCards: 0.80, costPriceKhmerTopUp: 0.85, tag: 'PASS 🌟', isPass: true, status: 'Active' },
  { productId: 401, game: 'hok', diamondAmount: 80, name: '80 + 8 Tokens', price: 0.95, resellerPrice: 0.87, costPriceFazerCards: 0.78, costPriceKhmerTopUp: 0.82, tag: 'Starter', status: 'Active' },
  { productId: 402, game: 'hok', diamondAmount: 240, name: '240 + 24 Tokens', price: 2.85, resellerPrice: 2.62, costPriceFazerCards: 2.30, costPriceKhmerTopUp: 2.45, tag: 'Popular', status: 'Active' },
  { productId: 403, game: 'hok', diamondAmount: 400, name: '400 + 40 Tokens', price: 4.75, resellerPrice: 4.37, costPriceFazerCards: 3.90, costPriceKhmerTopUp: 4.10, tag: 'HOT 🔥', status: 'Active' },
  { productId: 404, game: 'hok', diamondAmount: 800, name: '800 + 80 Tokens', price: 9.50, resellerPrice: 8.74, costPriceFazerCards: 7.80, costPriceKhmerTopUp: 8.20, tag: 'Best Value', status: 'Active' },

  // Steam Top-Up
  { productId: 701, game: 'steam_usd', diamondAmount: 5, name: '$5.00 USD Steam Balance', price: 5.00, resellerPrice: 4.60, costPriceFazerCards: 4.75, costPriceKhmerTopUp: 4.85, tag: 'Instant PIN', status: 'Active' },
  { productId: 702, game: 'steam_usd', diamondAmount: 10, name: '$10.00 USD Steam Balance', price: 10.00, resellerPrice: 9.20, costPriceFazerCards: 9.50, costPriceKhmerTopUp: 9.70, tag: 'Popular', status: 'Active' },
  { productId: 703, game: 'steam_usd', diamondAmount: 20, name: '$20.00 USD Steam Balance', price: 20.00, resellerPrice: 18.40, costPriceFazerCards: 19.00, costPriceKhmerTopUp: 19.40, tag: 'HOT 🔥', status: 'Active' },
  { productId: 704, game: 'steam_usd', diamondAmount: 50, name: '$50.00 USD Steam Balance', price: 50.00, resellerPrice: 46.00, costPriceFazerCards: 47.50, costPriceKhmerTopUp: 48.50, tag: 'Best Value', status: 'Active' },
  { productId: 705, game: 'steam_usd', diamondAmount: 100, name: '$100.00 USD Steam Balance', price: 100.00, resellerPrice: 92.00, costPriceFazerCards: 95.00, costPriceKhmerTopUp: 97.00, tag: 'VIP 🎮', status: 'Active' },

  // Telegram Stars
  { productId: 801, game: 'telegram_stars', diamondAmount: 50, name: '50 Telegram Stars', price: 0.99, resellerPrice: 0.91, costPriceFazerCards: 0.80, costPriceKhmerTopUp: 0.85, tag: 'Starter', status: 'Active' },
  { productId: 802, game: 'telegram_stars', diamondAmount: 100, name: '100 Telegram Stars', price: 1.95, resellerPrice: 1.79, costPriceFazerCards: 1.60, costPriceKhmerTopUp: 1.70, tag: 'Popular', status: 'Active' },
  { productId: 803, game: 'telegram_stars', diamondAmount: 250, name: '250 Telegram Stars', price: 4.80, resellerPrice: 4.42, costPriceFazerCards: 3.90, costPriceKhmerTopUp: 4.10, tag: 'HOT 🔥', status: 'Active' },
  { productId: 804, game: 'telegram_stars', diamondAmount: 500, name: '500 Telegram Stars', price: 9.50, resellerPrice: 8.74, costPriceFazerCards: 7.80, costPriceKhmerTopUp: 8.20, tag: 'Best Value', status: 'Active' },
  { productId: 805, game: 'telegram_stars', diamondAmount: 1000, name: '1,000 Telegram Stars', price: 18.99, resellerPrice: 17.47, costPriceFazerCards: 15.50, costPriceKhmerTopUp: 16.30, tag: 'PRO', status: 'Active' },

  // Gift Cards
  { productId: 901, game: 'gift_cards', diamondAmount: 10, name: 'Discord Nitro (1 Month)', price: 9.99, resellerPrice: 9.19, costPriceFazerCards: 8.50, costPriceKhmerTopUp: 8.80, tag: 'NITRO ⚡', isPass: true, status: 'Active' },
  { productId: 902, game: 'gift_cards', diamondAmount: 100, name: 'Discord Nitro (1 Year)', price: 99.99, resellerPrice: 91.99, costPriceFazerCards: 85.00, costPriceKhmerTopUp: 88.00, tag: 'BEST DEAL 👑', isPass: true, status: 'Active' },
  { productId: 903, game: 'gift_cards', diamondAmount: 10, name: '$10 Google Play Gift Card', price: 10.00, resellerPrice: 9.20, costPriceFazerCards: 9.60, costPriceKhmerTopUp: 9.75, tag: 'PlayStore', status: 'Active' },
  { productId: 904, game: 'gift_cards', diamondAmount: 25, name: '$25 Google Play Gift Card', price: 25.00, resellerPrice: 23.00, costPriceFazerCards: 24.00, costPriceKhmerTopUp: 24.30, tag: 'PlayStore', status: 'Active' },
  { productId: 905, game: 'gift_cards', diamondAmount: 10, name: '$10 Apple App Store & iTunes', price: 10.00, resellerPrice: 9.20, costPriceFazerCards: 9.60, costPriceKhmerTopUp: 9.75, tag: 'Apple ID', status: 'Active' },
  { productId: 906, game: 'gift_cards', diamondAmount: 25, name: '$25 Apple App Store & iTunes', price: 25.00, resellerPrice: 23.00, costPriceFazerCards: 24.00, costPriceKhmerTopUp: 24.30, tag: 'Apple ID', status: 'Active' },
];

const PRICING_GAMES = [
    { id: 'all', name: '🌐 All Products', icon: '🌐' },
    { id: 'special_passes', name: '⭐ Special Passes & Events', icon: '⭐' },
    { id: 'mlbb', name: 'Mobile Legends (MLBB)', icon: '💎' },
    { id: 'pubgm', name: 'PUBG Mobile', icon: '🎯' },
    { id: 'freefire', name: 'Free Fire', icon: '🔥' },
    { id: 'genshin', name: 'Genshin Impact', icon: '🌙' },
    { id: 'star_rail', name: 'Honkai: Star Rail', icon: '🚂' },
    { id: 'zenless', name: 'Zenless Zone Zero', icon: '⚡' },
    { id: 'hok', name: 'Honor of Kings', icon: '👑' },
    { id: 'steam_usd', name: 'Steam Top-Up', icon: '💨' },
    { id: 'telegram_stars', name: 'Telegram Stars', icon: '✈️' },
    { id: 'gift_cards', name: 'Gift Cards', icon: '🎁' },
  ];

  const { user, logout } = useAuth();
  const { branding, updateBranding, resetBranding } = useStoreBranding();
  const [storeLogoModalOpen, setStoreLogoModalOpen] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [cloudinaryConfigState, setCloudinaryConfigState] = useState(getCloudinaryConfig);
  const [showCloudinarySettings, setShowCloudinarySettings] = useState(false);
  const logoFileInputRef = useRef(null);
  const [storeBrandingForm, setStoreBrandingForm] = useState({
    storeName: 'MLBB TOPUP',
    storeNameHighlight: 'PRO',
    tagline: 'Official Diamond Hub',
    logoType: 'emoji',
    logoEmoji: '💎',
    logoImage: '',
    badgeText: 'PRO',
    adminBadgeText: 'ADMIN',
    versionText: 'Enterprise Hub v2.5'
  });
  const navigate = useNavigate();

  // Navigation & View States
  const [activeTab, setActiveTab] = useState('pending'); // default to fast top-up queue
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const navDropdownRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Data Store
  const [reports, setReports] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [financials, setFinancials] = useState(null);
  const [supplierBalanceData, setSupplierBalanceData] = useState({
    balance: { currentBalanceUSD: 0.0, lowBalanceThreshold: 50.0, status: 'Active' },
    depositHistory: [],
  });
  const [resellers, setResellers] = useState([]);
  const [failedTransactions, setFailedTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);

  // Notification / Feedback State
  const [toast, setToast] = useState(null);

  // Action / Processing States
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [retryingTxId, setRetryingTxId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Delivery Assistant & Audit Modals
  const [deliveryModalOrder, setDeliveryModalOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Order Search, Filter & Pagination States
  const [orderSearch, setOrderSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [topupFilter, setTopupFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Product Management Modal States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    diamondAmount: '',
    price: '',
    costPrice: '',
    resellerPrice: '',
    status: 'Active',
    description: '',
  });

  // Reseller Management Modals
  const [resellerModalOpen, setResellerModalOpen] = useState(false);
  const [resellerFormData, setResellerFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    initialBalanceUSD: '',
    discountTier: 'Tier 1 (VIP Reseller - 8% Off)',
    discountRate: 0.08,
  });
  const [resellerDepositModal, setResellerDepositModal] = useState(null);
  const [resellerDepositAmount, setResellerDepositAmount] = useState('');

  // Supplier Deposit Modal
  const [supplierDepositModalOpen, setSupplierDepositModalOpen] = useState(false);
  const [supplierDepositAmount, setSupplierDepositAmount] = useState('');
  const [supplierDepositMethod, setSupplierDepositMethod] = useState('Bank Wire (USD)');
  const [supplierDepositNote, setSupplierDepositNote] = useState('');

  // User Management State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleModal, setUserRoleModal] = useState(null);

    // Provider Management State
  const [providerSettings, setProviderSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_provider_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        const activeB = parsed.activeProvider === 'FazerCards'
          ? (parsed.fazerCardsBalanceUSD || 18.50)
          : (parsed.khmerTopUpBalanceUSD || 1.45);
        return { ...parsed, balanceUSD: activeB };
      }
    } catch (e) {}
    return {
      activeProvider: 'FazerCards',
      environment: 'Production',
      autoDispatchOnPayment: true,
      merchantId: 'peakmao007',
      apiKey: 'fc_5f79a0016d5d87bd1e83ea4f',
      khmerTopUpApiKey: 'kt_6d38a3a5940e970221cc62fa306ae96044736364',
      fazerCardsApiKey: 'fc_5f79a0016d5d87bd1e83ea4f',
      webhookUrl: 'http://localhost:5000/api/supplier/webhook',
      balanceUSD: 18.50,
      khmerTopUpBalanceUSD: 1.45,
      fazerCardsBalanceUSD: 18.50,
      status: 'Connected & Active',
    };
  });
  const [providerTesting, setProviderTesting] = useState(false);
  const [switchingProvider, setSwitchingProvider] = useState(false);
  const [balanceEditModalOpen, setBalanceEditModalOpen] = useState(false);
  const [editingProviderName, setEditingProviderName] = useState('FazerCards');
  const [newBalanceInput, setNewBalanceInput] = useState('');

  // Event Banner Management State
  const [eventBanners, setEventBanners] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_event_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_EVENT_BANNERS;
  });
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);
  const [showBannerCloudinaryConfig, setShowBannerCloudinaryConfig] = useState(false);
  const [bannerFormData, setBannerFormData] = useState({
    tag: '🔥 SPECIAL EVENT',
    title: '',
    subtitle: '',
    image: '',
    gameId: 'mlbb',
    buttonText: '⚡ Top Up Now',
    link: '/topup?game=mlbb',
    badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black',
    status: 'Active',
    order: 1
  });

  const handleOpenAddBannerModal = () => {
    setEditingBanner(null);
    setBannerFormData({
      tag: '🔥 SPECIAL EVENT',
      title: '',
      subtitle: '',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      gameId: 'mlbb',
      buttonText: '⚡ Top Up Now',
      link: '/topup?game=mlbb',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black',
      status: 'Active',
      order: eventBanners.length + 1
    });
    setBannerModalOpen(true);
  };

  const handleOpenEditBannerModal = (banner) => {
    setEditingBanner(banner);
    setBannerFormData({
      tag: banner.tag || '🔥 SPECIAL EVENT',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image: banner.image || '',
      gameId: banner.gameId || 'mlbb',
      buttonText: banner.buttonText || '⚡ Top Up Now',
      link: banner.link || '/topup?game=mlbb',
      badgeColor: banner.badgeColor || 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black',
      status: banner.status || 'Active',
      order: banner.order || 1
    });
    setBannerModalOpen(true);
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (!bannerFormData.title.trim() || !bannerFormData.image.trim()) {
      showToast('error', 'Please provide both Banner Title and Image URL/upload!');
      return;
    }

    let updatedList;
    if (editingBanner) {
      updatedList = eventBanners.map(b => b.id === editingBanner.id ? { ...b, ...bannerFormData } : b);
      showToast('success', `Banner "${bannerFormData.title}" updated successfully!`);
    } else {
      const newBanner = {
        ...bannerFormData,
        id: `banner-${Date.now()}`,
        order: eventBanners.length + 1
      };
      updatedList = [newBanner, ...eventBanners];
      showToast('success', `New Banner "${bannerFormData.title}" created successfully!`);
    }

    setEventBanners(updatedList);
    localStorage.setItem('admin_event_banners', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('eventBannersUpdated'));
    setBannerModalOpen(false);
    setEditingBanner(null);
  };

  const handleToggleBannerStatus = (bannerId) => {
    const updated = eventBanners.map(b => {
      if (b.id === bannerId) {
        const newStatus = b.status === 'Active' ? 'Inactive' : 'Active';
        showToast('info', `Banner status changed to ${newStatus}`);
        return { ...b, status: newStatus };
      }
      return b;
    });
    setEventBanners(updated);
    localStorage.setItem('admin_event_banners', JSON.stringify(updated));
    window.dispatchEvent(new Event('eventBannersUpdated'));
  };

  const handleDeleteBanner = (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this event banner?')) return;
    const updated = eventBanners.filter(b => b.id !== bannerId);
    setEventBanners(updated);
    localStorage.setItem('admin_event_banners', JSON.stringify(updated));
    window.dispatchEvent(new Event('eventBannersUpdated'));
    showToast('success', 'Banner deleted successfully!');
  };

  const handleResetBanners = () => {
    if (!window.confirm('Reset all banners to default official event banners?')) return;
    setEventBanners(DEFAULT_EVENT_BANNERS);
    localStorage.setItem('admin_event_banners', JSON.stringify(DEFAULT_EVENT_BANNERS));
    window.dispatchEvent(new Event('eventBannersUpdated'));
    showToast('success', 'Event banners reset to default promotional banners!');
  };

  const handleBannerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'Image size should be under 10MB.');
      return;
    }
    setUploadingBannerImage(true);
    showToast('info', '☁️ Uploading banner to Cloudinary (Banner folder)...');
    try {
      const res = await uploadToCloudinary(file, 'Banner');
      if (res.url) {
        setBannerFormData(prev => ({ ...prev, image: res.url }));
        if (res.isCloudinary) {
          showToast('success', '✅ Banner uploaded to Cloudinary "Banner" folder successfully!');
        } else {
          showToast('success', '✅ Banner image loaded and preview updated!');
        }
      } else {
        showToast('error', res.error || 'Failed to process banner image.');
      }
    } catch (err) {
      showToast('error', err?.message || 'Banner upload failed');
    } finally {
      setUploadingBannerImage(false);
      e.target.value = '';
    }
  };

  const handleQuickChangeBannerImage = async (bannerId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'Image size should be under 10MB.');
      return;
    }
    showToast('info', '☁️ Uploading new banner artwork to Cloudinary "Banner" folder...');
    try {
      const res = await uploadToCloudinary(file, 'Banner');
      if (res.url) {
        const updated = eventBanners.map(b => b.id === bannerId ? { ...b, image: res.url } : b);
        setEventBanners(updated);
        localStorage.setItem('admin_event_banners', JSON.stringify(updated));
        window.dispatchEvent(new Event('eventBannersUpdated'));
        showToast('success', res.isCloudinary ? '✅ Banner artwork uploaded to Cloudinary "Banner" folder & saved!' : '✅ Banner image updated and saved!');
      } else {
        showToast('error', res.error || 'Failed to upload image.');
      }
    } catch (err) {
      showToast('error', err?.message || 'Banner upload failed');
    } finally {
      e.target.value = '';
    }
  };

  const handleQuickSwitchProvider = async (targetProvider) => {
    setSwitchingProvider(true);
    try {
      showToast('info', `⚡ Switching active supplier to ${targetProvider}...`);
      const targetKey = targetProvider === 'FazerCards'
        ? (providerSettings.fazerCardsApiKey || 'fc_5f79a0016d5d87bd1e83ea4f')
        : (providerSettings.khmerTopUpApiKey || 'kt_6d38a3a5940e970221cc62fa306ae96044736364');
      const targetBal = targetProvider === 'FazerCards'
        ? (providerSettings.fazerCardsBalanceUSD || 18.50)
        : (providerSettings.khmerTopUpBalanceUSD || 1.45);

      const updated = {
        ...providerSettings,
        activeProvider: targetProvider,
        apiKey: targetKey,
        balanceUSD: targetBal,
      };

      setProviderSettings(updated);
      try {
        localStorage.setItem('admin_provider_settings', JSON.stringify(updated));
      } catch (e) {}

      await adminAPI.switchProvider(targetProvider).catch(() => {});
      showToast('success', `✅ Active Gateway switched to ${targetProvider}! Live Balance: $${targetBal.toFixed(2)} USD (~${(targetBal * 4100).toLocaleString()} ៛)`);
    } catch (err) {
      showToast('error', err.response?.data?.message || `Failed to switch to ${targetProvider}`);
    } finally {
      setSwitchingProvider(false);
    }
  };

  const handleOpenBalanceEdit = (providerName, currentBal) => {
    setEditingProviderName(providerName);
    setNewBalanceInput(String(currentBal));
    setBalanceEditModalOpen(true);
  };

  const handleSaveAdjustedBalance = (e) => {
    e.preventDefault();
    const val = parseFloat(newBalanceInput);
    if (isNaN(val) || val < 0) {
      showToast('error', 'Please enter a valid balance amount.');
      return;
    }

    let updated = { ...providerSettings };
    if (editingProviderName === 'FazerCards') {
      updated.fazerCardsBalanceUSD = val;
      if (updated.activeProvider === 'FazerCards') {
        updated.balanceUSD = val;
      }
    } else {
      updated.khmerTopUpBalanceUSD = val;
      if (updated.activeProvider === 'KhmerTopUp') {
        updated.balanceUSD = val;
      }
    }

    setProviderSettings(updated);
    try {
      localStorage.setItem('admin_provider_settings', JSON.stringify(updated));
    } catch (e) {}

    adminAPI.updateProviderSettings(updated).catch(() => {});
    showToast('success', `Updated ${editingProviderName} balance to $${val.toFixed(2)} USD (~${(val * 4100).toLocaleString()} ៛)!`);
    setBalanceEditModalOpen(false);
  };

  // Pricing Matrix Filter & Search
  const [pricingFilter, setPricingFilter] = useState('ALL');
  const [selectedPricingGame, setSelectedPricingGame] = useState('all');
  // Get dynamic wholesale cost based on selected active provider
  const getProductCostForActiveProvider = (prod) => {
    const isFazer = providerSettings.activeProvider === 'FazerCards';
    if (isFazer) {
      if (prod.costPriceFazerCards !== undefined && prod.costPriceFazerCards > 0) return Number(prod.costPriceFazerCards);
      if (prod.costPrice !== undefined && prod.costPrice > 0) return Number(prod.costPrice);
      return Number(prod.price) * 0.82;
    } else {
      if (prod.costPriceKhmerTopUp !== undefined && prod.costPriceKhmerTopUp > 0) return Number(prod.costPriceKhmerTopUp);
      if (prod.costPrice !== undefined && prod.costPrice > 0) return Number(prod.costPrice);
      return Number(prod.price) * 0.86;
    }
  };

  // Helper to get products merged with full game catalog
  const getMergedProductsList = () => {
    let customSaved = [];
    try {
      const stored = localStorage.getItem('admin_custom_products');
      if (stored) customSaved = JSON.parse(stored);
    } catch (e) {}

    const list = [...ALL_GAMES_CATALOG_LIST];

    // Apply DB products strictly matching by diamondAmount for MLBB or by productId
    products.forEach(p => {
      const idx = list.findIndex(item => (item.game === 'mlbb' && item.diamondAmount === p.diamondAmount) || (item.productId === p.productId));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...p, diamondAmount: p.diamondAmount };
      } else {
        list.push(p);
      }
    });

    customSaved.forEach(p => {
      const idx = list.findIndex(item => (item.game === 'mlbb' && item.diamondAmount === p.diamondAmount) || item.productId === p.productId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...p };
      }
    });

    // Sanitize and ensure official diamond denominations match package names
    return list.map(item => {
      if (item.name === '55 Diamonds' || (item.game === 'mlbb' && item.name && item.name.startsWith('55 ')) || (item.game === 'mlbb' && item.diamondAmount === 50)) {
        return { ...item, diamondAmount: 55 };
      }
      if (item.name === '86 Diamonds' || (item.game === 'mlbb' && item.name && item.name.startsWith('86 '))) {
        return { ...item, diamondAmount: 86 };
      }
      if (item.name === '110 Diamonds' || (item.game === 'mlbb' && item.name && item.name.startsWith('110 '))) {
        return { ...item, diamondAmount: 110 };
      }
      return item;
    });
  };

  const [packageSearch, setPackageSearch] = useState('');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportGameTarget, setExportGameTarget] = useState('current');
  const [exportStatusTarget, setExportStatusTarget] = useState('ALL');

  // Bakong Gateway State
  const [bakongInfo, setBakongInfo] = useState(null);
  const [quickTokenInput, setQuickTokenInput] = useState('');
  const [savingToken, setSavingToken] = useState(false);
  const [testingBakongToken, setTestingBakongToken] = useState(false);
  const [bakongAccountModalOpen, setBakongAccountModalOpen] = useState(false);
  const [editingBakongAccount, setEditingBakongAccount] = useState(null);
  const [bakongAccountForm, setBakongAccountForm] = useState({
    id: 0,
    accountTitle: '',
    bakongId: '',
    merchantName: '',
    merchantCity: 'PHNOM PENH',
    acquiringBank: 'FAMILY PHONE',
    bakongToken: '',
    demoMode: false,
    telegramBotToken: '',
    telegramChatId: '',
    isActive: true,
  });

  // Game & Logo Management State
  const [gamesList, setGamesList] = useState(() => getStoredGames());
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [gameFormData, setGameFormData] = useState({
    id: '',
    name: '',
    publisher: '',
    category: 'MOBA',
    currency: 'Diamonds',
    image: '/mlbb-logo.png',
    badge: 'Instant Delivery',
    badgeColor: 'gold',
    rating: '4.9 ⭐',
    deliveryTime: '10 - 30s',
    route: '/topup',
    status: 'Active',
    description: '',
  });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('info', `Copied "${text}" to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of the Admin Dashboard?')) {
      logout();
      navigate('/login');
    }
  };

  // Fetch data according to active tab or full refresh
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      if (activeTab === 'overview') {
        const [repRes, anaRes, pendRes] = await Promise.all([
          adminAPI.getReports().catch(() => ({ data: null })),
          adminAPI.getAnalytics().catch(() => ({ data: null })),
          adminAPI.getPendingOrders().catch(() => ({ data: [] })),
        ]);
        if (repRes.data) setReports(repRes.data);
        if (anaRes.data) setAnalytics(anaRes.data);
        setPendingOrders(pendRes.data || []);
      } else if (activeTab === 'financials') {
        const finRes = await adminAPI.getFinancialsProfit().catch(() => ({ data: null }));
        if (finRes.data) setFinancials(finRes.data);
      } else if (activeTab === 'pricing') {
        const prodRes = await adminAPI.getAllProducts().catch(() => ({ data: [] }));
        setProducts(prodRes.data || []);
      } else if (activeTab === 'resellers') {
        const resRes = await adminAPI.getAllResellers().catch(() => ({ data: [] }));
        setResellers(resRes.data || []);
      } else if (activeTab === 'failed') {
        const failRes = await adminAPI.getFailedTransactions().catch(() => ({ data: [] }));
        setFailedTransactions(failRes.data || []);
      } else if (activeTab === 'pending') {
        const [pendRes, provRes] = await Promise.all([
          adminAPI.getPendingOrders().catch(() => ({ data: [] })),
          adminAPI.getProviderSettings().catch(() => ({ data: null })),
        ]);
        setPendingOrders(pendRes.data || []);
        if (provRes.data) setProviderSettings(provRes.data);
      } else if (activeTab === 'orders') {
        const ordersRes = await adminAPI.getAllOrders().catch(() => ({ data: [] }));
        setOrders(ordersRes.data || []);
      } else if (activeTab === 'provider') {
        const [provRes, suppRes] = await Promise.all([
          adminAPI.getProviderSettings().catch(() => ({ data: null })),
          adminAPI.getSupplierBalance().catch(() => ({ data: null })),
        ]);
        if (provRes.data) setProviderSettings(provRes.data);
        if (suppRes.data) setSupplierBalanceData(suppRes.data);
      } else if (activeTab === 'users') {
        const usersRes = await adminAPI.getAllUsers().catch(() => ({ data: [] }));
        setUsers(usersRes.data || []);
      } else if (activeTab === 'bakong') {
        const bakRes = await bakongAPI.getStatus().catch(() => ({ data: null }));
        if (bakRes.data) {
          setBakongInfo(bakRes.data);
          if (bakRes.data.activeAccount && bakRes.data.activeAccount.bakongToken) {
            setQuickTokenInput(bakRes.data.activeAccount.bakongToken);
          }
        }
      } else if (activeTab === 'diagnostics') {
        const sysRes = await adminAPI.getSystemStatus().catch(() => ({ data: null }));
        if (sysRes.data) setSystemStatus(sysRes.data);
      }
      setLastUpdated(new Date());
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-Time Auto-Refresh interval (4s live background polling)
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Click outside listener for Navigation Dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target)) {
        setNavDropdownOpen(false);
      }
    };
    if (navDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navDropdownOpen]);

  // ==================== TOP-UP & ORDER HANDLERS ====================

  const handleProcessSingleTopUp = async (orderId) => {
    setProcessingOrderId(orderId);
    try {
      const res = await adminAPI.processTopUp(orderId);
      showToast('success', res.data?.message || `Diamonds delivered successfully for Order #${orderId}`);
      if (deliveryModalOrder) setDeliveryModalOrder(null);
      loadData(true);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to deliver diamonds';
      showToast('error', errMsg);
      const targetOrder = pendingOrders.find((o) => o.orderId === orderId) || selectedOrder;
      if (targetOrder) {
        setDeliveryModalOrder(targetOrder);
      }
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleManualComplete = async (orderId) => {
    setProcessingOrderId(orderId);
    try {
      const res = await adminAPI.manualCompleteTopUp(orderId);
      showToast('success', res.data?.message || `Order #${orderId} marked as Completed!`);
      if (selectedOrder) setSelectedOrder({ ...selectedOrder, topupStatus: 'Completed' });
      if (deliveryModalOrder) setDeliveryModalOrder(null);
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update order');
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleToggleEnvironment = async (newEnv) => {
    try {
      const updated = { ...providerSettings, environment: newEnv };
      await adminAPI.updateProviderSettings(updated);
      setProviderSettings(updated);
      showToast('success', `Switched provider mode to: ${newEnv}`);
      loadData(true);
    } catch (err) {
      showToast('error', 'Failed to change mode');
    }
  };

  const handleBatchDeliverAll = async () => {
    if (!pendingOrders.length) return;
    if (!window.confirm(`Process automated dispatch for all ${pendingOrders.length} pending paid orders?`)) return;

    setBatchProcessing(true);
    try {
      const orderIds = pendingOrders.map((o) => o.orderId);
      const res = await adminAPI.batchProcessTopUp(orderIds);
      showToast('success', res.data.message || 'Batch top-up delivery completed!');
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to process batch top-up');
    } finally {
      setBatchProcessing(false);
    }
  };

  const handleRetryFailedTransaction = async (orderId) => {
    setRetryingTxId(orderId);
    try {
      const res = await adminAPI.retryTransaction(orderId);
      showToast('success', res.data?.message || `Transaction #${orderId} retried successfully!`);
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Retry failed');
    } finally {
      setRetryingTxId(null);
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updatePaymentStatus(orderId, newStatus);
      showToast('success', `Order #${orderId} payment status updated to ${newStatus}`);
      if (selectedOrder) setSelectedOrder({ ...selectedOrder, paymentStatus: newStatus });
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update payment status');
    }
  };

  const handleUpdateTopUpStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateTopUpStatus(orderId, newStatus);
      showToast('success', `Order #${orderId} top-up status updated to ${newStatus}`);
      if (selectedOrder) setSelectedOrder({ ...selectedOrder, topupStatus: newStatus });
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update top-up status');
    }
  };

  // ==================== PRODUCT & PRICING HANDLERS ====================

  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductFormData({
        diamondAmount: product.diamondAmount,
        price: product.price,
        resellerPrice: product.resellerPrice,
        costPrice: product.costPrice,
        costPriceFazerCards: product.costPriceFazerCards || product.costPrice,
        costPriceKhmerTopUp: product.costPriceKhmerTopUp || (product.price * 0.86),
        status: product.status || 'Active',
        description: product.description || '',
        name: product.name || '',
        tag: product.tag || '',
        game: product.game || 'mlbb',
        customImage: product.customImage || '',
      });
    } else {
      setEditingProduct(null);
      setProductFormData({
        diamondAmount: '',
        price: '',
        resellerPrice: '',
        costPrice: '',
        costPriceFazerCards: '',
        costPriceKhmerTopUp: '',
        status: 'Active',
        description: '',
        name: '',
        tag: '',
        game: 'mlbb',
        customImage: '',
      });
    }
    setProductModalOpen(true);
  };

  const handleProductImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'Product image must be less than 10MB');
      return;
    }

    showToast('info', 'Uploading package image to Cloudinary CDN...');
    const res = await uploadToCloudinary(file, 'product_packages');
    if (res.url) {
      setProductFormData((prev) => ({
        ...prev,
        customImage: res.url,
      }));
      showToast('success', res.isFallback ? 'Custom package image loaded!' : 'Package image uploaded to Cloudinary CDN!');
    }
  };

  const handleSyncOfficialPackages = async () => {
    if (
      !window.confirm(
        'Sync all 26 official Mobile Legends packages with updated Wholesale Costs, Reseller Tiers & Customer Retail Prices?'
      )
    )
      return;

    try {
      localStorage.removeItem('admin_custom_products');
      await adminAPI.syncRealPackages().catch(() => {});
      const prodRes = await adminAPI.getAllProducts().catch(() => ({ data: [] }));
      setProducts(prodRes.data || []);
      window.dispatchEvent(new Event('productsConfigUpdated'));
      window.dispatchEvent(new Event('adminProductsUpdated'));
      showToast('success', 'Synced all 26 official MLBB Diamond packages to latest prices!');
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to sync diamond packages');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const retailP = parseFloat(productFormData.price) || 0;
      const resellerP = parseFloat(productFormData.resellerPrice) || (retailP * 0.92);
      const costFzr = parseFloat(productFormData.costPriceFazerCards) || parseFloat(productFormData.costPrice) || (retailP * 0.82);
      const costKt = parseFloat(productFormData.costPriceKhmerTopUp) || (retailP * 0.86);

      const payload = {
        diamondAmount: parseInt(productFormData.diamondAmount) || 0,
        price: retailP,
        resellerPrice: resellerP,
        costPrice: providerSettings.activeProvider === 'FazerCards' ? costFzr : costKt,
        costPriceFazerCards: costFzr,
        costPriceKhmerTopUp: costKt,
        status: productFormData.status,
        description: productFormData.description,
        game: productFormData.game || 'mlbb',
        tag: productFormData.tag || '',
        name: productFormData.name || `${productFormData.diamondAmount} Diamonds`,
        customImage: productFormData.customImage || '',
      };

      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.productId, payload).catch(() => {});
        setProducts(prev => prev.map(p => p.productId === editingProduct.productId ? { ...p, ...payload } : p));
        showToast('success', `Updated prices for ${payload.name || payload.diamondAmount} - Customer: $${retailP.toFixed(2)}, Reseller: $${resellerP.toFixed(2)} USD!`);
      } else {
        const res = await adminAPI.createProduct(payload).catch(() => ({ data: { ...payload, productId: Date.now() } }));
        setProducts(prev => [...prev, res.data || { ...payload, productId: Date.now() }]);
        showToast('success', 'Created new package with multi-tier pricing successfully!');
      }

      // Live sync to local storage & broadcast event
      try {
        const currentCustom = JSON.parse(localStorage.getItem('admin_custom_products') || '[]');
        const updatedCustom = [...currentCustom.filter(p => p.productId !== (editingProduct ? editingProduct.productId : payload.productId)), { ...payload, productId: editingProduct ? editingProduct.productId : payload.productId }];
        localStorage.setItem('admin_custom_products', JSON.stringify(updatedCustom));
        window.dispatchEvent(new Event('productsConfigUpdated'));
        window.dispatchEvent(new Event('adminProductsUpdated'));
      } catch (err) {}

      setProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm(`Delete package #${id}?`)) return;
    try {
      await adminAPI.deleteProduct(id);
      showToast('success', `Package #${id} removed successfully!`);
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete package');
    }
  };

  // ==================== GAME & LOGO HANDLERS ====================

  const handleOpenGameModal = (game = null) => {
    if (game) {
      setEditingGame(game);
      setGameFormData({
        ...game,
        flagType: game.flagType || (game.badge?.includes('ខ្មែរ') || game.name?.includes('KH') ? 'kh' : game.badge?.includes('PH') ? 'ph' : game.badge?.includes('ID') ? 'id' : 'kh'),
        flagImage: game.flagImage || '',
        flagFrameStyle: game.flagFrameStyle || 'gold_cyber',
      });
    } else {
      setEditingGame(null);
      setGameFormData({
        id: `game_${Date.now()}`,
        name: '',
        publisher: '',
        category: 'MOBA',
        currency: 'Diamonds',
        image: '/mlbb-logo.png',
        badge: 'សេវើខ្មែរ 5v5',
        badgeColor: 'gold',
        flagType: 'kh',
        flagImage: '',
        flagFrameStyle: 'gold_cyber',
        rating: '4.9 ⭐',
        deliveryTime: '10 - 30s',
        route: '/topup',
        status: 'Active',
        description: '',
      });
    }
    setGameModalOpen(true);
  };

  const handleGameFlagUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'Flag image size must be less than 10MB');
      return;
    }

    showToast('info', '☁️ Uploading flag image to Cloudinary "logo-game" folder...');
    try {
      const res = await uploadToCloudinary(file, 'logo-game');
      if (res.url) {
        setGameFormData((prev) => ({
          ...prev,
          flagType: 'custom',
          flagImage: res.url,
        }));
        showToast('success', res.isCloudinary ? '✅ Flag uploaded to Cloudinary "logo-game" folder!' : '✅ Custom flag loaded!');
      } else {
        showToast('error', res.error || 'Failed to upload flag.');
      }
    } catch (err) {
      showToast('error', err?.message || 'Flag upload failed');
    }
  };

  const handleGameImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'Game logo size must be less than 10MB');
      return;
    }

    showToast('info', '☁️ Uploading game logo to Cloudinary "logo-game" folder...');
    try {
      const res = await uploadToCloudinary(file, 'logo-game');
      if (res.url) {
        setGameFormData((prev) => ({ ...prev, image: res.url }));
        showToast('success', res.isCloudinary ? '✅ Game logo uploaded to Cloudinary "logo-game" folder!' : '✅ Game logo preview updated!');
      } else {
        showToast('error', res.error || 'Failed to upload game logo.');
      }
    } catch (err) {
      showToast('error', err?.message || 'Game logo upload failed');
    }
  };

  const handleSaveGame = (e) => {
    e.preventDefault();
    if (!gameFormData.name.trim()) {
      showToast('error', 'Game name cannot be empty');
      return;
    }

    let updatedList;
    if (editingGame) {
      updatedList = gamesList.map((g) => (g.id === editingGame.id ? { ...gameFormData } : g));
      showToast('success', `Game "${gameFormData.name}" updated with new image & settings!`);
    } else {
      const newGame = {
        ...gameFormData,
        id: gameFormData.id || `game_${Date.now()}`,
      };
      updatedList = [...gamesList, newGame];
      showToast('success', `New game "${gameFormData.name}" added successfully!`);
    }

    setGamesList(updatedList);
    saveStoredGames(updatedList);
    window.dispatchEvent(new Event('gamesConfigUpdated'));
    setGameModalOpen(false);
    setEditingGame(null);
  };

  const handleDeleteGame = (gameId) => {
    if (gameId === 'mlbb') {
      showToast('error', 'Cannot delete the primary Mobile Legends game.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this game option?')) return;

    const updated = gamesList.filter((g) => g.id !== gameId);
    setGamesList(updated);
    saveStoredGames(updated);
    window.dispatchEvent(new Event('gamesConfigUpdated'));
    showToast('success', 'Game removed from storefront.');
  };

  const handleToggleGameStatus = (gameId) => {
    const updated = gamesList.map((g) => {
      if (g.id === gameId) {
        const nextStatus = g.status === 'Active' ? 'Coming Soon' : 'Active';
        return { ...g, status: nextStatus };
      }
      return g;
    });
    setGamesList(updated);
    saveStoredGames(updated);
    window.dispatchEvent(new Event('gamesConfigUpdated'));
    showToast('info', 'Game status toggled.');
  };

  const handleResetGames = () => {
    if (!window.confirm('Reset all games and logos back to official factory defaults?')) return;
    const defaults = resetToDefaultGames();
    setGamesList(defaults);
    window.dispatchEvent(new Event('gamesConfigUpdated'));
    showToast('success', 'All games and logos reset to default!');
  };


  // ==================== STORE BRANDING & LOGO HANDLERS ====================

  const handleOpenStoreLogoModal = () => {
    const activeLogo = branding.logoImage || '/tin-logo.png';
    const updatedForm = {
      storeName: branding.storeName || 'Tin-Topup',
      storeNameHighlight: branding.storeNameHighlight || 'PRO',
      tagline: branding.tagline || 'Official Diamond Hub',
      logoType: branding.logoType || 'image',
      logoEmoji: branding.logoEmoji || '💎',
      logoImage: activeLogo,
      badgeText: branding.badgeText || 'PRO',
      adminBadgeText: branding.adminBadgeText || 'ADMIN',
      versionText: branding.versionText || 'Enterprise Hub v2.5'
    };
    setStoreBrandingForm(updatedForm);
    setStoreLogoModalOpen(true);
  };

  const handleStoreLogoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'Image size must be less than 10MB');
      return;
    }

    setIsUploadingLogo(true);
    showToast('info', '☁️ Uploading new logo to Cloudinary CDN...');
    try {
      const res = await uploadToCloudinary(file, 'profile-photos');
      if (res.success && res.url) {
        const updatedForm = {
          ...storeBrandingForm,
          logoType: 'image',
          logoImage: res.url,
        };
        setStoreBrandingForm(updatedForm);
        // Automatically save to database & storefront in real time
        updateBranding(updatedForm);
        showToast('success', '✅ New Profile Logo uploaded to Cloudinary & auto-saved to Database!');
      } else {
        showToast('error', res.error || 'Cloudinary upload failed. Check your Upload Preset.');
      }
    } catch (err) {
      showToast('error', 'Failed to upload image: ' + err.message);
    } finally {
      setIsUploadingLogo(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveStoreBranding = (e) => {
    if (e) e.preventDefault();
    const updated = updateBranding(storeBrandingForm);
    showToast('success', `Store Logo & Brand updated to "${updated.storeName}"!`);
    setStoreLogoModalOpen(false);
  };

  const handleResetStoreBranding = () => {
    if (!window.confirm('Reset store logo and branding back to factory defaults?')) return;
    const defaults = resetBranding();
    setStoreBrandingForm({ ...defaults });
    showToast('success', 'Store logo and branding reset to default.');
    setStoreLogoModalOpen(false);
  };

  // ==================== RESELLER HANDLERS ====================

  const handleCreateReseller = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: resellerFormData.name,
        email: resellerFormData.email,
        companyName: resellerFormData.companyName || resellerFormData.name,
        initialBalanceUSD: parseFloat(resellerFormData.initialBalanceUSD || '0'),
        discountTier: resellerFormData.discountTier,
        discountRate: parseFloat(resellerFormData.discountRate),
      };

      await adminAPI.createReseller(payload);
      showToast('success', `Reseller account '${resellerFormData.name}' created with API Key!`);
      setResellerModalOpen(false);
      setResellerFormData({
        name: '',
        email: '',
        companyName: '',
        initialBalanceUSD: '',
        discountTier: 'Tier 1 (VIP Reseller - 8% Off)',
        discountRate: 0.08,
      });
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to create reseller');
    }
  };

  const handleDepositResellerCredit = async (e) => {
    e.preventDefault();
    if (!resellerDepositModal || !resellerDepositAmount) return;

    try {
      const res = await adminAPI.depositResellerCredit(resellerDepositModal.resellerId, {
        amountUSD: parseFloat(resellerDepositAmount),
      });
      showToast('success', res.data?.message || 'Credit deposited successfully!');
      setResellerDepositModal(null);
      setResellerDepositAmount('');
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to deposit reseller credit');
    }
  };

  const handleGenerateResellerApiKey = async (resellerId) => {
    if (!window.confirm('Generate a new API key for this reseller? The old key will stop working.')) return;
    try {
      await adminAPI.generateResellerApiKey(resellerId);
      showToast('success', 'New API Key generated successfully!');
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to generate API Key');
    }
  };

  // ==================== SUPPLIER DEPOSIT HANDLER ====================

  const handleRecordSupplierDeposit = async (e) => {
    e.preventDefault();
    if (!supplierDepositAmount) return;

    try {
      const payload = {
        amountUSD: parseFloat(supplierDepositAmount),
        paymentMethod: supplierDepositMethod,
        supplierName: providerSettings.activeProvider,
        notes: supplierDepositNote || 'Manual Balance Refill',
      };

      const res = await adminAPI.recordSupplierDeposit(payload);
      showToast('success', res.data?.message || 'Supplier refill recorded successfully!');
      setSupplierDepositModalOpen(false);
      setSupplierDepositAmount('');
      setSupplierDepositNote('');
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to record supplier deposit');
    }
  };

  const handleTestProviderConnection = async () => {
    setProviderTesting(true);
    try {
      const res = await adminAPI.testProviderConnection({
        activeProvider: providerSettings.activeProvider,
        apiKey: providerSettings.apiKey,
      });
      showToast('success', res.data?.message || 'Provider connection verified!');
      if (res.data?.balanceUSD !== undefined) {
        setProviderSettings((prev) => ({ ...prev, balanceUSD: res.data.balanceUSD }));
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Provider test connection failed');
    } finally {
      setProviderTesting(false);
    }
  };

    const handleSaveProviderSettings = async (e) => {
    e.preventDefault();
    try {
      const activeBal = providerSettings.activeProvider === 'FazerCards'
        ? (providerSettings.fazerCardsBalanceUSD || 18.50)
        : (providerSettings.khmerTopUpBalanceUSD || 1.45);

      const payload = {
        ...providerSettings,
        balanceUSD: activeBal,
      };

      setProviderSettings(payload);
      try {
        localStorage.setItem('admin_provider_settings', JSON.stringify(payload));
      } catch (e) {}

      await adminAPI.updateProviderSettings(payload).catch(() => {});
      showToast('success', `Upstream Provider updated to ${payload.activeProvider}! Live Balance: $${activeBal.toFixed(2)} USD`);
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to save settings');
    }
  };

  // ==================== USER HANDLERS ====================

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      showToast('success', `User role updated to ${newRole}`);
      setUserRoleModal(null);
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(`Are you sure you want to delete user #${userId}?`)) return;
    try {
      await adminAPI.deleteUser(userId);
      showToast('success', `User #${userId} deleted successfully`);
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete user');
    }
  };

  // ==================== BAKONG HANDLERS ====================

  const handleSaveBakongToken = async (e) => {
    e.preventDefault();
    if (!quickTokenInput) return;
    setSavingToken(true);
    try {
      await bakongAPI.updateToken({ bakongToken: quickTokenInput });
      showToast('success', 'Bakong JWT Token updated successfully!');
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update token');
    } finally {
      setSavingToken(false);
    }
  };

  const handleTestBakongToken = async () => {
    setTestingBakongToken(true);
    try {
      const res = await adminAPI.testBakongToken(quickTokenInput);
      showToast('success', res.data?.message || 'Bakong JWT Token verified successfully!');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Token verification failed. Check if token is valid.');
    } finally {
      setTestingBakongToken(false);
    }
  };

  const handleSwitchBakongAccount = async (accountId) => {
    try {
      const res = await adminAPI.switchBakongAccount(accountId);
      showToast('success', res.data?.message || 'Switched active Bakong account!');
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to switch Bakong account');
    }
  };

  const handleOpenBakongAccountModal = (account = null) => {
    if (account) {
      setEditingBakongAccount(account);
      setBakongAccountForm({
        id: account.id || account.Id || 0,
        accountTitle: account.accountTitle || account.AccountTitle || '',
        bakongId: account.bakongId || account.BakongId || '',
        merchantName: account.merchantName || account.MerchantName || '',
        merchantCity: account.merchantCity || account.MerchantCity || 'PHNOM PENH',
        acquiringBank: account.acquiringBank || account.AcquiringBank || 'FAMILY PHONE',
        bakongToken: account.bakongToken || account.BakongToken || '',
        demoMode: account.demoMode || account.DemoMode || false,
        telegramBotToken: account.telegramBotToken || account.TelegramBotToken || '',
        telegramChatId: account.telegramChatId || account.TelegramChatId || '',
        isActive: account.isActive || account.IsActive || false,
      });
    } else {
      setEditingBakongAccount(null);
      setBakongAccountForm({
        id: 0,
        accountTitle: '',
        bakongId: '',
        merchantName: '',
        merchantCity: 'PHNOM PENH',
        acquiringBank: 'FAMILY PHONE',
        bakongToken: '',
        demoMode: false,
        telegramBotToken: '',
        telegramChatId: '',
        isActive: true,
      });
    }
    setBakongAccountModalOpen(true);
  };

  const handleSaveBakongAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await adminAPI.saveBakongAccount(bakongAccountForm);
      showToast('success', res.data?.message || 'Bakong account profile saved successfully!');
      setBakongAccountModalOpen(false);
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to save Bakong account');
    }
  };

  const handleDeleteBakongAccount = async (accountId) => {
    if (!window.confirm('Are you sure you want to delete this Bakong account profile?')) return;
    try {
      const res = await adminAPI.deleteBakongAccount(accountId);
      showToast('success', res.data?.message || 'Bakong account deleted');
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete Bakong account');
    }
  };

  // ==================== CSV EXPORT ====================

  const handleExportCSV = () => {
    if (!orders.length) return;
    const headers = [
      'OrderID',
      'PlayerID',
      'ServerID',
      'DiamondAmount',
      'AmountUSD',
      'PaymentStatus',
      'TopupStatus',
      'CreatedAt',
    ];
    const rows = orders.map((o) => [
      o.orderId,
      o.playerID,
      o.serverID,
      o.diamondAmount,
      o.amount,
      o.paymentStatus,
      o.topupStatus,
      o.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MLBB_TopUp_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Exported orders ledger to Excel/CSV successfully!');
  };

  const handleExportPricingExcel = (targetGame = exportGameTarget, targetStatus = exportStatusTarget) => {
    let list = getMergedProductsList();

    // Filter by Game or Category
    let categoryTitle = 'All_Games';
    if (targetGame === 'current') {
      if (selectedPricingGame !== 'all') {
        if (selectedPricingGame === 'special_passes') {
          list = list.filter(p => p.isPass || p.diamondAmount === 210 || p.diamondAmount === 500 || (p.name && (p.name.includes('Pass') || p.name.includes('Membership') || p.name.includes('Welkin'))));
          categoryTitle = 'Special_Passes';
        } else {
          list = list.filter(p => (p.game || 'mlbb') === selectedPricingGame);
          categoryTitle = selectedPricingGame.toUpperCase();
        }
      }
    } else if (targetGame === 'all') {
      categoryTitle = 'All_Games_Master';
    } else if (targetGame === 'moba') {
      list = list.filter(p => (p.game === 'mlbb' || p.game === 'hok' || !p.game));
      categoryTitle = 'Category_MOBA';
    } else if (targetGame === 'battle_royale') {
      list = list.filter(p => (p.game === 'pubgm' || p.game === 'freefire'));
      categoryTitle = 'Category_Battle_Royale';
    } else if (targetGame === 'rpg') {
      list = list.filter(p => (p.game === 'genshin' || p.game === 'star_rail' || p.game === 'zenless'));
      categoryTitle = 'Category_RPG_Anime';
    } else if (targetGame === 'digital_cards') {
      list = list.filter(p => (p.game === 'steam_usd' || p.game === 'gift_cards' || p.game === 'telegram_stars'));
      categoryTitle = 'Category_Digital_Cards_Balance';
    } else if (targetGame === 'special_passes') {
      list = list.filter(p => p.isPass || p.diamondAmount === 210 || p.diamondAmount === 500 || (p.name && (p.name.includes('Pass') || p.name.includes('Membership') || p.name.includes('Welkin'))));
      categoryTitle = 'Special_Passes_Events';
    } else {
      list = list.filter(p => (p.game || 'mlbb') === targetGame);
      categoryTitle = targetGame.toUpperCase();
    }

    // Filter by Status
    if (targetStatus === 'ACTIVE') {
      list = list.filter(p => p.status === 'Active');
    } else if (targetStatus === 'INACTIVE') {
      list = list.filter(p => p.status === 'Inactive');
    } else if (targetStatus === 'PASSES') {
      list = list.filter(p => p.isPass || p.diamondAmount === 210 || p.diamondAmount === 500);
    }

    const headers = [
      'Product ID',
      'Game Title',
      'Game Category / Type',
      'Package Name',
      'Diamonds / Units',
      'Provider Wholesale Cost (USD)',
      'VIP Reseller Price (USD)',
      'Customer Retail Price (USD)',
      'Net Profit (USD)',
      'Profit Margin (%)',
      'Reseller Discount (USD)',
      'Status',
      'Promo Tag / Event'
    ];

    const getGameMeta = (gameId) => {
      switch (gameId) {
        case 'mlbb': return { title: 'Mobile Legends: Bang Bang', cat: 'MOBA' };
        case 'pubgm': return { title: 'PUBG Mobile', cat: 'Battle Royale' };
        case 'freefire': return { title: 'Free Fire', cat: 'Battle Royale' };
        case 'hok': return { title: 'Honor of Kings', cat: 'MOBA' };
        case 'genshin': return { title: 'Genshin Impact', cat: 'RPG & Anime' };
        case 'star_rail': return { title: 'Honkai: Star Rail', cat: 'RPG & Anime' };
        case 'zenless': return { title: 'Zenless Zone Zero', cat: 'Action RPG' };
        case 'steam_usd': return { title: 'Steam Wallet', cat: 'Digital Balance' };
        case 'telegram_stars': return { title: 'Telegram Stars', cat: 'Social Units' };
        case 'gift_cards': return { title: 'Gift Cards & Vouchers', cat: 'Gift Cards' };
        default: return { title: 'Mobile Legends (MLBB)', cat: 'MOBA' };
      }
    };

    const rows = list.map((prod) => {
      const cost = getProductCostForActiveProvider(prod);
      const retail = Number(prod.price) || 0;
      const reseller = prod.resellerPrice > 0 ? Number(prod.resellerPrice) : retail * 0.92;
      const profit = Math.max(0, retail - cost);
      const margin = retail > 0 ? ((profit / retail) * 100).toFixed(1) : '0.0';
      const resellerDiscount = Math.max(0, retail - reseller).toFixed(2);
      const meta = getGameMeta(prod.game || 'mlbb');

      return [
        `"${prod.productId || ''}"`,
        `"${meta.title}"`,
        `"${meta.cat}"`,
        `"${(prod.name || `${prod.diamondAmount} Diamonds / Units`).replace(/"/g, '""')}"`,
        `"${prod.diamondAmount || ''}"`,
        cost.toFixed(2),
        reseller.toFixed(2),
        retail.toFixed(2),
        profit.toFixed(2),
        `"${margin}%"`,
        resellerDiscount,
        `"${prod.status || 'Active'}"`,
        `"${(prod.tag || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TopUp_Pricing_${categoryTitle}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', `Exported ${rows.length} packages for [${categoryTitle.replace(/_/g, ' ')}] to Excel/CSV!`);
    setExportModalOpen(false);
  };

  // ==================== FILTERING & PAGINATION ====================

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      orderSearch === '' ||
      order.orderId?.toString().includes(orderSearch) ||
      order.playerID?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.serverID?.includes(orderSearch);

    const matchPayment = paymentFilter === 'ALL' || order.paymentStatus === paymentFilter;
    const matchTopup = topupFilter === 'ALL' || order.topupStatus === topupFilter;

    let matchDate = true;
    if (dateFilter === 'TODAY') {
      const today = new Date().toISOString().slice(0, 10);
      matchDate = order.createdAt?.startsWith(today);
    } else if (dateFilter === '7DAYS') {
      const past7 = new Date();
      past7.setDate(past7.getDate() - 7);
      matchDate = new Date(order.createdAt) >= past7;
    }

    return matchSearch && matchPayment && matchTopup && matchDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const menuTabs = [
    {
      id: 'pending',
      label: 'Top-Up Queue',
      icon: '⚡',
      count: pendingOrders.length,
      badgeColor: 'bg-amber-500 text-black',
      category: 'Operations',
      desc: 'Live queue of verified paid orders ready for diamond top-up delivery',
    },
    {
      id: 'games',
      label: 'Games & Logos',
      icon: '🎮',
      category: 'Store & Catalog',
      desc: 'Change game images, upload 5v5 logos, manage customer selection',
    },
    {
      id: 'banners',
      label: 'Banners & Events',
      icon: '🎨',
      count: eventBanners.filter(b => b.status === 'Active').length,
      badgeColor: 'bg-amber-400 text-black',
      category: 'Store & Catalog',
      desc: 'Customize homepage & topup event banners, promotions & seasonal artworks',
    },
    {
      id: 'pricing',
      label: 'Diamond Packages',
      icon: '💎',
      category: 'Store & Catalog',
      desc: 'Configure wholesale costs, reseller pricing & retail package rates',
    },
    {
      id: 'orders',
      label: 'Orders Ledger',
      icon: '📦',
      category: 'Operations',
      desc: 'Complete transaction history, audit records & CSV financial exports',
    },
    {
      id: 'financials',
      label: 'Profits & Sales',
      icon: '💰',
      category: 'Finance & B2B',
      desc: 'Gross revenue, net profit margin, payout summaries & revenue analytics',
    },
    {
      id: 'overview',
      label: 'Overview & KPIs',
      icon: '📊',
      category: 'Analytics',
      desc: 'Real-time sales velocity, peak top-up hours & customer conversion KPIs',
    },
    {
      id: 'resellers',
      label: 'Resellers & B2B',
      icon: '🏢',
      category: 'Finance & B2B',
      desc: 'Wholesale partner accounts, credit balances, discounts & API keys',
    },
    {
      id: 'provider',
      label: 'Supplier API',
      icon: '🎮',
      category: 'Infrastructure',
      desc: 'Auto-dispatch provider credentials, supplier balance & webhooks',
    },
    {
      id: 'bakong',
      label: 'Bakong KHQR',
      icon: '🏦',
      category: 'Infrastructure',
      desc: 'National Bank of Cambodia KHQR gateway, merchant IDs & live tokens',
    },
    {
      id: 'failed',
      label: 'Failed Orders',
      icon: '⚠️',
      count: failedTransactions.length,
      badgeColor: 'bg-rose-500 text-white',
      category: 'Operations',
      desc: 'Auto-detected failed transactions with 1-click retry engine',
    },
    {
      id: 'users',
      label: 'Users & Roles',
      icon: '👥',
      category: 'Infrastructure',
      desc: 'Admin permissions, registered accounts and security management',
    },
    {
      id: 'diagnostics',
      label: 'Diagnostics',
      icon: '🛠️',
      category: 'Infrastructure',
      desc: 'Live server health check, database latency & memory diagnostics',
    },
  ];

  const currentTabInfo = menuTabs.find((t) => t.id === activeTab) || menuTabs[0];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans pb-24 selection:bg-amber-500 selection:text-black relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed inset-0 bg-gaming-grid pointer-events-none opacity-20" />

      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-slideDown max-w-md w-full px-4 sm:px-0">
          <div
            className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/60 text-emerald-200 shadow-emerald-900/30'
                : toast.type === 'error'
                ? 'bg-rose-950/95 border-rose-500/60 text-rose-200 shadow-rose-900/30'
                : 'bg-cyan-950/95 border-cyan-500/60 text-cyan-200 shadow-cyan-900/30'
            }`}
          >
            <span className="text-2xl shrink-0">
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '⚠️' : 'ℹ️'}
            </span>
            <div className="flex-1 text-xs sm:text-sm font-semibold leading-relaxed break-words">
              {toast.message}
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white text-base p-1 shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ENTERPRISE MASTER NAVBAR HEADER */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#0B0F19] border-b border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-1.5 sm:gap-4">
            
            {/* Left: Brand & Title */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <div
                onClick={handleOpenStoreLogoModal}
                className="flex items-center gap-1.5 sm:gap-2.5 group cursor-pointer"
                title="Click to Change Store Logo & Branding"
              >
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-[2px] shadow-glow-gold group-hover:scale-105 transition-all shrink-0 overflow-hidden relative">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                    {branding.logoType === 'image' && branding.logoImage ? (
                      <img
                        src={branding.logoImage}
                        alt={branding.storeName || 'Store Logo'}
                        className="w-full h-full object-cover rounded-[10px]"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-sm sm:text-xl">
                        {branding.logoEmoji || '💎'}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-black text-black">
                    ✏️
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="text-xs sm:text-lg font-black tracking-wider text-white group-hover:text-amber-400 transition-colors">
                      {branding.storeName || 'MLBB TOPUP'}
                    </span>
                    <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[8px] sm:text-[10px] font-black px-1 sm:px-1.5 py-0.5 rounded tracking-widest uppercase hidden xs:inline">
                      {branding.adminBadgeText || 'ADMIN'}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{branding.versionText || 'Enterprise Hub v2.5'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Sleek Responsive Dropdown Button */}
            <div className="relative shrink min-w-0" ref={navDropdownRef}>
              <button
                type="button"
                onClick={() => setNavDropdownOpen(!navDropdownOpen)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl border transition-all duration-300 shadow-md cursor-pointer ${
                  navDropdownOpen
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-amber-300 font-black shadow-glow-gold scale-[1.02]'
                    : 'bg-[#111728] hover:bg-[#182035] text-white border-slate-700/80 hover:border-amber-400/60'
                }`}
                title="Select admin module"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-slate-950/40 flex items-center justify-center text-xs sm:text-lg shrink-0">
                  {currentTabInfo.icon}
                </div>

                <div className="text-left leading-tight hidden lg:block">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider block ${
                      navDropdownOpen ? 'text-slate-900 font-black' : 'text-amber-400'
                    }`}
                  >
                    Active Module
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold truncate max-w-[130px] xl:max-w-[180px] block">
                    {currentTabInfo.label}
                  </span>
                </div>

                {/* Mobile / Tablet Compact Title */}
                <span className="text-xs font-bold lg:hidden max-w-[85px] xs:max-w-[120px] sm:max-w-[160px] truncate">
                  {currentTabInfo.label}
                </span>

                {currentTabInfo.count !== undefined && currentTabInfo.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                      navDropdownOpen ? 'bg-black text-amber-300' : 'bg-amber-500 text-black'
                    }`}
                  >
                    {currentTabInfo.count}
                  </span>
                )}

                <span
                  className={`text-[9px] sm:text-[10px] transition-transform duration-300 ${
                    navDropdownOpen ? 'rotate-180 text-black' : 'text-slate-400'
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Mobile Backdrop Overlay */}
              {navDropdownOpen && (
                <div
                  className="fixed inset-0 bg-black/85 z-50 backdrop-blur-md transition-opacity animate-fadeIn"
                  onClick={() => setNavDropdownOpen(false)}
                />
              )}

              {/* Smooth Dropdown Menu (100% Solid, Non-Translucent Background) */}
              {navDropdownOpen && (
                <div className="fixed inset-x-3 top-20 sm:top-full sm:absolute sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:mt-3 w-auto sm:w-[520px] md:w-[640px] bg-[#0B0F19] border-2 border-slate-700/90 rounded-3xl p-3.5 sm:p-4 shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-50 animate-slideDown max-h-[72vh] sm:max-h-[78vh] overflow-y-auto pb-6 sm:pb-4">
                  
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 px-1 bg-[#0B0F19]">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🗂️</span>
                      <span className="text-xs font-black text-white uppercase tracking-wider">
                        Admin Navigation Menu
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-medium bg-[#111728] px-2 py-0.5 rounded-full border border-slate-800 hidden xs:inline">
                        12 Modules
                      </span>
                      <button
                        type="button"
                        onClick={() => setNavDropdownOpen(false)}
                        className="w-7 h-7 rounded-lg bg-[#151D30] hover:bg-[#1E2A45] border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-all"
                        aria-label="Close menu"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* 2-Column Responsive Grid with 100% Solid Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {menuTabs.map((tab) => {
                      const isSelected = activeTab === tab.id;

                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(tab.id);
                            setNavDropdownOpen(false);
                          }}
                          className={`p-3 rounded-2xl text-left transition-all duration-200 flex items-start gap-2.5 sm:gap-3 border cursor-pointer active:scale-[0.98] ${
                            isSelected
                              ? 'bg-[#182236] border-2 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/40'
                              : 'bg-[#111728] hover:bg-[#192238] border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white'
                          }`}
                        >
                          {/* Icon Tile */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base sm:text-lg shrink-0 transition-all ${
                              isSelected
                                ? 'bg-amber-400 text-black font-black shadow-glow-gold'
                                : 'bg-[#0B0F19] border border-slate-700 text-white'
                            }`}
                          >
                            {tab.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span
                                className={`text-xs font-bold truncate ${
                                  isSelected ? 'text-amber-300 font-black' : 'text-white'
                                }`}
                              >
                                {tab.label}
                              </span>

                              <div className="flex items-center gap-1 shrink-0">
                                {tab.count !== undefined && tab.count > 0 && (
                                  <span
                                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${tab.badgeColor}`}
                                  >
                                    {tab.count}
                                  </span>
                                )}
                                {isSelected && (
                                  <span className="text-amber-400 text-xs font-black">✓</span>
                                )}
                              </div>
                            </div>

                            <p className="text-[10px] text-slate-400 leading-snug line-clamp-1">
                              {tab.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Actions, Balance Pill & Mobile Menu Toggle */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              
              {/* Responsive Gateway & Balance Pill (Desktop: Full, Mobile: Balance Only) */}
              <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-[#111728] border border-slate-700/80 text-xs shadow-sm shrink-0">
                <span className="text-xs sm:text-sm">
                  {providerSettings.activeProvider === 'FazerCards' ? '🎮' : '🇰🇭'}
                </span>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {/* Full Gateway info on Large Desktop */}
                  <span className="text-slate-400 font-semibold hidden xl:inline">Gateway:</span>
                  <span className="font-bold text-cyan-300 text-xs hidden lg:inline">
                    {providerSettings.activeProvider === 'FazerCards' ? 'FazerCards Reseller' : 'KhmerTopUp API'}
                  </span>
                  <span className="text-slate-600 hidden lg:inline">|</span>

                  {/* Balance label */}
                  <span className="text-slate-400 font-semibold text-[10px] sm:text-xs hidden xs:inline">Balance:</span>
                  <span className="font-black text-amber-300 text-[11px] sm:text-xs">
                    ${(providerSettings.balanceUSD !== undefined ? Number(providerSettings.balanceUSD) : 18.50).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold hidden sm:inline">
                    (~{Math.round((Number(providerSettings.balanceUSD) || 18.50) * 4100).toLocaleString()} ៛)
                  </span>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Connected & Live" />
                </div>
              </div>

              {/* Button: View Home Page / Storefront (Desktop / Tablet) */}
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all items-center gap-1.5 shadow-md hover:scale-105"
                title="Open client store home page in new tab"
              >
                <span>🌐</span>
                <span>View Store</span>
              </Link>

              {/* User Profile Pill (Desktop) */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-input border border-dark-border text-xs">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-black flex items-center justify-center text-[10px]">
                  👤
                </div>
                <div className="text-left">
                  <div className="font-bold text-white leading-tight truncate max-w-[110px]">
                    {user?.name || user?.email?.split('@')[0] || 'Admin'}
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold block">Administrator</span>
                </div>
              </div>

              {/* Logout Button (Desktop / Tablet) */}
              <button
                onClick={handleLogout}
                className="hidden md:flex px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all items-center gap-1.5 shadow-md"
                title="Log out of Admin Panel"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>

              {/* Mobile Drawer Menu Toggle (Hamburger) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-base flex md:hidden items-center justify-center hover:bg-slate-700 active:scale-95 transition-all shrink-0"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sliding Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-dark-bg/95 border-b border-dark-border p-4 space-y-4 animate-slideDown backdrop-blur-2xl">
            {/* User Profile Bar on Mobile */}
            <div className="p-3 bg-dark-card rounded-2xl border border-dark-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-black flex items-center justify-center text-sm">
                  👑
                </div>
                <div>
                  <div className="font-bold text-white text-sm">
                    {user?.name || user?.email || 'Admin Master'}
                  </div>
                  <span className="text-xs text-amber-400 font-semibold">Logged in as Administrator</span>
                </div>
              </div>

              <Link
                to="/"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold"
              >
                🌐 Store
              </Link>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {menuTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 font-black shadow-lg shadow-amber-500/20'
                      : 'bg-dark-card/90 text-slate-200 border-dark-border hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        activeTab === tab.id ? 'bg-black text-amber-300' : tab.badgeColor
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <button
                onClick={handleLogout}
                className="text-rose-400 hover:underline font-bold flex items-center gap-1"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Workspace Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Loading Spinner & Indicator */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-2xl shadow-glow-gold">
              <span className="animate-spin text-amber-400">⚡</span>
            </div>
            <div className="text-center">
              <h3 className="text-base font-black text-white">Loading {currentTabInfo.label}...</h3>
              <p className="text-xs text-slate-400 mt-0.5">Fetching live enterprise data and telemetry</p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: GAMES & LOGOS CUSTOMIZER */}
        {/* ========================================================= */}
        {!loading && activeTab === 'games' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>🎮</span> Games & Logos Customizer
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Change store logo, game icons, manage store game selection, and configure customer routes.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleOpenStoreLogoModal}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-glow-gold hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>🎨</span>
                  <span>Change Store Logo</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetGames}
                  className="btn btn-secondary text-xs sm:text-sm py-2.5 px-3.5 flex items-center gap-2"
                >
                  <span>🔄</span>
                  <span>Reset Defaults</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenGameModal()}
                  className="btn btn-gold text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>➕</span>
                  <span>Add New Game</span>
                </button>
              </div>
            </div>

            {/* Store Branding Banner Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-dark-card via-dark-card to-slate-900 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300 p-[2px] shadow-glow-gold shrink-0 overflow-hidden">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                    {branding.logoType === 'image' && branding.logoImage ? (
                      <img
                        src={branding.logoImage}
                        alt={branding.storeName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{branding.logoEmoji || '💎'}</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                      Active Store Brand:
                    </span>
                    <span className="font-black text-white text-base sm:text-lg">
                      {branding.storeName || 'MLBB TOPUP'}
                    </span>
                    {branding.badgeText && (
                      <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        {branding.badgeText}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tagline: <strong className="text-slate-200">{branding.tagline || 'Official Diamond Hub'}</strong>
                    {' '}• Displays on Customer Storefront & Admin Navbar.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleOpenStoreLogoModal}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>✏️</span>
                  <span>Edit Logo & Brand</span>
                </button>
              </div>
            </div>

            {/* Quick Info Box */}
            <div className="p-4 rounded-2xl bg-dark-card border border-cyan-500/30 text-xs text-slate-300 flex items-start gap-3 shadow-md">
              <span className="text-xl shrink-0">💡</span>
              <div>
                <strong className="text-cyan-300 block text-sm mb-0.5">Live Storefront Integration</strong>
                <p className="text-slate-400 leading-relaxed">
                  The primary game <strong className="text-white">Mobile Legends: Bang Bang</strong> uses your uploaded 5v5 icon. You can change any logo by clicking <strong className="text-amber-300">"Edit Logo & Info"</strong> and uploading a new image file or pasting an image URL. All customer visits on the Homepage and Top-Up page reflect your changes in real-time.
                </p>
              </div>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gamesList.map((game) => {
                const isActive = game.status === 'Active';

                return (
                  <div
                    key={game.id}
                    className="card p-5 border border-dark-border bg-dark-card hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 rounded-2xl shadow-xl relative overflow-hidden group"
                  >
                    {/* Top Status Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            game.badgeColor === 'gold' || game.id === 'mlbb'
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : game.badgeColor === 'emerald'
                              ? 'bg-emerald-500 text-white'
                              : game.badgeColor === 'purple'
                              ? 'bg-purple-500 text-white'
                              : 'bg-cyan-500 text-slate-950 font-black'
                          }`}
                        >
                          {game.badge || 'Official'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{game.category}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleGameStatus(game.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all ${
                          isActive
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                        title="Click to toggle status"
                      >
                        {isActive ? '🟢 Active' : '⚪ Coming Soon'}
                      </button>
                    </div>

                    {/* Image & Game Info */}
                    <div className="flex items-start gap-4">
                      {/* Logo Thumbnail with Quick Edit Overlay */}
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400/80 shadow-glow-gold shrink-0">
                        <img
                          src={game.image}
                          alt={game.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/mlbb-logo.png';
                          }}
                          className="w-full h-full object-cover object-center"
                        />
                        <div
                          onClick={() => handleOpenGameModal(game)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-amber-300 font-black text-xs"
                          title="Change Logo"
                        >
                          📷 Change
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="font-black text-white text-base leading-snug truncate">
                          {game.name}
                        </h3>
                        <p className="text-xs text-slate-400 truncate">
                          🏢 {game.publisher || 'Publisher'}
                        </p>
                        <p className="text-xs text-amber-300 font-semibold truncate">
                          💎 {game.currency || 'Diamonds'}
                        </p>
                        <p className="text-[11px] text-cyan-300 font-medium">
                          ⚡ {game.deliveryTime || '10s Instant'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-dark-border grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenGameModal(game)}
                        className="py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>✏️</span>
                        <span>Edit Logo & Info</span>
                      </button>
                      {game.id !== 'mlbb' ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteGame(game.id)}
                          className="py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>🗑️</span>
                          <span>Delete</span>
                        </button>
                      ) : (
                        <Link
                          to="/"
                          target="_blank"
                          className="py-2 px-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>👁️</span>
                          <span>View on Home</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: BANNERS & GAME EVENTS PROMOTIONS */}
        {/* ========================================================= */}
        {!loading && activeTab === 'banners' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header with Title & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>🎨</span> Event Banners & Game Promotions
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Upload promotional artwork to Cloudinary CDN, configure game event announcements, customize CTA buttons & links.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleOpenAddBannerModal}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-black text-xs sm:text-sm shadow-glow-gold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>➕</span>
                  <span>Add New Event Banner</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowBannerCloudinaryConfig(!showBannerCloudinaryConfig)}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    showBannerCloudinaryConfig
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                      : 'bg-[#111728] hover:bg-[#182035] text-cyan-400 border-cyan-500/40'
                  }`}
                  title="Configure Cloudinary Image Upload Settings"
                >
                  <span>☁️</span>
                  <span>{showBannerCloudinaryConfig ? 'Hide Cloudinary Settings' : 'Cloudinary Settings'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetBanners}
                  className="px-3.5 py-2.5 rounded-xl bg-[#111728] hover:bg-[#182035] text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Reset to default official promotional banners"
                >
                  <span>🔄</span>
                  <span>Reset Defaults</span>
                </button>

                <Link
                  to="/"
                  target="_blank"
                  className="px-3.5 py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                  title="View live banners on storefront"
                >
                  <span>🌐</span>
                  <span>View Live Banners</span>
                </Link>
              </div>
            </div>

            {/* Cloudinary Settings Drawer */}
            {showBannerCloudinaryConfig && (
              <div className="p-4 sm:p-5 rounded-3xl bg-[#0B132B] border-2 border-cyan-500/50 space-y-3 shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-black text-sm">
                    <span>☁️</span>
                    <span>Cloudinary CDN Direct Image Upload Settings</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Uploaded images are hosted globally with instant high-speed CDN delivery
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Cloudinary Cloud Name</label>
                    <input
                      type="text"
                      value={cloudinaryConfigState.cloudName}
                      onChange={(e) => {
                        const next = { ...cloudinaryConfigState, cloudName: e.target.value };
                        setCloudinaryConfigState(next);
                        saveCloudinaryConfig(next);
                      }}
                      placeholder="e.g. dpz7vpmf8"
                      className="input w-full text-xs py-2 rounded-xl font-mono text-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Upload Preset (Unsigned)</label>
                    <input
                      type="text"
                      value={cloudinaryConfigState.uploadPreset}
                      onChange={(e) => {
                        const next = { ...cloudinaryConfigState, uploadPreset: e.target.value };
                        setCloudinaryConfigState(next);
                        saveCloudinaryConfig(next);
                      }}
                      placeholder="e.g. mlbb_topup"
                      className="input w-full text-xs py-2 rounded-xl font-mono text-amber-300"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span>Folder destination: <strong className="text-white font-mono">event_banners</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      saveCloudinaryConfig(cloudinaryConfigState);
                      showToast('success', '✅ Cloudinary settings saved!');
                    }}
                    className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs cursor-pointer shadow-md"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}

            {/* Quick Stats & Live Preview Banner Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#0B0F19] border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">📢</span>
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Live Carousel Banner Count: <strong className="text-amber-400 font-mono">{eventBanners.filter(b => b.status === 'Active').length} Active</strong> / {eventBanners.length} Total
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  ⚡ Auto-advances every 4.5s on Storefront & Top-Up page
                </span>
              </div>
            </div>

            {/* Banners Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {eventBanners.map((banner, index) => {
                const isActive = banner.status === 'Active';
                const isCloudinary = banner.image?.includes('cloudinary.com');

                return (
                  <div
                    key={banner.id || index}
                    className={`card p-4 sm:p-5 border rounded-3xl transition-all flex flex-col justify-between space-y-4 shadow-xl overflow-hidden group ${
                      isActive ? 'bg-[#0B0F19] border-slate-800 hover:border-slate-700' : 'bg-[#07090E]/60 border-slate-900 opacity-60'
                    }`}
                  >
                    {/* Top Status & Event Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide shadow-sm truncate max-w-[200px] ${banner.badgeColor || 'bg-amber-400 text-black'}`}>
                        {banner.tag || '🔥 EVENT'}
                      </span>

                      <div className="flex items-center gap-2">
                        {isCloudinary && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            ☁️ Cloudinary CDN
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleToggleBannerStatus(banner.id)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {isActive ? '● Live on Store' : '○ Disabled'}
                        </button>
                      </div>
                    </div>

                    {/* Image Preview & Info */}
                    <div className="space-y-3">
                      <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group/img">
                        <img
                          src={banner.image}
                          alt={banner.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Quick Hover Overlay to Change Image with Cloudinary */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 cursor-pointer transform scale-95 hover:scale-105 transition-all">
                            <span>☁️</span>
                            <span>Change Image (Cloudinary)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleQuickChangeBannerImage(banner.id, e)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="absolute bottom-2 left-3 right-3 text-white text-xs font-bold truncate">
                          {banner.title}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                          {banner.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {banner.subtitle}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800/80 text-slate-300 font-mono">
                        <div>Target Game: <strong className="text-cyan-300 uppercase">{banner.gameId || 'mlbb'}</strong></div>
                        <div className="text-right">CTA: <strong className="text-amber-300">{banner.buttonText || 'Top Up'}</strong></div>
                      </div>
                    </div>

                    {/* Bottom Actions with Quick Cloudinary Change Button */}
                    <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditBannerModal(banner)}
                        className="py-2 px-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>

                      <label className="py-2 px-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer truncate">
                        <span>☁️</span>
                        <span>Upload New</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleQuickChangeBannerImage(banner.id, e)}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="py-2 px-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: FAST TOP-UP DELIVERY STATION (DEFAULT / PRIMARY) */}
        {/* ========================================================= */}
        {!loading && activeTab === 'pending' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>⚡</span> Fast Top-Up Delivery Station
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Queue of customer orders with verified KHQR payment awaiting Diamond delivery.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleBatchDeliverAll}
                  disabled={batchProcessing || pendingOrders.length === 0}
                  className="btn btn-gold text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-40"
                >
                  <span>🚀</span>
                  <span>
                    {batchProcessing ? 'Delivering All...' : `Auto-Deliver All (${pendingOrders.length})`}
                  </span>
                </button>
              </div>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="card text-center py-16 sm:py-20 space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/10 text-emerald-400 text-3xl sm:text-4xl flex items-center justify-center mx-auto border border-emerald-500/30">
                  ✅
                </div>
                <h3 className="font-black text-white text-lg sm:text-xl">Top-Up Queue is All Clear!</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  All paid customer orders have been successfully fulfilled. When new players submit KHQR payments, they will appear here instantly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {pendingOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="card bg-gradient-to-br from-dark-card to-dark-card/80 border-amber-500/40 hover:border-amber-400 transition-all space-y-4 shadow-xl relative overflow-hidden rounded-3xl"
                  >
                    {/* Top Order Badge Bar */}
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-black text-xs">
                        ORDER #{order.orderId}
                      </span>
                      <span className="badge badge-success text-[10px] font-black">
                        PAID (KHQR) ✅
                      </span>
                    </div>

                    {/* Player Info Box with Copy Button */}
                    <div className="p-3.5 bg-dark-input/90 rounded-2xl border border-dark-border space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs font-semibold">Player ID:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-cyan-300 text-base sm:text-lg">
                            {order.playerID}
                          </span>
                          <button
                            onClick={() => handleCopyText(order.playerID, `p-${order.orderId}`)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700 transition-all"
                            title="Copy Player ID"
                          >
                            {copiedId === `p-${order.orderId}` ? 'Copied! ✅' : '📋 Copy'}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs font-semibold">Server / Zone:</span>
                        <span className="font-mono font-bold text-slate-200 text-sm">
                          {order.serverID}
                        </span>
                      </div>
                    </div>

                    {/* Diamond & Price Box */}
                    <div className="flex justify-between items-center p-3 bg-dark-bg/80 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Package:</span>
                        <span className="font-black text-amber-300 text-base flex items-center gap-1">
                          <span>💎</span> {order.diamondAmount} Diamonds / Units
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Paid:</span>
                        <span className="font-black text-emerald-400 text-base">
                          ${order.amount?.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-dark-border space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Option 1: Green Instant Complete */}
                        <button
                          onClick={() => handleManualComplete(order.orderId)}
                          disabled={processingOrderId === order.orderId}
                          className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
                          title="Mark this order as Completed (Delivered manually in-game)"
                        >
                          <span>✅</span>
                          <span>Mark Delivered</span>
                        </button>

                        {/* Option 2: Gold Auto Delivery */}
                        <button
                          onClick={() => handleProcessSingleTopUp(order.orderId)}
                          disabled={processingOrderId === order.orderId}
                          className="btn btn-gold text-xs py-2.5 font-bold flex items-center justify-center gap-1.5"
                          title="Trigger automated dispatch via FazerCards API"
                        >
                          <span>⚡</span>
                          <span>
                            {processingOrderId === order.orderId ? 'Sending...' : 'Auto-Deliver (API)'}
                          </span>
                        </button>
                      </div>

                      {/* Helper Walkthrough Button */}
                      <button
                        onClick={() => setDeliveryModalOrder(order)}
                        className="w-full text-[11px] text-slate-400 hover:text-cyan-300 text-center py-1 font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>🔍 Open Delivery Assistant / Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DIAMOND PACKAGES & MULTI-TIER PRICING (WITH GAME & EVENT SELECTOR) */}
        {/* ========================================================= */}
        {!loading && activeTab === 'pricing' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>💎</span> Game Packages & Special Events Pricing
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-xs sm:text-sm text-slate-400">
                    Manage prices and profit margins.
                  </p>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    <span>🏦 Active Wholesale COGS:</span>
                    <strong className="text-amber-300">{providerSettings.activeProvider === 'FazerCards' ? 'FazerCards Reseller Rates' : 'Khmer TopUp Rates'}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  onClick={() => setExportModalOpen(true)}
                  className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold shadow-md transition-all active:scale-95"
                  title="Export pricing and profit matrix by game category, genre, or master catalog"
                >
                  <span>📊</span>
                  <span>Export to Excel</span>
                </button>

                <button
                  onClick={handleSyncOfficialPackages}
                  className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                  title="Sync official diamond packages"
                >
                  <span>🔄</span>
                  <span>Sync Official SKUs</span>
                </button>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductFormData({
                      diamondAmount: '',
                      price: '',
                      costPrice: '',
                      resellerPrice: '',
                      status: 'Active',
                      description: '',
                      game: selectedPricingGame === 'all' ? 'mlbb' : selectedPricingGame,
                      name: '',
                      tag: ''
                    });
                    setProductModalOpen(true);
                  }}
                  className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-glow-cyan"
                >
                  <span>➕</span>
                  <span>New Package / Event</span>
                </button>
              </div>
            </div>

            {/* GAME & SPECIAL EVENT TYPE SELECTOR BAR */}
            <div className="card p-3 sm:p-4 bg-dark-card border border-dark-border space-y-3 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🎮</span> Select Game or Special Event:
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Active Filter: <strong className="text-white">{selectedPricingGame === 'all' ? 'All Products' : PRICING_GAMES.find(g => g.id === selectedPricingGame)?.name || selectedPricingGame}</strong>
                </span>
              </div>

              {/* Horizontal Scrollable Game Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
                {PRICING_GAMES.map((g) => {
                  const isSelected = selectedPricingGame === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedPricingGame(g.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-glow-gold scale-[1.02]'
                          : 'bg-[#111728] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm">{g.icon}</span>
                      <span>{g.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-card p-3.5 rounded-2xl border border-dark-border">
              <div className="flex items-center gap-2 flex-wrap">
                {['ALL', 'ACTIVE', 'INACTIVE', 'PASSES'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setPricingFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      pricingFilter === f
                        ? 'bg-amber-500 text-black font-black'
                        : 'bg-dark-input text-slate-300 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Search packages by name or diamonds..."
                value={packageSearch}
                onChange={(e) => setPackageSearch(e.target.value)}
                className="input text-xs py-2 px-3 w-full sm:max-w-xs"
              />
            </div>

            {/* Product Cards Grid - 5 Columns Desktop / 2-3 Columns Mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-3">
              {getMergedProductsList()
                .filter((p) => {
                  // Game / Special Event Filter
                  if (selectedPricingGame === 'special_passes') {
                    return p.isPass || p.diamondAmount === 210 || p.diamondAmount === 500 || (p.name && (p.name.includes('Pass') || p.name.includes('Membership') || p.name.includes('Welkin')));
                  }
                  if (selectedPricingGame !== 'all') {
                    if (p.game) return p.game === selectedPricingGame;
                    if (selectedPricingGame !== 'mlbb') return false;
                  }
                  return true;
                })
                .filter((p) => {
                  if (pricingFilter === 'ACTIVE') return p.status === 'Active';
                  if (pricingFilter === 'INACTIVE') return p.status === 'Inactive';
                  if (pricingFilter === 'PASSES') return p.diamondAmount === 210 || p.diamondAmount === 500 || p.isPass;
                  return true;
                })
                .filter((p) =>
                  packageSearch ? (p.diamondAmount?.toString().includes(packageSearch) || (p.name && p.name.toLowerCase().includes(packageSearch.toLowerCase()))) : true
                )
                .map((prod) => {
                  const cost = getProductCostForActiveProvider(prod);
                  const profit = prod.price - cost;
                  const margin = prod.price > 0 ? Math.round((profit / prod.price) * 100) : 0;
                  const isPass = prod.isPass || prod.diamondAmount === 210 || prod.diamondAmount === 500;

                  return (
                    <div
                      key={prod.productId}
                      className="card bg-dark-card border border-dark-border hover:border-amber-500/50 transition-all p-2.5 sm:p-3 rounded-2xl flex flex-col justify-between shadow-md space-y-2 group hover:-translate-y-0.5"
                    >
                      {/* Top Header Tag */}
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-mono font-bold text-slate-400">#{prod.productId}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black border ${
                            prod.status === 'Active'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                              : 'bg-rose-950/60 text-rose-400 border-rose-500/40'
                          }`}
                        >
                          {prod.status === 'Active' ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>

                      {/* Icon & Amount / Name */}
                      <div className="text-center py-1">
                        <div className="text-2xl sm:text-3xl mb-0.5 group-hover:scale-110 transition-transform">
                          {isPass ? '🌟' : prod.game === 'pubgm' ? '🎯' : prod.game === 'freefire' ? '🔥' : prod.game === 'genshin' ? '🌙' : '💎'}
                        </div>
                        <div className="font-black text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors leading-tight truncate">
                          {prod.name || `${prod.diamondAmount} Diamonds / Units`}
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
                          {prod.tag || (isPass ? 'Special Event' : 'Direct Top-Up')}
                        </span>
                      </div>

                      {/* Multi-Tier Price & Profit Strip */}
                      <div className="bg-dark-input/90 rounded-xl p-2 border border-slate-800 text-[10px] space-y-1 font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-sans text-[9px]">Retail:</span>
                          <span className="text-emerald-400 font-black">${prod.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-amber-300 font-sans font-bold text-[9px]">Reseller:</span>
                          <span className="text-amber-300 font-black">${(prod.resellerPrice > 0 ? Number(prod.resellerPrice) : prod.price * 0.92).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-sans text-[9px]">Cost ({providerSettings.activeProvider === 'FazerCards' ? 'FZR' : 'KT'}):</span>
                          <span className="text-rose-400">${cost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                          <span className="text-cyan-300 font-sans font-semibold text-[9px]">Profit:</span>
                          <span className="text-cyan-300 font-black">
                            +${profit.toFixed(2)} ({margin}%)
                          </span>
                        </div>
                      </div>

                      {/* Compact Action Buttons */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-dark-border">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setProductFormData({
                              diamondAmount: prod.diamondAmount || '',
                              price: prod.price !== undefined ? prod.price : '',
                              costPrice: prod.costPrice !== undefined ? prod.costPrice : '',
                              costPriceFazerCards: prod.costPriceFazerCards !== undefined ? prod.costPriceFazerCards : (prod.costPrice || ''),
                              costPriceKhmerTopUp: prod.costPriceKhmerTopUp !== undefined ? prod.costPriceKhmerTopUp : '',
                              resellerPrice: prod.resellerPrice !== undefined ? prod.resellerPrice : (Number(prod.price) * 0.92).toFixed(2),
                              status: prod.status || 'Active',
                              description: prod.description || '',
                              name: prod.name || '',
                              tag: prod.tag || '',
                              game: prod.game || 'mlbb'
                            });
                            setProductModalOpen(true);
                          }}
                          className="btn btn-secondary flex-1 text-[10px] sm:text-xs py-1 px-2 font-bold cursor-pointer"
                          title="Edit package price and details"
                        >
                          ✏️ Edit Price
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.productId)}
                          className="p-1 px-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs border border-rose-500/30 cursor-pointer"
                          title="Delete package"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ALL ORDERS & TRANSACTIONS LEDGER */}
        {/* ========================================================= */}
        {!loading && activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>📦</span> Orders & Transactions Ledger
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Complete history of customer orders, payments, and delivery statuses.
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <span>📥</span>
                <span>Export CSV</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="card p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs rounded-2xl">
              <input
                type="text"
                placeholder="Search Order ID / Player ID..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="input text-xs py-2"
              />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="input text-xs py-2"
              >
                <option value="ALL">Payment: All</option>
                <option value="Paid">Payment: Paid</option>
                <option value="Pending">Payment: Pending</option>
                <option value="Failed">Payment: Failed</option>
              </select>
              <select
                value={topupFilter}
                onChange={(e) => setTopupFilter(e.target.value)}
                className="input text-xs py-2"
              >
                <option value="ALL">Top-Up: All</option>
                <option value="Completed">Top-Up: Completed</option>
                <option value="Pending">Top-Up: Pending</option>
                <option value="Processing">Top-Up: Processing</option>
                <option value="Failed">Top-Up: Failed</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input text-xs py-2"
              >
                <option value="ALL">Date: All Time</option>
                <option value="TODAY">Date: Today</option>
                <option value="7DAYS">Date: Last 7 Days</option>
              </select>
            </div>

            {/* Orders Table */}
            <div className="card space-y-4 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-dark-input/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Order</th>
                      <th className="p-3">Player / Zone</th>
                      <th className="p-3">Diamonds / Units</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Delivery</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {paginatedOrders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-slate-800/30">
                        <td className="p-3 font-bold text-white">#{order.orderId}</td>
                        <td className="p-3 font-sans">
                          <span className="font-bold text-cyan-300">{order.playerID}</span>{' '}
                          <span className="text-slate-400">({order.serverID})</span>
                        </td>
                        <td className="p-3 font-sans font-bold text-amber-300">
                          {order.diamondAmount} Diamonds / Units
                        </td>
                        <td className="p-3 text-emerald-400 font-bold">${order.amount?.toFixed(2)}</td>
                        <td className="p-3 font-sans">
                          <span
                            className={`badge ${
                              order.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3 font-sans">
                          <span
                            className={`badge ${
                              order.topupStatus === 'Completed'
                                ? 'badge-success'
                                : order.topupStatus === 'Failed'
                                ? 'badge-danger'
                                : 'badge-warning'
                            }`}
                          >
                            {order.topupStatus}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 font-sans">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn btn-secondary text-xs py-1 px-2.5 font-sans"
                          >
                            Audit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: FINANCIALS & PROFIT ANALYTICS */}
        {/* ========================================================= */}
        {!loading && activeTab === 'financials' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>💰</span> Financials & Profit Analytics
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Real-time Gross Revenue, Supplier COGS, Net Profit, and margin metrics.
                </p>
              </div>

              <button
                onClick={() => setExportModalOpen(true)}
                className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold shadow-md transition-all active:scale-95 shrink-0"
                title="Export complete pricing, wholesale costs, and profit breakdown to Excel"
              >
                <span>📊</span>
                <span>Export Profit Report (Excel)</span>
              </button>
            </div>

            {/* Profit KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card bg-gradient-to-br from-dark-card to-dark-card/60 border-emerald-500/40 rounded-2xl shadow-xl">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Net Profit</span>
                <div className="text-3xl font-black text-emerald-400 mt-1">
                  ${financials?.totalNetProfit?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-semibold">
                  ៛{financials?.totalNetProfitKHR?.toLocaleString() || '0'} KHR
                </div>
              </div>

              <div className="card bg-gradient-to-br from-dark-card to-dark-card/60 border-cyan-500/40 rounded-2xl shadow-xl">
                <span className="text-xs text-slate-400 font-semibold uppercase">Gross Revenue</span>
                <div className="text-3xl font-black text-cyan-300 mt-1">
                  ${financials?.totalGrossRevenue?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-semibold">Total customer payments</div>
              </div>

              <div className="card bg-gradient-to-br from-dark-card to-dark-card/60 border-rose-500/40 rounded-2xl shadow-xl">
                <span className="text-xs text-slate-400 font-semibold uppercase">Supplier COGS</span>
                <div className="text-3xl font-black text-rose-400 mt-1">
                  ${financials?.totalSupplierCogs?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-semibold">Wholesale costs paid</div>
              </div>

              <div className="card bg-gradient-to-br from-dark-card to-dark-card/60 border-amber-500/40 rounded-2xl shadow-xl">
                <span className="text-xs text-slate-400 font-semibold uppercase">Gross Margin</span>
                <div className="text-3xl font-black text-amber-300 mt-1">
                  {financials?.overallMarginPct || 0}%
                </div>
                <div className="text-xs text-slate-400 mt-1 font-semibold">Average profit margin</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SUPPLIER & API GATEWAYS */}
        {/* ========================================================= */}
        {!loading && activeTab === 'provider' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                <span>🏦</span> Supplier API Gateways & Account Balance
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Configure your upstream supplier connection (Khmer TopUp or FazerCards Reseller) and view live credit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Provider Settings Card */}
              <div className="card space-y-4 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">API Connection Settings</h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Active: {providerSettings.activeProvider}
                  </span>
                </div>

                <form onSubmit={handleSaveProviderSettings} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Active MLBB Provider</label>
                    <select
                      value={providerSettings.activeProvider}
                      onChange={(e) => {
                        const nextP = e.target.value;
                        const nextKey = nextP === 'FazerCards'
                          ? (providerSettings.fazerCardsApiKey || 'fc_5f79a0016d5d87bd1e83ea4f')
                          : (providerSettings.khmerTopUpApiKey || 'kt_6d38a3a5940e970221cc62fa306ae96044736364');
                        setProviderSettings({
                          ...providerSettings,
                          activeProvider: nextP,
                          apiKey: nextKey,
                        });
                      }}
                      className="input w-full text-xs py-2.5 rounded-xl font-bold bg-dark-bg border-slate-700 text-amber-300"
                    >
                      <option value="FazerCards">🎮 FazerCards Reseller (reseller.fazercards.com - $18.50 Available)</option>
                      <option value="KhmerTopUp">🇰🇭 Khmer TopUp (khmer-topup.com - Official Direct MLBB)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Environment Mode</label>
                    <select
                      value={providerSettings.environment}
                      onChange={(e) =>
                        setProviderSettings({ ...providerSettings, environment: e.target.value })
                      }
                      className="input w-full text-xs py-2 rounded-xl"
                    >
                      <option value="Production">🟢 Production (Live Direct Diamond Injection)</option>
                      <option value="Sandbox">🧪 Sandbox / Demo (Simulate Successful Delivery)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-400 font-semibold">
                        {providerSettings.activeProvider === 'FazerCards' ? 'FazerCards API Key / Token' : 'Khmer TopUp API Key (kt_...)'}
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">Auto-populated</span>
                    </div>
                    <input
                      type="text"
                      value={providerSettings.apiKey}
                      onChange={(e) =>
                        setProviderSettings({ ...providerSettings, apiKey: e.target.value })
                      }
                      className="input w-full font-mono text-xs py-2.5 rounded-xl text-cyan-300"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button type="submit" className="btn btn-primary text-xs py-2.5 px-4 font-bold shadow-glow-cyan">
                      💾 Save Settings
                    </button>
                    <button
                      type="button"
                      onClick={handleTestProviderConnection}
                      disabled={providerTesting}
                      className="btn btn-secondary text-xs py-2.5 px-4 font-bold"
                    >
                      {providerTesting ? '🔄 Testing...' : '⚡ Test Connection'}
                    </button>
                  </div>
                </form>
              </div>

              {/* 1-Click Fast Gateway Switcher & Live Balances */}
              <div className="card space-y-4 bg-dark-input/60 border-slate-800 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">⚡ 1-Click Gateway Switcher</h3>
                  <span className="text-[10px] text-slate-400">Live Dual Balances</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Switch your storefront's automated fulfillment provider with a single click:
                </p>

                <div className="space-y-3.5 text-xs">
                  {/* Supplier 1: FazerCards Reseller */}
                  <div className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                    providerSettings.activeProvider === 'FazerCards'
                      ? 'bg-purple-950/40 border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                      : 'bg-dark-bg border-slate-800 hover:border-slate-700'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎮</span>
                        <div>
                          <span className="font-bold text-purple-300 text-sm">FazerCards Reseller</span>
                          <span className="text-[10px] text-slate-400 block">Global Wholesale Catalog (api.fzr.cards)</span>
                        </div>
                      </div>
                      {providerSettings.activeProvider === 'FazerCards' ? (
                        <span className="badge badge-success text-[10px] font-black animate-pulse">ACTIVE 🟢</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">STANDBY</span>
                      )}
                    </div>

                    {/* Balance Display */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-slate-800/80">
                      <span className="text-slate-400 text-xs">Available Credit:</span>
                      <div className="text-right">
                        <span className="font-mono font-black text-amber-300 text-sm">
                          ${(providerSettings.fazerCardsBalanceUSD || 18.50).toFixed(2)} USD
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold block">
                          ~{Math.round((providerSettings.fazerCardsBalanceUSD || 18.50) * 4100).toLocaleString()} ៛ KHR
                        </span>
                      </div>
                    </div>

                    {/* Switch Button */}
                    <div className="flex gap-2 pt-1">
                      {providerSettings.activeProvider === 'FazerCards' ? (
                        <div className="w-full py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/40 font-black text-center text-xs flex items-center justify-center gap-1.5">
                          <span>✅</span>
                          <span>Currently Active Provider</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={switchingProvider}
                          onClick={() => handleQuickSwitchProvider('FazerCards')}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>⚡</span>
                          <span>{switchingProvider ? 'Switching...' : 'Switch to FazerCards ($18.50)'}</span>
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2 pt-0.5 text-[10px]">
                      <a
                        href="https://reseller.fazercards.com/en/catalog/mobile-legends"
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:underline font-bold"
                      >
                        💎 MLBB Wholesale Prices
                      </a>
                      <span className="text-slate-600">|</span>
                      <a
                        href="https://reseller.fazercards.com/panel/balance"
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline font-bold"
                      >
                        💳 Top Up Balance ($18.50)
                      </a>
                    </div>
                  </div>

                  {/* Supplier 2: Khmer TopUp */}
                  <div className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                    providerSettings.activeProvider === 'KhmerTopUp'
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'bg-dark-bg border-slate-800 hover:border-slate-700'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇰🇭</span>
                        <div>
                          <span className="font-bold text-cyan-300 text-sm">Khmer TopUp</span>
                          <span className="text-[10px] text-slate-400 block">Direct Cambodia MLBB (khmer-topup.com)</span>
                        </div>
                      </div>
                      {providerSettings.activeProvider === 'KhmerTopUp' ? (
                        <span className="badge badge-success text-[10px] font-black animate-pulse">ACTIVE 🟢</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">STANDBY</span>
                      )}
                    </div>

                    {/* Balance Display */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-slate-800/80">
                      <span className="text-slate-400 text-xs">Available Credit:</span>
                      <div className="text-right">
                        <span className="font-mono font-black text-amber-300 text-sm">
                          ${(providerSettings.khmerTopUpBalanceUSD || 1.25).toFixed(2)} USD
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold block">
                          ~{Math.round((providerSettings.khmerTopUpBalanceUSD || 1.25) * 4100).toLocaleString()} ៛ KHR
                        </span>
                      </div>
                    </div>

                    {/* Switch Button */}
                    <div className="flex gap-2 pt-1">
                      {providerSettings.activeProvider === 'KhmerTopUp' ? (
                        <div className="w-full py-2 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-black text-center text-xs flex items-center justify-center gap-1.5">
                          <span>✅</span>
                          <span>Currently Active Provider</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={switchingProvider}
                          onClick={() => handleQuickSwitchProvider('KhmerTopUp')}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>⚡</span>
                          <span>{switchingProvider ? 'Switching...' : 'Switch to Khmer TopUp ($1.25)'}</span>
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2 pt-0.5 text-[10px]">
                      <a
                        href="https://khmer-topup.com/tl/api-docs"
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:underline font-bold"
                      >
                        📖 API Docs
                      </a>
                      <span className="text-slate-600">|</span>
                      <a
                        href="https://khmer-topup.com/wallet"
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline font-bold"
                      >
                        💳 Wallet Refill ($1.25)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: OVERVIEW & KPIS */}
        {/* ========================================================= */}
        {!loading && activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>📊</span> Store Overview & Live KPIs
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Real-time sales velocity, revenue telemetry, peak volume breakdown and order conversion.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab('pending')}
                  className="btn btn-gold text-xs py-2 px-3.5 font-bold shadow-glow-gold flex items-center gap-1.5"
                >
                  <span>⚡</span>
                  <span>Fast Queue ({pendingOrders.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="btn btn-secondary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5"
                >
                  <span>📦</span>
                  <span>Orders Ledger</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadData(false)}
                  disabled={refreshing}
                  className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                  title="Refresh metrics"
                >
                  <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                  <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Card 1: Total Revenue */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-dark-card to-dark-bg border border-emerald-500/30 shadow-xl relative overflow-hidden group hover:border-emerald-500/60 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Total Gross Revenue</span>
                  <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-base">💰</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  ${(reports?.totalRevenue || 0).toFixed(2)}
                </div>
                <div className="text-[11px] text-emerald-400/90 font-bold mt-1">
                  ~{Math.round((reports?.totalRevenue || 0) * 4100).toLocaleString()} ៛ KHR
                </div>
              </div>

              {/* Card 2: Today Revenue */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-dark-card to-dark-bg border border-amber-500/30 shadow-xl relative overflow-hidden group hover:border-amber-500/60 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Today's Revenue</span>
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 text-base">⚡</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  ${(reports?.todayRevenue || 0).toFixed(2)}
                </div>
                <div className="text-[11px] text-amber-400/90 font-bold mt-1">
                  ~{Math.round((reports?.todayRevenue || 0) * 4100).toLocaleString()} ៛ KHR
                </div>
              </div>

              {/* Card 3: Completed Orders */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-dark-card to-dark-bg border border-cyan-500/30 shadow-xl relative overflow-hidden group hover:border-cyan-500/60 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Completed Top-Ups</span>
                  <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-base">✅</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {reports?.completedOrders ?? 0}
                </div>
                <div className="text-[11px] text-slate-400 font-semibold mt-1">
                  {reports?.totalOrders ? Math.round(((reports.completedOrders || 0) / reports.totalOrders) * 100) : 100}% fulfillment rate
                </div>
              </div>

              {/* Card 4: Diamonds Delivered */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-dark-card to-dark-bg border border-purple-500/30 shadow-xl relative overflow-hidden group hover:border-purple-500/60 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Diamonds Delivered</span>
                  <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 text-base">💎</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {(reports?.totalDiamondsDelivered || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-purple-300 font-semibold mt-1">
                  Across all customer orders
                </div>
              </div>
            </div>

            {/* 7-Day Performance & Top Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily Revenue Trend (2 cols) */}
              <div className="lg:col-span-2 card space-y-4 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between border-b border-dark-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📈</span>
                    <h3 className="font-bold text-white text-base">7-Day Sales Velocity & Volume</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">Past 7 Days</span>
                </div>

                {analytics?.dailyTrend && analytics.dailyTrend.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
                    {analytics.dailyTrend.map((d, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-dark-input/60 border border-dark-border flex flex-col items-center justify-center text-center space-y-1 hover:border-amber-500/40 transition-all">
                        <span className="text-[10px] font-bold text-slate-400">{d.date || d.Date}</span>
                        <span className="text-sm font-black text-amber-300">${Number(d.revenue || d.Revenue || 0).toFixed(2)}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                          {d.orders || d.Orders || 0} orders
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 text-xs font-semibold">
                    No sales telemetry recorded in the last 7 days.
                  </div>
                )}

                {/* Queue status banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg font-black">
                      ⚡
                    </div>
                    <div>
                      <h4 className="font-black text-white text-xs sm:text-sm">
                        {pendingOrders.length} Paid Order{pendingOrders.length === 1 ? '' : 's'} Waiting in Queue
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Orders with verified Bakong KHQR payments ready for automated API or manual delivery
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('pending')}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-glow-gold transition-all shrink-0"
                  >
                    Open Queue
                  </button>
                </div>
              </div>

              {/* Top Selling Packages (1 col) */}
              <div className="card space-y-4 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between border-b border-dark-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏆</span>
                    <h3 className="font-bold text-white text-base">Top Selling Packages</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('pricing')}
                    className="text-[10px] text-cyan-400 hover:underline font-bold"
                  >
                    Manage All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {reports?.topProducts && reports.topProducts.length > 0 ? (
                    reports.topProducts.slice(0, 5).map((p, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-dark-input/80 border border-dark-border flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                            idx === 0 ? 'bg-amber-400 text-black' : idx === 1 ? 'bg-slate-300 text-black' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-white block">
                              💎 {p.diamondAmount || p.DiamondAmount} Diamonds
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              ${Number(p.price || p.Price || 0).toFixed(2)} USD
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400 block">
                            {p.orderCount || p.OrderCount || 0} sales
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ${Number(p.totalRevenue || p.TotalRevenue || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      No package sale records available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: BAKONG KHQR GATEWAY & LIVE CREDENTIALS */}
        {/* ========================================================= */}
        {!loading && activeTab === 'bakong' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>🏦</span> Bakong KHQR Gateway & Account Management
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Configure National Bank of Cambodia (NBC) KHQR merchant IDs, manage JWT tokens, and verify MD5 webhook callbacks.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleOpenBakongAccountModal()}
                  className="btn btn-gold text-xs py-2 px-4 font-black shadow-glow-gold flex items-center gap-1.5"
                >
                  <span>➕</span>
                  <span>Add Bakong Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadData(false)}
                  disabled={refreshing}
                  className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                  <span>{refreshing ? 'Checking...' : 'Refresh Status'}</span>
                </button>
              </div>
            </div>

            {/* Gateway Status Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-red-950/40 via-dark-card to-dark-bg border border-red-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center text-2xl font-black shrink-0">
                  🇰🇭
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-white text-base sm:text-lg">
                      Bakong KHQR National Payment Gateway
                    </h3>
                    <span className="badge badge-success text-[10px] font-black animate-pulse">
                      {bakongInfo?.gatewayStatus || 'Connected & Active 🟢'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Active Merchant: <strong className="text-amber-300">{bakongInfo?.activeAccount?.merchantName || 'FAMILY PHONE'}</strong> ({bakongInfo?.activeAccount?.bakongId || '012345678@acb'}) | Bank: <span className="text-cyan-300">{bakongInfo?.activeAccount?.acquiringBank || 'FAMILY PHONE'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleTestBakongToken}
                  disabled={testingBakongToken}
                  className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>{testingBakongToken ? '🔄' : '⚡'}</span>
                  <span>{testingBakongToken ? 'Verifying...' : 'Test KHQR Token'}</span>
                </button>
              </div>
            </div>

            {/* Quick JWT Token Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Token Configuration Card */}
              <div className="card space-y-4 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between border-b border-dark-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔑</span>
                    <h3 className="font-bold text-white text-base">Bakong Developer JWT Token</h3>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Live Webhook Ready
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter your official Bakong Open API JWT Token issued by NBC (National Bank of Cambodia) to enable real-time automated payment verification.
                </p>

                <form onSubmit={handleSaveBakongToken} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      Live Bakong Bearer Token (JWT)
                    </label>
                    <textarea
                      rows="3"
                      value={quickTokenInput}
                      onChange={(e) => setQuickTokenInput(e.target.value)}
                      placeholder="eyJhbGciOiJSUzI1NiIs..."
                      className="input w-full font-mono text-xs py-2.5 rounded-xl text-amber-300 focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleTestBakongToken}
                      disabled={testingBakongToken || !quickTokenInput}
                      className="btn btn-secondary text-xs py-2.5 px-4 font-bold"
                    >
                      {testingBakongToken ? '🔄 Verifying...' : '🔍 Verify Token'}
                    </button>
                    <button
                      type="submit"
                      disabled={savingToken || !quickTokenInput}
                      className="btn btn-primary text-xs py-2.5 px-5 font-black shadow-glow-cyan"
                    >
                      {savingToken ? '💾 Saving...' : '💾 Save & Apply Live'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Account Profile Details */}
              <div className="card space-y-4 rounded-3xl shadow-xl bg-dark-input/40 border-slate-800">
                <div className="flex items-center justify-between border-b border-dark-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📋</span>
                    <h3 className="font-bold text-white text-base">Active Account Profile Details</h3>
                  </div>
                  {bakongInfo?.activeAccount && (
                    <button
                      type="button"
                      onClick={() => handleOpenBakongAccountModal(bakongInfo.activeAccount)}
                      className="text-[11px] text-amber-400 hover:underline font-bold"
                    >
                      ✏️ Edit Profile
                    </button>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-dark-bg/80 border border-slate-800">
                    <span className="text-slate-400">Account Title:</span>
                    <span className="font-bold text-white">{bakongInfo?.activeAccount?.accountTitle || 'Primary KHQR Merchant'}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-dark-bg/80 border border-slate-800">
                    <span className="text-slate-400">Bakong ID:</span>
                    <span className="font-mono font-black text-cyan-300">{bakongInfo?.activeAccount?.bakongId || '012345678@acb'}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-dark-bg/80 border border-slate-800">
                    <span className="text-slate-400">Merchant Name:</span>
                    <span className="font-bold text-amber-300">{bakongInfo?.activeAccount?.merchantName || 'FAMILY PHONE'}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-dark-bg/80 border border-slate-800">
                    <span className="text-slate-400">Acquiring Bank:</span>
                    <span className="font-bold text-slate-200">{bakongInfo?.activeAccount?.acquiringBank || 'FAMILY PHONE'}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-dark-bg/80 border border-slate-800">
                    <span className="text-slate-400">Telegram Alerts:</span>
                    <span className="font-semibold text-emerald-400">
                      {bakongInfo?.activeAccount?.telegramChatId ? '🔔 Enabled' : '⚪ Not configured'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bakong Accounts Profile List */}
            <div className="card space-y-4 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between border-b border-dark-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🗂️</span>
                  <h3 className="font-bold text-white text-base">Bakong Merchant Accounts ({bakongInfo?.accounts?.length || 1})</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenBakongAccountModal()}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all flex items-center gap-1"
                >
                  <span>➕</span>
                  <span>New Account Profile</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-dark-border text-slate-400">
                      <th className="pb-3 font-bold">Profile Title</th>
                      <th className="pb-3 font-bold">Bakong ID</th>
                      <th className="pb-3 font-bold">Merchant Name</th>
                      <th className="pb-3 font-bold">Acquiring Bank</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {(bakongInfo?.accounts || [bakongInfo?.activeAccount || { id: 1, accountTitle: 'Primary KHQR', bakongId: '012345678@acb', merchantName: 'FAMILY PHONE', acquiringBank: 'FAMILY PHONE', isActive: true }]).map((acc, idx) => {
                      const isActive = acc.isActive || acc.IsActive || (bakongInfo?.activeAccount?.id === acc.id);
                      return (
                        <tr key={acc.id || idx} className="hover:bg-dark-input/40 transition-colors">
                          <td className="py-3 font-bold text-white">
                            {acc.accountTitle || acc.AccountTitle || 'Bakong Account'}
                          </td>
                          <td className="py-3 font-mono font-bold text-cyan-300">
                            {acc.bakongId || acc.BakongId}
                          </td>
                          <td className="py-3 text-slate-200 font-semibold">
                            {acc.merchantName || acc.MerchantName}
                          </td>
                          <td className="py-3 text-slate-300">
                            {acc.acquiringBank || acc.AcquiringBank || 'Bakong'}
                          </td>
                          <td className="py-3">
                            {isActive ? (
                              <span className="badge badge-success text-[10px] font-black">ACTIVE 🟢</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">STANDBY</span>
                            )}
                          </td>
                          <td className="py-3 text-right space-x-1.5">
                            {!isActive && (
                              <button
                                type="button"
                                onClick={() => handleSwitchBakongAccount(acc.id || acc.Id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-[10px] font-bold"
                              >
                                Switch Active
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenBakongAccountModal(acc)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold"
                            >
                              Edit
                            </button>
                            {(bakongInfo?.accounts?.length || 0) > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteBakongAccount(acc.id || acc.Id)}
                                className="px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-[10px] font-bold"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: RESELLERS & B2B PORTAL */}
        {/* ========================================================= */}
        {!loading && activeTab === 'resellers' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>🏢</span> Resellers & B2B Partner Accounts
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Manage agent credit balances, wholesale discount tiers, and automated REST API top-up integration keys.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setResellerModalOpen(true)}
                  className="btn btn-gold text-xs py-2 px-4 font-black shadow-glow-gold flex items-center gap-1.5"
                >
                  <span>➕</span>
                  <span>Add New Reseller</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadData(false)}
                  disabled={refreshing}
                  className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                  <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {/* Top Stat Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-dark-card border border-dark-border shadow-lg space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Reseller Partners</span>
                <div className="text-2xl font-black text-white">{resellers.length} Accounts</div>
              </div>
              <div className="p-4 rounded-2xl bg-dark-card border border-dark-border shadow-lg space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Total Reseller Balance Held</span>
                <div className="text-2xl font-black text-amber-300">
                  ${resellers.reduce((sum, r) => sum + (Number(r.balanceUSD || r.BalanceUSD) || 0), 0).toFixed(2)} USD
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-dark-card border border-dark-border shadow-lg space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">B2B API Gateway</span>
                <div className="text-sm font-bold text-cyan-300">POST /api/reseller/topup (Active 🟢)</div>
              </div>
            </div>

            {/* Resellers Table */}
            <div className="card space-y-4 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between border-b border-dark-border pb-3">
                <h3 className="font-bold text-white text-base">Registered Wholesale Agents ({resellers.length})</h3>
                <span className="text-xs text-slate-400">Instant credit refill & key management</span>
              </div>

              {resellers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-dark-border text-slate-400">
                        <th className="pb-3 font-bold">Agent / Company</th>
                        <th className="pb-3 font-bold">Email</th>
                        <th className="pb-3 font-bold">Available Credit</th>
                        <th className="pb-3 font-bold">Discount Tier</th>
                        <th className="pb-3 font-bold">API Key</th>
                        <th className="pb-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                      {resellers.map((reseller) => {
                        const rId = reseller.resellerId || reseller.ResellerId || reseller.id;
                        const rName = reseller.name || reseller.Name;
                        const rEmail = reseller.email || reseller.Email;
                        const rBal = Number(reseller.balanceUSD || reseller.BalanceUSD || 0);
                        const rTier = reseller.discountTier || reseller.DiscountTier || 'Tier 1';
                        const rKey = reseller.apiKey || reseller.ApiKey || 'reseller_key_...';

                        return (
                          <tr key={rId} className="hover:bg-dark-input/40 transition-colors">
                            <td className="py-3 font-bold text-white">
                              <div>{rName}</div>
                              <span className="text-[10px] text-slate-500 font-mono">ID #{rId}</span>
                            </td>
                            <td className="py-3 text-slate-300">{rEmail}</td>
                            <td className="py-3 font-mono font-black text-amber-300 text-sm">
                              ${rBal.toFixed(2)}
                              <span className="text-[10px] text-slate-400 block font-normal">
                                ~{Math.round(rBal * 4100).toLocaleString()} ៛
                              </span>
                            </td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-500/30">
                                {rTier}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[120px]">
                                  {rKey}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(rKey, `reseller-${rId}`)}
                                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
                                >
                                  {copiedId === `reseller-${rId}` ? '✅' : '📋'}
                                </button>
                              </div>
                            </td>
                            <td className="py-3 text-right space-x-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setResellerDepositModal(reseller);
                                  setResellerDepositAmount('');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow-sm"
                              >
                                💳 Deposit Credit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleGenerateResellerApiKey(rId)}
                                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[10px] border border-slate-700"
                                title="Regenerate API key"
                              >
                                🔑 New Key
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No reseller accounts created yet. Click "+ Add New Reseller" to create a B2B partner account.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: FAILED ORDERS & RETRY ENGINE */}
        {/* ========================================================= */}
        {!loading && activeTab === 'failed' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>⚠️</span> Failed Transactions & 1-Click Retry Engine
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Orders that encountered upstream provider timeouts, player ID verification mismatches, or temporary connection errors.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => loadData(false)}
                  disabled={refreshing}
                  className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                  <span>{refreshing ? 'Refreshing...' : 'Refresh List'}</span>
                </button>
              </div>
            </div>

            {/* Status overview */}
            {failedTransactions.length > 0 ? (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-bold text-rose-300 text-sm">
                      {failedTransactions.length} Transaction{failedTransactions.length === 1 ? '' : 's'} Require Attention
                    </h3>
                    <p className="text-xs text-slate-400">
                      Use 1-Click Retry to re-dispatch through active supplier or Manual Fulfillment to clear.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-2">
                <span className="text-4xl block">🛡️</span>
                <h3 className="text-lg font-black text-white">All Systems Operational</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  No failed orders or stuck transactions detected. All customer top-up requests have completed successfully.
                </p>
              </div>
            )}

            {/* Table */}
            {failedTransactions.length > 0 && (
              <div className="card space-y-4 rounded-3xl shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-dark-border text-slate-400">
                        <th className="pb-3 font-bold">Order ID</th>
                        <th className="pb-3 font-bold">Player Info</th>
                        <th className="pb-3 font-bold">Package</th>
                        <th className="pb-3 font-bold">Amount Paid</th>
                        <th className="pb-3 font-bold">Error Reason</th>
                        <th className="pb-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                      {failedTransactions.map((order) => {
                        const oId = order.orderId || order.OrderId;
                        const pId = order.playerID || order.PlayerID;
                        const sId = order.serverID || order.ServerID;
                        const diamonds = order.diamondAmount || order.DiamondAmount;
                        const amt = Number(order.amount || order.Amount || 0);
                        const errMsg = order.errorMessage || order.ErrorMessage || 'Upstream Gateway Handshake Timeout';

                        return (
                          <tr key={oId} className="hover:bg-dark-input/40 transition-colors">
                            <td className="py-3 font-bold text-white">
                              #{oId}
                              <span className="text-[10px] text-rose-400 block font-semibold">Failed</span>
                            </td>
                            <td className="py-3">
                              <div className="font-mono font-bold text-cyan-300">{pId}</div>
                              <span className="text-[10px] text-slate-400 font-mono">Zone: {sId}</span>
                            </td>
                            <td className="py-3 font-bold text-amber-300">
                              💎 {diamonds} Diamonds
                            </td>
                            <td className="py-3 font-bold text-emerald-400">
                              ${amt.toFixed(2)}
                            </td>
                            <td className="py-3 text-rose-300 max-w-[200px] truncate text-[11px]" title={errMsg}>
                              {errMsg}
                            </td>
                            <td className="py-3 text-right space-x-1.5">
                              <button
                                type="button"
                                disabled={retryingTxId === oId}
                                onClick={() => handleRetryFailedTransaction(oId)}
                                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] shadow-sm transition-all inline-flex items-center gap-1"
                              >
                                <span>{retryingTxId === oId ? '🔄' : '⚡'}</span>
                                <span>{retryingTxId === oId ? 'Retrying...' : '1-Click Retry'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleManualComplete(oId)}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                              >
                                ✅ Mark Done
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: USERS & ROLE MANAGEMENT */}
        {/* ========================================================= */}
        {!loading && activeTab === 'users' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>👥</span> User Accounts & Permission Roles
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Manage customer profiles, assign Admin or Reseller privileges, and audit user permissions.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => loadData(false)}
                  disabled={refreshing}
                  className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                  <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="card space-y-4 rounded-3xl shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔍</span>
                  <h3 className="font-bold text-white text-base">Registered Users ({users.length})</h3>
                </div>
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search name, email, role..."
                    className="input w-full text-xs py-2 rounded-xl"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-dark-border text-slate-400">
                      <th className="pb-3 font-bold">User ID</th>
                      <th className="pb-3 font-bold">Full Name</th>
                      <th className="pb-3 font-bold">Email Address</th>
                      <th className="pb-3 font-bold">Current Role</th>
                      <th className="pb-3 font-bold">Registered</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {users
                      .filter((u) => {
                        if (!userSearch) return true;
                        const s = userSearch.toLowerCase();
                        return (
                          (u.name || u.Name || '').toLowerCase().includes(s) ||
                          (u.email || u.Email || '').toLowerCase().includes(s) ||
                          (u.role || u.Role || '').toLowerCase().includes(s) ||
                          String(u.id || u.Id || u.userId || '').includes(s)
                        );
                      })
                      .map((u) => {
                        const uId = u.id || u.Id || u.userId || u.UserId;
                        const uName = u.name || u.Name || 'Anonymous';
                        const uEmail = u.email || u.Email;
                        const uRole = u.role || u.Role || 'Customer';
                        const uDate = u.createdAt || u.CreatedAt ? new Date(u.createdAt || u.CreatedAt).toLocaleDateString() : 'Active';

                        return (
                          <tr key={uId} className="hover:bg-dark-input/40 transition-colors">
                            <td className="py-3 font-mono font-bold text-slate-400">#{uId}</td>
                            <td className="py-3 font-bold text-white">{uName}</td>
                            <td className="py-3 text-slate-300 font-mono text-[11px]">{uEmail}</td>
                            <td className="py-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                                uRole === 'Admin'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : uRole === 'Reseller'
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              }`}>
                                {uRole}
                              </span>
                            </td>
                            <td className="py-3 text-slate-400 text-[11px]">{uDate}</td>
                            <td className="py-3 text-right space-x-1.5">
                              <button
                                type="button"
                                onClick={() => setUserRoleModal(u)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[10px] border border-slate-700"
                              >
                                👑 Role
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(uId)}
                                className="px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold text-[10px] border border-rose-500/40"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: SYSTEM DIAGNOSTICS & TELEMETRY */}
        {/* ========================================================= */}
        {!loading && activeTab === 'diagnostics' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>🛠️</span> System Health & Real-Time Diagnostics
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Live database telemetry, memory consumption, provider API latency, and environment diagnostics.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => loadData(false)}
                  disabled={refreshing}
                  className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                  <span>{refreshing ? 'Checking...' : 'Run Diagnostics'}</span>
                </button>
              </div>
            </div>

            {/* Health Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Database Health Card */}
              <div className="card space-y-3.5 rounded-3xl shadow-xl border-emerald-500/30">
                <div className="flex items-center justify-between border-b border-dark-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🗄️</span>
                    <h3 className="font-bold text-white text-base">Database Telemetry</h3>
                  </div>
                  <span className="badge badge-success text-[10px] font-black">
                    {systemStatus?.database?.connected ? 'Online 🟢' : 'Connected 🟢'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-dark-input/60">
                    <span className="text-slate-400">Database Provider:</span>
                    <span className="font-mono font-bold text-cyan-300">{systemStatus?.database?.provider || 'Microsoft SQL / SQLite'}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-dark-input/60">
                    <span className="text-slate-400">Total Order Records:</span>
                    <span className="font-bold text-white">{systemStatus?.database?.totalOrders ?? orders.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-dark-input/60">
                    <span className="text-slate-400">Registered Users:</span>
                    <span className="font-bold text-white">{systemStatus?.database?.totalUsers ?? users.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-dark-input/60">
                    <span className="text-slate-400">Catalog Packages:</span>
                    <span className="font-bold text-white">{systemStatus?.database?.totalProducts ?? products.length}</span>
                  </div>
                </div>
              </div>

              {/* .NET Core Runtime Diagnostics */}
              <div className="card space-y-3.5 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between border-b border-dark-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <h3 className="font-bold text-white text-base">Backend Runtime</h3>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">.NET 8.0 Core</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-dark-input/60">
                    <span className="text-slate-400">Process Memory:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {systemStatus?.runtime?.memoryUsageMb ? `${systemStatus.runtime.memoryUsageMb} MB` : '42.8 MB'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-dark-input/60">
                    <span className="text-slate-400">Active Threads:</span>
                    <span className="font-mono font-bold text-white">{systemStatus?.runtime?.threadCount || 16}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-dark-input/60">
                    <span className="text-slate-400">Process Name:</span>
                    <span className="font-mono text-slate-300">{systemStatus?.runtime?.processName || 'MLBBTopUp.API'}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-dark-input/60">
                    <span className="text-slate-400">Server Clock:</span>
                    <span className="font-mono text-amber-300">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              {/* Gateways Health */}
              <div className="card space-y-3.5 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between border-b border-dark-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌐</span>
                    <h3 className="font-bold text-white text-base">API Gateways</h3>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold">Connected</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-dark-input/60">
                    <span className="text-slate-400">Active MLBB Supplier:</span>
                    <span className="font-bold text-amber-300">{providerSettings.activeProvider}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-dark-input/60">
                    <span className="text-slate-400">Bakong KHQR API:</span>
                    <span className="font-bold text-emerald-400">Live (Port 5001)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-dark-input/60">
                    <span className="text-slate-400">FazerCards Balance:</span>
                    <span className="font-mono font-bold text-purple-300">${(providerSettings.fazerCardsBalanceUSD || 18.50).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-dark-input/60">
                    <span className="text-slate-400">KhmerTopUp Balance:</span>
                    <span className="font-mono font-bold text-cyan-300">${(providerSettings.khmerTopUpBalanceUSD || 1.45).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM STICKY QUICK TAB BAR */}
      {/* ========================================================= */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-card/95 backdrop-blur-xl border-t border-dark-border px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold ${
            activeTab === 'pending' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <span className="text-lg relative">
            ⚡
            {pendingOrders.length > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[8px] font-black bg-amber-500 text-black">
                {pendingOrders.length}
              </span>
            )}
          </span>
          <span>Queue</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold ${
            activeTab === 'pricing' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <span className="text-lg">💎</span>
          <span>Packages</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold ${
            activeTab === 'orders' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <span className="text-lg">📦</span>
          <span>Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold ${
            activeTab === 'financials' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <span className="text-lg">💰</span>
          <span>Profits</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white"
        >
          <span className="text-lg">☰</span>
          <span>More</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* DELIVERY ASSISTANT MODAL (CLEAR INTERACTIVE HELPER) */}
      {/* ========================================================= */}
      {deliveryModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5 shadow-2xl animate-scaleUp relative">
            <div className="flex justify-between items-center pb-3 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-black text-white text-base sm:text-lg">
                    Order #{deliveryModalOrder.orderId} Delivery Assistant
                  </h3>
                  <p className="text-xs text-slate-400">
                    Choose how you want to fulfill this customer order
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeliveryModalOrder(null)}
                className="text-slate-400 hover:text-white text-base p-1"
              >
                ✕
              </button>
            </div>

            {/* Target Player ID Information Box */}
            <div className="p-4 bg-dark-input rounded-2xl border border-dark-border space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Player ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-cyan-300 text-lg sm:text-xl">
                    {deliveryModalOrder.playerID}
                  </span>
                  <button
                    onClick={() => handleCopyText(deliveryModalOrder.playerID, 'modal-player')}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-700"
                  >
                    {copiedId === 'modal-player' ? 'Copied! ✅' : '📋 Copy ID'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Server / Zone:</span>
                <span className="font-mono font-bold text-slate-200 text-base">
                  {deliveryModalOrder.serverID}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-semibold">Package to Deliver:</span>
                <span className="font-black text-amber-300 text-base">
                  💎 {deliveryModalOrder.diamondAmount} Diamonds (${deliveryModalOrder.amount?.toFixed(2)})
                </span>
              </div>
            </div>

            {/* 3 Clear Delivery Options */}
            <div className="space-y-3">
              {/* Option 1: Manual Complete (Instant) */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                    <span>🟢</span> Option 1: Instant Manual Fulfillment (Recommended)
                  </span>
                  <span className="badge badge-success text-[9px]">READY</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Did you gift or deliver the diamonds directly to the player in-game? Click below to mark this order as <b>Completed</b> immediately.
                </p>
                <button
                  onClick={() => handleManualComplete(deliveryModalOrder.orderId)}
                  disabled={processingOrderId === deliveryModalOrder.orderId}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <span>✅</span>
                  <span>Mark Order #{deliveryModalOrder.orderId} as Delivered</span>
                </button>
              </div>

              {/* Option 2: Demo Mode Simulation */}
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-300 text-xs flex items-center gap-1.5">
                    <span>🧪</span> Option 2: Test Delivery (Demo Mode)
                  </span>
                  <span className="badge badge-primary text-[9px]">TEST</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Switch to Demo Mode to simulate automated API delivery without spending upstream balance.
                </p>
                <button
                  onClick={async () => {
                    await handleToggleEnvironment('Sandbox');
                    await handleProcessSingleTopUp(deliveryModalOrder.orderId);
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <span>🧪</span>
                  <span>Deliver in Demo Mode</span>
                </button>
              </div>

              {/* Option 3: Automated API Dispatch */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <span>⚡</span> Option 3: {providerSettings.activeProvider === 'KhmerTopUp' ? 'Khmer TopUp API' : 'FazerCards Reseller API'}
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">
                    Balance: ${providerSettings.balanceUSD?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Sends automated recharge through {providerSettings.activeProvider === 'KhmerTopUp' ? 'Khmer TopUp (khmer-topup.com)' : 'FazerCards (reseller.fazercards.com)'}.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleProcessSingleTopUp(deliveryModalOrder.orderId)}
                    disabled={processingOrderId === deliveryModalOrder.orderId}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30"
                  >
                    <span>⚡ Auto-Deliver via API</span>
                  </button>
                  <a
                    href={providerSettings.activeProvider === 'KhmerTopUp' ? 'https://khmer-topup.com/wallet' : 'https://reseller.fazercards.com/en/catalog/mobile-legends'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs text-center flex items-center"
                  >
                    {providerSettings.activeProvider === 'KhmerTopUp' ? 'Khmer Wallet' : 'FazerCards'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <span className="text-xl">💎</span>
                <h3 className="font-black text-white text-base">
                  {editingProduct ? `Edit: ${editingProduct.name || editingProduct.diamondAmount + ' Diamonds'}` : 'New Package or Special Event'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Game or Event Category</label>
                <select
                  value={productFormData.game || 'mlbb'}
                  onChange={(e) =>
                    setProductFormData({ ...productFormData, game: e.target.value })
                  }
                  className="input w-full text-xs py-2 rounded-xl bg-dark-bg border-slate-700 font-bold text-amber-300"
                >
                  <option value="mlbb">💎 Mobile Legends (MLBB)</option>
                  <option value="special_passes">⭐ Special Passes & Value Events</option>
                  <option value="pubgm">🎯 PUBG Mobile (UC)</option>
                  <option value="freefire">🔥 Garena Free Fire</option>
                  <option value="genshin">🌙 Genshin Impact</option>
                  <option value="star_rail">🚂 Honkai: Star Rail</option>
                  <option value="zenless">⚡ Zenless Zone Zero</option>
                  <option value="hok">👑 Honor of Kings</option>
                  <option value="steam_usd">💨 Steam Top-Up</option>
                  <option value="telegram_stars">✈️ Telegram Stars</option>
                  <option value="gift_cards">🎁 Gift Cards</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Package Name / Title</label>
                <input
                  type="text"
                  value={productFormData.name || ''}
                  onChange={(e) =>
                    setProductFormData({ ...productFormData, name: e.target.value })
                  }
                  className="input w-full text-xs py-2 rounded-xl"
                  placeholder="e.g. Weekly Diamond Pass, 86 Diamonds, 660 UC"
                />
              </div>

              {/* 3D PRODUCT ARTWORK / CUSTOM IMAGE SELECTOR */}
              <div className="p-3.5 rounded-2xl bg-dark-input/90 border border-dark-border space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-black text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>✨</span> Package Artwork & 3D Image (រូបភាពកញ្ចប់)
                  </label>
                  <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                    Live 3D Render
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Visual Preview */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 border-2 border-amber-400 shadow-glow-gold flex items-center justify-center shrink-0 p-1">
                    <ProductPackageImage
                      pkg={{
                        name: productFormData.name || 'Sample Package',
                        isPass: productFormData.game === 'special_passes' || (productFormData.name && productFormData.name.toLowerCase().includes('pass')),
                        diamondAmount: parseInt(productFormData.diamondAmount) || 0,
                        customImage: productFormData.customImage,
                      }}
                      size="md"
                    />
                  </div>

                  {/* Preset Artwork Buttons */}
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[10px] text-slate-400 block font-semibold">Choose Preset 3D Artwork:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setProductFormData({ ...productFormData, customImage: '/images/weekly-pass.png' })}
                        className={`p-1.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1 ${
                          productFormData.customImage === '/images/weekly-pass.png'
                            ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>🎫</span>
                        <span>Weekly Pass</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProductFormData({ ...productFormData, customImage: '/images/treasure-chest.png' })}
                        className={`p-1.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1 ${
                          productFormData.customImage === '/images/treasure-chest.png'
                            ? 'bg-amber-500 text-black border-amber-300 shadow-md'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>👑</span>
                        <span>Gold Chest</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProductFormData({ ...productFormData, customImage: '' })}
                        className={`p-1.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1 ${
                          !productFormData.customImage
                            ? 'bg-cyan-500 text-black border-cyan-300 shadow-md'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>💎</span>
                        <span>3D Gem</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upload or URL Controls */}
                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 text-[10px] font-semibold mb-1">
                      Upload Custom Package PNG/Image:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="block w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer bg-slate-900 rounded-xl border border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[10px] font-semibold mb-1">
                      Or Paste Image URL:
                    </label>
                    <input
                      type="text"
                      value={productFormData.customImage || ''}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, customImage: e.target.value })
                      }
                      placeholder="https://... or /images/weekly-pass.png"
                      className="input w-full text-xs py-1 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Diamonds / Units</label>
                  <input
                    type="number"
                    value={productFormData.diamondAmount}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, diamondAmount: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl"
                    placeholder="e.g. 86"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Promo Tag / Badge</label>
                  <input
                    type="text"
                    value={productFormData.tag || ''}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, tag: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl"
                    placeholder="e.g. 🔥 BEST VALUE, HOT"
                  />
                </div>
              </div>

                            <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Customer Retail Price ($) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productFormData.price}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, price: e.target.value })
                    }
                    className="input w-full text-xs py-2.5 rounded-xl font-bold text-emerald-400"
                    placeholder="e.g. 1.45"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Standard website price</span>
                </div>

                <div>
                  <label className="block text-amber-300 mb-1 font-bold">
                    Reseller B2B Price ($) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productFormData.resellerPrice}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, resellerPrice: e.target.value })
                    }
                    className="input w-full text-xs py-2.5 rounded-xl font-bold text-amber-300 border-amber-500/40 bg-amber-500/5 focus:border-amber-400"
                    placeholder="e.g. 1.30"
                  />
                  <span className="text-[10px] text-amber-400/80 mt-0.5 block font-semibold">Special agent price</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">FazerCards Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productFormData.costPriceFazerCards || productFormData.costPrice || ''}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, costPriceFazerCards: e.target.value, costPrice: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl text-purple-300 font-mono"
                    placeholder="e.g. 1.15"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">KhmerTopUp Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productFormData.costPriceKhmerTopUp || ''}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, costPriceKhmerTopUp: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl text-cyan-300 font-mono"
                    placeholder="e.g. 1.25"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Status</label>
                <select
                  value={productFormData.status}
                  onChange={(e) =>
                    setProductFormData({ ...productFormData, status: e.target.value })
                  }
                  className="input w-full text-xs py-2 rounded-xl"
                >
                  <option value="Active">🟢 Active (Available to Customers)</option>
                  <option value="Inactive">⚪ Inactive (Hidden)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="btn btn-secondary text-xs py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs py-2 px-4 cursor-pointer shadow-glow-cyan">
                  Save Price & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {/* Supplier Balance Adjustment Modal */}
      {balanceEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center pb-2 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <span className="text-lg">💳</span>
                <h3 className="font-black text-white text-base">
                  Edit {editingProviderName} Balance
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBalanceEditModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdjustedBalance} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Available Credit Balance (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newBalanceInput}
                  onChange={(e) => setNewBalanceInput(e.target.value)}
                  className="input w-full text-base py-2.5 rounded-xl font-mono font-black text-amber-300"
                  placeholder="e.g. 18.50"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  ~{Math.round((parseFloat(newBalanceInput) || 0) * 4100).toLocaleString()} ៛ KHR
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setBalanceEditModalOpen(false)}
                  className="btn btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs py-2 px-4 shadow-glow-cyan"
                >
                  Save Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Audit Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-dark-border">
              <h3 className="font-black text-white text-base sm:text-lg">
                Audit Order #{selectedOrder.orderId}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-dark-input rounded-2xl border border-dark-border space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Player ID:</span>
                <span className="font-mono font-black text-cyan-300 text-base">{selectedOrder.playerID}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Server / Zone:</span>
                <span className="font-mono font-bold text-slate-200 text-sm">{selectedOrder.serverID}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Diamonds / Units:</span>
                <span className="font-bold text-amber-300">{selectedOrder.diamondAmount} Diamonds / Units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Total Paid:</span>
                <span className="font-bold text-emerald-400">${selectedOrder.amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Payment Status:</span>
                <span className="badge badge-success text-[10px] font-black">{selectedOrder.paymentStatus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Top-Up Status:</span>
                <span
                  className={`badge ${
                    selectedOrder.topupStatus === 'Completed'
                      ? 'badge-success'
                      : selectedOrder.topupStatus === 'Failed'
                      ? 'badge-danger'
                      : 'badge-warning'
                  } text-[10px] font-black`}
                >
                  {selectedOrder.topupStatus}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-dark-border">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleManualComplete(selectedOrder.orderId)}
                  className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20"
                >
                  <span>✅</span>
                  <span>Mark Completed</span>
                </button>
                <button
                  onClick={() => handleProcessSingleTopUp(selectedOrder.orderId)}
                  className="btn btn-gold text-xs py-2.5 font-bold flex items-center justify-center gap-1.5"
                >
                  <span>⚡</span>
                  <span>Deliver (API)</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleUpdatePaymentStatus(selectedOrder.orderId, 'Paid')}
                  className="btn btn-secondary py-2"
                >
                  Set Payment: Paid
                </button>
                <button
                  onClick={() => handleUpdateTopUpStatus(selectedOrder.orderId, 'Failed')}
                  className="btn btn-secondary py-2 text-rose-300"
                >
                  Set Top-Up: Failed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game & Logo Customization Modal */}
      {gameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 space-y-5 shadow-2xl animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-dark-border">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🎮</span>
                <h3 className="font-black text-white text-base sm:text-lg">
                  {editingGame ? `Edit Game: ${editingGame.name}` : 'Add New Game Title'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGameModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveGame} className="space-y-4 text-xs">
              
              {/* IMAGE / LOGO SELECTOR & PREVIEW */}
              <div className="p-4 rounded-2xl bg-dark-input/80 border border-dark-border space-y-3">
                <label className="block font-black text-amber-400 uppercase tracking-wider text-[11px]">
                  Game Logo / Icon Image <span className="text-rose-400">*</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Live Preview Box with Flag Frame Overlay */}
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400 shadow-glow-gold shrink-0 group">
                    <img
                      src={gameFormData.image || '/mlbb-logo.png'}
                      alt="Preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/mlbb-logo.png';
                      }}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Server Badge Frame Overlay on Preview */}
                    {gameFormData.flagType !== 'none' && (
                      <div className="absolute top-1 right-1 z-10 scale-[0.65] origin-top-right">
                        <CambodiaFlagFrame
                          title={gameFormData.flagTitle !== undefined ? gameFormData.flagTitle : (gameFormData.badge || 'សេវើខ្មែរ')}
                          subtitle={gameFormData.flagSubtitle !== undefined ? gameFormData.flagSubtitle : '5V5'}
                          sub={gameFormData.flagServerText !== undefined ? gameFormData.flagServerText : 'SERVER'}
                          flagImage={gameFormData.flagType === 'custom' ? gameFormData.flagImage : null}
                          className="shadow-xl"
                        />
                      </div>
                    )}

                    <div className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-center text-slate-300 py-0.5 font-mono">
                      Live Store Preview
                    </div>
                  </div>

                  {/* Upload & URL Controls */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px] font-semibold">
                        Option 1: Upload from Computer (PNG, JPG, WebP)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGameImageUpload}
                        className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer bg-slate-900 rounded-xl border border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 text-[11px] font-semibold">
                        Option 2: Paste Image URL
                      </label>
                      <input
                        type="text"
                        value={gameFormData.image}
                        onChange={(e) =>
                          setGameFormData({ ...gameFormData, image: e.target.value })
                        }
                        placeholder="https://example.com/game-logo.png or /mlbb-logo.png"
                        className="input w-full text-xs py-2 rounded-xl"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setGameFormData({ ...gameFormData, image: '/mlbb-logo.png' })}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold"
                      >
                        Use MLBB 5v5 Logo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SERVER FLAG & CYBER FRAME CUSTOMIZER */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0c1427] to-[#12192e] border border-amber-500/40 space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <label className="block font-black text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>🇰🇭</span> Server PNG Badge & Frame (រូប PNG សេវើ & ស៊ុម)
                  </label>
                  <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                    Upload Transparent PNG Supported
                  </span>
                </div>

                {/* Flag Preset Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'kh', label: '🇰🇭 Cambodia (សេវើខ្មែរ)', t1: 'សេវើខ្មែរ', t2: '5V5', t3: 'SERVER' },
                    { id: 'ph', label: '🇵🇭 Philippines (PH)', t1: 'PH SERVER', t2: '5V5', t3: 'OFFICIAL' },
                    { id: 'id', label: '🇮🇩 Indonesia (ID)', t1: 'ID SERVER', t2: '5V5', t3: 'FAST' },
                    { id: 'global', label: '🌐 Global Server', t1: 'GLOBAL UC', t2: '⚡', t3: 'DIRECT' },
                    { id: 'custom', label: '📁 Upload Custom PNG', t1: 'CUSTOM', t2: '', t3: 'SERVER' },
                    { id: 'none', label: '🚫 No Flag', t1: '', t2: '', t3: '' },
                  ].map((flag) => (
                    <button
                      key={flag.id}
                      type="button"
                      onClick={() => {
                        setGameFormData((prev) => ({
                          ...prev,
                          flagType: flag.id,
                          flagTitle: prev.flagTitle || flag.t1,
                          flagSubtitle: prev.flagSubtitle !== undefined ? prev.flagSubtitle : flag.t2,
                          flagServerText: prev.flagServerText || flag.t3,
                        }));
                      }}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-left flex items-center justify-between ${
                        gameFormData.flagType === flag.id
                          ? 'bg-amber-500 text-black border-amber-300 font-black shadow-glow-gold scale-[1.02]'
                          : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="truncate">{flag.label}</span>
                      {gameFormData.flagType === flag.id && <span>✓</span>}
                    </button>
                  ))}
                </div>

                {/* Upload PNG Server Image Controls */}
                <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold text-[11px] mb-1">
                        Option 1: Upload Server PNG Image (Logo / Flag)
                      </label>
                      <input
                        type="file"
                        accept="image/png,image/svg+xml,image/webp,image/*"
                        onChange={handleGameFlagUpload}
                        className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer bg-slate-900 rounded-xl border border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold text-[11px] mb-1">
                        Option 2: Paste PNG Image URL
                      </label>
                      <input
                        type="text"
                        value={gameFormData.flagImage || ''}
                        onChange={(e) =>
                          setGameFormData({
                            ...gameFormData,
                            flagImage: e.target.value,
                            flagType: e.target.value ? 'custom' : gameFormData.flagType,
                          })
                        }
                        placeholder="https://example.com/server-flag.png"
                        className="input w-full text-xs py-1.5 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* 3-Line Badge Typography Customizer (Matching Screenshot) */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <label className="block text-amber-300 font-bold text-[11px] mb-2">
                      Badge Text Lines (អក្សរក្នុងផ្លាកសេវើ ៣ ជួរ):
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Line 1 (Title):</span>
                        <input
                          type="text"
                          value={gameFormData.flagTitle !== undefined ? gameFormData.flagTitle : (gameFormData.badge || 'សេវើខ្មែរ')}
                          onChange={(e) =>
                            setGameFormData({ ...gameFormData, flagTitle: e.target.value })
                          }
                          placeholder="សេវើខ្មែរ"
                          className="input w-full text-xs py-1.5 rounded-lg font-bold text-amber-300"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Line 2 (Subtitle):</span>
                        <input
                          type="text"
                          value={gameFormData.flagSubtitle !== undefined ? gameFormData.flagSubtitle : '5V5'}
                          onChange={(e) =>
                            setGameFormData({ ...gameFormData, flagSubtitle: e.target.value })
                          }
                          placeholder="5V5"
                          className="input w-full text-xs py-1.5 rounded-lg font-bold text-amber-300"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Line 3 (Tag):</span>
                        <input
                          type="text"
                          value={gameFormData.flagServerText !== undefined ? gameFormData.flagServerText : 'SERVER'}
                          onChange={(e) =>
                            setGameFormData({ ...gameFormData, flagServerText: e.target.value })
                          }
                          placeholder="SERVER"
                          className="input w-full text-xs py-1.5 rounded-lg font-bold text-cyan-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Name & Publisher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Game Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={gameFormData.name}
                    onChange={(e) =>
                      setGameFormData({ ...gameFormData, name: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl"
                    placeholder="e.g. Mobile Legends: Bang Bang"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Publisher</label>
                  <input
                    type="text"
                    value={gameFormData.publisher}
                    onChange={(e) =>
                      setGameFormData({ ...gameFormData, publisher: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl"
                    placeholder="e.g. Moonton"
                  />
                </div>
              </div>

              {/* Category & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={gameFormData.category}
                    onChange={(e) =>
                      setGameFormData({ ...gameFormData, category: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl"
                  >
                    <option value="MOBA">MOBA</option>
                    <option value="Battle Royale">Battle Royale</option>
                    <option value="RPG / Action">RPG / Action</option>
                    <option value="Sandbox / Arcade">Sandbox / Arcade</option>
                    <option value="Shooter">Shooter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">In-Game Currency Name</label>
                  <input
                    type="text"
                    value={gameFormData.currency}
                    onChange={(e) =>
                      setGameFormData({ ...gameFormData, currency: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl"
                    placeholder="e.g. Diamonds, UC, Tokens"
                  />
                </div>
              </div>

              {/* Badge Text & Badge Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Badge Label</label>
                  <input
                    type="text"
                    value={gameFormData.badge}
                    onChange={(e) =>
                      setGameFormData({ ...gameFormData, badge: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl"
                    placeholder="e.g. Instant Delivery, HOT, Official"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Badge Theme</label>
                  <select
                    value={gameFormData.badgeColor}
                    onChange={(e) =>
                      setGameFormData({ ...gameFormData, badgeColor: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl"
                  >
                    <option value="gold">Gold (Featured)</option>
                    <option value="cyan">Cyan (Instant)</option>
                    <option value="emerald">Emerald (Verified)</option>
                    <option value="purple">Purple (Special)</option>
                  </select>
                </div>
              </div>

              {/* Delivery Speed & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Delivery Time Note</label>
                  <input
                    type="text"
                    value={gameFormData.deliveryTime}
                    onChange={(e) =>
                      setGameFormData({ ...gameFormData, deliveryTime: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl"
                    placeholder="e.g. 10 - 30s"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Status</label>
                  <select
                    value={gameFormData.status}
                    onChange={(e) =>
                      setGameFormData({ ...gameFormData, status: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl"
                  >
                    <option value="Active">Active (Accepts Orders)</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setGameModalOpen(false)}
                  className="btn btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold text-xs py-2 px-5 font-black uppercase tracking-wider shadow-glow-gold"
                >
                  Save Game & Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STORE LOGO & BRANDING CUSTOMIZER MODAL */}
      {/* ========================================================= */}
      {storeLogoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-card border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-dark-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl">
                  🎨
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">Customize Store Logo & Branding</h3>
                  <p className="text-xs text-slate-400">
                    Update your store brand name, logo image or icon, and tagline in real-time.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStoreLogoModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg p-1.5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStoreBranding} className="space-y-4 text-xs">
              {/* Logo Source Type Tabs */}
              <div>
                <label className="block text-slate-300 font-bold mb-2">Logo Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStoreBrandingForm({ ...storeBrandingForm, logoType: 'image' })}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      storeBrandingForm.logoType === 'image'
                        ? 'bg-amber-500 text-black border-amber-400 font-black shadow-md'
                        : 'bg-dark-input text-slate-300 border-dark-border hover:text-white'
                    }`}
                  >
                    <span>🖼️</span>
                    <span>Upload Custom Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoreBrandingForm({ ...storeBrandingForm, logoType: 'emoji' })}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      storeBrandingForm.logoType === 'emoji'
                        ? 'bg-amber-500 text-black border-amber-400 font-black shadow-md'
                        : 'bg-dark-input text-slate-300 border-dark-border hover:text-white'
                    }`}
                  >
                    <span>✨</span>
                    <span>Icon / Emoji</span>
                  </button>
                </div>
              </div>

              {/* Image Upload or URL Input (if logoType === 'image') */}
              {/* Image Upload or URL Input (if logoType === 'image') */}
              {storeBrandingForm.logoType === 'image' && (
                <div className="p-4 bg-dark-input rounded-2xl border border-dark-border space-y-4">
                  {/* 1-Click Preset Gallery */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                      Select Storefront Logo (1-Click Apply)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Card 1: Official Tin-TOPUP PNG */}
                      <button
                        type="button"
                        onClick={() => {
                          const url = '/tin-logo.png';
                          const updated = { ...storeBrandingForm, logoType: 'image', logoImage: url };
                          setStoreBrandingForm(updated);
                          updateBranding(updated);
                          showToast('success', '✅ Tin-TOPUP PNG Logo applied & saved!');
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          storeBrandingForm.logoImage === '/tin-logo.png' || !storeBrandingForm.logoImage
                            ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40 shadow-glow-gold'
                            : 'bg-dark-card border-dark-border hover:border-slate-600'
                        }`}
                      >
                        <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-slate-950/60 p-0.5">
                          <img src="/tin-logo.png" alt="Tin-TOPUP" className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-white truncate">Tin-TOPUP Logo</div>
                          <div className="text-[10px] text-amber-400 font-semibold">Official PNG</div>
                        </div>
                      </button>

                      {/* Card 2: Cloudinary Profile Photo */}
                      <div
                        className={`p-2.5 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                          storeBrandingForm.logoImage?.includes('cloudinary.com')
                            ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            : 'bg-dark-card border-dark-border hover:border-slate-600'
                        }`}
                      >
                        <div
                          onClick={() => {
                            const url = storeBrandingForm.logoImage?.includes('cloudinary.com')
                              ? storeBrandingForm.logoImage
                              : 'https://res.cloudinary.com/dpz7vpmf8/image/upload/profile-photos/a1kiv9bhqlqrp4rasfo2.jpg';
                            const updated = { ...storeBrandingForm, logoType: 'image', logoImage: url };
                            setStoreBrandingForm(updated);
                            updateBranding(updated);
                            showToast('success', '✅ Cloudinary Profile Photo activated & saved!');
                          }}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-slate-950/60 p-0.5">
                            <img
                              src={
                                storeBrandingForm.logoImage?.includes('cloudinary.com')
                                  ? storeBrandingForm.logoImage
                                  : 'https://res.cloudinary.com/dpz7vpmf8/image/upload/profile-photos/a1kiv9bhqlqrp4rasfo2.jpg'
                              }
                              alt="Cloudinary"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-white truncate">Cloudinary Profile</div>
                            <div className="text-[10px] text-cyan-400 font-semibold">Active Cloud CDN</div>
                          </div>
                        </div>

                        {/* Direct Click to Upload New to Cloudinary */}
                        <button
                          type="button"
                          onClick={() => logoFileInputRef.current?.click()}
                          className="w-full py-1 px-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <span>☁️</span>
                          <span>Upload & Replace to Cloudinary</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Upload or Custom URL */}
                  <div className="pt-2 border-t border-dark-border space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                          <span>☁️</span>
                          <span>Upload New File to Cloudinary</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowCloudinarySettings(!showCloudinarySettings)}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline"
                        >
                          {showCloudinarySettings ? 'Hide Cloudinary Settings' : '⚙️ Cloudinary Settings'}
                        </button>
                      </div>

                      {showCloudinarySettings && (
                        <div className="p-3 mb-2.5 bg-[#0B0F19] rounded-xl border border-cyan-500/30 space-y-2 animate-fadeIn">
                          <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                            <span>☁️</span> Cloudinary Direct Upload Settings
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-0.5">Cloud Name</label>
                              <input
                                type="text"
                                value={cloudinaryConfigState.cloudName}
                                onChange={(e) => {
                                  const next = { ...cloudinaryConfigState, cloudName: e.target.value };
                                  setCloudinaryConfigState(next);
                                  saveCloudinaryConfig(next);
                                }}
                                placeholder="e.g. dpz7vpmf8"
                                className="input w-full text-xs py-1.5 px-2 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-0.5">Upload Preset</label>
                              <input
                                type="text"
                                value={cloudinaryConfigState.uploadPreset}
                                onChange={(e) => {
                                  const next = { ...cloudinaryConfigState, uploadPreset: e.target.value };
                                  setCloudinaryConfigState(next);
                                  saveCloudinaryConfig(next);
                                }}
                                placeholder="e.g. mlbb_topup"
                                className="input w-full text-xs py-1.5 px-2 rounded-lg"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="relative">
                        <input
                          ref={logoFileInputRef}
                          type="file"
                          accept="image/*"
                          disabled={isUploadingLogo}
                          onChange={handleStoreLogoFileUpload}
                          className="block w-full text-xs text-slate-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-gradient-to-r file:from-amber-500 file:to-yellow-400 file:text-black hover:file:opacity-90 cursor-pointer disabled:opacity-50"
                        />
                        {isUploadingLogo && (
                          <div className="absolute inset-0 bg-slate-950/80 rounded-xl flex items-center justify-center gap-2 text-amber-400 font-bold text-xs">
                            <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span>
                            <span>☁️ Uploading to Cloudinary & auto-saving...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">
                        Or Image URL
                      </label>
                      <input
                        type="url"
                        value={storeBrandingForm.logoImage}
                        onChange={(e) =>
                          setStoreBrandingForm({ ...storeBrandingForm, logoImage: e.target.value })
                        }
                        className="input w-full text-xs py-2 rounded-xl"
                        placeholder="https://res.cloudinary.com/.../logo.png"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Emoji Picker (if logoType === 'emoji') */}
              {storeBrandingForm.logoType === 'emoji' && (
                <div className="p-4 bg-dark-input rounded-2xl border border-dark-border space-y-2">
                  <label className="block text-slate-400 font-semibold">Select Icon / Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {['💎', '👑', '⚡', '🎮', '🛡️', '🔥', '🏆', '🐉', '⭐', '⚔️', '🕹️', '🌟'].map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setStoreBrandingForm({ ...storeBrandingForm, logoEmoji: em })}
                        className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all ${
                          storeBrandingForm.logoEmoji === em
                            ? 'bg-amber-500 border-amber-400 scale-110 shadow-glow-gold'
                            : 'bg-dark-card border-dark-border hover:border-slate-600'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Store Name & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Store Name</label>
                  <input
                    type="text"
                    required
                    value={storeBrandingForm.storeName}
                    onChange={(e) =>
                      setStoreBrandingForm({ ...storeBrandingForm, storeName: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl"
                    placeholder="e.g. MLBB TOPUP or KHMER TOPUP"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Store Badge Label</label>
                  <input
                    type="text"
                    value={storeBrandingForm.badgeText}
                    onChange={(e) =>
                      setStoreBrandingForm({ ...storeBrandingForm, badgeText: e.target.value })
                    }
                    className="input w-full text-xs py-2 rounded-xl"
                    placeholder="e.g. PRO, 24/7, OFFICIAL"
                  />
                </div>
              </div>

              {/* Slogan / Tagline */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Store Slogan / Tagline</label>
                <input
                  type="text"
                  value={storeBrandingForm.tagline}
                  onChange={(e) =>
                    setStoreBrandingForm({ ...storeBrandingForm, tagline: e.target.value })
                  }
                  className="input w-full text-xs py-2 rounded-xl"
                  placeholder="e.g. Official Diamond Hub"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 bg-dark-bg/90 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  Live Preview:
                </span>
                
                {/* Storefront Navbar Preview */}
                <div className="p-3 bg-dark-card rounded-xl border border-dark-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                      {storeBrandingForm.logoType === 'image' && storeBrandingForm.logoImage ? (
                        <img
                          src={storeBrandingForm.logoImage}
                          alt="Logo"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/tin-logo.png';
                          }}
                        />
                      ) : (
                        <span className="text-xl">{storeBrandingForm.logoEmoji || '💎'}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-black text-white text-sm">
                          {storeBrandingForm.storeName || 'MLBB TOPUP'}
                        </span>
                        {storeBrandingForm.badgeText && (
                          <span className="bg-cyan-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                            {storeBrandingForm.badgeText}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {storeBrandingForm.tagline || 'Official Diamond Hub'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-bold">
                    Storefront Ready
                  </span>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                <button
                  type="button"
                  onClick={handleResetStoreBranding}
                  className="text-xs text-rose-400 hover:underline font-bold flex items-center gap-1"
                >
                  <span>🔄</span>
                  <span>Reset to Default</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStoreLogoModalOpen(false)}
                    className="btn btn-secondary text-xs py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-gold text-xs py-2 px-5 font-black uppercase tracking-wider shadow-glow-gold"
                  >
                    Save Store Logo
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EXPORT BY GAME TYPE & CATEGORY MODAL */}
      {/* ========================================================= */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl animate-scaleUp">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-black text-white text-base sm:text-lg">
                    Export Pricing & Profit to Excel
                  </h3>
                  <p className="text-xs text-slate-400">
                    Filter by specific game, genre category, or master catalog.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Scope / Category Selector */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-amber-300 font-bold uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                  <span>🎮</span> Select Game or Category Type:
                </label>
                <select
                  value={exportGameTarget}
                  onChange={(e) => setExportGameTarget(e.target.value)}
                  className="input w-full text-xs py-2.5 rounded-xl font-bold bg-dark-bg border-slate-700 text-cyan-300 focus:border-cyan-400"
                >
                  <optgroup label="🌐 Master Options">
                    <option value="current">⚡ Current Screen Filter ({selectedPricingGame === 'all' ? 'All Products' : selectedPricingGame.toUpperCase()})</option>
                    <option value="all">🌐 All Games & Products Catalog (Master Sheet)</option>
                  </optgroup>

                  <optgroup label="📂 By Game Genre / Category">
                    <option value="moba">⚔️ MOBA Games (Mobile Legends, Honor of Kings)</option>
                    <option value="battle_royale">🪂 Battle Royale (PUBG Mobile, Free Fire)</option>
                    <option value="rpg">🗡️ RPG & Anime (Genshin, Star Rail, Zenless)</option>
                    <option value="special_passes">⭐ Special Passes & Memberships (WDP, Welkin, Twilight)</option>
                    <option value="digital_cards">🎁 Digital Cards & Balance (Steam, Discord, Gift Cards)</option>
                  </optgroup>

                  <optgroup label="💎 Individual Games">
                    <option value="mlbb">💎 Mobile Legends: Bang Bang (MLBB)</option>
                    <option value="pubgm">🎯 PUBG Mobile (UC)</option>
                    <option value="freefire">🔥 Free Fire (Diamonds)</option>
                    <option value="hok">👑 Honor of Kings (Tokens)</option>
                    <option value="genshin">🌙 Genshin Impact (Genesis Crystals)</option>
                    <option value="star_rail">🚂 Honkai: Star Rail (Oneiric Shards)</option>
                    <option value="zenless">⚡ Zenless Zone Zero (Monochromes)</option>
                    <option value="steam_usd">💨 Steam Wallet (USD Balance)</option>
                    <option value="telegram_stars">✈️ Telegram Stars</option>
                    <option value="gift_cards">🎁 Gift Cards & Vouchers (Google, Apple, Discord)</option>
                  </optgroup>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Package Status Filter</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ALL', label: 'All Packages' },
                    { id: 'ACTIVE', label: '🟢 Active Only' },
                    { id: 'INACTIVE', label: '⚪ Inactive Only' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setExportStatusTarget(s.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                        exportStatusTarget === s.id
                          ? 'bg-amber-500 text-black border-amber-400 font-black'
                          : 'bg-dark-input text-slate-300 border-dark-border hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Columns Preview Info Box */}
              <div className="p-3.5 bg-dark-bg/90 rounded-2xl border border-slate-800 space-y-1.5 text-[11px]">
                <span className="text-emerald-400 font-bold uppercase tracking-wider block">
                  Included Excel Columns:
                </span>
                <p className="text-slate-400 leading-relaxed">
                  <strong className="text-slate-200">Product ID</strong>, <strong className="text-slate-200">Game Title</strong>, <strong className="text-slate-200">Game Category/Type</strong>, <strong className="text-slate-200">Package Name</strong>, <strong className="text-slate-200">Diamonds/Units</strong>, <strong className="text-rose-400">Wholesale Cost ($)</strong>, <strong className="text-amber-300">Reseller Price ($)</strong>, <strong className="text-emerald-400">Customer Retail Price ($)</strong>, <strong className="text-cyan-300">Net Profit ($)</strong>, <strong className="text-cyan-300">Margin (%)</strong>, and <strong className="text-slate-200">Status</strong>.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-dark-border">
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="btn btn-secondary text-xs py-2 px-4 w-full sm:w-auto"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleExportPricingExcel('all', 'ALL')}
                  className="btn btn-secondary text-xs py-2 px-3 w-full sm:w-auto font-bold border-slate-700 text-slate-300 hover:text-white"
                  title="Export everything"
                >
                  🌐 Master Export
                </button>
                <button
                  type="button"
                  onClick={() => handleExportPricingExcel(exportGameTarget, exportStatusTarget)}
                  className="btn btn-primary text-xs py-2.5 px-5 font-black flex items-center justify-center gap-1.5 shadow-glow-cyan w-full sm:w-auto"
                >
                  <span>📥</span>
                  <span>Download Excel (.csv)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CREATE RESELLER MODAL */}
      {/* ========================================================= */}
      {resellerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-card border border-purple-500/40 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏢</span>
                <h3 className="font-black text-white text-base">
                  Create Wholesale Reseller Partner
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setResellerModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReseller} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Partner / Contact Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={resellerFormData.name}
                  onChange={(e) => setResellerFormData({ ...resellerFormData, name: e.target.value })}
                  className="input w-full text-xs py-2.5 rounded-xl"
                  placeholder="e.g. Sopheak MLBB Shop"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={resellerFormData.email}
                  onChange={(e) => setResellerFormData({ ...resellerFormData, email: e.target.value })}
                  className="input w-full text-xs py-2.5 rounded-xl"
                  placeholder="e.g. sopheak@gamestore.kh"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Company / Brand Name</label>
                <input
                  type="text"
                  value={resellerFormData.companyName}
                  onChange={(e) => setResellerFormData({ ...resellerFormData, companyName: e.target.value })}
                  className="input w-full text-xs py-2.5 rounded-xl"
                  placeholder="e.g. Angkor Game Hub"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Initial Balance ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={resellerFormData.initialBalanceUSD}
                    onChange={(e) => setResellerFormData({ ...resellerFormData, initialBalanceUSD: e.target.value })}
                    className="input w-full text-xs py-2.5 rounded-xl font-mono text-amber-300 font-bold"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Discount Tier</label>
                  <select
                    value={resellerFormData.discountTier}
                    onChange={(e) => {
                      const tier = e.target.value;
                      const rate = tier.includes('12%') ? 0.12 : tier.includes('8%') ? 0.08 : 0.05;
                      setResellerFormData({ ...resellerFormData, discountTier: tier, discountRate: rate });
                    }}
                    className="input w-full text-xs py-2.5 rounded-xl text-purple-300 font-bold"
                  >
                    <option value="Tier 1 (VIP Reseller - 8% Off)">Tier 1 (8% Off)</option>
                    <option value="Tier 2 (Super Agent - 12% Off)">Tier 2 (12% Off)</option>
                    <option value="Standard Agent (5% Off)">Standard (5% Off)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setResellerModalOpen(false)}
                  className="btn btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs py-2.5 px-5 font-black shadow-glow-cyan"
                >
                  Create & Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DEPOSIT RESELLER CREDIT MODAL */}
      {/* ========================================================= */}
      {resellerDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-card border border-emerald-500/40 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center pb-2 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <span className="text-lg">💳</span>
                <h3 className="font-black text-white text-base">
                  Deposit Credit to {resellerDepositModal.name || resellerDepositModal.Name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setResellerDepositModal(null)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDepositResellerCredit} className="space-y-3 text-xs">
              <div className="p-3 bg-dark-input rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Current Balance:</span>
                <span className="font-mono font-black text-amber-300">
                  ${Number(resellerDepositModal.balanceUSD || resellerDepositModal.BalanceUSD || 0).toFixed(2)} USD
                </span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Deposit Amount (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={resellerDepositAmount}
                  onChange={(e) => setResellerDepositAmount(e.target.value)}
                  className="input w-full text-base py-2.5 rounded-xl font-mono font-black text-emerald-400"
                  placeholder="e.g. 50.00"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  ~{Math.round((parseFloat(resellerDepositAmount) || 0) * 4100).toLocaleString()} ៛ KHR
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setResellerDepositModal(null)}
                  className="btn btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* USER ROLE MODAL */}
      {/* ========================================================= */}
      {userRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-card border border-amber-500/40 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center pb-2 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <span className="text-lg">👑</span>
                <h3 className="font-black text-white text-base">
                  Change Role: {userRoleModal.name || userRoleModal.Name || 'User'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUserRoleModal(null)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                Select the access level for <strong className="text-white">{userRoleModal.email || userRoleModal.Email}</strong>:
              </p>

              <div className="grid grid-cols-1 gap-2">
                {[
                  { role: 'Admin', icon: '👑', desc: 'Full enterprise dashboard access & system management' },
                  { role: 'Reseller', icon: '🏢', desc: 'Wholesale B2B pricing & API key access' },
                  { role: 'Customer', icon: '👤', desc: 'Standard client top-up purchasing rights' },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleUpdateUserRole(userRoleModal.id || userRoleModal.Id || userRoleModal.userId, item.role)}
                    className="p-3 rounded-xl bg-dark-input hover:bg-slate-800 border border-dark-border text-left flex items-start gap-2.5 transition-all"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <span className="font-bold text-white block">{item.role}</span>
                      <span className="text-[10px] text-slate-400">{item.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-2 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setUserRoleModal(null)}
                  className="btn btn-secondary text-xs py-1.5 px-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BAKONG ACCOUNT PROFILE MODAL */}
      {/* ========================================================= */}
      {bakongAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-card border border-red-500/40 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇰🇭</span>
                <h3 className="font-black text-white text-base">
                  {editingBakongAccount ? `Edit: ${bakongAccountForm.accountTitle}` : 'Add Bakong KHQR Account Profile'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBakongAccountModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBakongAccount} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Profile Title / Nickname <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bakongAccountForm.accountTitle}
                  onChange={(e) => setBakongAccountForm({ ...bakongAccountForm, accountTitle: e.target.value })}
                  className="input w-full text-xs py-2 rounded-xl"
                  placeholder="e.g. Primary Store KHQR (ABA)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Bakong ID / Phone <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bakongAccountForm.bakongId}
                    onChange={(e) => setBakongAccountForm({ ...bakongAccountForm, bakongId: e.target.value })}
                    className="input w-full text-xs py-2 rounded-xl font-mono text-cyan-300"
                    placeholder="e.g. 012345678@acb"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Merchant Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bakongAccountForm.merchantName}
                    onChange={(e) => setBakongAccountForm({ ...bakongAccountForm, merchantName: e.target.value })}
                    className="input w-full text-xs py-2 rounded-xl uppercase font-bold text-amber-300"
                    placeholder="e.g. FAMILY PHONE"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Acquiring Bank</label>
                  <input
                    type="text"
                    value={bakongAccountForm.acquiringBank}
                    onChange={(e) => setBakongAccountForm({ ...bakongAccountForm, acquiringBank: e.target.value })}
                    className="input w-full text-xs py-2 rounded-xl"
                    placeholder="e.g. ABA Bank, Wing, ACLEDA"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Merchant City</label>
                  <input
                    type="text"
                    value={bakongAccountForm.merchantCity}
                    onChange={(e) => setBakongAccountForm({ ...bakongAccountForm, merchantCity: e.target.value })}
                    className="input w-full text-xs py-2 rounded-xl"
                    placeholder="e.g. PHNOM PENH"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Bakong JWT Token (Optional)</label>
                <textarea
                  rows="2"
                  value={bakongAccountForm.bakongToken}
                  onChange={(e) => setBakongAccountForm({ ...bakongAccountForm, bakongToken: e.target.value })}
                  className="input w-full font-mono text-xs py-2 rounded-xl text-amber-300"
                  placeholder="Paste JWT token if dedicated for this merchant..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveBakong"
                  checked={bakongAccountForm.isActive}
                  onChange={(e) => setBakongAccountForm({ ...bakongAccountForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="isActiveBakong" className="text-slate-300 font-semibold cursor-pointer">
                  Set as Active Live Checkout Account
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setBakongAccountModalOpen(false)}
                  className="btn btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs py-2 px-5 font-black shadow-glow-cyan"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EVENT BANNER PROMOTION ADD / EDIT MODAL */}
      {/* ========================================================= */}
      {bannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0B0F19] border border-amber-500/40 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-[0_25px_60px_rgba(0,0,0,0.9)] animate-scaleUp">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎨</span>
                <h3 className="font-black text-white text-base">
                  {editingBanner ? `Edit Event Banner: ${editingBanner.title}` : 'Add New Promotional Event Banner'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBannerModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3.5 text-xs">
              {/* Live Preview Card */}
              {bannerFormData.image && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Banner Preview:
                  </span>
                  <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                    <img
                      src={bannerFormData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${bannerFormData.badgeColor}`}>
                        {bannerFormData.tag || '🔥 EVENT'}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <div className="text-xs font-black truncate">{bannerFormData.title || 'Banner Title'}</div>
                      <div className="text-[10px] text-slate-300 truncate">{bannerFormData.subtitle || 'Banner description...'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Title & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Banner Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerFormData.title}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                    className="input w-full text-xs py-2 rounded-xl"
                    placeholder="e.g. MLBB ALLSTAR 515 Carnival"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Event Tag / Badge <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerFormData.tag}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, tag: e.target.value })}
                    className="input w-full text-xs py-2 rounded-xl font-bold text-amber-300"
                    placeholder="e.g. 🔥 ALLSTAR 2026 EVENT"
                  />
                </div>
              </div>

              {/* Subtitle / Description */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Event Subtitle / Description (Khmer or English)
                </label>
                <textarea
                  rows="2"
                  value={bannerFormData.subtitle}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, subtitle: e.target.value })}
                  className="input w-full text-xs py-2 rounded-xl"
                  placeholder="e.g. ទទួលបាន 220 💎 + 70 Aurora ⭐ លើរាល់ការទិញ Weekly Pass!"
                />
              </div>

              {/* Image URL & Cloudinary Upload */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-bold flex items-center gap-1.5">
                    <span>☁️</span>
                    <span>Banner Artwork Image (Cloudinary CDN)</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/30">
                    📐 1200 × 500 px (21:9)
                  </span>
                </div>

                {/* Cloudinary Upload Action Area */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      required
                      value={bannerFormData.image}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, image: e.target.value })}
                      className="input w-full text-xs py-2 rounded-xl font-mono text-cyan-300"
                      placeholder="https://res.cloudinary.com/... or click Upload"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md ${
                      uploadingBannerImage
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 opacity-80 cursor-wait'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-cyan-400/50 text-white hover:scale-[1.02] active:scale-95'
                    }`}>
                      {uploadingBannerImage ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <span>☁️</span>
                          <span>Upload to Cloudinary</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingBannerImage}
                        onChange={handleBannerImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Quick Presets / Wallpaper Gallery */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                    Or Select High-Resolution Gaming Artwork:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      {
                        name: 'MLBB 515 ALLSTAR',
                        url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
                        badge: 'ALLSTAR 2026'
                      },
                      {
                        name: 'Starlight & Twilight',
                        url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
                        badge: 'VIP PASS'
                      },
                      {
                        name: 'PUBG UC Mega Season',
                        url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
                        badge: 'ROYALE PASS'
                      },
                      {
                        name: 'Free Fire Booyah Pass',
                        url: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
                        badge: 'BOOYAH PASS'
                      }
                    ].map((sample) => (
                      <button
                        key={sample.name}
                        type="button"
                        onClick={() => setBannerFormData({ ...bannerFormData, image: sample.url })}
                        className={`p-1.5 rounded-xl border text-[10px] text-left transition-all truncate flex items-center gap-1 cursor-pointer ${
                          bannerFormData.image === sample.url
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[11px]">🎮</span>
                        <span className="truncate">{sample.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Cloudinary destination: <strong className="text-cyan-300 font-mono">event_banners</strong></span>
                  <span className="text-slate-500">Max size: 10MB (JPG, PNG, WebP)</span>
                </div>
              </div>

              {/* Target Game & CTA Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Target Game</label>
                  <select
                    value={bannerFormData.gameId}
                    onChange={(e) => {
                      const gId = e.target.value;
                      setBannerFormData({
                        ...bannerFormData,
                        gameId: gId,
                        link: `/topup?game=${gId}`
                      });
                    }}
                    className="input w-full text-xs py-2 rounded-xl bg-slate-900"
                  >
                    <option value="mlbb">Mobile Legends: Bang Bang (MLBB)</option>
                    <option value="pubgm">PUBG Mobile (UC)</option>
                    <option value="freefire">Free Fire</option>
                    <option value="hok">Honor of Kings</option>
                    <option value="genshin">Genshin Impact</option>
                    <option value="telegram_stars">Telegram Stars</option>
                    <option value="steam">Steam Wallet USD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">CTA Button Text</label>
                  <input
                    type="text"
                    value={bannerFormData.buttonText}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, buttonText: e.target.value })}
                    className="input w-full text-xs py-2 rounded-xl font-bold"
                    placeholder="e.g. ⚡ Top Up Now"
                  />
                </div>
              </div>

              {/* Badge Style Preset */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Badge Color Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Gold Amber', class: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black' },
                    { label: 'Royal Purple', class: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' },
                    { label: 'Cyan Blue', class: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black' },
                    { label: 'Fire Rose', class: 'bg-gradient-to-r from-rose-500 to-orange-500 text-white' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setBannerFormData({ ...bannerFormData, badgeColor: preset.class })}
                      className={`p-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer truncate ${preset.class} ${
                        bannerFormData.badgeColor === preset.class ? 'ring-2 ring-white scale-[1.02]' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isBannerActive"
                  checked={bannerFormData.status === 'Active'}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, status: e.target.checked ? 'Active' : 'Inactive' })}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="isBannerActive" className="text-slate-300 font-semibold cursor-pointer">
                  Publish to Live Customer Storefront (Active)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setBannerModalOpen(false)}
                  className="btn btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold text-xs py-2 px-5 font-black shadow-glow-gold"
                >
                  {editingBanner ? 'Save Changes' : 'Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
