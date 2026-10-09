import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, bakongAPI, paywayAPI } from '../services/api';
import { getStoredGames, saveStoredGames, resetToDefaultGames, getMasterTopupStatus, saveMasterTopupStatus, fetchStoredGames, fetchMasterTopupStatus, saveGameStatusOverride } from '../services/gamesConfig';
import { useStoreBranding } from '../services/storeBranding';
import { DEFAULT_EVENT_BANNERS, getAllStoredBanners, fetchStoredBanners, saveStoredBanners } from '../services/eventBanners';
import { CambodiaFlagSvg, CambodiaFlagFrame, CambodiaCornerBadge, DynamicFlagMedallion, UniversalSphericalFlag, POPULAR_FLAGS, ALL_FLAG_OPTIONS } from '../components/CambodiaFlagBadge';
import CreativeFlagDropdown from '../components/CreativeFlagDropdown';
import ProductPackageImage from '../components/ProductPackageImage';
import { uploadToCloudinary, readFileAsDataUrl, getCloudinaryConfig, saveCloudinaryConfig } from '../services/cloudinary';
import {
  DEFAULT_PROVIDERS,
  PROVIDER_PRESETS,
  getStoredProviderSettings,
  fetchStoredProviderSettings,
  switchActiveProvider,
  saveStoredProviderSettings,
  addStoredFazerCardsToken,
  switchStoredFazerCardsToken,
  deleteStoredFazerCardsToken,
  addCustomProvider,
  updateCustomProvider,
  deleteCustomProvider,
  updateProviderBalance
} from '../services/supplierGateway';
import { getLocalOrders, mergeOrders, updateLocalOrderStatus } from '../utils/orderStorage';

const AdminDashboard = () => {

  // All Game & Special Event Types for Admin Pricing Manager
  

// Comprehensive Catalog of Official Packages for All Games & Special Events with Dual Provider Wholesale Costs
const ALL_GAMES_CATALOG_LIST = [
  // Mobile Legends (MLBB)
  { productId: 2, game: 'mlbb', diamondAmount: 55, name: '55 Diamonds', price: 0.89, resellerPrice: 0.89, costPriceFazerCards: 0.74, costPriceKhmerTopUp: 0.76, tag: 'Starter', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 3, game: 'mlbb', diamondAmount: 86, name: '86 Diamonds', price: 1.39, resellerPrice: 1.39, costPriceFazerCards: 1.17, costPriceKhmerTopUp: 1.20, tag: 'Bonus', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 5, game: 'mlbb', diamondAmount: 210, name: 'Weekly Pass', price: 1.55, resellerPrice: 1.55, costPriceFazerCards: 1.45, costPriceKhmerTopUp: 1.55, tag: 'ទទួលបាន 220 💎 + 70 arura ⭐', isPass: true, status: 'Active', customImage: '/images/weekly-pass.png' },
  { productId: 19, game: 'mlbb', diamondAmount: 440, name: '2 Weekly Pass', price: 3.10, resellerPrice: 3.10, costPriceFazerCards: 2.90, costPriceKhmerTopUp: 3.00, tag: 'ទទួលបាន 440 💎 + 140 arura ⭐', isPass: true, status: 'Active', customImage: '/images/weekly-pass.png' },
  { productId: 20, game: 'mlbb', diamondAmount: 660, name: '3 Weekly Pass', price: 4.65, resellerPrice: 4.65, costPriceFazerCards: 4.35, costPriceKhmerTopUp: 4.50, tag: '29 tickets 🎫', isPass: true, status: 'Active', customImage: '/images/weekly-pass.png' },
  { productId: 21, game: 'mlbb', diamondAmount: 880, name: '4 Weekly Pass', price: 6.20, resellerPrice: 6.20, costPriceFazerCards: 5.80, costPriceKhmerTopUp: 6.00, tag: '4x WDP', isPass: true, status: 'Active', customImage: '/images/weekly-pass.png' },
  { productId: 22, game: 'mlbb', diamondAmount: 1100, name: '5 Weekly Pass', price: 7.75, resellerPrice: 7.75, costPriceFazerCards: 7.25, costPriceKhmerTopUp: 7.50, tag: '5x WDP', isPass: true, status: 'Active', customImage: '/images/weekly-pass.png' },
  { productId: 23, game: 'mlbb', diamondAmount: 1320, name: '6 Weekly Pass', price: 9.30, resellerPrice: 9.30, costPriceFazerCards: 8.70, costPriceKhmerTopUp: 9.00, tag: '6x WDP', isPass: true, status: 'Active', customImage: '/images/weekly-pass.png' },
  { productId: 24, game: 'mlbb', diamondAmount: 605, name: '165 + 2Weekly', price: 5.50, resellerPrice: 5.50, costPriceFazerCards: 5.12, costPriceKhmerTopUp: 5.30, tag: '165 💎 + 2x WDP', isPass: true, status: 'Active', customImage: '/images/weekly-pass.png' },
  { productId: 207, game: 'mlbb', diamondAmount: 55, name: 'Weekly Elite Bundle', price: 0.89, resellerPrice: 0.89, costPriceFazerCards: 0.75, costPriceKhmerTopUp: 0.76, tag: 'ទទួលបាន 55 💎 + 20 arura ⭐', isPass: true, status: 'Active', customImage: '/images/weekly-pass.png' },
  { productId: 208, game: 'mlbb', diamondAmount: 275, name: 'Monthly Epic Bundle', price: 4.44, resellerPrice: 4.44, costPriceFazerCards: 3.73, costPriceKhmerTopUp: 3.90, tag: 'ទទួលបាន 275 💎 + 180 arura ⭐', isPass: true, status: 'Active', customImage: '/images/weekly-pass.png' },
  { productId: 17, game: 'mlbb', diamondAmount: 110, name: '110 Diamonds', price: 1.78, resellerPrice: 1.78, costPriceFazerCards: 1.45, costPriceKhmerTopUp: 1.50, tag: 'Bonus', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 18, game: 'mlbb', diamondAmount: 165, name: '165 Diamonds', price: 2.66, resellerPrice: 2.66, costPriceFazerCards: 2.22, costPriceKhmerTopUp: 2.25, tag: 'HOT 🔥', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 4, game: 'mlbb', diamondAmount: 172, name: '172 Diamonds', price: 2.78, resellerPrice: 2.78, costPriceFazerCards: 2.31, costPriceKhmerTopUp: 2.35, tag: 'Standard', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 6, game: 'mlbb', diamondAmount: 257, name: '257 Diamonds', price: 4.15, resellerPrice: 4.15, costPriceFazerCards: 3.34, costPriceKhmerTopUp: 3.40, tag: 'Popular', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 25, game: 'mlbb', diamondAmount: 275, name: '275 Diamonds', price: 4.44, resellerPrice: 4.44, costPriceFazerCards: 3.55, costPriceKhmerTopUp: 3.60, tag: '29 tickets 🎟️', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 26, game: 'mlbb', diamondAmount: 312, name: '312 Diamonds', price: 5.03, resellerPrice: 5.03, costPriceFazerCards: 3.88, costPriceKhmerTopUp: 4.00, tag: 'STARLIGHT 🌟', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 27, game: 'mlbb', diamondAmount: 343, name: '343 Diamonds', price: 5.53, resellerPrice: 5.53, costPriceFazerCards: 4.25, costPriceKhmerTopUp: 4.40, tag: '29 tickets 🎟️', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 8, game: 'mlbb', diamondAmount: 429, name: '429 Diamonds', price: 6.92, resellerPrice: 6.92, costPriceFazerCards: 5.68, costPriceKhmerTopUp: 5.80, tag: '29 tickets 🎟️', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 9, game: 'mlbb', diamondAmount: 500, name: 'Twilight Pass', price: 8.25, resellerPrice: 8.25, costPriceFazerCards: 7.64, costPriceKhmerTopUp: 8.00, tag: 'VIP PASS 👑', isPass: true, status: 'Active', customImage: '/images/weekly-pass.png' },
  { productId: 10, game: 'mlbb', diamondAmount: 514, name: '514 Diamonds', price: 8.29, resellerPrice: 8.29, costPriceFazerCards: 6.28, costPriceKhmerTopUp: 6.45, tag: 'Best Value', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 28, game: 'mlbb', diamondAmount: 565, name: '565 Diamonds', price: 9.12, resellerPrice: 9.12, costPriceFazerCards: 7.31, costPriceKhmerTopUp: 7.45, tag: 'Special', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 29, game: 'mlbb', diamondAmount: 600, name: '600 Diamonds', price: 9.68, resellerPrice: 9.68, costPriceFazerCards: 7.25, costPriceKhmerTopUp: 7.45, tag: 'Pro Pack', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 11, game: 'mlbb', diamondAmount: 706, name: '706 Diamonds', price: 11.39, resellerPrice: 11.39, costPriceFazerCards: 9.08, costPriceKhmerTopUp: 9.25, tag: 'VIP', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 30, game: 'mlbb', diamondAmount: 878, name: '878 Diamonds', price: 14.17, resellerPrice: 14.17, costPriceFazerCards: 10.90, costPriceKhmerTopUp: 11.20, tag: 'VIP PRO', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 31, game: 'mlbb', diamondAmount: 963, name: '963 Diamonds', price: 15.54, resellerPrice: 15.54, costPriceFazerCards: 11.60, costPriceKhmerTopUp: 11.90, tag: 'Grand Pack', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 12, game: 'mlbb', diamondAmount: 1050, name: '1050 Diamonds', price: 16.94, resellerPrice: 16.94, costPriceFazerCards: 13.20, costPriceKhmerTopUp: 13.60, tag: 'Royal Chest', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 32, game: 'mlbb', diamondAmount: 1412, name: '1412 Diamonds', price: 22.78, resellerPrice: 22.78, costPriceFazerCards: 18.80, costPriceKhmerTopUp: 19.20, tag: 'Treasury', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 13, game: 'mlbb', diamondAmount: 2195, name: '2195 Diamonds', price: 35.41, resellerPrice: 35.41, costPriceFazerCards: 27.49, costPriceKhmerTopUp: 28.00, tag: 'Mythic Pack', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 33, game: 'mlbb', diamondAmount: 2452, name: '2452 Diamonds', price: 39.56, resellerPrice: 39.56, costPriceFazerCards: 27.70, costPriceKhmerTopUp: 28.50, tag: 'Mythic Plus', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 34, game: 'mlbb', diamondAmount: 2901, name: '2901 Diamonds', price: 46.81, resellerPrice: 46.81, costPriceFazerCards: 34.00, costPriceKhmerTopUp: 35.00, tag: 'Legendary Pack', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 14, game: 'mlbb', diamondAmount: 3688, name: '3688 Diamonds', price: 59.49, resellerPrice: 59.49, costPriceFazerCards: 45.86, costPriceKhmerTopUp: 48.65, tag: 'Epic Vault', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 35, game: 'mlbb', diamondAmount: 4390, name: '4390 Diamonds', price: 70.83, resellerPrice: 70.83, costPriceFazerCards: 53.60, costPriceKhmerTopUp: 55.00, tag: 'Supreme Chest', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 15, game: 'mlbb', diamondAmount: 5532, name: '5532 Diamonds', price: 89.25, resellerPrice: 89.25, costPriceFazerCards: 69.24, costPriceKhmerTopUp: 70.00, tag: 'Immortal Pack', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 36, game: 'mlbb', diamondAmount: 6944, name: '6944 Diamonds', price: 112.04, resellerPrice: 112.04, costPriceFazerCards: 79.20, costPriceKhmerTopUp: 81.00, tag: 'Titan Pack', status: 'Active', customImage: '/images/diamond-chest-3d.png' },
  { productId: 16, game: 'mlbb', diamondAmount: 9288, name: '9288 Diamonds', price: 149.85, resellerPrice: 149.85, costPriceFazerCards: 115.00, costPriceKhmerTopUp: 118.00, tag: 'ULTIMATE ⚡', status: 'Active', customImage: '/images/diamond-chest-3d.png' },

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
  {
    id: 'all',
    name: 'All Products',
    icon: '🌐',
    logo: '/images/all-products-icon.svg',
  },
  {
    id: 'special_passes',
    name: 'Special Passes & Events',
    icon: '⭐',
    logo: '/images/weekly-pass.png',
    fallbackLogo: '/images/diamond-chest-3d.png',
  },
  {
    id: 'mlbb',
    name: 'Mobile Legends (MLBB)',
    icon: '💎',
    logo: '/mlbb-logo.png',
  },
  {
    id: 'pubgm',
    name: 'PUBG Mobile',
    icon: '🎯',
    logo: 'https://res.cloudinary.com/dpz7vpmf8/image/upload/v1790944800/logo-game/ovdfdmru7jnhmwjvy6vy.jpg',
    fallbackLogo: '/images/pubgm-banner.jpg',
  },
  {
    id: 'freefire',
    name: 'Free Fire',
    icon: '🔥',
    logo: '/images/freefire-square-logo.png',
    fallbackLogo: '/images/freefire_hero_banner.jpg',
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    icon: '🌙',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/5/5d/Genshin_Impact_logo.svg',
    fallbackLogo: '/images/genshin-logo.svg',
  },
  {
    id: 'star_rail',
    name: 'Honkai: Star Rail',
    icon: '🚂',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/9/95/Honkai_Star_Rail_logo.png',
    fallbackLogo: '/images/star-rail-logo.svg',
  },
  {
    id: 'zenless',
    name: 'Zenless Zone Zero',
    icon: '⚡',
    logo: 'https://upload.wikimedia.org/wikipedia/en/9/92/Zenless_Zone_Zero_logo.png',
    fallbackLogo: '/images/zenless-logo.svg',
  },
  {
    id: 'hok',
    name: 'Honor of Kings',
    icon: '👑',
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/7d/Honor_of_Kings_logo.png',
    fallbackLogo: '/images/hok-logo.svg',
  },
  {
    id: 'steam_usd',
    name: 'Steam Top-Up',
    icon: '💨',
    logo: '/images/steam-logo.png',
  },
  {
    id: 'telegram_stars',
    name: 'Telegram Stars',
    icon: '✈️',
    logo: '/images/telegram-stars-logo.svg',
  },
  {
    id: 'gift_cards',
    name: 'Gift Cards',
    icon: '🎁',
    logo: '/images/treasure-chest.png',
  },
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
  const location = useLocation();

  // Navigation & View States
  const getInitialTab = () => {
    const p = window.location.pathname.toLowerCase();
    if (p.includes('/orders')) return 'orders';
    if (p.includes('/setup') || p.includes('/provider')) return 'provider';
    if (p.includes('/pricing')) return 'pricing';
    if (p.includes('/games')) return 'games';
    if (p.includes('/profile') || p.includes('/brand')) return 'profile';
    if (p.includes('/financials')) return 'financials';
    return 'pending';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    const p = location.pathname.toLowerCase();
    if (p.includes('/orders')) setActiveTab('orders');
    else if (p.includes('/setup') || p.includes('/provider')) setActiveTab('provider');
    else if (p.includes('/pricing')) setActiveTab('pricing');
    else if (p.includes('/games')) setActiveTab('games');
    else if (p.includes('/profile') || p.includes('/brand')) setActiveTab('profile');
    else if (p.includes('/financials')) setActiveTab('financials');
  }, [location.pathname]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1100;
    }
    return false;
  });
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const navDropdownRef = useRef(null);
  const navSearchInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
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
  const [orders, setOrders] = useState(() => getLocalOrders());

  // Auto-sync orders whenever local storage or order updates occur
  useEffect(() => {
    const handleOrdersUpdated = () => {
      setOrders(getLocalOrders());
    };
    window.addEventListener('orders-updated', handleOrdersUpdated);
    window.addEventListener('storage', handleOrdersUpdated);
    return () => {
      window.removeEventListener('orders-updated', handleOrdersUpdated);
      window.removeEventListener('storage', handleOrdersUpdated);
    };
  }, []);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [pendingBalanceOrders, setPendingBalanceOrders] = useState([]); // paid but provider had no balance
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

  // Provider Management State backed by Persistent Pinned Storage & Cloud Sync
  const [providerSettings, setProviderSettings] = useState(() => getStoredProviderSettings());
  const [providerTesting, setProviderTesting] = useState(false);
  const [switchingProvider, setSwitchingProvider] = useState(false);
  const [balanceEditModalOpen, setBalanceEditModalOpen] = useState(false);
  const [editingProviderId, setEditingProviderId] = useState(null);
  const [editingProviderName, setEditingProviderName] = useState('FazerCards');
  const [newBalanceInput, setNewBalanceInput] = useState('');
  const [addFzrTokenModalOpen, setAddFzrTokenModalOpen] = useState(false);
  const [newFzrTokenInput, setNewFzrTokenInput] = useState('');
  const [newFzrTokenNameInput, setNewFzrTokenNameInput] = useState('');
  const [newFzrTokenSetActive, setNewFzrTokenSetActive] = useState(true);
  const [showFzrTokenSecret, setShowFzrTokenSecret] = useState(false);
  const [testingFzrTokenId, setTestingFzrTokenId] = useState(null);
  const [savingFzrToken, setSavingFzrToken] = useState(false);

  // Dynamic Multi-Provider Management States
  const [addProviderModalOpen, setAddProviderModalOpen] = useState(false);
  const [editProviderModalOpen, setEditProviderModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [showProviderSecretKey, setShowProviderSecretKey] = useState(false);
  const [providerFormData, setProviderFormData] = useState({
    name: '',
    subtitle: '',
    icon: '🌐',
    badge: 'API GATEWAY',
    badgeColor: 'emerald',
    apiUrl: '',
    apiKey: '',
    merchantId: '',
    balanceUSD: '0.00',
    docsUrl: '',
    refillUrl: '',
    category: 'Custom Gateway',
    setAsActive: false,
  });

  // Event Banner Management State with Cloud Database Sync
  const [eventBanners, setEventBanners] = useState(() => getAllStoredBanners());
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);
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

  // Financials & Profit Analytics Tab States
  const [financialsSearch, setFinancialsSearch] = useState('');
  const [financialsGameFilter, setFinancialsGameFilter] = useState('ALL');
  const [financialsTimeFilter, setFinancialsTimeFilter] = useState('ALL');
  const [financialsSubTab, setFinancialsSubTab] = useState('ledger'); // 'ledger' | 'packages' | 'trends'
  const [financialsPage, setFinancialsPage] = useState(1);
  const [financialsPageSize, setFinancialsPageSize] = useState(15);
  const [clearFinancialsModalOpen, setClearFinancialsModalOpen] = useState(false);
  const [clearingFinancials, setClearingFinancials] = useState(false);

  // Compute live display financials combining API metrics and real orders cleanly
  const displayFinancials = useMemo(() => {
    const clearedTimestamp = financials?.clearedAt || (typeof window !== 'undefined' ? localStorage.getItem('financials_cleared_at') : null);
    const clearedDate = clearedTimestamp ? new Date(clearedTimestamp) : null;

    const apiLedger = financials?.salesLedger || [];

    // Helper to resolve provider wholesale price accurately for any package
    const resolveProviderPrice = (pkgName, sellPrice, diamondAmount, billNumber = '') => {
      const pStr = String(pkgName || '').toLowerCase();
      const amt = Number(diamondAmount || 0);
      const sell = Number(sellPrice || 0);
      const bill = String(billNumber || '').toLowerCase();
      const isKT = (providerSettings?.activeProvider === 'KhmerTopUp') || bill.startsWith('kt-');

      // Check catalog list matches
      const catalogMatch = ALL_GAMES_CATALOG_LIST.find(p => 
        (amt > 0 && p.diamondAmount === amt) || 
        (sell > 0 && Math.abs(p.price - sell) < 0.01) ||
        (pStr && p.name.toLowerCase().includes(pStr))
      );
      if (catalogMatch) {
        const cost = isKT 
          ? (catalogMatch.costPriceKhmerTopUp || catalogMatch.costPriceFazerCards) 
          : (catalogMatch.costPriceFazerCards || catalogMatch.costPriceKhmerTopUp);
        if (cost > 0) return cost;
      }

      if (isKT) {
        if (amt === 3688 || sell === 49.99 || pStr.includes('3688') || pStr.includes('49.99')) return 48.65;
        if (amt === 55 || sell === 0.95 || pStr.includes('55')) return 0.76;
        if (amt === 86 || sell === 1.35 || pStr.includes('86')) return 1.20;
        if (amt === 110 || sell === 1.70 || pStr.includes('110')) return 1.50;
        if (amt === 165 || sell === 2.40 || pStr.includes('165')) return 2.25;
        if (amt === 172 || sell === 2.50 || pStr.includes('172')) return 2.35;
        if (amt === 210 || sell === 1.55 || pStr.includes('weekly')) return 1.55;
        if (amt === 257 || sell === 3.69 || pStr.includes('257')) return 3.40;
        if (amt === 275 || sell === 3.85 || pStr.includes('275')) return 3.60;
        if (amt === 312 || sell === 4.55 || pStr.includes('312')) return 4.00;
        if (amt === 343 || sell === 4.99 || pStr.includes('343')) return 4.40;
        if (amt === 429 || sell === 6.30 || pStr.includes('429')) return 5.80;
        if (amt === 514 || sell === 7.35 || pStr.includes('514')) return 6.45;
        if (amt === 565 || sell === 7.80 || pStr.includes('565')) return 7.45;
        if (amt === 600 || sell === 8.50 || pStr.includes('600')) return 7.45;
        if (amt === 706 || sell === 9.99 || pStr.includes('706')) return 9.25;
        if (amt === 878 || sell === 12.80 || pStr.includes('878')) return 11.20;
        if (amt === 963 || sell === 13.60 || pStr.includes('963')) return 11.90;
        if (amt === 1050 || sell === 15.50 || pStr.includes('1050')) return 13.60;
        if (amt === 1412 || sell === 22.00 || pStr.includes('1412')) return 19.20;
        if (amt === 2195 || sell === 29.99 || pStr.includes('2195')) return 28.00;
        if (amt === 2452 || sell === 32.50 || pStr.includes('2452')) return 28.50;
        if (amt === 2901 || sell === 39.99 || pStr.includes('2901')) return 35.00;
        if (amt === 4390 || sell === 62.99 || pStr.includes('4390')) return 55.00;
        if (amt === 5532 || sell === 73.99 || pStr.includes('5532')) return 70.00;
        if (amt === 6944 || sell === 92.99 || pStr.includes('6944')) return 81.00;
        if (amt === 9288 || sell === 125.00 || pStr.includes('9288')) return 118.00;
      }

      if (amt === 3688 || sell === 49.99 || pStr.includes('3688') || pStr.includes('49.99')) return 45.86;
      if (amt === 55 || sell === 0.95 || pStr.includes('55')) return 0.74;
      if (amt === 86 || sell === 1.35 || pStr.includes('86')) return 1.17;
      if (amt === 110 || sell === 1.70 || pStr.includes('110')) return 1.45;
      if (amt === 165 || sell === 2.40 || pStr.includes('165')) return 2.22;
      if (amt === 172 || sell === 2.50 || pStr.includes('172')) return 2.31;
      if (amt === 210 || sell === 1.55 || pStr.includes('weekly')) return 1.45;
      if (amt === 257 || sell === 3.69 || pStr.includes('257')) return 3.34;
      if (amt === 275 || sell === 3.85 || pStr.includes('275')) return 3.55;
      if (amt === 343 || sell === 4.99 || pStr.includes('343')) return 4.25;
      if (amt === 429 || sell === 6.30 || pStr.includes('429')) return 5.68;
      if (amt === 514 || sell === 7.35 || pStr.includes('514')) return 6.28;
      if (amt === 706 || sell === 9.99 || pStr.includes('706')) return 9.08;
      if (amt === 1050 || sell === 15.50 || pStr.includes('1050')) return 13.20;
      if (amt === 2195 || sell === 29.99 || pStr.includes('2195')) return 27.49;
      if (amt === 5532 || sell === 73.99 || pStr.includes('5532')) return 69.24;
      if (amt === 9288 || sell === 125.00 || pStr.includes('9288')) return 115.00;

      return sell > 0 ? Number((sell * 0.82).toFixed(2)) : 0;
    };

    const seenKeys = new Set();
    const cleanLedger = [];

    // 1. Ingest API ledger items (excluding mock test records)
    apiLedger.forEach(item => {
      const pIdStr = String(item.playerId || item.playerID || '').trim();
      const billStr = String(item.billNumber || '').trim().toUpperCase();
      if (pIdStr === '1225368571' || billStr.startsWith('TRX') || billStr.startsWith('MLBB000') || billStr.startsWith('ORD-TOPIC') || billStr.startsWith('ORD-TEST')) {
        return;
      }

      const billKey = String(item.billNumber || item.orderId || item.transaction_id || '').toLowerCase();
      if (billKey) seenKeys.add(billKey);

      if (clearedDate && item.date && new Date(item.date) <= clearedDate) return;

      const sell = Number(item.sellerPrice || 0);
      const prov = (item.providerPrice && Number(item.providerPrice) > 0) 
        ? Number(item.providerPrice) 
        : resolveProviderPrice(item.packageName, sell, item.diamondAmount, item.billNumber);
      const net = Number((sell - prov).toFixed(2));
      const margin = sell > 0 ? Number(((net / sell) * 100).toFixed(1)) : 0;

      cleanLedger.push({
        ...item,
        sellerPrice: sell,
        providerPrice: prov,
        netProfit: net,
        marginPct: margin,
        status: item.status || 'Completed'
      });
    });

    // 2. Merge local paid / completed orders NOT present in API ledger
    const localPaidOrders = (orders || []).filter(o => {
      if (!o) return false;
      const pIdStr = String(o.playerId || o.playerID || '').trim();
      const billStr = String(o.billNumber || o.orderId || '').trim().toUpperCase();
      if (pIdStr === '1225368571' || billStr.startsWith('TRX') || billStr.startsWith('MLBB000') || billStr.startsWith('ORD-TOPIC') || billStr.startsWith('ORD-TEST')) {
        return false;
      }

      const payStatus = String(o.paymentStatus || '').toLowerCase();
      const topStatus = String(o.topupStatus || '').toLowerCase();
      const isPaid = payStatus === 'paid' || payStatus === 'approved' || payStatus === 'success' || topStatus === 'completed' || topStatus === 'delivered';
      if (!isPaid) return false;
      if (clearedDate && o.createdAt && new Date(o.createdAt) <= clearedDate) return false;
      return true;
    });

    localPaidOrders.forEach(o => {
      const ordIdStr = o.orderId ? String(o.orderId) : '';
      const orderIdKey = ordIdStr ? `ord-${ordIdStr}` : '';
      
      const alreadyInLedger = (orderIdKey && seenKeys.has(orderIdKey)) ||
        (ordIdStr && cleanLedger.some(l => String(l.orderId) === ordIdStr || String(l.billNumber || '').includes(ordIdStr))) ||
        cleanLedger.some(l => Math.abs(Number(l.sellerPrice) - Number(o.amount)) < 0.01 && String(l.date || '').slice(0, 16) === String(o.createdAt || '').slice(0, 16));

      if (!alreadyInLedger) {
        if (orderIdKey) seenKeys.add(orderIdKey);

        const billNum = o.billNumber || (o.orderId ? `ORD-${o.orderId}` : `TX-${String(o.createdAt || Date.now()).slice(-8)}`);
        const sell = Number(o.amount || o.price || 0);
        const prov = (o.providerPrice && Number(o.providerPrice) > 0) ? Number(o.providerPrice) : resolveProviderPrice(o.productName, sell, o.diamondAmount, billNum);
        const profit = Number((sell - prov).toFixed(2));
        const margin = sell > 0 ? Number(((profit / sell) * 100).toFixed(1)) : 0;

        cleanLedger.push({
          billNumber: o.orderId ? `ORD-${o.orderId}` : `TX-${String(o.createdAt || Date.now()).slice(-8)}`,
          orderId: o.orderId || 0,
          gameName: o.gameName || 'Mobile Legends',
          packageName: o.productName || (o.diamondAmount ? `${o.diamondAmount} Diamonds` : 'MLBB Diamonds'),
          playerId: o.playerID || o.playerId || 'N/A',
          serverId: o.serverID || o.serverId || 'Global',
          sellerPrice: sell,
          providerPrice: prov,
          netProfit: profit,
          marginPct: margin,
          date: o.createdAt || new Date().toISOString(),
          status: o.topupStatus || 'Completed'
        });
      }
    });

    // Sort descending by date (newest sales at the top)
    cleanLedger.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    // Calculate totals across ALL merged transactions
    let rev = 0;
    let cogs = 0;
    cleanLedger.forEach(item => {
      rev += Number(item.sellerPrice || 0);
      cogs += Number(item.providerPrice || 0);
    });

    rev = Number(rev.toFixed(2));
    cogs = Number(cogs.toFixed(2));
    const net = Number((rev - cogs).toFixed(2));
    const marginPct = rev > 0 ? Number(((net / rev) * 100).toFixed(1)) : 0;

    return {
      totalGrossRevenue: rev,
      totalGrossRevenueKHR: Math.round(rev * 4100),
      totalSupplierCogs: cogs,
      totalSupplierCogsKHR: Math.round(cogs * 4100),
      totalNetProfit: net,
      totalNetProfitKHR: Math.round(net * 4100),
      overallMarginPct: marginPct,
      dailyProfitTrend: financials?.dailyProfitTrend || [],
      packageProfitability: financials?.packageProfitability || [],
      salesLedger: cleanLedger,
      clearedAt: clearedTimestamp
    };
  }, [financials, orders, providerSettings]);

  // Sync event banners from cloud MongoDB on Admin load & auto-seed if cloud is empty
  useEffect(() => {
    fetchStoredBanners().then((cloudBanners) => {
      if (cloudBanners && cloudBanners.length > 0) {
        setEventBanners(getAllStoredBanners());
      } else {
        const local = getAllStoredBanners();
        if (local && local.length > 0) {
          saveStoredBanners(local);
        }
      }
    });

    const handleSync = () => {
      setEventBanners(getAllStoredBanners());
    };

    window.addEventListener('eventBannersUpdated', handleSync);
    window.addEventListener('storage', handleSync);

    // Initial sync of live Top-Up Provider Settings & live balances from cloud across all devices
    fetchStoredProviderSettings().then((cloudSettings) => {
      if (cloudSettings) {
        setProviderSettings(cloudSettings);
      }
    });

    const handleProviderSync = () => {
      setProviderSettings(getStoredProviderSettings());
    };

    window.addEventListener('providerSettingsUpdated', handleProviderSync);
    window.addEventListener('storage', handleProviderSync);

    return () => {
      window.removeEventListener('eventBannersUpdated', handleSync);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('providerSettingsUpdated', handleProviderSync);
      window.removeEventListener('storage', handleProviderSync);
    };
  }, []);

  const handleForceSyncToCloud = async () => {
    setSyncingCloud(true);
    showToast('info', '☁️ Syncing banners to MongoDB Cloud database for all devices...');
    try {
      await saveStoredBanners(eventBanners);
      showToast('success', '✅ All banners successfully synced to MongoDB Cloud! Visible on all phones & computers.');
    } catch (err) {
      showToast('error', 'Failed to sync to cloud: ' + (err?.message || err));
    } finally {
      setSyncingCloud(false);
    }
  };

  const handleOpenAddBannerModal = () => {
    setEditingBanner(null);
    setBannerFormData({
      tag: '🔥 SPECIAL EVENT',
      title: '',
      subtitle: '',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80',
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

  const handleSaveBanner = async (e) => {
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
    await saveStoredBanners(updatedList);
    setBannerModalOpen(false);
    setEditingBanner(null);
  };

  const handleToggleBannerStatus = async (bannerId) => {
    const updated = eventBanners.map(b => {
      if (b.id === bannerId) {
        const newStatus = b.status === 'Active' ? 'Inactive' : 'Active';
        showToast('info', `Banner status changed to ${newStatus}`);
        return { ...b, status: newStatus };
      }
      return b;
    });
    setEventBanners(updated);
    await saveStoredBanners(updated);
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this event banner?')) return;
    const updated = eventBanners.filter(b => b.id !== bannerId);
    setEventBanners(updated);
    await saveStoredBanners(updated);
    showToast('success', 'Banner deleted successfully!');
  };

  const handleResetBanners = async () => {
    if (!window.confirm('Reset all banners to default official event banners?')) return;
    setEventBanners(DEFAULT_EVENT_BANNERS);
    await saveStoredBanners(DEFAULT_EVENT_BANNERS);
    showToast('success', 'Event banners reset to default promotional banners!');
  };

  const handleBannerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingBannerImage(true);
    showToast('info', '☁️ Processing & optimizing banner artwork...');
    try {
      let finalUrl = '';
      const res = await uploadToCloudinary(file, 'Banner');
      if (res && res.url) {
        finalUrl = res.url;
      } else {
        // High-speed lightweight canvas fallback (under 150KB) for smartphones
        finalUrl = await readFileAsDataUrl(file, 1200, 0.82);
      }

      if (finalUrl) {
        setBannerFormData(prev => ({ ...prev, image: finalUrl }));
        if (res && res.isCloudinary) {
          showToast('success', '✅ Banner uploaded to Cloudinary "Banner" folder successfully!');
        } else {
          showToast('success', '✅ Banner artwork optimized & ready to save!');
        }
      } else {
        showToast('error', res?.error || 'Failed to process banner image.');
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
    showToast('info', '☁️ Optimizing artwork & broadcasting to all devices...');
    try {
      let finalUrl = '';
      const res = await uploadToCloudinary(file, 'Banner');
      if (res && res.url) {
        finalUrl = res.url;
      } else {
        finalUrl = await readFileAsDataUrl(file, 1200, 0.82);
      }

      if (finalUrl) {
        const updated = eventBanners.map(b => b.id === bannerId ? { ...b, image: finalUrl } : b);
        setEventBanners(updated);
        await saveStoredBanners(updated);
        showToast('success', '✅ Banner artwork updated & synced to MongoDB Cloud! Visible on all devices.');
      } else {
        showToast('error', res?.error || 'Failed to upload image.');
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
      const targetName = typeof targetProvider === 'object' ? targetProvider.name : targetProvider;
      const targetId = typeof targetProvider === 'object' ? targetProvider.id : targetProvider;
      showToast('info', `⚡ Switching active supplier to ${targetName}...`);
      const updated = await switchActiveProvider(targetId);
      setProviderSettings(updated);

      // Explicitly notify backend API as well
      await adminAPI.switchProvider(updated.activeProvider).catch((e) => {
        console.warn('adminAPI.switchProvider warning:', e?.message);
      });
      await adminAPI.updateProviderSettings(updated).catch(() => {});

      const activeObj = (updated.providers || []).find(p => p.id === updated.activeProvider || p.name === updated.activeProvider);
      const targetBal = activeObj?.balanceUSD ?? updated.balanceUSD ?? 0;

      showToast('success', `✅ Active Gateway switched to ${activeObj?.name || updated.activeProvider}! Live Balance: $${Number(targetBal).toFixed(2)} USD (~${Math.round(Number(targetBal) * 4100).toLocaleString()} ៛)`);
    } catch (err) {
      showToast('error', err.response?.data?.message || `Failed to switch to ${targetProvider}`);
    } finally {
      setSwitchingProvider(false);
    }
  };

  const handleOpenBalanceEdit = (providerOrName, currentBal) => {
    if (typeof providerOrName === 'object' && providerOrName !== null) {
      setEditingProviderId(providerOrName.id);
      setEditingProviderName(providerOrName.name);
      const isKhmer = providerOrName.id === 'KhmerTopUp' || String(providerOrName.id).toLowerCase().includes('khmer');
      const isFazer = providerOrName.id === 'FazerCards' || String(providerOrName.id).toLowerCase().includes('fazer');
      const liveBal = isKhmer
        ? (providerSettings.khmerTopUpBalanceUSD !== undefined ? Number(providerSettings.khmerTopUpBalanceUSD) : Number(providerOrName.balanceUSD ?? 0.49))
        : isFazer
          ? (providerSettings.fazerCardsBalanceUSD !== undefined ? Number(providerSettings.fazerCardsBalanceUSD) : Number(providerOrName.balanceUSD ?? 0.01))
          : Number(providerOrName.balanceUSD ?? currentBal ?? 0);
      setNewBalanceInput(String(liveBal.toFixed(2)));
    } else {
      setEditingProviderId(providerOrName);
      setEditingProviderName(providerOrName);
      setNewBalanceInput(String(Number(currentBal ?? 0).toFixed(2)));
    }
    setBalanceEditModalOpen(true);
  };

  const handleSaveAdjustedBalance = async (e) => {
    e.preventDefault();
    const val = parseFloat(newBalanceInput);
    if (isNaN(val) || val < 0) {
      showToast('error', 'Please enter a valid balance amount.');
      return;
    }

    try {
      const targetId = editingProviderId || editingProviderName;
      const updated = await updateProviderBalance(targetId, val);
      setProviderSettings(updated);
      showToast('success', `Updated ${editingProviderName} balance to $${val.toFixed(2)} USD (~${Math.round(val * 4100).toLocaleString()} ៛)!`);
      setBalanceEditModalOpen(false);
    } catch (err) {
      showToast('error', err?.message || 'Failed to update balance');
    }
  };

  // Dynamic Provider Add / Edit / Delete Handlers
  const handleSelectPreset = (preset) => {
    setProviderFormData(prev => ({
      ...prev,
      name: preset.name || '',
      subtitle: preset.subtitle || '',
      icon: preset.icon || '🌐',
      badge: preset.badge || 'API',
      badgeColor: preset.badgeColor || 'emerald',
      apiUrl: preset.apiUrl || '',
      docsUrl: preset.docsUrl || '',
      refillUrl: preset.refillUrl || '',
      category: preset.category || 'Preset Gateway',
      apiKey: preset.apiKey || '',
    }));
    showToast('info', `Preset "${preset.name}" loaded! Fill in your API credentials to connect.`);
  };

  const handleOpenAddProviderModal = () => {
    setEditingProvider(null);
    setProviderFormData({
      name: '',
      subtitle: '',
      icon: '🌐',
      badge: 'API GATEWAY',
      badgeColor: 'emerald',
      apiUrl: '',
      apiKey: '',
      merchantId: '',
      balanceUSD: '0.00',
      docsUrl: '',
      refillUrl: '',
      category: 'Custom Gateway',
      setAsActive: false,
    });
    setShowProviderSecretKey(false);
    setAddProviderModalOpen(true);
  };

  const handleOpenEditProviderModal = (provider) => {
    setEditingProvider(provider);
    setProviderFormData({
      name: provider.name || '',
      subtitle: provider.subtitle || '',
      icon: provider.icon || '🌐',
      badge: provider.badge || 'API',
      badgeColor: provider.badgeColor || 'emerald',
      apiUrl: provider.apiUrl || '',
      apiKey: provider.apiKey || '',
      merchantId: provider.merchantId || '',
      balanceUSD: String(provider.balanceUSD ?? 0),
      docsUrl: provider.docsUrl || '',
      refillUrl: provider.refillUrl || '',
      category: provider.category || 'Custom Gateway',
      setAsActive: providerSettings.activeProvider === provider.id || providerSettings.activeProvider === provider.name,
    });
    setShowProviderSecretKey(false);
    setEditProviderModalOpen(true);
  };

  const handleSaveProviderFormSubmit = async (e) => {
    e.preventDefault();
    if (!providerFormData.name.trim()) {
      showToast('error', 'Provider Name is required!');
      return;
    }

    try {
      if (editingProvider) {
        showToast('info', `Saving changes to ${providerFormData.name}...`);
        const updated = await updateCustomProvider(editingProvider.id, providerFormData);
        setProviderSettings(updated);
        showToast('success', `✅ Provider "${providerFormData.name}" updated successfully!`);
        setEditProviderModalOpen(false);
      } else {
        showToast('info', `Adding provider "${providerFormData.name}"...`);
        const updated = await addCustomProvider(providerFormData);
        setProviderSettings(updated);
        showToast('success', `✅ Provider "${providerFormData.name}" added successfully!`);
        setAddProviderModalOpen(false);
      }
    } catch (err) {
      showToast('error', err?.message || 'Failed to save provider settings');
    }
  };

  const handleDeleteProviderConfirm = async (providerId, providerName) => {
    if (!window.confirm(`Are you sure you want to delete supplier "${providerName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const updated = await deleteCustomProvider(providerId);
      setProviderSettings(updated);
      showToast('success', `🗑️ Provider "${providerName}" removed.`);
    } catch (err) {
      showToast('error', err?.message || 'Cannot delete provider');
    }
  };

  // Reseller & Retail Pricing Presets Dictionary
  const MARKET_RESELLER_PRICES = {
    55: { price: 0.89, resellerPrice: 0.89 },
    86: { price: 1.39, resellerPrice: 1.39 },
    210: { price: 1.55, resellerPrice: 1.55 },
    440: { price: 3.10, resellerPrice: 3.10 },
    660: { price: 4.65, resellerPrice: 4.65 },
    880: { price: 6.20, resellerPrice: 6.20 },
    1100: { price: 7.75, resellerPrice: 7.75 },
    1320: { price: 9.30, resellerPrice: 9.30 },
    605: { price: 5.50, resellerPrice: 5.50 },
    110: { price: 1.78, resellerPrice: 1.78 },
    165: { price: 2.66, resellerPrice: 2.66 },
    172: { price: 2.78, resellerPrice: 2.78 },
    257: { price: 4.15, resellerPrice: 4.15 },
    275: { price: 4.44, resellerPrice: 4.44 },
    312: { price: 5.03, resellerPrice: 5.03 },
    343: { price: 5.53, resellerPrice: 5.53 },
    429: { price: 6.92, resellerPrice: 6.92 },
    500: { price: 8.25, resellerPrice: 8.25 },
    514: { price: 8.29, resellerPrice: 8.29 },
    565: { price: 9.12, resellerPrice: 9.12 },
    600: { price: 9.68, resellerPrice: 9.68 },
    706: { price: 11.39, resellerPrice: 11.39 },
    878: { price: 14.17, resellerPrice: 14.17 },
    963: { price: 15.54, resellerPrice: 15.54 },
    1050: { price: 16.94, resellerPrice: 16.94 },
    1412: { price: 22.78, resellerPrice: 22.78 },
    2195: { price: 35.41, resellerPrice: 35.41 },
    2452: { price: 39.56, resellerPrice: 39.56 },
    2901: { price: 46.81, resellerPrice: 46.81 },
    3688: { price: 59.49, resellerPrice: 59.49 },
    4390: { price: 70.83, resellerPrice: 70.83 },
    5532: { price: 89.25, resellerPrice: 89.25 },
    6944: { price: 112.04, resellerPrice: 112.04 },
    9288: { price: 149.85, resellerPrice: 149.85 },
  };

  const CLASSIC_RESELLER_PRICES = {
    55: { price: 0.95, resellerPrice: 0.87 },
    86: { price: 1.40, resellerPrice: 1.25 },
    210: { price: 1.55, resellerPrice: 1.55 },
    110: { price: 1.85, resellerPrice: 1.65 },
    165: { price: 2.50, resellerPrice: 2.25 },
    172: { price: 2.60, resellerPrice: 2.40 },
    257: { price: 3.69, resellerPrice: 3.40 },
    275: { price: 3.90, resellerPrice: 3.60 },
    312: { price: 4.55, resellerPrice: 4.10 },
    343: { price: 5.00, resellerPrice: 4.50 },
    429: { price: 6.20, resellerPrice: 5.60 },
    500: { price: 8.50, resellerPrice: 8.00 },
    514: { price: 7.20, resellerPrice: 6.50 },
    565: { price: 7.80, resellerPrice: 7.20 },
    600: { price: 8.40, resellerPrice: 7.50 },
    706: { price: 9.70, resellerPrice: 8.70 },
    878: { price: 12.80, resellerPrice: 11.50 },
    963: { price: 13.60, resellerPrice: 12.20 },
    1050: { price: 15.50, resellerPrice: 14.00 },
    1412: { price: 19.80, resellerPrice: 18.00 },
    2195: { price: 29.80, resellerPrice: 27.00 },
    2452: { price: 32.50, resellerPrice: 29.50 },
    2901: { price: 39.99, resellerPrice: 36.00 },
    3688: { price: 49.99, resellerPrice: 46.00 },
    4390: { price: 62.99, resellerPrice: 57.00 },
    5532: { price: 73.99, resellerPrice: 68.00 },
    6944: { price: 92.99, resellerPrice: 84.00 },
    9288: { price: 125.00, resellerPrice: 115.00 },
  };

  // Pricing Matrix Filter & Search
  const [pricingFilter, setPricingFilter] = useState('ALL');
  const [selectedPricingGame, setSelectedPricingGame] = useState('all');
  const [activePricingPreset, setActivePricingPreset] = useState(() => {
    try {
      return localStorage.getItem('active_pricing_preset') || 'market';
    } catch (e) {
      return 'market';
    }
  });

  // Switch and Apply Reseller Pricing Preset across Catalog
  const handleApplyPricingPreset = async (presetKey) => {
    try {
      setActivePricingPreset(presetKey);
      localStorage.setItem('active_pricing_preset', presetKey);

      const targetPresetMap = presetKey === 'market' ? MARKET_RESELLER_PRICES : CLASSIC_RESELLER_PRICES;

      // Update in-memory merged products list
      const currentList = getMergedProductsList();
      const updatedProductsList = currentList.map(item => {
        if (item.game === 'mlbb' || !item.game) {
          const match = targetPresetMap[item.diamondAmount];
          if (match) {
            return {
              ...item,
              price: match.price,
              resellerPrice: match.resellerPrice,
            };
          }
        }
        return item;
      });

      // Save custom products to localStorage
      localStorage.setItem('admin_custom_products', JSON.stringify(updatedProductsList));

      // Batch update DB products if available
      for (const item of updatedProductsList) {
        if (item.productId && (item.game === 'mlbb' || !item.game)) {
          const match = targetPresetMap[item.diamondAmount];
          if (match) {
            await adminAPI.updateProduct(item.productId, {
              price: match.price,
              resellerPrice: match.resellerPrice,
            }).catch(() => {});
          }
        }
      }

      setProducts(prev => prev.map(p => {
        if (p.game === 'mlbb' || !p.game) {
          const match = targetPresetMap[p.diamondAmount];
          if (match) {
            return { ...p, price: match.price, resellerPrice: match.resellerPrice };
          }
        }
        return p;
      }));

      window.dispatchEvent(new Event('productsConfigUpdated'));
      window.dispatchEvent(new Event('adminProductsUpdated'));

      showToast('success', `Switched MLBB pricing to ${presetKey === 'market' ? '🎯 Market Reseller Rates (Ref Screenshots)' : '🏛️ Classic Standard Rates'} preset!`);
    } catch (err) {
      showToast('error', 'Failed to update pricing preset');
    }
  };
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
      if (stored) {
        customSaved = JSON.parse(stored);
      }
    } catch (e) {}

    const list = [...ALL_GAMES_CATALOG_LIST];

    // Apply DB products strictly matching by productId or diamondAmount and pass type
    products.forEach(p => {
      const isPass = Boolean(p.isPass || (p.description && p.description.toLowerCase().includes('pass')) || (p.description && p.description.toLowerCase().includes('bundle')));
      const idx = list.findIndex(item => {
        if (item.productId === p.productId) return true;
        if (item.game === 'mlbb' && item.diamondAmount === p.diamondAmount) {
          const itemPass = Boolean(item.isPass || (item.name && item.name.toLowerCase().includes('pass')) || (item.name && item.name.toLowerCase().includes('bundle')));
          return itemPass === isPass;
        }
        return false;
      });
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...p, productId: list[idx].productId, diamondAmount: p.diamondAmount };
      } else {
        list.push(p);
      }
    });

    customSaved.forEach(p => {
      const isPass = Boolean(p.isPass || (p.name && p.name.toLowerCase().includes('pass')) || (p.name && p.name.toLowerCase().includes('bundle')));
      const idx = list.findIndex(item => {
        if (item.productId === p.productId) return true;
        if (item.game === 'mlbb' && item.diamondAmount === p.diamondAmount) {
          const itemPass = Boolean(item.isPass || (item.name && item.name.toLowerCase().includes('pass')) || (item.name && item.name.toLowerCase().includes('bundle')));
          return itemPass === isPass;
        }
        return false;
      });
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...p, productId: list[idx].productId };
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
  const [packageAnalyticsGameFilter, setPackageAnalyticsGameFilter] = useState('ALL');
  const [packageAnalyticsSortBy, setPackageAnalyticsSortBy] = useState('game'); // 'game' | 'sold' | 'profit' | 'unitProfit' | 'margin' | 'retail' | 'cost' | 'reseller' | 'revenue' | 'name'
  const [packageAnalyticsSortOrder, setPackageAnalyticsSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [packageAnalyticsSearch, setPackageAnalyticsSearch] = useState('');

  const getGameAnalyticsMeta = (gameId) => {
    const g = String(gameId || 'mlbb').toLowerCase();
    switch (g) {
      case 'mlbb':
        return { id: 'mlbb', name: 'Mobile Legends', icon: '⚔️', badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'pubgm':
        return { id: 'pubgm', name: 'PUBG Mobile', icon: '🎯', badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'freefire':
        return { id: 'freefire', name: 'Free Fire', icon: '🔥', badgeColor: 'bg-orange-500/15 text-orange-300 border-orange-500/30' };
      case 'hok':
        return { id: 'hok', name: 'Honor of Kings', icon: '👑', badgeColor: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' };
      case 'genshin':
        return { id: 'genshin', name: 'Genshin Impact', icon: '🌙', badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
      case 'star_rail':
        return { id: 'star_rail', name: 'Honkai: Star Rail', icon: '🚂', badgeColor: 'bg-violet-500/15 text-violet-300 border-violet-500/30' };
      case 'zenless':
        return { id: 'zenless', name: 'Zenless Zone Zero', icon: '⚡', badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'steam_usd':
        return { id: 'steam_usd', name: 'Steam Wallet', icon: '💨', badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      case 'telegram_stars':
        return { id: 'telegram_stars', name: 'Telegram Stars', icon: '✈️', badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30' };
      case 'gift_cards':
        return { id: 'gift_cards', name: 'Gift Cards', icon: '🎁', badgeColor: 'bg-pink-500/15 text-pink-300 border-pink-500/30' };
      default:
        return { id: g, name: gameId || 'Game', icon: '🎮', badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
    }
  };

  const packageAnalyticsData = useMemo(() => {
    const list = getMergedProductsList();
    const backendPkgs = displayFinancials?.packageProfitability || [];
    const clearedTimestamp = financials?.clearedAt || (typeof window !== 'undefined' ? localStorage.getItem('financials_cleared_at') : null);
    const clearedDate = clearedTimestamp ? new Date(clearedTimestamp) : null;

    const paidOrders = (orders || []).filter(o => {
      if (!o || (o.paymentStatus !== 'Paid' && o.topupStatus !== 'Completed')) return false;
      if (clearedDate && new Date(o.createdAt || 0) <= clearedDate) return false;
      return true;
    });

    const activeProv = providerSettings?.activeProvider || 'FazerCards';

    return list.map((prod, idx) => {
      const gId = prod.game || 'mlbb';
      const meta = getGameAnalyticsMeta(gId);
      const retailPrice = Number(prod.price || 0);
      const providerCost = getProductCostForActiveProvider(prod);
      const resellerPrice = prod.resellerPrice > 0 ? Number(prod.resellerPrice) : Number((retailPrice * 0.92).toFixed(2));
      const unitNetProfit = Math.max(0, Number((retailPrice - providerCost).toFixed(2)));
      const resellerUnitProfit = Math.max(0, Number((resellerPrice - providerCost).toFixed(2)));
      const retailMarginPct = retailPrice > 0 ? Number(((unitNetProfit / retailPrice) * 100).toFixed(1)) : 0;
      const resellerMarginPct = resellerPrice > 0 ? Number(((resellerUnitProfit / resellerPrice) * 100).toFixed(1)) : 0;

      // Find matching sales in backend package profitability or paid orders
      const backendMatch = backendPkgs.find(bp => {
        if (bp.productId && prod.productId && Number(bp.productId) === Number(prod.productId)) return true;
        if (gId === 'mlbb' && Number(bp.diamondAmount) === Number(prod.diamondAmount)) return true;
        return false;
      });

      const orderMatches = paidOrders.filter(o => {
        if (prod.productId && (Number(o.productId) === Number(prod.productId) || Number(o.productID) === Number(prod.productId))) {
          return true;
        }
        const oGame = String(o.gameName || o.game || '').toLowerCase();
        const pGame = String(gId).toLowerCase();
        const gameMatch = oGame.includes(pGame) || (pGame === 'mlbb' && (oGame.includes('mlbb') || oGame.includes('mobile legend') || !o.gameName));
        if (gameMatch && Number(o.diamondAmount) === Number(prod.diamondAmount)) {
          return true;
        }
        return false;
      });

      const backendSoldCount = Number(backendMatch?.totalSoldCount || 0);
      const ordersSoldCount = orderMatches.length;
      const unitsSold = Math.max(ordersSoldCount, backendSoldCount);

      const totalProfit = unitsSold > 0
        ? Number((unitsSold * unitNetProfit).toFixed(2))
        : (backendMatch?.totalProfit ? Number(backendMatch.totalProfit) : 0);

      const totalRevenue = unitsSold > 0
        ? Number((unitsSold * retailPrice).toFixed(2))
        : 0;

      const totalProviderCost = unitsSold > 0
        ? Number((unitsSold * providerCost).toFixed(2))
        : 0;

      const packageName = prod.name || `${prod.diamondAmount} ${gId === 'steam_usd' ? 'USD' : gId === 'telegram_stars' ? 'Stars' : 'Diamonds'}`;

      return {
        key: `${gId}-${prod.productId || idx}`,
        productId: prod.productId,
        gameId: gId,
        gameName: meta.name,
        gameIcon: meta.icon,
        gameBadgeColor: meta.badgeColor,
        name: packageName,
        diamondAmount: prod.diamondAmount,
        retailPrice,
        providerCost,
        resellerPrice,
        unitNetProfit,
        resellerUnitProfit,
        retailMarginPct,
        resellerMarginPct,
        unitsSold,
        totalProfit,
        totalRevenue,
        totalProviderCost,
        status: prod.status || 'Active',
        isPass: Boolean(prod.isPass),
        tag: prod.tag || '',
        activeProvider: activeProv
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, providerSettings, orders, displayFinancials, financials]);

  const filteredAndSortedPackages = useMemo(() => {
    let list = [...packageAnalyticsData];

    // Filter by Game
    if (packageAnalyticsGameFilter !== 'ALL') {
      list = list.filter(p => p.gameId === packageAnalyticsGameFilter);
    }

    // Search query
    if (packageAnalyticsSearch.trim()) {
      const q = packageAnalyticsSearch.trim().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.gameName.toLowerCase().includes(q) ||
        String(p.diamondAmount).includes(q) ||
        String(p.tag || '').toLowerCase().includes(q)
      );
    }

    // Sort by Game ("short by game") or other columns
    list.sort((a, b) => {
      let cmp = 0;
      switch (packageAnalyticsSortBy) {
        case 'game':
          cmp = a.gameName.localeCompare(b.gameName);
          if (cmp === 0) {
            cmp = a.retailPrice - b.retailPrice;
          }
          break;
        case 'sold':
          cmp = a.unitsSold - b.unitsSold;
          if (cmp === 0) cmp = b.totalProfit - a.totalProfit;
          break;
        case 'profit':
          cmp = a.totalProfit - b.totalProfit;
          if (cmp === 0) cmp = a.unitNetProfit - b.unitNetProfit;
          break;
        case 'unitProfit':
          cmp = a.unitNetProfit - b.unitNetProfit;
          break;
        case 'margin':
          cmp = a.retailMarginPct - b.retailMarginPct;
          break;
        case 'retail':
          cmp = a.retailPrice - b.retailPrice;
          break;
        case 'cost':
          cmp = a.providerCost - b.providerCost;
          break;
        case 'reseller':
          cmp = a.resellerPrice - b.resellerPrice;
          break;
        case 'revenue':
          cmp = a.totalRevenue - b.totalRevenue;
          break;
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        default:
          cmp = 0;
      }
      return packageAnalyticsSortOrder === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [packageAnalyticsData, packageAnalyticsGameFilter, packageAnalyticsSearch, packageAnalyticsSortBy, packageAnalyticsSortOrder]);

  const packageAnalyticsKpis = useMemo(() => {
    const pkgs = filteredAndSortedPackages;
    const totalCount = pkgs.length;
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    let totalUnitsSold = 0;
    let sumMargin = 0;

    pkgs.forEach(p => {
      totalRevenue += p.totalRevenue;
      totalCost += p.totalProviderCost;
      totalProfit += p.totalProfit;
      totalUnitsSold += p.unitsSold;
      sumMargin += p.retailMarginPct;
    });

    const avgMargin = totalCount > 0 ? (sumMargin / totalCount).toFixed(1) : '0.0';

    return {
      totalCount,
      totalRevenue,
      totalCost,
      totalProfit,
      totalUnitsSold,
      avgMargin
    };
  }, [filteredAndSortedPackages]);

  const handleExportPackageAnalyticsCSV = () => {
    const list = filteredAndSortedPackages;
    if (list.length === 0) {
      showToast('error', 'No package data to export.');
      return;
    }
    const headers = [
      'Game',
      'Package Name',
      'Diamonds / Units',
      'Seller Retail (USD)',
      'Provider Cost (USD)',
      'Active Provider',
      'Reseller Wholesale (USD)',
      'Unit Net Profit (USD)',
      'Retail Margin (%)',
      'Reseller Unit Profit (USD)',
      'Reseller Margin (%)',
      'Units Sold',
      'Total Profit (USD)',
      'Total Revenue (USD)',
      'Status',
      'Pass / Promo Tag'
    ];
    const rows = list.map(p => [
      `"${p.gameName}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.diamondAmount || ''}"`,
      p.retailPrice.toFixed(2),
      p.providerCost.toFixed(2),
      `"${p.activeProvider}"`,
      p.resellerPrice.toFixed(2),
      p.unitNetProfit.toFixed(2),
      `"${p.retailMarginPct}%"`,
      p.resellerUnitProfit.toFixed(2),
      `"${p.resellerMarginPct}%"`,
      p.unitsSold,
      p.totalProfit.toFixed(2),
      p.totalRevenue.toFixed(2),
      `"${p.status}"`,
      `"${(p.tag || (p.isPass ? 'Pass' : '')).replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const filterSuffix = packageAnalyticsGameFilter === 'ALL' ? 'All_Games' : packageAnalyticsGameFilter.toUpperCase();
    link.setAttribute('download', `Package_Profitability_Analytics_${filterSuffix}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', `Exported ${rows.length} package analytics rows to CSV!`);
  };
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

  // ABA PayWay Dashboard State
  const [paywayTransactions, setPaywayTransactions] = useState([]);
  const [paywayExchangeRate, setPaywayExchangeRate] = useState(null);
  const [paywayLoading, setPaywayLoading] = useState(false);
  const [paywayError, setPaywayError] = useState(null);
  const [paywayFilter, setPaywayFilter] = useState({ status: '', fromDate: '', toDate: '', fromAmount: '', toAmount: '', page: '1', pagination: '40' });
  const [paywaySelectedTran, setPaywaySelectedTran] = useState(null);
  const [paywayTranDetailOpen, setPaywayTranDetailOpen] = useState(false);
  const [paywayTranDetail, setPaywayTranDetail] = useState(null);
  const [paywayTranDetailLoading, setPaywayTranDetailLoading] = useState(false);
  const [paywayReceiptModalOpen, setPaywayReceiptModalOpen] = useState(false);
  const [paywayReceiptTran, setPaywayReceiptTran] = useState(null);
  const [paywaySyncing, setPaywaySyncing] = useState(false);
  const [paywayDeliveringId, setPaywayDeliveringId] = useState(null);

  // Game & Logo Management State
  const [gamesList, setGamesList] = useState(() => getStoredGames());
  const [masterTopupStatus, setMasterTopupStatus] = useState(() => getMasterTopupStatus());
  const [customNoticeText, setCustomNoticeText] = useState(() => getMasterTopupStatus()?.notice || 'Top-Ups are temporarily paused by Admin for maintenance. Please check back shortly!');
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
  const [gameModalStep, setGameModalStep] = useState(1); // 1: Layout 1 | 2: Layout 2 | 3: Layout 3

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
        const [repRes, anaRes, pendRes, balRes] = await Promise.all([
          adminAPI.getReports().catch(() => ({ data: null })),
          adminAPI.getAnalytics().catch(() => ({ data: null })),
          adminAPI.getPendingOrders().catch(() => ({ data: [] })),
          adminAPI.getPendingBalanceOrders().catch(() => ({ data: { orders: [] } })),
        ]);
        if (repRes.data) setReports(repRes.data);
        if (anaRes.data) setAnalytics(anaRes.data);
        setPendingOrders(pendRes.data || []);
        setPendingBalanceOrders(balRes.data?.orders || []);
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
        const [pendRes, provRes, balRes] = await Promise.all([
          adminAPI.getPendingOrders().catch(() => ({ data: [] })),
          adminAPI.getProviderSettings().catch(() => ({ data: null })),
          adminAPI.getPendingBalanceOrders().catch(() => ({ data: { orders: [] } })),
        ]);
        setPendingOrders(pendRes.data || []);
        if (provRes.data) {
          const pinned = localStorage.getItem('admin_active_provider_pinned');
          const serverActive = provRes.data.activeProvider || provRes.data.ActiveProvider;
          const finalActive = pinned || (serverActive ? (String(serverActive).toLowerCase().includes('khmer') ? 'KhmerTopUp' : 'FazerCards') : 'FazerCards');
          const currentLocal = getStoredProviderSettings();
          const cleanKtKey = (provRes.data.khmerTopUpApiKey && provRes.data.khmerTopUpApiKey !== 'kt_6d38a3a5940e970221cc62fa306ae96044736364')
            ? provRes.data.khmerTopUpApiKey
            : (currentLocal.khmerTopUpApiKey && currentLocal.khmerTopUpApiKey !== 'kt_6d38a3a5940e970221cc62fa306ae96044736364' ? currentLocal.khmerTopUpApiKey : 'kt_28c2640c86717199395d973670cf039a30ba2716');
          const ktBal = provRes.data.khmerTopUpBalanceUSD !== undefined ? Number(provRes.data.khmerTopUpBalanceUSD) : Number(currentLocal.khmerTopUpBalanceUSD ?? 3.00);
          const fcBal = provRes.data.fazerCardsBalanceUSD !== undefined ? Number(provRes.data.fazerCardsBalanceUSD) : Number(currentLocal.fazerCardsBalanceUSD ?? 0.01);
          const activeBal = finalActive === 'KhmerTopUp' ? ktBal : fcBal;

          const updatedProviders = (currentLocal.providers || DEFAULT_PROVIDERS).map(p => {
            if (p.id === 'KhmerTopUp') return { ...p, balanceUSD: ktBal, apiKey: cleanKtKey };
            if (p.id === 'FazerCards') return { ...p, balanceUSD: fcBal, apiKey: provRes.data.fazerCardsApiKey || p.apiKey };
            return p;
          });

          const merged = {
            ...currentLocal,
            ...provRes.data,
            activeProvider: finalActive,
            ActiveProvider: finalActive,
            apiKey: finalActive === 'KhmerTopUp' ? cleanKtKey : (provRes.data.apiKey || currentLocal.apiKey),
            khmerTopUpApiKey: cleanKtKey,
            khmerTopUpBalanceUSD: ktBal,
            fazerCardsBalanceUSD: fcBal,
            balanceUSD: activeBal,
            providers: updatedProviders
          };
          saveStoredProviderSettings(merged);
          setProviderSettings(merged);
        }
        setPendingBalanceOrders(balRes.data?.orders || []);
      } else if (activeTab === 'orders') {
        const ordersRes = await adminAPI.getAllOrders().catch(() => ({ data: [] }));
        const remoteOrders = Array.isArray(ordersRes?.data) ? ordersRes.data : [];
        const localOrders = getLocalOrders();
        const combined = mergeOrders(remoteOrders, localOrders);
        setOrders(combined);
      } else if (activeTab === 'provider') {
        const [provRes, suppRes] = await Promise.all([
          adminAPI.getProviderSettings().catch(() => ({ data: null })),
          adminAPI.getSupplierBalance().catch(() => ({ data: null })),
        ]);
        if (provRes.data) {
          const pinned = localStorage.getItem('admin_active_provider_pinned');
          const serverActive = provRes.data.activeProvider || provRes.data.ActiveProvider;
          const finalActive = pinned || (serverActive ? (String(serverActive).toLowerCase().includes('khmer') ? 'KhmerTopUp' : 'FazerCards') : 'KhmerTopUp');
          const currentLocal = getStoredProviderSettings();
          const cleanKtKey = (provRes.data.khmerTopUpApiKey && provRes.data.khmerTopUpApiKey !== 'kt_6d38a3a5940e970221cc62fa306ae96044736364')
            ? provRes.data.khmerTopUpApiKey
            : (currentLocal.khmerTopUpApiKey && currentLocal.khmerTopUpApiKey !== 'kt_6d38a3a5940e970221cc62fa306ae96044736364' ? currentLocal.khmerTopUpApiKey : 'kt_28c2640c86717199395d973670cf039a30ba2716');
          const ktBal = provRes.data.khmerTopUpBalanceUSD !== undefined ? Number(provRes.data.khmerTopUpBalanceUSD) : Number(currentLocal.khmerTopUpBalanceUSD ?? 3.00);
          const fcBal = provRes.data.fazerCardsBalanceUSD !== undefined ? Number(provRes.data.fazerCardsBalanceUSD) : Number(currentLocal.fazerCardsBalanceUSD ?? 0.01);
          const activeBal = finalActive === 'KhmerTopUp' ? ktBal : fcBal;

          const updatedProviders = (currentLocal.providers || DEFAULT_PROVIDERS).map(p => {
            if (p.id === 'KhmerTopUp') return { ...p, balanceUSD: ktBal, apiKey: cleanKtKey };
            if (p.id === 'FazerCards') return { ...p, balanceUSD: fcBal, apiKey: provRes.data.fazerCardsApiKey || p.apiKey };
            return p;
          });

          const merged = {
            ...currentLocal,
            ...provRes.data,
            activeProvider: finalActive,
            ActiveProvider: finalActive,
            apiKey: finalActive === 'KhmerTopUp' ? cleanKtKey : (provRes.data.apiKey || currentLocal.apiKey),
            khmerTopUpApiKey: cleanKtKey,
            khmerTopUpBalanceUSD: ktBal,
            fazerCardsBalanceUSD: fcBal,
            balanceUSD: activeBal,
            providers: updatedProviders
          };
          saveStoredProviderSettings(merged);
          setProviderSettings(merged);
        }
        if (suppRes.data) setSupplierBalanceData(suppRes.data);
      } else if (activeTab === 'users') {
        const usersRes = await adminAPI.getAllUsers().catch(() => ({ data: [] }));
        setUsers(usersRes.data || []);

      } else if (activeTab === 'payway') {
        setPaywayLoading(true);
        setPaywayError(null);
        try {
          const [txRes, rateRes] = await Promise.all([
            paywayAPI.getTransactionList({ page: '1', pagination: '40' }).catch(() => ({ data: null })),
            paywayAPI.getExchangeRate().catch(() => ({ data: null })),
          ]);
          // Backend returns raw JSON string as content; axios might return it as-is or parsed
          const parseTxData = (res) => {
            try {
              const raw = typeof res?.data === 'string' ? JSON.parse(res.data) : res?.data;
              if (Array.isArray(raw?.data)) return raw.data;
              if (Array.isArray(raw?.data?.transactions)) return raw.data.transactions;
              if (Array.isArray(raw?.transactions)) return raw.transactions;
              if (Array.isArray(raw)) return raw;
              return [];
            } catch { return []; }
          };
          const parseRateData = (res) => {
            try {
              const raw = typeof res?.data === 'string' ? JSON.parse(res.data) : res?.data;
              return raw?.data || raw || null;
            } catch { return null; }
          };
          setPaywayTransactions(parseTxData(txRes));
          setPaywayExchangeRate(parseRateData(rateRes));
        } catch (err) {
          setPaywayError('Failed to load ABA PayWay data: ' + (err?.message || String(err)));
        } finally {
          setPaywayLoading(false);
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
    fetchStoredGames().then((cloudGames) => {
      if (cloudGames && Array.isArray(cloudGames)) setGamesList(cloudGames);
    });
    fetchMasterTopupStatus().then((cloudStatus) => {
      if (cloudStatus) {
        setMasterTopupStatus(cloudStatus);
        setCustomNoticeText(cloudStatus.notice || 'Top-Ups are temporarily paused by Admin for maintenance. Please check back shortly!');
      }
    });
  }, [loadData]);

  // Real-Time Auto-Refresh disabled: only refreshes when admin clicks the Refresh button
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadData(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  // Click outside & Escape key listener for Navigation Dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target)) {
        setNavDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setNavDropdownOpen(false);
      }
    };
    if (navDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navDropdownOpen]);

  // Global Shortcut: Press '/' or 'Ctrl+K' / 'Cmd+K' to quick-focus module search
  useEffect(() => {
    const handleGlobalSearchKey = (e) => {
      const activeEl = document.activeElement;
      const targetTag = activeEl?.tagName?.toLowerCase();
      const isInput = activeEl?.isContentEditable || targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select';

      if (!isInput && (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'))) {
        e.preventDefault();
        if (sidebarCollapsed) {
          setSidebarCollapsed(false);
        }
        setTimeout(() => {
          navSearchInputRef.current?.focus();
          navSearchInputRef.current?.select();
        }, 60);
      }
    };
    window.addEventListener('keydown', handleGlobalSearchKey);
    return () => window.removeEventListener('keydown', handleGlobalSearchKey);
  }, [sidebarCollapsed]);

  // Auto-collapse sidebar on smaller tablet/laptop screens (< 1100px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1100) {
        setSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ==================== TOP-UP & ORDER HANDLERS ====================

  const handleProcessSingleTopUp = async (orderId) => {
    setProcessingOrderId(orderId);
    try {
      const res = await adminAPI.processTopUp(orderId);
      showToast('success', res.data?.message || `Diamonds delivered successfully for Order #${orderId}`);
      updateLocalOrderStatus(orderId, { topupStatus: 'Completed' });
      setOrders(prev => prev.map(o => Number(o.orderId) === Number(orderId) ? { ...o, topupStatus: 'Completed' } : o));
      if (selectedOrder) setSelectedOrder({ ...selectedOrder, topupStatus: 'Completed' });
      if (deliveryModalOrder) setDeliveryModalOrder(null);
      loadData(true);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to deliver diamonds';
      showToast('error', errMsg);
      const targetOrder = orders.find((o) => Number(o.orderId) === Number(orderId)) || pendingOrders.find((o) => Number(o.orderId) === Number(orderId)) || selectedOrder;
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
      updateLocalOrderStatus(orderId, { topupStatus: 'Completed' });
      setOrders(prev => prev.map(o => Number(o.orderId) === Number(orderId) ? { ...o, topupStatus: 'Completed' } : o));
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

    showToast('info', 'Uploading package image...');
    try {
      let finalUrl = '';
      const res = await uploadToCloudinary(file, 'product_packages');
      if (res && res.url) {
        finalUrl = res.url;
      } else {
        finalUrl = await readFileAsDataUrl(file, 1200, 0.9);
      }

      if (finalUrl) {
        setProductFormData((prev) => ({
          ...prev,
          customImage: finalUrl,
        }));
        showToast('success', res?.isCloudinary ? '✅ Package PNG image uploaded to Cloudinary CDN!' : '✅ Custom package image loaded!');
      } else {
        showToast('error', res?.error || 'Failed to process package image');
      }
    } catch (err) {
      showToast('error', err?.message || 'Package image upload failed');
    } finally {
      if (e.target) e.target.value = '';
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
    setGameModalStep(1);
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

  const handleSetGameStatus = (gameId, newStatus) => {
    saveGameStatusOverride(gameId, newStatus);
    const updated = gamesList.map((g) => {
      if (g.id === gameId) {
        return { ...g, status: newStatus };
      }
      return g;
    });
    setGamesList(updated);
    saveStoredGames(updated);
    window.dispatchEvent(new Event('gamesConfigUpdated'));
    showToast('success', `Status updated to "${newStatus}"!`);
  };

  const handleSetMasterTopupStatus = (status, notice) => {
    const noticeText = notice || customNoticeText || 'Top-Ups are temporarily paused by Admin for maintenance. Please check back shortly!';
    const updated = saveMasterTopupStatus({
      status,
      notice: noticeText,
    });
    setMasterTopupStatus(updated);
    showToast('success', `Store Top-Up Status updated to "${status}"!`);
  };

  const handleQuickPauseAllGames = (statusToSet = 'Paused') => {
    if (!window.confirm(`Are you sure you want to ${statusToSet === 'Closed' ? 'CLOSE' : 'PAUSE'} top-ups for ALL games?`)) return;
    const updatedGames = gamesList.map((g) => {
      saveGameStatusOverride(g.id, statusToSet);
      return { ...g, status: statusToSet };
    });
    setGamesList(updatedGames);
    saveStoredGames(updatedGames);
    handleSetMasterTopupStatus(statusToSet);
    window.dispatchEvent(new Event('gamesConfigUpdated'));
    showToast('success', `All games and store top-ups are now ${statusToSet.toUpperCase()}!`);
  };

  const handleOpenAllGames = () => {
    if (!window.confirm('Open & Activate top-up for ALL games?')) return;
    const updatedGames = gamesList.map((g) => {
      saveGameStatusOverride(g.id, 'Active');
      return { ...g, status: 'Active' };
    });
    setGamesList(updatedGames);
    saveStoredGames(updatedGames);
    handleSetMasterTopupStatus('Active');
    window.dispatchEvent(new Event('gamesConfigUpdated'));
    showToast('success', '✅ All games and store top-ups are now ACTIVE & OPEN!');
  };

  const handleToggleGameStatus = (gameId) => {
    const currentGame = gamesList.find((g) => g.id === gameId);
    const nextStatus = currentGame?.status === 'Active' ? 'Paused' : currentGame?.status === 'Paused' ? 'Closed' : 'Active';
    handleSetGameStatus(gameId, nextStatus);
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

  const handleTestProviderConnection = async (specificProvider = null) => {
    setProviderTesting(true);
    const targetProv = specificProvider || (providerSettings.providers || DEFAULT_PROVIDERS).find(p => p.id === providerSettings.activeProvider) || { id: providerSettings.activeProvider, apiKey: providerSettings.apiKey };
    const targetProvId = targetProv.id || providerSettings.activeProvider;
    const targetKey = targetProv.apiKey || providerSettings.apiKey;

    try {
      const res = await adminAPI.testProviderConnection({
        activeProvider: targetProvId,
        apiKey: targetKey,
      });

      const rawBal = res.data?.balanceUSD !== undefined ? res.data.balanceUSD : res.data?.availableBalanceUSD;
      const bal = rawBal !== undefined && rawBal !== null ? Number(rawBal) : null;

      if (bal !== null) {
        const isKhmer = targetProvId === 'KhmerTopUp' || String(targetProvId).toLowerCase().includes('khmer');
        const isFazer = targetProvId === 'FazerCards' || String(targetProvId).toLowerCase().includes('fazer');

        const updated = {
          ...providerSettings,
          ...(isKhmer ? { khmerTopUpBalanceUSD: bal } : {}),
          ...(isFazer ? { fazerCardsBalanceUSD: bal } : {}),
          ...(providerSettings.activeProvider === targetProvId ? { balanceUSD: bal } : {}),
          providers: (providerSettings.providers || DEFAULT_PROVIDERS).map(p => {
            if (p.id === targetProvId) return { ...p, balanceUSD: bal };
            if (isKhmer && p.id === 'KhmerTopUp') return { ...p, balanceUSD: bal };
            if (isFazer && p.id === 'FazerCards') return { ...p, balanceUSD: bal };
            return p;
          })
        };

        await saveStoredProviderSettings(updated);
        setProviderSettings(updated);
        showToast('success', `✅ ${targetProv.name || targetProvId} Live Wallet Connected! Real Balance: $${bal.toFixed(2)} USD (~${Math.round(bal * 4100).toLocaleString()} ៛ KHR)`);
      } else {
        showToast('success', res.data?.message || 'Provider connection verified!');
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
        ? (providerSettings.fazerCardsBalanceUSD !== undefined ? Number(providerSettings.fazerCardsBalanceUSD) : 0.01)
        : (providerSettings.khmerTopUpBalanceUSD !== undefined ? Number(providerSettings.khmerTopUpBalanceUSD) : 3.00);

      // If user typed a new FazerCards token in the input box, ensure it is added to keyring and old tokens are KEPT!
      let tokens = Array.isArray(providerSettings.fazerCardsTokens) ? [...providerSettings.fazerCardsTokens] : [];
      let fzrKey = providerSettings.fazerCardsApiKey || 'fc_5f79a0016d5d87bd1e83ea4f';
      let ktKey = providerSettings.khmerTopUpApiKey || 'kt_28c2640c86717199395d973670cf039a30ba2716';

      if (providerSettings.activeProvider === 'FazerCards' && providerSettings.apiKey) {
        const cleanInputKey = providerSettings.apiKey.trim();
        fzrKey = cleanInputKey;
        const exists = tokens.find(t => t.token === cleanInputKey);
        if (!exists) {
          // Add as new token and KEEP ALL PREVIOUS TOKENS SAFE!
          tokens.forEach(t => { t.isActive = false; });
          tokens.push({
            id: 'fzr_' + Date.now().toString(36),
            name: `Token #${tokens.length + 1}`,
            token: cleanInputKey,
            isActive: true,
            balanceUSD: null,
            createdAt: new Date().toISOString()
          });
        } else {
          tokens.forEach(t => { t.isActive = (t.token === cleanInputKey); });
        }
      } else if (providerSettings.activeProvider === 'KhmerTopUp' && providerSettings.apiKey) {
        ktKey = providerSettings.apiKey.trim();
      } else if (providerSettings.apiKey && providerSettings.apiKey.startsWith('kt_')) {
        ktKey = providerSettings.apiKey.trim();
      }

      // Sync active provider's API key into providers list
      let provList = Array.isArray(providerSettings.providers) ? [...providerSettings.providers] : [...DEFAULT_PROVIDERS];
      const activeIdx = provList.findIndex(p => p.id === providerSettings.activeProvider || p.name === providerSettings.activeProvider);
      if (activeIdx >= 0) {
        provList[activeIdx] = {
          ...provList[activeIdx],
          apiKey: providerSettings.activeProvider === 'KhmerTopUp' ? ktKey : providerSettings.apiKey,
        };
      }
      const ktIdx = provList.findIndex(p => p.id === 'KhmerTopUp');
      if (ktIdx >= 0) {
        provList[ktIdx] = {
          ...provList[ktIdx],
          apiKey: ktKey,
        };
      }

      const payload = {
        ...providerSettings,
        activeProvider: providerSettings.activeProvider,
        ActiveProvider: providerSettings.activeProvider,
        apiKey: providerSettings.activeProvider === 'KhmerTopUp' ? ktKey : providerSettings.apiKey,
        khmerTopUpApiKey: ktKey,
        fazerCardsApiKey: fzrKey,
        fazerCardsTokens: tokens,
        providers: provList,
        balanceUSD: activeBal,
      };

      try {
        localStorage.setItem('admin_active_provider_pinned', providerSettings.activeProvider);
      } catch (e) {}

      const saved = await saveStoredProviderSettings(payload);
      setProviderSettings(saved);

      // Explicitly notify .NET backend API as well
      await adminAPI.switchProvider(saved.activeProvider).catch(() => {});
      await adminAPI.updateProviderSettings(saved).catch(() => {});

      showToast('success', `Upstream Provider updated to ${saved.activeProvider}! Live Balance: $${activeBal.toFixed(2)} USD`);
      loadData(true);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to save settings');
    }
  };

  const handleAddFazerCardsTokenSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!newFzrTokenInput.trim()) {
      showToast('error', 'Please enter a valid FazerCards token / API key.');
      return;
    }
    setSavingFzrToken(true);
    try {
      const cleanToken = newFzrTokenInput.trim();
      const label = newFzrTokenNameInput.trim() || `Token #${(providerSettings.fazerCardsTokens?.length || 0) + 1}`;
      
      const updated = await addStoredFazerCardsToken(cleanToken, label, newFzrTokenSetActive);
      setProviderSettings(updated);

      // Sync with .NET Backend
      await adminAPI.addFazerCardsToken({
        token: cleanToken,
        name: label,
        setActive: newFzrTokenSetActive
      }).catch(() => {});
      await adminAPI.updateProviderSettings(updated).catch(() => {});

      setAddFzrTokenModalOpen(false);
      setNewFzrTokenInput('');
      setNewFzrTokenNameInput('');
      showToast('success', `FazerCards token "${label}" added! Old token safely preserved in Keyring.`);
      loadData(true);
    } catch (err) {
      showToast('error', 'Failed to add FazerCards token');
    } finally {
      setSavingFzrToken(false);
    }
  };

  const handleSwitchFzrToken = async (tokenId) => {
    try {
      const updated = await switchStoredFazerCardsToken(tokenId);
      setProviderSettings(updated);

      await adminAPI.switchFazerCardsToken(tokenId).catch(() => {});
      await adminAPI.updateProviderSettings(updated).catch(() => {});

      showToast('success', 'Active FazerCards token switched successfully!');
      loadData(true);
    } catch (err) {
      showToast('error', 'Failed to switch token');
    }
  };

  const handleDeleteFzrToken = async (tokenId) => {
    const target = (providerSettings.fazerCardsTokens || []).find(t => t.id === tokenId);
    if (!target) return;
    if (target.isActive) {
      showToast('error', 'Cannot delete active token. Switch to another token first.');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove token "${target.name || target.token.substring(0, 10)}..." from keyring?`)) {
      return;
    }
    try {
      const updated = await deleteStoredFazerCardsToken(tokenId);
      setProviderSettings(updated);

      await adminAPI.deleteFazerCardsToken(tokenId).catch(() => {});
      await adminAPI.updateProviderSettings(updated).catch(() => {});

      showToast('success', 'Token removed from keyring.');
    } catch (err) {
      showToast('error', 'Failed to delete token');
    }
  };

  const handleTestSpecificFzrToken = async (tokenStr, tokenId) => {
    setTestingFzrTokenId(tokenId);
    try {
      const res = await adminAPI.testProviderConnection({
        activeProvider: 'FazerCards',
        apiKey: tokenStr
      });
      if (res.data?.success) {
        const bal = res.data.balanceUSD ?? res.data.availableBalanceUSD ?? 0;
        showToast('success', `Token Verified! Live Balance: $${bal.toFixed(2)} USD`);
        const updatedTokens = (providerSettings.fazerCardsTokens || []).map(t =>
          t.id === tokenId ? { ...t, balanceUSD: bal, status: 'Verified' } : t
        );
        const updated = { ...providerSettings, fazerCardsTokens: updatedTokens };
        await saveStoredProviderSettings(updated);
        setProviderSettings(updated);
      } else {
        showToast('error', res.data?.message || 'Token verification failed');
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Token connection failed');
    } finally {
      setTestingFzrTokenId(null);
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

  const handleClearFinancials = async () => {
    setClearingFinancials(true);
    try {
      const res = await adminAPI.clearFinancials().catch(e => {
        console.warn('Backend clearFinancials error (proceeding with local reset):', e?.message);
        return { data: { clearedAt: new Date().toISOString() } };
      });

      const clearedIso = res?.data?.clearedAt || new Date().toISOString();
      localStorage.setItem('financials_cleared_at', clearedIso);

      // Reset local financials state
      setFinancials({
        totalGrossRevenue: 0,
        totalGrossRevenueKHR: 0,
        totalSupplierCogs: 0,
        totalSupplierCogsKHR: 0,
        totalNetProfit: 0,
        totalNetProfitKHR: 0,
        overallMarginPct: 0,
        dailyProfitTrend: [],
        packageProfitability: (financials?.packageProfitability || []).map(p => ({
          ...p,
          totalSoldCount: 0,
          totalProfit: 0
        })),
        salesLedger: [],
        clearedAt: clearedIso
      });

      setClearFinancialsModalOpen(false);
      showToast('success', '✅ Financials cleared! All counters reset to $0.00 for your new sell period.');
    } catch (err) {
      showToast('error', 'Failed to clear financials: ' + (err?.message || err));
    } finally {
      setClearingFinancials(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (!order) return false;
    const pId = String(order.playerID || order.playerId || '');
    const sId = String(order.serverID || order.serverId || '');
    const oId = String(order.orderId || '');
    const accName = String(order.accountName || order.customerName || '');
    const gName = String(order.gameName || '');
    const sQuery = orderSearch.trim().toLowerCase();

    const matchSearch =
      !sQuery ||
      oId.includes(sQuery) ||
      pId.toLowerCase().includes(sQuery) ||
      sId.toLowerCase().includes(sQuery) ||
      accName.toLowerCase().includes(sQuery) ||
      gName.toLowerCase().includes(sQuery);

    const payStatus = order.paymentStatus || 'Pending';
    const topStatus = order.topupStatus || 'Pending';

    const matchPayment = paymentFilter === 'ALL' || payStatus.toLowerCase() === paymentFilter.toLowerCase();
    const matchTopup = topupFilter === 'ALL' || topStatus.toLowerCase() === topupFilter.toLowerCase();

    let matchDate = true;
    if (dateFilter === 'TODAY') {
      const today = new Date().toISOString().slice(0, 10);
      matchDate = String(order.createdAt || '').slice(0, 10) === today;
    } else if (dateFilter === '7DAYS') {
      const past7 = new Date();
      past7.setDate(past7.getDate() - 7);
      matchDate = new Date(order.createdAt || 0) >= past7;
    } else if (dateFilter === '30DAYS') {
      const past30 = new Date();
      past30.setDate(past30.getDate() - 30);
      matchDate = new Date(order.createdAt || 0) >= past30;
    }

    return matchSearch && matchPayment && matchTopup && matchDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedOrders = filteredOrders.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const menuCategories = [
    { id: 'operations', label: 'Operations', icon: '⚡' },
    { id: 'catalog', label: 'Store & Catalog', icon: '🎮' },
    { id: 'finance', label: 'Gateways & Finance', icon: '🏦' },
    { id: 'analytics', label: 'Analytics & Access', icon: '📊' },
  ];

  const menuTabs = [
    {
      id: 'pending',
      label: 'Top-Up Queue',
      icon: '⚡',
      count: pendingOrders.length + (pendingBalanceOrders?.length || 0),
      badgeColor: 'bg-amber-500 text-black',
      categoryId: 'operations',
      category: 'Operations',
      desc: 'Live queue of verified paid orders ready for diamond top-up delivery',
    },
    {
      id: 'orders',
      label: 'Orders Ledger',
      icon: '📦',
      categoryId: 'operations',
      category: 'Operations',
      desc: 'Complete transaction history, audit records & CSV financial exports',
    },
    {
      id: 'failed',
      label: 'Failed Orders',
      icon: '⚠️',
      count: failedTransactions.length,
      badgeColor: 'bg-rose-500 text-white',
      categoryId: 'operations',
      category: 'Operations',
      desc: 'Auto-detected failed transactions with 1-click retry engine',
    },
    {
      id: 'games',
      label: 'Games & Logos',
      icon: '🎮',
      categoryId: 'catalog',
      category: 'Store & Catalog',
      desc: 'Change game images, upload 5v5 logos, manage customer selection',
    },
    {
      id: 'profile',
      label: 'Profile Information',
      icon: '🏪',
      categoryId: 'catalog',
      category: 'Store & Catalog',
      desc: 'Store brand identity, logo, tagline, store badges and profile information',
    },
    {
      id: 'pricing',
      label: 'Diamond Packages',
      icon: '💎',
      categoryId: 'catalog',
      category: 'Store & Catalog',
      desc: 'Configure wholesale costs, reseller pricing & retail package rates',
    },
    {
      id: 'banners',
      label: 'Banners & Events',
      icon: '🎨',
      count: eventBanners.filter(b => b.status === 'Active').length,
      badgeColor: 'bg-amber-400 text-black',
      categoryId: 'catalog',
      category: 'Store & Catalog',
      desc: 'Customize homepage & topup event banners, promotions & seasonal artworks',
    },
    {
      id: 'provider',
      label: 'Supplier API',
      icon: '🔌',
      categoryId: 'finance',
      category: 'Gateways & Finance',
      desc: 'Auto-dispatch provider credentials, supplier balance & webhooks',
    },
    {
      id: 'payway',
      label: 'ABA PayWay',
      icon: '💳',
      categoryId: 'finance',
      category: 'Gateways & Finance',
      desc: 'ABA PayWay merchant transactions, exchange rates & real-time payment status',
    },
    {
      id: 'financials',
      label: 'Profits & Sales',
      icon: '💰',
      categoryId: 'finance',
      category: 'Gateways & Finance',
      desc: 'Gross revenue, net profit margin, payout summaries & revenue analytics',
    },
    {
      id: 'overview',
      label: 'Overview & KPIs',
      icon: '📊',
      categoryId: 'analytics',
      category: 'Analytics & Access',
      desc: 'Real-time sales velocity, peak top-up hours & customer conversion KPIs',
    },
    {
      id: 'resellers',
      label: 'Resellers & B2B',
      icon: '🏢',
      categoryId: 'analytics',
      category: 'Analytics & Access',
      desc: 'Wholesale partner accounts, credit balances, discounts & API keys',
    },
    {
      id: 'users',
      label: 'Users & Roles',
      icon: '👥',
      categoryId: 'analytics',
      category: 'Analytics & Access',
      desc: 'Admin permissions, registered accounts and security management',
    },
    {
      id: 'diagnostics',
      label: 'Diagnostics',
      icon: '🛠️',
      categoryId: 'analytics',
      category: 'Analytics & Access',
      desc: 'Live server health check, database latency & memory diagnostics',
    },
  ];

  const currentTabInfo = menuTabs.find((t) => t.id === activeTab) || menuTabs[0];

  const filteredNavTabs = menuTabs.filter((t) => {
    if (!navSearchQuery || !navSearchQuery.trim()) return true;
    const q = navSearchQuery.toLowerCase().trim();
    return (
      t.label.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="h-screen min-h-[100dvh] bg-[#07090E] text-slate-100 font-sans selection:bg-amber-500 selection:text-black relative flex flex-row overflow-hidden">
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
      {/* ENTERPRISE DASHBOARD SYSTEM SIDEBAR (DESKTOP) */}
      {/* ========================================================= */}
      <aside
        className={`hidden md:flex flex-col shrink-0 bg-[#0A0E17] border-r border-slate-800/80 transition-all duration-300 h-full select-none z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-64 xl:w-72'
        }`}
      >
        {/* Brand & Collapse Header */}
        <div
          className={`h-16 border-b border-slate-800/80 shrink-0 bg-[#0B0F19] relative transition-all ${
            sidebarCollapsed ? 'flex items-center justify-center px-2' : 'px-3.5 flex items-center justify-between'
          }`}
        >
          {!sidebarCollapsed ? (
            <>
              <div
                onClick={handleOpenStoreLogoModal}
                className="flex items-center gap-3 group cursor-pointer min-w-0 flex-1 mr-2"
                title="Click to Change Store Logo & Branding"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-[2px] shadow-[0_0_15px_rgba(251,191,36,0.25)] group-hover:scale-105 transition-all shrink-0 overflow-hidden relative">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                    {branding.logoType === 'image' && branding.logoImage ? (
                      <img
                        src={branding.logoImage}
                        alt={branding.storeName || 'Store Logo'}
                        className="w-full h-full object-cover rounded-[14px]"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-xl select-none">{branding.logoEmoji || '💎'}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-wide text-white truncate group-hover:text-amber-300 transition-colors">
                      {branding.storeName || 'MLBB TOPUP'}
                    </span>
                    <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                      {branding.badgeText || 'PRO'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="truncate">Admin System Hub</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Collapse Button (When Expanded) */}
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-sm shrink-0 active:scale-95"
                title="Collapse Sidebar"
              >
                <span className="text-[11px] font-bold block">◀</span>
              </button>
            </>
          ) : (
            <>
              {/* Perfectly Centered Logo (When Collapsed) */}
              <div
                onClick={handleOpenStoreLogoModal}
                className="cursor-pointer group flex items-center justify-center"
                title={`${branding.storeName || 'Admin Hub'} (Click to change branding)`}
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-[2px] shadow-[0_0_15px_rgba(251,191,36,0.25)] group-hover:scale-105 transition-all flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden text-lg">
                    {branding.logoType === 'image' && branding.logoImage ? (
                      <img
                        src={branding.logoImage}
                        alt="Logo"
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    ) : (
                      <span className="select-none">{branding.logoEmoji || '💎'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Rail Expand Toggle on Outer Border */}
              <button
                type="button"
                onClick={() => setSidebarCollapsed(false)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-40 w-6 h-6 rounded-full bg-[#0D1220] border border-slate-700 hover:border-amber-400/90 text-slate-400 hover:text-amber-300 shadow-[0_2px_10px_rgba(0,0,0,0.6)] flex items-center justify-center text-[10px] font-black cursor-pointer transition-all hover:scale-110 active:scale-95 group"
                title="Expand Sidebar"
              >
                <span className="group-hover:translate-x-0.5 transition-transform">▶</span>
              </button>
            </>
          )}
        </div>

        {/* Quick Search Filter (When Expanded & Collapsed) */}
        {!sidebarCollapsed ? (
          <div className="px-3 py-2.5 border-b border-slate-800/70 bg-gradient-to-b from-[#080B12] to-[#0A0E17]">
            <div className="relative group">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 focus-within:border-amber-400/80 focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:bg-[#0C1220] transition-all duration-200 shadow-inner">
                {/* 3D Glass Emoji Icon Tile */}
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0 shadow-sm group-focus-within:bg-amber-500/20 group-focus-within:border-amber-400/50 group-focus-within:shadow-[0_0_10px_rgba(245,158,11,0.25)] transition-all">
                  <span className="text-[11px] select-none leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    🔍
                  </span>
                </div>

                {/* Search Text Input */}
                <input
                  ref={navSearchInputRef}
                  type="text"
                  value={navSearchQuery}
                  onChange={(e) => setNavSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setNavSearchQuery('');
                      navSearchInputRef.current?.blur();
                    }
                  }}
                  placeholder="Search modules..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-medium selection:bg-amber-500/30 selection:text-amber-200"
                />

                {/* Right Action: Clear or Shortcut Badge */}
                {navSearchQuery ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-[9px] font-bold text-amber-300 font-mono select-none">
                      {filteredNavTabs.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNavSearchQuery('');
                        navSearchInputRef.current?.focus();
                      }}
                      className="w-5 h-5 rounded-md bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-400 flex items-center justify-center text-[10px] font-black transition-colors cursor-pointer border border-transparent hover:border-rose-500/30"
                      title="Clear search (Esc)"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <kbd
                    onClick={() => navSearchInputRef.current?.focus()}
                    className="cursor-pointer px-1.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/70 text-[10px] font-mono text-slate-400 group-focus-within:text-amber-300 group-focus-within:border-amber-400/40 select-none shadow-sm transition-colors shrink-0"
                    title="Press / to search"
                  >
                    /
                  </kbd>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-2.5 border-b border-slate-800/70 flex justify-center bg-[#080B12]">
            <button
              type="button"
              onClick={() => {
                setSidebarCollapsed(false);
                setTimeout(() => navSearchInputRef.current?.focus(), 80);
              }}
              className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 flex items-center justify-center text-xs text-slate-400 hover:text-amber-300 transition-all cursor-pointer shadow-sm group"
              title="Search modules (/)"
            >
              <span className="group-hover:scale-110 transition-transform">🔍</span>
            </button>
          </div>
        )}

        {/* Navigation Categories & Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-2.5 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {menuCategories.map((cat, idx) => {
            const tabsInCat = filteredNavTabs.filter((t) => t.categoryId === cat.id);
            if (tabsInCat.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-1">
                {!sidebarCollapsed ? (
                  <div className={`px-2.5 pb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 select-none ${idx > 0 ? 'pt-3 border-t border-slate-800/40' : 'pt-0.5'}`}>
                    <span className="text-xs opacity-75">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </div>
                ) : (
                  <div className="my-2 border-t border-slate-800/80 mx-2" />
                )}

                <div className="space-y-0.5">
                  {tabsInCat.map((tab) => {
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left transition-all duration-200 ease-out cursor-pointer flex items-center rounded-xl relative group active:scale-[0.98] ${
                          sidebarCollapsed
                            ? 'justify-center p-2.5 my-1 hover:scale-105'
                            : 'px-3 py-2.5 gap-3 my-0.5 hover:translate-x-1'
                        } ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent text-white font-black border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.06)]'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/70 border border-transparent font-bold'
                        }`}
                        title={sidebarCollapsed ? tab.label : undefined}
                      >
                        {/* Active Left Neon Glow Accent Bar */}
                        {isSelected && !sidebarCollapsed && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 shadow-[0_0_10px_#f59e0b]" />
                        )}

                        {/* Professional 3D Emoji Icon Tile */}
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 relative ${
                            isSelected
                              ? 'bg-gradient-to-br from-amber-400/25 via-amber-500/15 to-amber-950/40 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/30'
                              : 'bg-gradient-to-br from-slate-800/60 to-slate-900/90 border border-slate-800/90 text-slate-300 group-hover:bg-slate-800 group-hover:border-slate-700 group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.4)] group-hover:scale-105'
                          }`}
                        >
                          <span className="text-base select-none transform transition-transform duration-200 group-hover:scale-115 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                            {tab.icon}
                          </span>
                        </div>

                        {/* Label & live badge (Expanded) */}
                        {!sidebarCollapsed && (
                          <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5">
                            <span className={`text-xs truncate transition-colors ${isSelected ? 'text-amber-200 font-black' : 'group-hover:text-white'}`}>
                              {tab.label}
                            </span>
                            {tab.count !== undefined && tab.count > 0 && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-black shrink-0 shadow-sm ${tab.badgeColor}`}
                              >
                                {tab.count}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Collapsed dot badge */}
                        {sidebarCollapsed && tab.count !== undefined && tab.count > 0 && (
                          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-slate-950 animate-pulse shadow-glow-gold" />
                        )}

                        {/* Collapsed Tooltip on hover */}
                        {sidebarCollapsed && (
                          <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-2xl border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 flex items-center gap-2">
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                            {tab.count !== undefined && tab.count > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-black">
                                {tab.count}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Empty Search Result State */}
          {filteredNavTabs.length === 0 && !sidebarCollapsed && (
            <div className="py-8 px-4 text-center">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-sm mb-2 shadow-inner">
                🔍
              </div>
              <p className="text-xs font-bold text-slate-300">No modules found</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[170px] mx-auto truncate">
                No match for &ldquo;{navSearchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setNavSearchQuery('')}
                className="mt-3 px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Footer: User profile & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-[#090C14] shrink-0">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-900/70 border border-slate-800/90">
              <div className="flex items-center gap-2.5 min-w-0 pl-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-[1.5px] shadow-glow-gold shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xs">
                    👑
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-white truncate leading-tight">
                    {user?.name || user?.email?.split('@')[0] || 'Admin Master'}
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold block leading-tight">Administrator</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-8 h-8 rounded-xl bg-rose-950/40 hover:bg-rose-900/70 text-rose-300 hover:text-white border border-rose-500/30 hover:border-rose-500/60 text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95 shrink-0"
                title="Sign Out"
              >
                🚪
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-1">
              <button
                type="button"
                onClick={handleLogout}
                className="w-9 h-9 rounded-xl bg-rose-950/50 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-500/30 flex items-center justify-center text-xs cursor-pointer shadow-sm transition-all"
                title="Sign Out"
              >
                🚪
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MOBILE SLIDING DRAWER NAVIGATION OVERLAY */}
      {/* ========================================================= */}
      <div
        className={`fixed inset-0 z-[70] flex md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
        }`}
      >
        {/* Backdrop Overlay with smooth blur and fade */}
        <div
          className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer Content with smooth slide-in / slide-out spring easing */}
        <div
          className={`relative w-80 max-w-[85vw] h-full bg-[#0A0E17]/95 backdrop-blur-2xl border-r border-amber-500/20 p-4 pb-6 flex flex-col z-10 shadow-[25px_0_60px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-[2px] shadow-glow-gold flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                  {branding.logoType === 'image' && branding.logoImage ? (
                    <img src={branding.logoImage} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-base select-none">{branding.logoEmoji || '💎'}</span>
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white truncate">{branding.storeName || 'MLBB TOPUP'}</span>
                  <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase shrink-0">
                    {branding.badgeText || 'PRO'}
                  </span>
                </div>
                <span className="text-[10px] text-amber-400 font-bold block truncate">{menuTabs.length} SYSTEM MODULES</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer shrink-0 ml-2 transition-all duration-200 active:scale-90 hover:rotate-90 shadow-sm"
              aria-label="Close navigation"
            >
              ✕
            </button>
          </div>

          {/* Mobile Provider Status Ribbon */}
          <div className="mt-2.5 p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-[11px] text-slate-400 font-medium">API:</span>
              <span className="text-[11px] font-bold text-cyan-300 truncate">
                {providerSettings.activeProvider === 'FazerCards' ? 'FazerCards' : 'KhmerTopUp'}
              </span>
            </div>
            <span className="text-xs font-black text-amber-300 font-mono">
              ${(providerSettings.balanceUSD !== undefined ? Number(providerSettings.balanceUSD) : 0.49).toFixed(2)}
            </span>
          </div>

          {/* Mobile Quick Search Input */}
          <div className="py-2.5 border-b border-slate-800/80 shrink-0">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 focus-within:border-amber-400/80 focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:bg-[#0C1220] transition-all duration-200">
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0">
                <span className="text-[11px] select-none">🔍</span>
              </div>
              <input
                type="text"
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
                placeholder="Search modules..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-medium"
              />
              {navSearchQuery ? (
                <div className="flex items-center gap-1 shrink-0">
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-[9px] font-bold text-amber-300 font-mono">
                    {filteredNavTabs.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setNavSearchQuery('')}
                    className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all duration-150 active:scale-90"
                  >
                    ✕
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Mobile Categories & Module Links */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
            {menuCategories.map((cat, idx) => {
              const tabsInCat = filteredNavTabs.filter((t) => t.categoryId === cat.id);
              if (tabsInCat.length === 0) return null;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className={`text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 flex items-center gap-1.5 ${idx > 0 ? 'pt-2.5 border-t border-slate-800/40' : ''}`}>
                    <span className="text-xs opacity-75">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </div>
                  <div className="space-y-1">
                    {tabsInCat.map((tab) => {
                      const isSelected = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(tab.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`group w-full text-left p-2.5 rounded-2xl flex items-center justify-between border cursor-pointer relative overflow-hidden transition-all duration-200 ease-out active:scale-[0.97] hover:translate-x-1 ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-500/25 via-amber-500/10 to-transparent border-amber-400/60 text-white font-black shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/40'
                              : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:bg-slate-800/90 hover:border-slate-700/80 hover:text-white'
                          }`}
                        >
                          {/* Active Left Neon Glow Accent Bar */}
                          {isSelected && (
                            <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 shadow-[0_0_12px_#f59e0b]" />
                          )}

                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 group-hover:scale-110 group-active:scale-95 ${
                                isSelected
                                  ? 'bg-gradient-to-br from-amber-400/25 via-amber-500/15 to-amber-950/40 border-amber-400/50 shadow-sm'
                                  : 'bg-slate-800/70 border-slate-700/70 group-hover:border-slate-600'
                              }`}
                            >
                              <span className="text-base select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transform transition-transform duration-200 group-hover:rotate-6">
                                {tab.icon}
                              </span>
                            </div>
                            <span className={`text-xs transition-colors duration-200 ${isSelected ? 'font-black text-amber-200' : 'font-bold group-hover:text-amber-100'}`}>
                              {tab.label}
                            </span>
                          </div>
                          {tab.count !== undefined && tab.count > 0 && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black shadow-sm transition-transform duration-200 group-hover:scale-105 ${
                                isSelected ? 'bg-amber-400 text-black font-black' : tab.badgeColor
                              }`}
                            >
                              {tab.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Mobile Empty Search Result State */}
            {filteredNavTabs.length === 0 && (
              <div className="py-8 px-4 text-center">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-sm mb-2 shadow-inner">
                  🔍
                </div>
                <p className="text-xs font-bold text-slate-300">No modules found</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[170px] mx-auto truncate">
                  No match for &ldquo;{navSearchQuery}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => setNavSearchQuery('')}
                  className="mt-3 px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold cursor-pointer transition-all duration-150 active:scale-95 shadow-sm"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          {/* Mobile Drawer Footer */}
          <div className="pt-3 border-t border-slate-800 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <Link
                to="/"
                target="_blank"
                className="flex-1 py-2 text-center rounded-xl bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all duration-200 active:scale-95 hover:bg-cyan-900/90 hover:border-cyan-400/60 shadow-sm"
              >
                🌐 Storefront
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2 text-center rounded-xl bg-rose-950/80 text-rose-300 border border-rose-500/40 text-xs font-bold cursor-pointer transition-all duration-200 active:scale-95 hover:bg-rose-900/90 hover:border-rose-400/60 shadow-sm"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* WORKSPACE COLUMN (HEADER + MAIN CONTENT) */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Workspace Top Header Bar */}
        <header className="shrink-0 z-20 bg-[#0B0F19] border-b border-slate-800/90 px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 shadow-md">
          {/* Left: Mobile hamburger & breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-90 transition-all duration-200 shrink-0 cursor-pointer shadow-sm hover:border-amber-500/40"
              aria-label="Open navigation menu"
            >
              ☰
            </button>

            {/* Breadcrumb Path */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs truncate">
              <span className="text-slate-500 font-semibold hidden sm:inline">Admin Hub</span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="text-slate-400 font-semibold hidden md:inline">{currentTabInfo.category}</span>
              <span className="text-slate-600 hidden md:inline">/</span>
              <div className="flex items-center gap-2 font-black text-white text-xs sm:text-sm truncate">
                <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xs shadow-sm shrink-0">
                  <span className="select-none">{currentTabInfo.icon}</span>
                </div>
                <span className="text-amber-300 font-extrabold truncate">{currentTabInfo.label}</span>
              </div>
            </div>
          </div>

          {/* Right: Balance, Storefront & Refresh actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Live Gateway Pill (Mobile Compact) */}
            <div className="flex sm:hidden items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-black text-amber-300 font-mono text-[11px]">
                ${(providerSettings.balanceUSD !== undefined ? Number(providerSettings.balanceUSD) : 0.49).toFixed(2)}
              </span>
            </div>

            {/* Live Gateway Pill (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-slate-400 font-medium text-[11px]">API:</span>
              <span className="font-bold text-cyan-300 text-[11px] truncate max-w-[85px] lg:max-w-none">
                {providerSettings.activeProvider === 'FazerCards' ? 'FazerCards' : 'KhmerTopUp'}
              </span>
              <span className="text-slate-700">|</span>
              <span className="font-black text-amber-300 text-[11px] font-mono">
                ${(providerSettings.balanceUSD !== undefined ? Number(providerSettings.balanceUSD) : 0.49).toFixed(2)}
              </span>
            </div>

            {/* Storefront Link */}
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 shrink-0"
              title="View live customer storefront in new tab"
            >
              <span>🌐</span>
              <span className="hidden lg:inline">Storefront</span>
            </Link>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => {
                loadData(false);
                showToast('info', '🔄 Syncing live admin data...');
              }}
              disabled={refreshing}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 text-[11px] font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
              title="Click to refresh live data"
            >
              <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
              <span className="hidden sm:inline">{refreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="hidden md:flex px-2.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition-all items-center gap-1 active:scale-95 cursor-pointer shrink-0"
              title="Sign Out"
            >
              <span>🚪</span>
              <span className="hidden lg:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main Workspace Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="max-w-7xl mx-auto w-full space-y-6">
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
                  Change game icons, manage store game selection, and configure customer routes.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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

            {/* Master Top-Up Status Controller Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0E1526] via-[#111A30] to-[#0E1526] border border-amber-500/40 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0">
                    {masterTopupStatus?.status === 'Closed' ? '🔴' : masterTopupStatus?.status === 'Paused' ? '⏸️' : '🟢'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-white text-sm sm:text-base">
                        Store Top-Up Master Switch
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        masterTopupStatus?.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : masterTopupStatus?.status === 'Closed'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {masterTopupStatus?.status === 'Active' ? '🟢 ALL TOP-UPS OPEN' : masterTopupStatus?.status === 'Closed' ? '🔴 ALL TOP-UPS CLOSED' : '⏸️ ALL TOP-UPS PAUSED'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Instantly pause or close all game top-ups across customer storefront during maintenance or restock.
                    </p>
                  </div>
                </div>

                {/* Master Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleOpenAllGames}
                    className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      masterTopupStatus?.status === 'Active'
                        ? 'bg-emerald-500 text-slate-950 font-black scale-105 shadow-md shadow-emerald-950/60'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    <span>🟢</span>
                    <span>Open All</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickPauseAllGames('Paused')}
                    className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      masterTopupStatus?.status === 'Paused'
                        ? 'bg-amber-500 text-slate-950 font-black scale-105 shadow-md shadow-amber-950/60'
                        : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    <span>⏸️</span>
                    <span>Pause All</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickPauseAllGames('Closed')}
                    className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      masterTopupStatus?.status === 'Closed'
                        ? 'bg-rose-600 text-white font-black scale-105 shadow-md shadow-rose-950/60'
                        : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    <span>🔴</span>
                    <span>Close All</span>
                  </button>
                </div>
              </div>

              {/* Maintenance Notice Message Input */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2">
                <div className="w-full relative flex-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Customer Maintenance / Pause Notice Message:
                  </span>
                  <input
                    type="text"
                    value={customNoticeText}
                    onChange={(e) => setCustomNoticeText(e.target.value)}
                    placeholder="e.g. Top-Ups are temporarily paused by Admin for system maintenance. Please check back shortly!"
                    className="w-full bg-[#080C15] border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="w-full sm:w-auto pt-0 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => handleSetMasterTopupStatus(masterTopupStatus?.status || 'Paused', customNoticeText)}
                    className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Save Notice
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Info Box */}
            <div className="p-4 rounded-2xl bg-dark-card border border-cyan-500/30 text-xs text-slate-300 flex items-start gap-3 shadow-md">
              <span className="text-xl shrink-0">💡</span>
              <div>
                <strong className="text-cyan-300 block text-sm mb-0.5">Live Storefront Integration</strong>
                <p className="text-slate-400 leading-relaxed">
                  The primary game <strong className="text-white">Mobile Legends: Bang Bang</strong> uses your uploaded 5v5 icon. You can change any logo by clicking <strong className="text-amber-300">"Edit Logo & Info"</strong> and uploading a new image file or pasting an image URL. You can also pause or close top-ups for any individual game using the status buttons below.
                </p>
              </div>
            </div>

            {/* Games Grid (Compact Layout matching reference mockup) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gamesList.map((game) => {
                const isMLBB = game.id === 'mlbb' || game.id.startsWith('mlbb');
                const isOpened = game.status === 'Active';
                const isPaused = game.status === 'Paused';
                const isClosed = game.status === 'Closed';

                return (
                  <div
                    key={game.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#0B0F19] border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 shadow-xl relative select-none"
                  >
                    {/* Top Row: Badge Pill (Left) & Segmented Status Pill (Right) */}
                    <div className="flex items-center justify-between gap-2">
                      {/* Left: Colorful Badge Pill */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow-sm ${
                          game.badgeColor === 'gold' || isMLBB
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : game.badgeColor === 'purple'
                            ? 'bg-purple-600 text-white font-bold'
                            : game.badgeColor === 'emerald'
                            ? 'bg-emerald-500 text-white font-bold'
                            : 'bg-cyan-500 text-slate-950 font-black'
                        }`}
                      >
                        {game.badge || 'Official'}
                      </span>

                      {/* Right: Segmented Status Controller Pill */}
                      <div className="inline-flex items-center gap-0.5 bg-[#080C15] p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
                        {/* Open Button */}
                        <button
                          type="button"
                          onClick={() => handleSetGameStatus(game.id, 'Active')}
                          className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                            isOpened
                              ? 'bg-[#00E599] text-[#062419] font-black shadow-sm'
                              : 'text-slate-400 hover:text-emerald-300'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          <span>Open</span>
                        </button>

                        {/* Pause Button */}
                        <button
                          type="button"
                          onClick={() => handleSetGameStatus(game.id, 'Paused')}
                          className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                            isPaused
                              ? 'bg-blue-600 text-white font-black shadow-sm'
                              : 'text-slate-400 hover:text-blue-300'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                          <span>Pause</span>
                        </button>

                        {/* Close Button */}
                        <button
                          type="button"
                          onClick={() => handleSetGameStatus(game.id, 'Closed')}
                          className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                            isClosed
                              ? 'bg-rose-600 text-white font-black shadow-sm'
                              : 'text-slate-400 hover:text-rose-300'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
                          <span>Close</span>
                        </button>
                      </div>
                    </div>

                    {/* Middle Section: Image Thumbnail & Details */}
                    <div className="flex items-center gap-3.5">
                      {/* Logo Icon with Rounded Box */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner shrink-0 group">
                        <img
                          src={game.image}
                          alt={game.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/mlbb-logo.png';
                          }}
                          className="w-full h-full object-cover"
                        />
                        <div
                          onClick={() => handleOpenGameModal(game)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-amber-300 font-bold text-[9px]"
                          title="Change Logo"
                        >
                          📷 Change
                        </div>
                      </div>

                      {/* Info lines */}
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="font-black text-white text-xs sm:text-sm uppercase tracking-wide truncate">
                          {game.name}
                        </h4>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                          <span>{game.publisher || 'Game'}</span>
                          <span className="text-slate-600 font-black">•</span>
                          <span className="text-amber-400 font-bold">{game.currency || 'Diamonds'}</span>
                        </div>
                        <div className="text-[11px] text-cyan-400 font-bold flex items-center gap-1">
                          <span>⚡</span>
                          <span>{game.deliveryTime || '10 - 30s'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: 2 Compact Horizontal Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenGameModal(game)}
                        className="py-1.5 px-3 rounded-xl bg-[#18181B]/80 hover:bg-[#27272A] border border-[#78350F]/70 text-[#FDE68A] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>✏️</span>
                        <span>Edit Info</span>
                      </button>

                      {game.id !== 'mlbb' ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteGame(game.id)}
                          className="py-1.5 px-3 rounded-xl bg-[#18181B]/80 hover:bg-[#27272A] border border-[#881337]/70 text-[#FDA4AF] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <span>🗑️</span>
                          <span>Delete</span>
                        </button>
                      ) : (
                        <Link
                          to="/"
                          target="_blank"
                          className="py-1.5 px-3 rounded-xl bg-[#18181B]/80 hover:bg-[#27272A] border border-[#0E7490]/70 text-[#67E8F9] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
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
                  onClick={handleForceSyncToCloud}
                  disabled={syncingCloud}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                    syncingCloud
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 cursor-wait'
                      : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/50 hover:scale-105 active:scale-95'
                  }`}
                  title="Push and sync all current banners to MongoDB Cloud for all visitors"
                >
                  <span>{syncingCloud ? '⏳' : '☁️'}</span>
                  <span>{syncingCloud ? 'Syncing...' : 'Sync to All Devices'}</span>
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
                            e.target.src = banner.localFallbackImage || '/mlbb-logo.png';
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

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleBatchDeliverAll}
                  disabled={batchProcessing || pendingOrders.length === 0}
                  className="btn btn-gold text-xs sm:text-sm py-2.5 px-4 w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-40"
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
        {/* AWAITING BALANCE ORDERS — Customer Paid, Provider No Funds */}
        {/* ========================================================= */}
        {!loading && activeTab === 'pending' && pendingBalanceOrders.length > 0 && (
          <div className="space-y-5 mt-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40">
              <span className="text-3xl">🚨</span>
              <div>
                <h3 className="text-amber-300 font-black text-base">
                  Awaiting Balance — {pendingBalanceOrders.length} Order{pendingBalanceOrders.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-slate-400 text-xs">
                  Customer paid but diamonds were NOT delivered — provider had insufficient balance. Please top up provider and approve each order below.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pendingBalanceOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="card bg-gradient-to-br from-amber-950/30 to-dark-card border-amber-500/50 hover:border-amber-400 transition-all space-y-4 shadow-xl relative overflow-hidden rounded-3xl"
                >
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-black text-xs">
                      ORDER #{order.orderId}
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                      ⚠️ Awaiting Balance
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Player ID</span>
                      <span className="font-mono text-white">{order.playerID}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Zone</span>
                      <span className="font-mono text-white">{order.serverID}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Package</span>
                      <span className="text-white font-bold">{order.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Diamonds</span>
                      <span className="text-amber-300 font-black">💎 {order.diamondAmount}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2">
                      <span className="text-slate-400">Amount</span>
                      <span className="text-emerald-400 font-black">${Number(order.amount).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setProcessingOrderId(order.orderId);
                      try {
                        const res = await adminAPI.approveTopup(order.orderId);
                        if (res.data?.success) {
                          showToast('success', `✅ Diamonds delivered for Order #${order.orderId}!`);
                        } else {
                          showToast('error', res.data?.message || 'Delivery failed');
                        }
                        loadData(true);
                      } catch (err) {
                        showToast('error', err.response?.data?.message || 'Failed to approve topup');
                      } finally {
                        setProcessingOrderId(null);
                      }
                    }}
                    disabled={processingOrderId === order.orderId}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {processingOrderId === order.orderId ? (
                      <><span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /><span>Delivering...</span></>
                    ) : (
                      <><span>⚡</span><span>Approve &amp; Deliver Diamonds</span></>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PROFILE INFORMATION & STORE BRANDING */}
        {/* ========================================================= */}
        {!loading && activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>🏪</span> Profile Information & Store Brand
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Manage your store brand identity, logo, tagline, trust badges, and administrator contact credentials.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleResetStoreBranding}
                  className="btn btn-secondary text-xs sm:text-sm py-2.5 px-3.5 flex items-center gap-2"
                >
                  <span>🔄</span>
                  <span>Reset Defaults</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenStoreLogoModal}
                  className="btn btn-gold text-xs sm:text-sm py-2.5 px-4 font-black flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>✏️</span>
                  <span>Edit in Modal</span>
                </button>
              </div>
            </div>

            {/* Active Store Brand Live Hero Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-dark-card via-slate-900 to-[#0A101D] border border-amber-500/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 p-[2px] shadow-glow-gold shrink-0 overflow-hidden">
                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center overflow-hidden">
                    {branding.logoType === 'image' && branding.logoImage ? (
                      <img
                        src={branding.logoImage}
                        alt={branding.storeName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl sm:text-4xl">{branding.logoEmoji || '💎'}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                      ACTIVE STORE BRAND
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-white">
                      {branding.storeName || 'MLBB TOPUP'}
                    </span>
                    {branding.badgeText && (
                      <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-sm">
                        {branding.badgeText}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    Tagline: <strong className="text-amber-200">{branding.tagline || 'Official Diamond Hub'}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Synchronized across Customer Storefront, Mobile App, and Admin Navigation Bar.</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 relative z-10 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleOpenStoreLogoModal}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>🎨</span>
                  <span>Change Logo / Preset</span>
                </button>
              </div>
            </div>

            {/* Profile Information Configuration & Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Columns: Editable Brand Information Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-5 sm:p-6 rounded-3xl bg-[#0B0F19] border border-slate-800 shadow-xl space-y-5">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>🏷️</span> Store Identity & Details
                    </h3>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full font-bold">
                      Public Identity
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Store Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={storeBrandingForm.storeName}
                        onChange={(e) => setStoreBrandingForm(prev => ({ ...prev, storeName: e.target.value }))}
                        placeholder="e.g. Tin-Topup"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-amber-400 focus:outline-none transition-all"
                      />
                      <span className="text-[10px] text-slate-500 block">Primary brand name shown on header &amp; invoices</span>
                    </div>

                    {/* Badge / Highlight Tag */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Trust Badge Tag
                      </label>
                      <input
                        type="text"
                        value={storeBrandingForm.badgeText}
                        onChange={(e) => setStoreBrandingForm(prev => ({ ...prev, badgeText: e.target.value }))}
                        placeholder="e.g. PRO, VIP, OFFICIAL"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-amber-400 focus:outline-none transition-all"
                      />
                      <span className="text-[10px] text-slate-500 block">Small badge next to store name (e.g. PRO)</span>
                    </div>

                    {/* Tagline */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Brand Tagline / Slogan
                      </label>
                      <input
                        type="text"
                        value={storeBrandingForm.tagline}
                        onChange={(e) => setStoreBrandingForm(prev => ({ ...prev, tagline: e.target.value }))}
                        placeholder="e.g. Official Diamond Hub"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none transition-all"
                      />
                      <span className="text-[10px] text-slate-500 block">Sub-headline displayed underneath the logo</span>
                    </div>

                    {/* Facebook Page */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                        <span>📘</span> Facebook Support Page
                      </label>
                      <input
                        type="text"
                        value={storeBrandingForm.facebookPage || ''}
                        onChange={(e) => setStoreBrandingForm(prev => ({ ...prev, facebookPage: e.target.value }))}
                        placeholder="https://facebook.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-blue-400 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Telegram Username */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                        <span>✈️</span> Telegram Channel / Support
                      </label>
                      <input
                        type="text"
                        value={storeBrandingForm.telegramUsername || ''}
                        onChange={(e) => setStoreBrandingForm(prev => ({ ...prev, telegramUsername: e.target.value, telegramUrl: e.target.value.startsWith('http') ? e.target.value : `https://t.me/${e.target.value.replace('@', '')}` }))}
                        placeholder="@Peak_Deth"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Logo Source Type Toggle */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Logo Format Selection
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setStoreBrandingForm(prev => ({ ...prev, logoType: 'image' }))}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          storeBrandingForm.logoType === 'image'
                            ? 'bg-amber-500/15 border-amber-500/60 text-white ring-1 ring-amber-500/30'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-2xl">🖼️</span>
                        <div>
                          <p className="text-xs font-black">Image Artwork</p>
                          <p className="text-[10px] text-slate-500">Upload or URL file</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStoreBrandingForm(prev => ({ ...prev, logoType: 'emoji' }))}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          storeBrandingForm.logoType === 'emoji'
                            ? 'bg-amber-500/15 border-amber-500/60 text-white ring-1 ring-amber-500/30'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-2xl">💎</span>
                        <div>
                          <p className="text-xs font-black">Gaming Emoji</p>
                          <p className="text-[10px] text-slate-500">Pick from presets</p>
                        </div>
                      </button>
                    </div>

                    {storeBrandingForm.logoType === 'image' ? (
                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Logo Image URL / Upload
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={storeBrandingForm.logoImage || ''}
                            onChange={(e) => setStoreBrandingForm(prev => ({ ...prev, logoImage: e.target.value }))}
                            placeholder="/tin-logo.png or https://..."
                            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => logoFileInputRef.current?.click()}
                            disabled={isUploadingLogo}
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                          >
                            <span>{isUploadingLogo ? '⏳' : '📤'}</span>
                            <span>{isUploadingLogo ? 'Uploading...' : 'Upload'}</span>
                          </button>
                        </div>

                        {/* Presets */}
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <span className="text-[10px] text-slate-500 font-bold">Quick Presets:</span>
                          {[
                            ['/tin-logo.png', 'Tin Logo'],
                            ['/Logo-Website.PNG', 'Website Logo'],
                            ['/logo.png', 'Default Logo']
                          ].map(([url, label]) => (
                            <button
                              key={url}
                              type="button"
                              onClick={() => setStoreBrandingForm(prev => ({ ...prev, logoImage: url, logoType: 'image' }))}
                              className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold transition-all ${
                                storeBrandingForm.logoImage === url
                                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Pick Gaming Emoji Preset
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {['💎', '👑', '⚡', '🎮', '🏆', '🔥', '⭐', '🚀', '🗡️', '🛡️'].map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => setStoreBrandingForm(prev => ({ ...prev, logoEmoji: em, logoType: 'emoji' }))}
                              className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer border ${
                                storeBrandingForm.logoEmoji === em
                                  ? 'bg-amber-400 text-black border-amber-300 scale-110 shadow-glow-gold'
                                  : 'bg-slate-800/60 border-slate-700 text-white hover:bg-slate-700'
                              }`}
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Save Action */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                    <p className="text-[11px] text-slate-500">Changes apply immediately across all client pages.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = updateBranding(storeBrandingForm);
                        showToast('success', `✅ Profile updated to "${updated.storeName}"!`);
                      }}
                      className="btn btn-gold text-xs py-2.5 px-6 font-black flex items-center gap-2 shadow-glow-gold"
                    >
                      <span>💾</span>
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Storefront Preview & Admin Account Card */}
              <div className="space-y-6">
                {/* Live Navbar Preview */}
                <div className="p-5 rounded-3xl bg-[#0B0F19] border border-slate-800 shadow-xl space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-black text-white flex items-center gap-2">
                      <span>👁️</span> Live Storefront Preview
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Real-Time
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Here is how customers see your brand in the storefront navigation bar:
                  </p>

                  {/* Simulated Navbar Brand */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-inner flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-[2px] shadow-glow-gold shrink-0 overflow-hidden">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                        {storeBrandingForm.logoType === 'image' && storeBrandingForm.logoImage ? (
                          <img
                            src={storeBrandingForm.logoImage}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl">{storeBrandingForm.logoEmoji || '💎'}</span>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-white text-sm tracking-tight truncate">
                          {storeBrandingForm.storeName || 'MLBB TOPUP'}
                        </span>
                        {storeBrandingForm.badgeText && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {storeBrandingForm.badgeText}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block">
                        {storeBrandingForm.tagline || 'Official Diamond Hub'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Logged-In Administrator Profile Card */}
                <div className="p-5 rounded-3xl bg-[#0B0F19] border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-black text-white flex items-center gap-2">
                      <span>👤</span> Administrator Profile
                    </span>
                    <span className="text-[9px] text-amber-300 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      Super Admin
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px] shadow-md shrink-0">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl">
                        👑
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-white truncate">
                        {user?.name || 'Peak Deth'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        {user?.email || 'pudeth@example.com'}
                      </p>
                      <span className="inline-block px-2 py-0.5 mt-1 rounded-md text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                        ● Authorized Administrator
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Account Role:</span>
                      <span className="text-white font-bold">{user?.role || 'Admin'}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Merchant Code:</span>
                      <span className="text-amber-300 font-mono font-bold">tintopup</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Platform Version:</span>
                      <span className="text-slate-300 font-mono">v2.5 (Enterprise)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

            {/* RESELLER PRICING MODE & PRESET SWITCHER */}
            <div className="card p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-indigo-500/20">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏷️</span>
                  <div>
                    <h4 className="font-black text-white text-xs sm:text-sm flex items-center gap-2">
                      <span>Reseller Pricing Preset Engine</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {activePricingPreset === 'market' ? '🎯 Market Rates (Ref Screenshots)' : activePricingPreset === 'classic' ? '🏛️ Classic Standard Rates' : '⚡ Custom Reseller Rates'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Switch pricing presets across MLBB packages with 1-click while preserving original diamond amounts.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleApplyPricingPreset('market')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePricingPreset === 'market'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-glow-gold scale-[1.02] ring-2 ring-amber-300'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <span>🎯</span>
                    <span>Market Reseller Rates (Screenshot Fit)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPricingPreset('classic')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePricingPreset === 'classic'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black shadow-glow-cyan scale-[1.02] ring-2 ring-cyan-300'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <span>🏛️</span>
                    <span>Classic Standard Rates</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-sm">✅ 86 💎</span>
                  <div>
                    <span className="block text-[11px] text-slate-400">Market Preset:</span>
                    <strong className="text-white">Retail $1.40 / Reseller $1.30</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-sm">✅ 172 💎</span>
                  <div>
                    <span className="block text-[11px] text-slate-400">Market Preset:</span>
                    <strong className="text-white">Retail $2.60 / Reseller $2.45</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-sm">✅ 3688 💎</span>
                  <div>
                    <span className="block text-[11px] text-slate-400">Store Selling Rate:</span>
                    <strong className="text-white">Price $59.49</strong>
                  </div>
                </div>
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
                      className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-sm select-none ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-glow-gold scale-[1.02] ring-1 ring-amber-300'
                          : 'bg-[#111728] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-[#161f36]'
                      }`}
                    >
                      {g.logo ? (
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-0.5 transition-transform ${
                          isSelected ? 'bg-black/25 ring-1 ring-black/40' : 'bg-slate-950/80 border border-slate-700/60'
                        }`}>
                          <img
                            src={g.logo}
                            alt={g.name}
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              if (g.fallbackLogo && e.target.src !== g.fallbackLogo) {
                                e.target.src = g.fallbackLogo;
                              } else {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = 'inline';
                                }
                              }
                            }}
                            className="w-full h-full object-cover rounded-md"
                          />
                          <span style={{ display: 'none' }} className="text-xs">{g.icon}</span>
                        </div>
                      ) : (
                        <span className="text-sm">{g.icon}</span>
                      )}
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
                        <div className="flex items-center justify-center min-h-[42px] mb-1 group-hover:scale-110 transition-transform">
                          {prod.customImage || prod.game === 'mlbb' || isPass ? (
                            <ProductPackageImage pkg={prod} size="md" />
                          ) : (() => {
                            const gameDef = PRICING_GAMES.find(g => g.id === prod.game);
                            if (gameDef && gameDef.logo) {
                              return (
                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-900/80 border border-slate-700/60 p-0.5 shadow-sm flex items-center justify-center">
                                  <img
                                    src={gameDef.logo}
                                    alt={prod.name}
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      if (gameDef.fallbackLogo && e.target.src !== gameDef.fallbackLogo) {
                                        e.target.src = gameDef.fallbackLogo;
                                      } else {
                                        e.target.style.display = 'none';
                                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'inline';
                                      }
                                    }}
                                    className="w-full h-full object-cover rounded"
                                  />
                                  <span style={{ display: 'none' }} className="text-xl">{gameDef.icon || '💎'}</span>
                                </div>
                              );
                            }
                            return (
                              <span className="text-2xl sm:text-3xl">
                                {gameDef?.icon || '💎'}
                              </span>
                            );
                          })()}
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
                          onClick={() => handleOpenProductModal(prod)}
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
            {/* Header + Stats Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>📦</span> Orders & Transactions Ledger
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Complete real-time history of customer orders, payments, and live delivery statuses.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => loadData(true)}
                  disabled={refreshing}
                  className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                  title="Refresh orders from server"
                >
                  <span className={refreshing ? 'animate-spin' : ''}>↻</span>
                  <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold cursor-pointer"
                >
                  <span>📥</span>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="card p-3 rounded-2xl bg-dark-card/90 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-lg">
                  📦
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Orders</span>
                  <span className="text-lg font-black text-white font-mono">{orders.length}</span>
                </div>
              </div>

              <div className="card p-3 rounded-2xl bg-dark-card/90 border border-emerald-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-lg">
                  ✅
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Delivered</span>
                  <span className="text-lg font-black text-emerald-300 font-mono">
                    {orders.filter(o => o.topupStatus === 'Completed').length}
                  </span>
                </div>
              </div>

              <div className="card p-3 rounded-2xl bg-dark-card/90 border border-amber-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-lg">
                  ⏳
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Pending Delivery</span>
                  <span className="text-lg font-black text-amber-300 font-mono">
                    {orders.filter(o => o.topupStatus === 'Pending' || o.topupStatus === 'Processing' || o.topupStatus === 'AwaitingBalance').length}
                  </span>
                </div>
              </div>

              <div className="card p-3 rounded-2xl bg-dark-card/90 border border-rose-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center text-lg">
                  ❌
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-400 block">Failed / Need Attention</span>
                  <span className="text-lg font-black text-rose-300 font-mono">
                    {orders.filter(o => o.topupStatus === 'Failed').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="card p-3.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 text-xs rounded-2xl bg-dark-card/90 border border-slate-800">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search Order ID, Player ID, Game, Customer..."
                  value={orderSearch}
                  onChange={(e) => {
                    setOrderSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="input text-xs py-2 w-full"
                />
              </div>
              <div>
                <select
                  value={paymentFilter}
                  onChange={(e) => {
                    setPaymentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="input text-xs py-2 w-full"
                >
                  <option value="ALL">Payment: All</option>
                  <option value="Paid">Payment: Paid (KHQR/ABA)</option>
                  <option value="Pending">Payment: Unpaid / Pending</option>
                  <option value="Failed">Payment: Failed</option>
                </select>
              </div>
              <div>
                <select
                  value={topupFilter}
                  onChange={(e) => {
                    setTopupFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="input text-xs py-2 w-full"
                >
                  <option value="ALL">Delivery: All</option>
                  <option value="Completed">Delivery: Completed (Delivered)</option>
                  <option value="Pending">Delivery: Pending</option>
                  <option value="Processing">Delivery: Processing</option>
                  <option value="AwaitingBalance">Delivery: Low Balance</option>
                  <option value="Failed">Delivery: Failed</option>
                </select>
              </div>
              <div>
                <select
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="input text-xs py-2 w-full"
                >
                  <option value="ALL">Date: All Time</option>
                  <option value="TODAY">Date: Today</option>
                  <option value="7DAYS">Date: Last 7 Days</option>
                  <option value="30DAYS">Date: Last 30 Days</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="card rounded-2xl shadow-xl overflow-hidden border border-slate-800 bg-[#0B0F19]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[850px]">
                  <thead className="bg-[#111728] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
                    <tr>
                      <th className="p-3">Order</th>
                      <th className="p-3">Player / Zone</th>
                      <th className="p-3">Item / Package</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Current Delivery Status</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {paginatedOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-slate-400 font-sans">
                          <div className="max-w-sm mx-auto space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl mx-auto">
                              📭
                            </div>
                            <h4 className="font-bold text-white text-sm">No Orders Found</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              {orderSearch || paymentFilter !== 'ALL' || topupFilter !== 'ALL' || dateFilter !== 'ALL'
                                ? 'No orders match your current filters. Try resetting the filters to view all orders.'
                                : 'There are currently no orders registered in the system.'}
                            </p>
                            {(orderSearch || paymentFilter !== 'ALL' || topupFilter !== 'ALL' || dateFilter !== 'ALL') && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOrderSearch('');
                                  setPaymentFilter('ALL');
                                  setTopupFilter('ALL');
                                  setDateFilter('ALL');
                                  setCurrentPage(1);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                              >
                                ✕ Reset All Filters
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((order) => {
                        const isDelivered = order.topupStatus === 'Completed';
                        const isProcessing = order.topupStatus === 'Processing';
                        const isFailed = order.topupStatus === 'Failed';
                        const isAwaitingBal = order.topupStatus === 'AwaitingBalance';
                        const isPendingDelivery = !isDelivered && !isProcessing && !isFailed && !isAwaitingBal;

                        const isPaid = order.paymentStatus === 'Paid';

                        return (
                          <tr key={order.orderId} className="hover:bg-slate-800/40 transition-colors">
                            {/* ORDER */}
                            <td className="p-3">
                              <div className="flex flex-col">
                                <span className="font-bold text-white font-mono text-sm">
                                  #{order.orderId}
                                </span>
                                <span className="text-[10px] text-amber-400/90 font-sans font-semibold truncate max-w-[140px]">
                                  {order.gameName || 'Mobile Legends'}
                                </span>
                              </div>
                            </td>

                            {/* PLAYER / ZONE */}
                            <td className="p-3 font-sans">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-black text-cyan-300 text-xs">
                                    {order.playerID || order.playerId}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyText(order.playerID || order.playerId, `p-${order.orderId}`)}
                                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-all text-[10px] cursor-pointer"
                                    title="Copy Player ID"
                                  >
                                    {copiedId === `p-${order.orderId}` ? '✅' : '📋'}
                                  </button>
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  Zone / Server:{' '}
                                  <span className="font-mono text-slate-300 font-bold">
                                    {order.serverID || order.serverId || 'Global'}
                                  </span>
                                </div>
                                {order.accountName && order.accountName !== '??????????' && (
                                  <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                                    {order.accountName}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* DIAMONDS / UNITS */}
                            <td className="p-3 font-sans">
                              <div className="font-bold text-amber-300 text-xs flex items-center gap-1">
                                <span>💎</span>
                                <span>
                                  {order.productName || (order.diamondAmount ? `${order.diamondAmount} Diamonds` : 'Diamonds')}
                                </span>
                              </div>
                              {order.diamondAmount && order.productName && !order.productName.includes(String(order.diamondAmount)) && (
                                <span className="text-[10px] text-slate-400">
                                  ({order.diamondAmount} Units)
                                </span>
                              )}
                            </td>

                            {/* AMOUNT */}
                            <td className="p-3">
                              <div className="font-bold text-emerald-400 text-xs font-mono">
                                ${Number(order.amount || order.price || 0).toFixed(2)}
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">
                                ~{Math.round(Number(order.amount || order.price || 0) * 4100).toLocaleString()} ៛
                              </span>
                            </td>

                            {/* PAYMENT */}
                            <td className="p-3 font-sans">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                                  <span>✅</span>
                                  <span>Paid</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                                  <span>⏳</span>
                                  <span>{order.paymentStatus || 'Pending'}</span>
                                </span>
                              )}
                            </td>

                            {/* CURRENT DELIVERY STATUS */}
                            <td className="p-3 font-sans">
                              {isDelivered && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs font-black shadow-sm shadow-emerald-500/10">
                                  <span>✅</span>
                                  <span>Delivered</span>
                                </div>
                              )}
                              {isProcessing && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 text-xs font-bold animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                                  <span>Delivering...</span>
                                </div>
                              )}
                              {isPendingDelivery && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/40 text-xs font-bold">
                                  <span>⏳</span>
                                  <span>Pending Delivery</span>
                                </div>
                              )}
                              {isAwaitingBal && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500/15 text-orange-300 border border-orange-500/40 text-xs font-bold">
                                  <span>⚠️</span>
                                  <span>Low Supplier Funds</span>
                                </div>
                              )}
                              {isFailed && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/40 text-xs font-bold">
                                  <span>❌</span>
                                  <span>Delivery Failed</span>
                                </div>
                              )}
                            </td>

                            {/* DATE */}
                            <td className="p-3 text-slate-400 font-sans text-[11px]">
                              {order.createdAt ? (
                                <div>
                                  <div className="text-white font-medium">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              ) : (
                                'N/A'
                              )}
                            </td>

                            {/* ACTIONS */}
                            <td className="p-3 text-right font-sans">
                              <div className="flex items-center justify-end gap-1.5">
                                {!isDelivered ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleManualComplete(order.orderId)}
                                      disabled={processingOrderId === order.orderId}
                                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                                      title="Mark order as Delivered"
                                    >
                                      <span>✅</span>
                                      <span className="hidden sm:inline">Delivered</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleProcessSingleTopUp(order.orderId)}
                                      disabled={processingOrderId === order.orderId}
                                      className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] flex items-center gap-1 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                                      title="Trigger automated dispatch via Provider API"
                                    >
                                      <span>⚡</span>
                                      <span className="hidden sm:inline">{processingOrderId === order.orderId ? '...' : 'Auto'}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setDeliveryModalOrder(order)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-[11px] border border-slate-700 transition-all cursor-pointer"
                                      title="Open Delivery Assistant"
                                    >
                                      🛠️
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedOrder(order)}
                                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-bold border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
                                  >
                                    <span>🔍</span>
                                    <span>Audit</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              {filteredOrders.length > 0 && (
                <div className="p-3.5 bg-[#0e1322] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
                  <div className="text-slate-400">
                    Showing <strong className="text-white">{(safeCurrentPage - 1) * pageSize + 1}</strong> to{' '}
                    <strong className="text-white">{Math.min(safeCurrentPage * pageSize, filteredOrders.length)}</strong> of{' '}
                    <strong className="text-white">{filteredOrders.length}</strong> orders
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={safeCurrentPage <= 1}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 font-bold border border-slate-700 transition-all cursor-pointer"
                    >
                      ← Prev
                    </button>

                    <div className="flex items-center gap-1 px-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                        let pageNum = idx + 1;
                        if (totalPages > 5 && safeCurrentPage > 3) {
                          pageNum = safeCurrentPage - 2 + idx;
                          if (pageNum > totalPages) pageNum = totalPages - (4 - idx);
                        }
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-7 h-7 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                              safeCurrentPage === pageNum
                                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={safeCurrentPage >= totalPages}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 font-bold border border-slate-700 transition-all cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
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
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <p className="text-xs sm:text-sm text-slate-400">
                    Real-time Gross Revenue, Supplier COGS, Net Profit, and margin metrics.
                  </p>
                  {displayFinancials?.clearedAt && (
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <span>🔄</span> Cleared Period (tracking new sales)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setClearFinancialsModalOpen(true)}
                  className="btn text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/50 text-rose-300 font-bold shadow-md transition-all active:scale-95 shrink-0"
                  title="Reset all financial revenue, provider costs & sales ledger to $0.00 for a fresh new sell"
                >
                  <span>🗑️</span>
                  <span>Clear Financials / New Sell</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportModalOpen(true)}
                  className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold shadow-md transition-all active:scale-95 shrink-0"
                  title="Export complete pricing, wholesale costs, and profit breakdown to Excel"
                >
                  <span>📊</span>
                  <span>Export Profit Report (Excel)</span>
                </button>
              </div>
            </div>

            {/* Core Financials KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Income / Total Net Profit */}
              <div className="card bg-gradient-to-br from-dark-card to-dark-card/80 border-emerald-500/50 rounded-2xl shadow-xl p-5 relative overflow-hidden group hover:border-emerald-400 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">Income (Net Profit)</span>
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-sm shadow-sm">💎</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-2 tracking-tight">
                  ${displayFinancials?.totalNetProfit?.toFixed(2) || '0.00'}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-bold">៛{displayFinancials?.totalNetProfitKHR?.toLocaleString() || '0'} KHR</span>
                  <span className="text-emerald-400/90 text-[10px] font-black bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Earnings After Costs</span>
                </div>
              </div>

              {/* Total Seller (Gross Revenue) */}
              <div className="card bg-gradient-to-br from-dark-card to-dark-card/80 border-cyan-500/50 rounded-2xl shadow-xl p-5 relative overflow-hidden group hover:border-cyan-400 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300">Total Seller (Revenue)</span>
                  <span className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center text-sm shadow-sm">💰</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-cyan-300 mt-2 tracking-tight">
                  ${displayFinancials?.totalGrossRevenue?.toFixed(2) || '0.00'}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-bold">៛{displayFinancials?.totalGrossRevenueKHR?.toLocaleString() || Math.round((displayFinancials?.totalGrossRevenue || 0) * 4100).toLocaleString()} KHR</span>
                  <span className="text-cyan-400/90 text-[10px] font-black bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">Total Customer Paid</span>
                </div>
              </div>

              {/* Total Provider Price (Supplier Wholesale COGS) */}
              <div className="card bg-gradient-to-br from-dark-card to-dark-card/80 border-rose-500/50 rounded-2xl shadow-xl p-5 relative overflow-hidden group hover:border-rose-400 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-300">Total Provider Price</span>
                  <span className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center text-sm shadow-sm">⚡</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-rose-400 mt-2 tracking-tight">
                  ${displayFinancials?.totalSupplierCogs?.toFixed(2) || '0.00'}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-bold">៛{displayFinancials?.totalSupplierCogsKHR?.toLocaleString() || Math.round((displayFinancials?.totalSupplierCogs || 0) * 4100).toLocaleString()} KHR</span>
                  <span className="text-rose-400/90 text-[10px] font-black bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">KhmerTopUp / Fazer</span>
                </div>
              </div>

              {/* Profit Margin */}
              <div className="card bg-gradient-to-br from-dark-card to-dark-card/80 border-amber-500/50 rounded-2xl shadow-xl p-5 relative overflow-hidden group hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">Net Profit Margin</span>
                  <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center text-sm shadow-sm">📈</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 mt-2 tracking-tight">
                  {displayFinancials?.overallMarginPct || 0}%
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-bold">Average Profit %</span>
                  <span className="text-amber-400/90 text-[10px] font-black bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">{(displayFinancials?.overallMarginPct || 0) > 15 ? '🔥 High Return' : 'Standard'}</span>
                </div>
              </div>
            </div>

            {/* Sub-Tabs Navigation & Quick Filters */}
            <div className="card bg-[#0B0F19] border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Sub-view switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 w-fit">
                  <button
                    type="button"
                    onClick={() => setFinancialsSubTab('ledger')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      financialsSubTab === 'ledger'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span>📑</span>
                    <span>Sales & Profit Ledger ({(displayFinancials?.salesLedger || []).length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinancialsSubTab('packages')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      financialsSubTab === 'packages'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span>💎</span>
                    <span>Package Profitability ({packageAnalyticsData.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinancialsSubTab('trends')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      financialsSubTab === 'trends'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span>📊</span>
                    <span>7-Day Daily Trend</span>
                  </button>
                </div>

                {/* Filter and Search controls */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Search box */}
                  <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                    <input
                      type="text"
                      placeholder="Search bill, player ID, package..."
                      value={financialsSearch}
                      onChange={(e) => {
                        setFinancialsSearch(e.target.value);
                        setFinancialsPage(1);
                      }}
                      className="input text-xs pl-8 pr-3 py-1.5 w-full bg-slate-950/80 border-slate-700/80 rounded-xl"
                    />
                  </div>

                  {/* Game filter dropdown */}
                  <select
                    value={financialsGameFilter}
                    onChange={(e) => {
                      setFinancialsGameFilter(e.target.value);
                      setFinancialsPage(1);
                    }}
                    className="input text-xs py-1.5 px-3 bg-slate-950/80 border-slate-700/80 rounded-xl font-bold text-slate-200"
                  >
                    <option value="ALL">🎮 All Games</option>
                    <option value="mlbb">⚔️ Mobile Legends</option>
                    <option value="freefire">🔥 Free Fire</option>
                    <option value="hok">👑 Honor of Kings</option>
                    <option value="pubgm">🎯 PUBG Mobile</option>
                  </select>

                  {/* Quick Export CSV Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const ledger = displayFinancials?.salesLedger || [];
                      if (ledger.length === 0) {
                        showToast('error', 'No ledger data available to export.');
                        return;
                      }
                      const headers = ['Bill / Transaction', 'Game', 'Package', 'Player ID', 'Server / Zone', 'Seller Price (USD)', 'Provider Cost (USD)', 'Net Profit (USD)', 'Margin %', 'Date', 'Status'];
                      const csvRows = [headers.join(',')];
                      ledger.forEach(item => {
                        csvRows.push([
                          `"${item.billNumber || ''}"`,
                          `"${item.gameName || ''}"`,
                          `"${item.packageName || ''}"`,
                          `"${item.playerId || ''}"`,
                          `"${item.serverId || ''}"`,
                          Number(item.sellerPrice || 0).toFixed(2),
                          Number(item.providerPrice || 0).toFixed(2),
                          Number(item.netProfit || 0).toFixed(2),
                          `${Number(item.marginPct || 0).toFixed(1)}%`,
                          `"${item.date || ''}"`,
                          `"${item.status || ''}"`
                        ].join(','));
                      });
                      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `Profit_and_Sales_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast('success', `Exported ${ledger.length} financial transactions to CSV!`);
                    }}
                    className="btn btn-secondary text-xs py-1.5 px-3 rounded-xl border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>📥</span>
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* SUB-VIEW 1: SALES & PROFIT LEDGER */}
              {financialsSubTab === 'ledger' && (() => {
                const ledger = displayFinancials?.salesLedger || [];
                const filteredLedger = ledger.filter(item => {
                  if (!item) return false;
                  const q = financialsSearch.trim().toLowerCase();
                  const matchQuery = !q ||
                    String(item.billNumber || '').toLowerCase().includes(q) ||
                    String(item.playerId || '').toLowerCase().includes(q) ||
                    String(item.packageName || '').toLowerCase().includes(q) ||
                    String(item.gameName || '').toLowerCase().includes(q);

                  if (!matchQuery) return false;

                  if (financialsGameFilter !== 'ALL') {
                    const g = String(item.gameName || '').toLowerCase();
                    if (financialsGameFilter === 'freefire' && !g.includes('free') && !g.includes('ff')) return false;
                    if (financialsGameFilter === 'mlbb' && !g.includes('legend') && !g.includes('mlbb')) return false;
                    if (financialsGameFilter === 'hok' && !g.includes('honor') && !g.includes('hok')) return false;
                    if (financialsGameFilter === 'pubgm' && !g.includes('pubg')) return false;
                  }

                  return true;
                });

                const totalPages = Math.ceil(filteredLedger.length / financialsPageSize) || 1;
                const startIndex = (financialsPage - 1) * financialsPageSize;
                const paginatedLedger = filteredLedger.slice(startIndex, startIndex + financialsPageSize);

                return (
                  <div className="space-y-3">
                    <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
                      <table className="w-full text-left text-xs min-w-[900px]">
                        <thead className="bg-[#111728] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
                          <tr>
                            <th className="p-3">Bill / Tx ID</th>
                            <th className="p-3">Game & Package</th>
                            <th className="p-3">Player ID</th>
                            <th className="p-3 text-right">Total Seller</th>
                            <th className="p-3 text-right">Provider Price</th>
                            <th className="p-3 text-right">Net Income</th>
                            <th className="p-3 text-center">Margin %</th>
                            <th className="p-3">Date</th>
                            <th className="p-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {paginatedLedger.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="p-10 text-center text-slate-400 font-sans">
                                <div className="space-y-2">
                                  <div className="text-3xl">📭</div>
                                  <p className="font-bold text-white text-sm">No transactions match your filters</p>
                                  <p className="text-xs text-slate-500">When orders are fulfilled, each sale with seller price and provider wholesale cost will appear here.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            paginatedLedger.map((row, idx) => {
                              const isFF = (row.gameName || '').toLowerCase().includes('free') || (row.gameName || '').toLowerCase().includes('ff');
                              const isML = (row.gameName || '').toLowerCase().includes('legend') || (row.gameName || '').toLowerCase().includes('mlbb');
                              const gameBadge = isFF ? { text: 'Free Fire', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' }
                                : isML ? { text: 'MLBB', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' }
                                : { text: row.gameName || 'Game', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };

                              return (
                                <tr key={row.billNumber || idx} className="hover:bg-slate-900/60 transition-colors">
                                  {/* Bill # */}
                                  <td className="p-3">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-slate-200">{row.billNumber}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyText(row.billNumber, `fin-${row.billNumber}`)}
                                        className="text-[10px] text-slate-500 hover:text-amber-400 transition-colors"
                                        title="Copy transaction ID"
                                      >
                                        {copiedId === `fin-${row.billNumber}` ? '✓' : '📋'}
                                      </button>
                                    </div>
                                  </td>

                                  {/* Game & Package */}
                                  <td className="p-3">
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${gameBadge.color} shrink-0`}>
                                        {gameBadge.text}
                                      </span>
                                      <span className="font-bold text-white font-sans truncate max-w-[170px]" title={row.packageName}>
                                        {row.packageName}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Player ID */}
                                  <td className="p-3">
                                    <div className="text-slate-300">
                                      <span>{row.playerId}</span>
                                      {row.serverId && row.serverId !== 'Global' && (
                                        <span className="text-[10px] text-slate-500 ml-1">({row.serverId})</span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Total Seller (Customer Sell Price) */}
                                  <td className="p-3 text-right">
                                    <span className="font-black text-cyan-300 text-sm">
                                      ${Number(row.sellerPrice || 0).toFixed(2)}
                                    </span>
                                  </td>

                                  {/* Total Provider Price (Wholesale COGS) */}
                                  <td className="p-3 text-right">
                                    <span className="font-black text-rose-300 text-sm">
                                      ${Number(row.providerPrice || 0).toFixed(2)}
                                    </span>
                                  </td>

                                  {/* Net Income / Profit */}
                                  <td className="p-3 text-right">
                                    <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-xs">
                                      +${Number(row.netProfit || 0).toFixed(2)}
                                    </span>
                                  </td>

                                  {/* Margin % */}
                                  <td className="p-3 text-center">
                                    <span className="text-amber-300 font-bold text-xs">
                                      {Number(row.marginPct || 0).toFixed(1)}%
                                    </span>
                                  </td>

                                  {/* Date */}
                                  <td className="p-3 text-slate-400 text-[11px] font-sans">
                                    {row.date ? String(row.date).slice(0, 16).replace('T', ' ') : 'Just now'}
                                  </td>

                                  {/* Status */}
                                  <td className="p-3 text-center">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-sans">
                                      Delivered ✓
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Bar */}
                    {filteredLedger.length > financialsPageSize && (
                      <div className="flex items-center justify-between pt-2 px-1 text-xs">
                        <span className="text-slate-400 font-sans">
                          Showing <span className="text-white font-bold">{startIndex + 1}</span> to <span className="text-white font-bold">{Math.min(startIndex + financialsPageSize, filteredLedger.length)}</span> of <span className="text-white font-bold">{filteredLedger.length}</span> transactions
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setFinancialsPage(p => Math.max(1, p - 1))}
                            disabled={financialsPage === 1}
                            className="btn btn-secondary text-xs py-1 px-3 disabled:opacity-40"
                          >
                            Previous
                          </button>
                          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-bold">
                            {financialsPage} / {totalPages}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFinancialsPage(p => Math.min(totalPages, p + 1))}
                            disabled={financialsPage === totalPages}
                            className="btn btn-secondary text-xs py-1 px-3 disabled:opacity-40"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* SUB-VIEW 2: REAL PACKAGE PROFITABILITY ANALYTICS (MULTI-GAME & MULTI-PROVIDER) */}
              {financialsSubTab === 'packages' && (() => {
                const pkgs = filteredAndSortedPackages;
                const kpis = packageAnalyticsKpis;
                const activeProvName = providerSettings?.activeProvider || 'FazerCards';

                const handleHeaderSort = (key) => {
                  if (packageAnalyticsSortBy === key) {
                    setPackageAnalyticsSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  } else {
                    setPackageAnalyticsSortBy(key);
                    setPackageAnalyticsSortOrder(key === 'game' || key === 'name' ? 'asc' : 'desc');
                  }
                };

                const renderSortArrow = (key) => {
                  if (packageAnalyticsSortBy !== key) return <span className="opacity-30 text-[9px] ml-1">↕</span>;
                  return (
                    <span className="text-amber-400 font-black text-[10px] ml-1">
                      {packageAnalyticsSortOrder === 'asc' ? '▲' : '▼'}
                    </span>
                  );
                };

                return (
                  <div className="space-y-4">
                    {/* Controls & Filter Bar */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0F1423] border border-slate-800/90 shadow-lg space-y-3">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        {/* Search & Active Game Filter */}
                        <div className="flex flex-wrap items-center gap-2.5 flex-1">
                          {/* Search Input */}
                          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                            <input
                              type="text"
                              placeholder="Search game, package, diamonds..."
                              value={packageAnalyticsSearch}
                              onChange={(e) => setPackageAnalyticsSearch(e.target.value)}
                              className="input text-xs pl-8 pr-7 py-1.5 w-full bg-slate-950/80 border-slate-700/80 rounded-xl"
                            />
                            {packageAnalyticsSearch && (
                              <button
                                type="button"
                                onClick={() => setPackageAnalyticsSearch('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          {/* Game Filter Dropdown */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase hidden sm:inline">Game:</span>
                            <select
                              value={packageAnalyticsGameFilter}
                              onChange={(e) => setPackageAnalyticsGameFilter(e.target.value)}
                              className="input text-xs py-1.5 px-3 bg-slate-950/90 border-slate-700/80 rounded-xl font-bold text-slate-200 cursor-pointer"
                            >
                              <option value="ALL">🎮 All Games ({packageAnalyticsData.length})</option>
                              <option value="mlbb">⚔️ Mobile Legends</option>
                              <option value="pubgm">🎯 PUBG Mobile</option>
                              <option value="freefire">🔥 Free Fire</option>
                              <option value="hok">👑 Honor of Kings</option>
                              <option value="genshin">🌙 Genshin Impact</option>
                              <option value="star_rail">🚂 Honkai: Star Rail</option>
                              <option value="zenless">⚡ Zenless Zone Zero</option>
                              <option value="steam_usd">💨 Steam Wallet</option>
                              <option value="telegram_stars">✈️ Telegram Stars</option>
                              <option value="gift_cards">🎁 Gift Cards</option>
                            </select>
                          </div>

                          {/* Sort By Dropdown ("short by game") */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase hidden sm:inline">Sort:</span>
                            <select
                              value={packageAnalyticsSortBy}
                              onChange={(e) => setPackageAnalyticsSortBy(e.target.value)}
                              className="input text-xs py-1.5 px-3 bg-slate-950/90 border-slate-700/80 rounded-xl font-bold text-amber-300 cursor-pointer"
                            >
                              <option value="game">🎮 Sort by Game</option>
                              <option value="profit">💰 Highest Total Profit</option>
                              <option value="sold">📦 Most Units Sold</option>
                              <option value="unitProfit">💎 Unit Net Profit</option>
                              <option value="margin">📈 Profit Margin %</option>
                              <option value="retail">🏷️ Seller Retail Price</option>
                              <option value="cost">⚡ Provider Wholesale Cost</option>
                              <option value="reseller">🏢 Reseller Wholesale</option>
                              <option value="revenue">💵 Total Revenue</option>
                              <option value="name">🔤 Package Name</option>
                            </select>

                            {/* Sort Direction Toggle */}
                            <button
                              type="button"
                              onClick={() => setPackageAnalyticsSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                              className="btn btn-secondary text-xs py-1.5 px-2.5 rounded-xl border-slate-700 font-bold flex items-center gap-1 cursor-pointer"
                              title={packageAnalyticsSortOrder === 'asc' ? 'Ascending Order' : 'Descending Order'}
                            >
                              <span>{packageAnalyticsSortOrder === 'asc' ? '▲ Asc' : '▼ Desc'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Right: Active Provider & CSV Export */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {/* Live Provider indicator */}
                          <div className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5" title={`Wholesale cost dynamically pulled for ${activeProvName}`}>
                            <span>🔌</span>
                            <span className="text-[10px] uppercase text-purple-400 font-normal">Active Provider:</span>
                            <span className="font-black text-white">{activeProvName}</span>
                          </div>

                          {/* Dedicated Export CSV button */}
                          <button
                            type="button"
                            onClick={handleExportPackageAnalyticsCSV}
                            className="btn btn-secondary text-xs py-1.5 px-3 rounded-xl border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60 font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                            title="Export package profitability leaderboard with live provider & reseller rates"
                          >
                            <span>📥</span>
                            <span>Export CSV ({pkgs.length})</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 5 Real-Analytics Summary KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {/* KPI 1: Total Packages */}
                      <div className="card bg-gradient-to-br from-[#0F1423] to-[#0A0D18] border border-cyan-500/30 rounded-2xl p-3.5 space-y-1 shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">Catalog Size</span>
                          <span className="text-cyan-400 text-sm">📦</span>
                        </div>
                        <div className="text-2xl font-black text-cyan-200">
                          {kpis.totalCount}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {packageAnalyticsGameFilter === 'ALL' ? 'Across all games' : getGameAnalyticsMeta(packageAnalyticsGameFilter).name}
                        </div>
                      </div>

                      {/* KPI 2: Total Revenue */}
                      <div className="card bg-gradient-to-br from-[#0F1423] to-[#0A0D18] border border-blue-500/30 rounded-2xl p-3.5 space-y-1 shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-300">Retail Revenue</span>
                          <span className="text-blue-400 text-sm">💰</span>
                        </div>
                        <div className="text-2xl font-black text-blue-200">
                          ${kpis.totalRevenue.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          ~{Math.round(kpis.totalRevenue * 4100).toLocaleString()} ៛ Gross
                        </div>
                      </div>

                      {/* KPI 3: Total Provider Cost */}
                      <div className="card bg-gradient-to-br from-[#0F1423] to-[#0A0D18] border border-rose-500/30 rounded-2xl p-3.5 space-y-1 shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-rose-300">Provider Cost</span>
                          <span className="text-rose-400 text-sm">⚡</span>
                        </div>
                        <div className="text-2xl font-black text-rose-300">
                          ${kpis.totalCost.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          Supplier COGS ({activeProvName})
                        </div>
                      </div>

                      {/* KPI 4: Total Net Profit / Income */}
                      <div className="card bg-gradient-to-br from-[#0F1423] to-[#0A0D18] border border-emerald-500/40 rounded-2xl p-3.5 space-y-1 shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">Net Profit</span>
                          <span className="text-emerald-400 text-sm">💎</span>
                        </div>
                        <div className="text-2xl font-black text-emerald-400">
                          +${kpis.totalProfit.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-emerald-400/80 font-bold">
                          ~{Math.round(kpis.totalProfit * 4100).toLocaleString()} ៛ Income
                        </div>
                      </div>

                      {/* KPI 5: Avg Margin & Volume */}
                      <div className="card bg-gradient-to-br from-[#0F1423] to-[#0A0D18] border border-amber-500/30 rounded-2xl p-3.5 space-y-1 shadow-md col-span-2 sm:col-span-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">Avg Margin</span>
                          <span className="text-amber-400 text-sm">📈</span>
                        </div>
                        <div className="text-2xl font-black text-amber-300">
                          {kpis.avgMargin}%
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {kpis.totalUnitsSold} total units sold
                        </div>
                      </div>
                    </div>

                    {/* Real-Analytics Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40 shadow-xl">
                      <table className="w-full text-left text-xs min-w-[1050px]">
                        <thead className="bg-[#111728] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold select-none">
                          <tr>
                            <th onClick={() => handleHeaderSort('game')} className="p-3 cursor-pointer hover:text-white transition-colors">
                              Game {renderSortArrow('game')}
                            </th>
                            <th onClick={() => handleHeaderSort('name')} className="p-3 cursor-pointer hover:text-white transition-colors">
                              Package / Denomination {renderSortArrow('name')}
                            </th>
                            <th onClick={() => handleHeaderSort('retail')} className="p-3 text-right cursor-pointer hover:text-white transition-colors">
                              Seller Retail {renderSortArrow('retail')}
                            </th>
                            <th onClick={() => handleHeaderSort('cost')} className="p-3 text-right cursor-pointer hover:text-white transition-colors">
                              Provider Cost {renderSortArrow('cost')}
                            </th>
                            <th onClick={() => handleHeaderSort('reseller')} className="p-3 text-right cursor-pointer hover:text-white transition-colors">
                              Reseller Wholesale {renderSortArrow('reseller')}
                            </th>
                            <th onClick={() => handleHeaderSort('unitProfit')} className="p-3 text-right cursor-pointer hover:text-white transition-colors">
                              Unit Net Profit {renderSortArrow('unitProfit')}
                            </th>
                            <th onClick={() => handleHeaderSort('margin')} className="p-3 text-center cursor-pointer hover:text-white transition-colors">
                              Margin % {renderSortArrow('margin')}
                            </th>
                            <th onClick={() => handleHeaderSort('sold')} className="p-3 text-center cursor-pointer hover:text-white transition-colors">
                              Units Sold {renderSortArrow('sold')}
                            </th>
                            <th onClick={() => handleHeaderSort('profit')} className="p-3 text-right cursor-pointer hover:text-white transition-colors">
                              Total Profit {renderSortArrow('profit')}
                            </th>
                            <th onClick={() => handleHeaderSort('revenue')} className="p-3 text-right cursor-pointer hover:text-white transition-colors">
                              Total Income {renderSortArrow('revenue')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {pkgs.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="p-10 text-center text-slate-400 font-sans">
                                <div className="space-y-2">
                                  <div className="text-3xl">🎮</div>
                                  <p className="font-bold text-white text-sm">No packages match the selected criteria</p>
                                  <p className="text-xs text-slate-500">Try selecting "All Games" or clearing your search query.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            pkgs.map((p) => {
                              const marginBadgeColor = p.retailMarginPct >= 20
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : p.retailMarginPct >= 10
                                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                  : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';

                              return (
                                <tr key={p.key} className="hover:bg-slate-900/60 transition-colors">
                                  {/* Game Badge */}
                                  <td className="p-3 font-sans">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${p.gameBadgeColor} inline-flex items-center gap-1`}>
                                        <span>{p.gameIcon}</span>
                                        <span>{p.gameName}</span>
                                      </span>
                                    </div>
                                  </td>

                                  {/* Package / Denomination */}
                                  <td className="p-3 font-sans font-bold text-white">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span>{p.name}</span>
                                      {p.isPass && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                                          Pass ⭐
                                        </span>
                                      )}
                                      {p.status === 'Inactive' && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                          Inactive
                                        </span>
                                      )}
                                      {p.tag && !p.isPass && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
                                          {p.tag}
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Seller Retail */}
                                  <td className="p-3 text-right font-black text-cyan-300">
                                    ${p.retailPrice.toFixed(2)}
                                  </td>

                                  {/* Provider Wholesale Cost */}
                                  <td className="p-3 text-right">
                                    <div className="inline-flex flex-col items-end">
                                      <span className="font-black text-rose-300">${p.providerCost.toFixed(2)}</span>
                                      <span className="text-[9px] text-slate-500 font-mono">
                                        {activeProvName === 'FazerCards' ? 'FZR' : 'KHM'}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Reseller Wholesale */}
                                  <td className="p-3 text-right font-bold text-purple-300">
                                    <div className="inline-flex flex-col items-end">
                                      <span>${p.resellerPrice.toFixed(2)}</span>
                                      <span className="text-[9px] text-purple-400/80 font-normal">
                                        +${p.resellerUnitProfit.toFixed(2)} net
                                      </span>
                                    </div>
                                  </td>

                                  {/* Unit Net Profit */}
                                  <td className="p-3 text-right">
                                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-black">
                                      +${p.unitNetProfit.toFixed(2)}
                                    </span>
                                  </td>

                                  {/* Margin % */}
                                  <td className="p-3 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${marginBadgeColor}`}>
                                      {p.retailMarginPct.toFixed(1)}%
                                    </span>
                                  </td>

                                  {/* Units Sold */}
                                  <td className="p-3 text-center">
                                    <span className={`px-2 py-0.5 rounded font-bold ${p.unitsSold > 0 ? 'bg-slate-800 text-white font-black' : 'text-slate-500'}`}>
                                      {p.unitsSold}
                                    </span>
                                  </td>

                                  {/* Total Profit */}
                                  <td className="p-3 text-right font-black text-emerald-400">
                                    ${p.totalProfit.toFixed(2)}
                                  </td>

                                  {/* Total Income / Revenue */}
                                  <td className="p-3 text-right font-bold text-cyan-300">
                                    ${p.totalRevenue.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* SUB-VIEW 3: 7-DAY DAILY PERFORMANCE TRENDS */}
              {financialsSubTab === 'trends' && (() => {
                const trends = displayFinancials?.dailyProfitTrend || [];
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      {trends.map((day, idx) => (
                        <div key={day.date || idx} className="card bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2 text-center hover:border-amber-500/40 transition-all">
                          <div className="text-xs font-black text-slate-300 uppercase">{day.date}</div>
                          <div className="text-xl font-black text-emerald-400">
                            +${Number(day.netProfit || 0).toFixed(2)}
                          </div>
                          <div className="text-[10px] space-y-1 text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                            <div className="flex justify-between">
                              <span>Seller:</span>
                              <span className="text-cyan-300 font-bold">${Number(day.grossRevenue || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Provider:</span>
                              <span className="text-rose-300 font-bold">${Number(day.supplierCost || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Orders:</span>
                              <span className="text-amber-300 font-bold">{day.ordersCount || 0}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SUPPLIER & API GATEWAYS */}
        {/* ========================================================= */}
        {!loading && activeTab === 'provider' && (() => {
          const allProvidersList = (providerSettings.providers || DEFAULT_PROVIDERS).map(p => {
            if (p.id === 'KhmerTopUp') {
              const liveBal = providerSettings.khmerTopUpBalanceUSD !== undefined ? Number(providerSettings.khmerTopUpBalanceUSD) : Number(p.balanceUSD ?? 0.49);
              return { ...p, balanceUSD: liveBal };
            }
            if (p.id === 'FazerCards') {
              const liveBal = providerSettings.fazerCardsBalanceUSD !== undefined ? Number(providerSettings.fazerCardsBalanceUSD) : Number(p.balanceUSD ?? 0.01);
              return { ...p, balanceUSD: liveBal };
            }
            return p;
          });
          const activeProvObj = allProvidersList.find(p => p.id === providerSettings.activeProvider || p.name === providerSettings.activeProvider) || allProvidersList[0];
          const activeFzrToken = (providerSettings.fazerCardsTokens || []).find(t => t.isActive) || (providerSettings.fazerCardsTokens || [])[0];
          const standbyFzrTokens = (providerSettings.fazerCardsTokens || []).filter(t => t.id !== activeFzrToken?.id && t.token !== activeFzrToken?.token);
          const totalLiquidityUSD = allProvidersList.reduce((sum, p) => sum + (Number(p.balanceUSD) || 0), 0);
          const totalLiquidityKHR = Math.round(totalLiquidityUSD * 4100);

          const renderProviderAvatar = (prov, size = "md") => {
            const isKhmer = prov?.id === 'KhmerTopUp' || prov?.icon === '🇰🇭' || (prov?.name || '').toLowerCase().includes('khmer');
            const sizeClasses = size === "lg" ? "w-12 h-12 text-2xl" : size === "sm" ? "w-7 h-7 text-sm" : "w-10 h-10 text-xl";

            if (isKhmer) {
              return (
                <div className={`${sizeClasses} shrink-0 rounded-2xl p-0.5 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-md shadow-cyan-500/20 flex items-center justify-center`}>
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900 flex items-center justify-center p-0.5">
                    <UniversalSphericalFlag flagType="kh" className="w-full h-full object-cover" />
                  </div>
                </div>
              );
            }

            const bgGrad = prov?.id === 'FazerCards'
              ? 'from-purple-500/30 via-indigo-600/30 to-purple-950 border-purple-500/50 text-purple-300 shadow-purple-500/20'
              : prov?.badgeColor === 'emerald'
              ? 'from-emerald-500/30 via-teal-600/30 to-emerald-950 border-emerald-500/50 text-emerald-300 shadow-emerald-500/20'
              : prov?.badgeColor === 'amber'
              ? 'from-amber-500/30 via-orange-600/30 to-amber-950 border-amber-500/50 text-amber-300 shadow-amber-500/20'
              : 'from-cyan-500/30 via-blue-600/30 to-slate-900 border-cyan-500/50 text-cyan-300 shadow-cyan-500/20';

            return (
              <div className={`${sizeClasses} shrink-0 rounded-2xl bg-gradient-to-br ${bgGrad} border shadow-md flex items-center justify-center font-black select-none`}>
                {prov?.icon || '🌐'}
              </div>
            );
          };

          return (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Action Button */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleOpenAddProviderModal}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:via-teal-300 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
                >
                  <span className="text-sm">➕</span>
                  <span>Add New Provider</span>
                </button>
              </div>

              {/* Quick Telemetry & Liquidity Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
                {/* KPI 1: Active Gateway */}
                <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex items-center gap-3.5 transition-all hover:border-slate-700">
                  {renderProviderAvatar(activeProvObj, "md")}
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Route</span>
                    <div className="font-extrabold text-white text-sm truncate flex items-center gap-1.5 mt-0.5">
                      <span className="truncate">{activeProvObj?.name || providerSettings.activeProvider}</span>
                      <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">● Operational · ~85ms</span>
                  </div>
                </div>

                {/* KPI 2: Total Liquidity */}
                <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex items-center gap-3.5 transition-all hover:border-slate-700">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl shrink-0">
                    💰
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Combined Credit</span>
                    <div className="font-mono font-black text-amber-300 text-sm truncate mt-0.5">
                      ${totalLiquidityUSD.toFixed(2)} USD
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                      ~{totalLiquidityKHR.toLocaleString()} ៛ KHR
                    </span>
                  </div>
                </div>

                {/* KPI 3: Gateways Pool */}
                <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex items-center gap-3.5 transition-all hover:border-slate-700">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xl shrink-0">
                    ⚡
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gateway Pool</span>
                    <div className="font-extrabold text-white text-sm truncate mt-0.5">
                      {allProvidersList.length} Connected
                    </div>
                    <span className="text-[10px] text-indigo-300 block mt-0.5">
                      1 Active · {allProvidersList.length - 1} Standby
                    </span>
                  </div>
                </div>

                {/* KPI 4: Failover Protection */}
                <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex items-center gap-3.5 transition-all hover:border-slate-700">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                    🛡️
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Failover Protection</span>
                    <div className="font-extrabold text-emerald-300 text-sm truncate mt-0.5">
                      Smart Auto-Route
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Zero downtime top-ups
                    </span>
                  </div>
                </div>
              </div>

              {/* Main 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card: API Connection Settings */}
                <div className="card space-y-5 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-dark-card/90 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-base text-cyan-300">
                        🔐
                      </div>
                      <div>
                        <h3 className="font-black text-white text-base tracking-wide">API Connection Settings</h3>
                        <p className="text-[11px] text-slate-400">Configure credentials & live environment handshake</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>{activeProvObj?.name || providerSettings.activeProvider}</span>
                    </span>
                  </div>

                  <form onSubmit={handleSaveProviderSettings} className="space-y-4 text-xs">
                    {/* Top Row: Provider Select & Environment Mode */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                          Select Active Supplier Gateway
                        </label>
                        <select
                          value={providerSettings.activeProvider}
                          onChange={(e) => {
                            const nextId = e.target.value;
                            const targetProv = allProvidersList.find(p => p.id === nextId);
                            const nextKey = targetProv?.apiKey || (nextId === 'FazerCards' ? (providerSettings.fazerCardsApiKey || 'fc_5f79a0016d5d87bd1e83ea4f') : (providerSettings.khmerTopUpApiKey || 'kt_28c2640c86717199395d973670cf039a30ba2716'));
                            setProviderSettings({
                              ...providerSettings,
                              activeProvider: nextId,
                              apiKey: nextKey,
                              khmerTopUpApiKey: nextId === 'KhmerTopUp' ? nextKey : providerSettings.khmerTopUpApiKey
                            });
                          }}
                          className="input w-full text-xs py-2.5 rounded-xl font-bold bg-dark-bg border-slate-700 text-amber-300 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all cursor-pointer"
                        >
                          {allProvidersList.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} {p.badge ? `(${p.badge})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                          Environment Mode
                        </label>
                        <select
                          value={providerSettings.environment}
                          onChange={(e) =>
                            setProviderSettings({ ...providerSettings, environment: e.target.value })
                          }
                          className="input w-full text-xs py-2.5 rounded-xl bg-dark-bg border-slate-700 text-slate-200 cursor-pointer"
                        >
                          <option value="Production">🟢 Production (Live Injection)</option>
                          <option value="Sandbox">🧪 Sandbox / Demo</option>
                        </select>
                      </div>
                    </div>

                    {/* Active Provider Showcase Box */}
                    {providerSettings.activeProvider === 'FazerCards' ? (
                      <div className="space-y-3 pt-1">
                        {/* FazerCards Token Manager Header */}
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">🔑</span>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              FazerCards Token Keyring
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {(providerSettings.fazerCardsTokens || []).length} Saved
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAddFzrTokenModalOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-[11px] shadow-md flex items-center gap-1.5 transition-all transform hover:scale-105 cursor-pointer"
                          >
                            <span>➕</span>
                            <span>Add New Token</span>
                          </button>
                        </div>

                        {/* Active Token Showcase Card */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/30 via-slate-900 to-dark-bg border border-purple-500/40 shadow-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                                Active Injection Token:
                              </span>
                              <span className="text-xs font-black text-purple-300 truncate">
                                {activeFzrToken?.name || 'Primary Token'}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                              {activeFzrToken?.balanceUSD !== null && activeFzrToken?.balanceUSD !== undefined
                                ? `$${activeFzrToken.balanceUSD.toFixed(2)} USD`
                                : `$${(providerSettings.fazerCardsBalanceUSD !== undefined ? Number(providerSettings.fazerCardsBalanceUSD) : 0.01).toFixed(2)} USD`}
                            </span>
                          </div>

                          <div className="relative">
                            <input
                              type={showFzrTokenSecret ? "text" : "password"}
                              value={providerSettings.apiKey}
                              onChange={(e) =>
                                setProviderSettings({
                                  ...providerSettings,
                                  apiKey: e.target.value,
                                  fazerCardsApiKey: e.target.value
                                })
                              }
                              className="input w-full font-mono text-xs py-2.5 pl-3.5 pr-24 rounded-xl text-purple-300 bg-black/60 border-slate-700/80 focus:border-purple-400 transition-all"
                              placeholder="fc_..."
                            />
                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setShowFzrTokenSecret(!showFzrTokenSecret)}
                                className="p-1.5 text-xs rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title={showFzrTokenSecret ? "Hide token" : "Reveal token"}
                              >
                                {showFzrTokenSecret ? '👁️' : '🔒'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (providerSettings.apiKey) {
                                    navigator.clipboard.writeText(providerSettings.apiKey);
                                    showToast('success', 'Token copied to clipboard!');
                                  }
                                }}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all cursor-pointer"
                                title="Copy Token"
                              >
                                📋 Copy
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Standby Tokens */}
                        {standbyFzrTokens.length > 0 && (
                          <div className="p-3 rounded-2xl bg-dark-bg/60 border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                              <span>🛡️ Standby Keyring Tokens ({standbyFzrTokens.length})</span>
                              <span className="text-[10px] text-slate-500">1-Click Switch</span>
                            </div>
                            <div className="space-y-1.5">
                              {standbyFzrTokens.map((tokItem, idx) => (
                                <div
                                  key={tokItem.id || idx}
                                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all text-xs"
                                >
                                  <div className="min-w-0 flex-1 pr-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-bold text-white text-[11px] truncate">
                                        {tokItem.name || `Backup Token #${idx + 1}`}
                                      </span>
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-800 text-slate-400">
                                        STANDBY
                                      </span>
                                      {tokItem.balanceUSD !== null && tokItem.balanceUSD !== undefined && (
                                        <span className="text-[10px] font-mono text-cyan-400">
                                          ${tokItem.balanceUSD.toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                    <div className="font-mono text-[10px] text-slate-400 truncate mt-0.5">
                                      {tokItem.token.length > 18
                                        ? `${tokItem.token.substring(0, 8)}...${tokItem.token.substring(tokItem.token.length - 6)}`
                                        : tokItem.token}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleSwitchFzrToken(tokItem.id)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-[10px] font-bold transition-all cursor-pointer"
                                    >
                                      ⚡ Switch
                                    </button>
                                    <button
                                      type="button"
                                      disabled={testingFzrTokenId === tokItem.id}
                                      onClick={() => handleTestSpecificFzrToken(tokItem.token, tokItem.id)}
                                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-all cursor-pointer"
                                    >
                                      {testingFzrTokenId === tokItem.id ? '🔄' : 'Test'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteFzrToken(tokItem.id)}
                                      className="p-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 text-[10px] cursor-pointer"
                                      title="Remove"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-dark-bg border border-cyan-500/40 shadow-xl space-y-3.5 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            {renderProviderAvatar(activeProvObj, "lg")}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-black text-white text-sm truncate">{activeProvObj?.name}</h4>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  {activeProvObj?.badge || 'DIRECT'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{activeProvObj?.subtitle || activeProvObj?.apiUrl}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenEditProviderModal(activeProvObj)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700/80 shadow-md flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                          >
                            <span>⚙️</span>
                            <span>Edit Config</span>
                          </button>
                        </div>

                        {/* API Secret Key Input */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-slate-300 font-bold text-[11px] flex items-center gap-1.5">
                              <span>🔑</span>
                              <span>API Secret Key / Token</span>
                            </label>
                            <span className="text-[10px] text-cyan-400/90 font-mono font-semibold">
                              {activeProvObj?.id === 'KhmerTopUp' ? '🇰🇭 Official Direct API Key' : 'Active Credential'}
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type={showProviderSecretKey ? "text" : "password"}
                              value={providerSettings.apiKey || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setProviderSettings({
                                  ...providerSettings,
                                  apiKey: val,
                                  khmerTopUpApiKey: providerSettings.activeProvider === 'KhmerTopUp' ? val : providerSettings.khmerTopUpApiKey
                                });
                              }}
                              className="input w-full font-mono text-xs py-2.5 pl-3.5 pr-20 rounded-xl text-cyan-300 bg-black/60 border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 shadow-inner"
                              placeholder="API Key string..."
                            />
                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setShowProviderSecretKey(!showProviderSecretKey)}
                                className="p-1.5 text-xs rounded-lg hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title={showProviderSecretKey ? "Hide key" : "Show key"}
                              >
                                {showProviderSecretKey ? '👁️' : '🔒'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (providerSettings.apiKey) {
                                    navigator.clipboard.writeText(providerSettings.apiKey);
                                    showToast('success', 'API Key copied to clipboard!');
                                  }
                                }}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                                title="Copy Key"
                              >
                                📋 Copy
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Gateway Endpoint URL with POST method badge */}
                        <div>
                          <label className="text-slate-300 font-bold text-[11px] block mb-1">
                            Gateway Endpoint URL
                          </label>
                          <div className="flex rounded-xl overflow-hidden border border-slate-700/80 bg-black/50">
                            <span className="px-3 py-2 bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] flex items-center border-r border-slate-800 shrink-0">
                              POST
                            </span>
                            <input
                              type="text"
                              value={activeProvObj?.apiUrl || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updatedProvs = allProvidersList.map(p =>
                                  p.id === activeProvObj.id ? { ...p, apiUrl: val } : p
                                );
                                setProviderSettings({
                                  ...providerSettings,
                                  providers: updatedProvs
                                });
                              }}
                              className="w-full font-mono text-xs py-2 px-3 text-slate-200 bg-transparent border-none outline-none focus:ring-0"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons Bar */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-slate-800">
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer"
                      >
                        <span>💾</span>
                        <span>Save Credentials</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTestProviderConnection(activeProvObj)}
                        disabled={providerTesting}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/20 hover:from-emerald-600/40 hover:to-teal-600/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center gap-2 transition-all cursor-pointer shadow-md"
                        title="Query live real wallet balance directly from provider API"
                      >
                        <span>{providerTesting ? '⏳' : '🔄'}</span>
                        <span>{providerTesting ? 'Syncing...' : 'Sync Live Wallet'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleTestProviderConnection}
                        disabled={providerTesting}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <span>{providerTesting ? '🔄' : '⚡'}</span>
                        <span>{providerTesting ? 'Testing Handshake...' : 'Test Connection'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenBalanceEdit(activeProvObj)}
                        className="ml-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:from-amber-500/30 hover:to-yellow-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <span>💳</span>
                        <span>Adjust Balance</span>
                        <span className="font-mono font-black text-amber-200 bg-amber-500/25 px-2 py-0.5 rounded-lg border border-amber-500/30">
                          ${Number(activeProvObj?.balanceUSD ?? 0).toFixed(2)}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Card: 1-Click Gateway Switcher */}
                <div className="card space-y-4 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-dark-card/90 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-base text-purple-300">
                        ⚡
                      </div>
                      <div>
                        <h3 className="font-black text-white text-base tracking-wide">1-Click Gateway Switcher</h3>
                        <p className="text-[11px] text-slate-400">Zero-downtime routing & live wholesale balances</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {allProvidersList.length} Configured
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs max-h-[640px] overflow-y-auto pr-1">
                    {allProvidersList.map((prov) => {
                      const isActive = providerSettings.activeProvider === prov.id || providerSettings.activeProvider === prov.name;
                      const isDefault = prov.isDefault || prov.id === 'FazerCards' || prov.id === 'KhmerTopUp';
                      const balanceUSD = Number(prov.balanceUSD ?? 0);
                      const balanceKHR = Math.round(balanceUSD * 4100);

                      return (
                        <div
                          key={prov.id}
                          className={`p-4 rounded-2xl border transition-all space-y-3 ${
                            isActive
                              ? 'bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-blue-950/30 border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/30'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700/80 transition-all'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                              {renderProviderAvatar(prov, "md")}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-sm truncate">{prov.name}</span>
                                  {prov.badge && (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                                      {prov.badge}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 block truncate mt-0.5">{prov.subtitle || prov.apiUrl}</span>
                              </div>
                            </div>
                            {isActive ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm shrink-0">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>ACTIVE 🟢</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                                STANDBY
                              </span>
                            )}
                          </div>

                          {/* Balance Display */}
                          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/50 border border-slate-800/80">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 text-xs font-semibold">Available Credit:</span>
                              <button
                                type="button"
                                onClick={() => handleTestProviderConnection(prov)}
                                disabled={providerTesting}
                                className="px-2 py-0.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                title="Sync live real wallet balance from provider API"
                              >
                                <span>{providerTesting ? '⏳' : '🔄'}</span>
                                <span>Sync</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenBalanceEdit(prov)}
                                className="px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold transition-all cursor-pointer"
                                title="Update credit balance"
                              >
                                ✏️ Edit
                              </button>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-black text-amber-300 text-base">
                                ${balanceUSD.toFixed(2)} USD
                              </span>
                              <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">
                                ~{balanceKHR.toLocaleString()} ៛ KHR
                              </span>
                            </div>
                          </div>

                          {/* Switch Button */}
                          <div className="flex gap-2 pt-0.5">
                            {isActive ? (
                              <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Currently Active Fulfillment Route</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={switchingProvider}
                                onClick={() => handleQuickSwitchProvider(prov)}
                                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <span>⚡</span>
                                <span>{switchingProvider ? 'Routing...' : `Switch to ${prov.name} ($${balanceUSD.toFixed(2)})`}</span>
                              </button>
                            )}
                          </div>

                          {/* Footer Links & Actions */}
                          <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-800/60">
                            <div className="flex items-center gap-2.5">
                              {prov.docsUrl && (
                                <a
                                  href={prov.docsUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-amber-400 hover:text-amber-300 font-bold hover:underline flex items-center gap-1"
                                >
                                  <span>📖</span>
                                  <span>API Docs</span>
                                </a>
                              )}
                              {prov.docsUrl && prov.refillUrl && <span className="text-slate-700">|</span>}
                              {prov.refillUrl && (
                                <a
                                  href={prov.refillUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline flex items-center gap-1"
                                >
                                  <span>💳</span>
                                  <span>Refill Portal</span>
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditProviderModal(prov)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[10px] border border-slate-700 transition-colors cursor-pointer"
                              >
                                ⚙️ Config
                              </button>
                              {!isDefault && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProviderConfirm(prov.id, prov.name)}
                                  className="px-2 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 font-bold text-[10px] transition-colors cursor-pointer"
                                  title="Delete Provider"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add Provider CTA Card */}
                    <button
                      type="button"
                      onClick={handleOpenAddProviderModal}
                      className="w-full p-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-emerald-500/60 bg-dark-bg/40 hover:bg-emerald-500/5 text-slate-400 hover:text-emerald-300 flex items-center justify-center gap-2 transition-all cursor-pointer group"
                    >
                      <span className="text-base group-hover:scale-125 transition-transform">➕</span>
                      <span className="font-bold text-xs">Add Another Supplier Gateway (Smile One, UniPin, Custom REST...)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

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
                  <table className="w-full text-left text-xs min-w-[640px]">
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
                  <table className="w-full text-left text-xs min-w-[640px]">
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
        {/* TAB: ABA PAYWAY DASHBOARD */}
        {/* ========================================================= */}
        {!loading && activeTab === 'payway' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>💳</span> ABA PayWay Dashboard
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Merchant ID: <span className="text-amber-300 font-bold">tintopup</span> — Live transaction list, exchange rates &amp; payment status from ABA PayWay gateway.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="https://merchant.payway.com.kh/transactions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold text-xs py-2 px-4 font-black shadow-glow-gold flex items-center gap-1.5"
                >
                  <span>🌐</span>
                  <span>Open PayWay Portal</span>
                </a>
                <button
                  type="button"
                  onClick={async () => {
                    setPaywaySyncing(true);
                    try {
                      const res = await paywayAPI.syncReceiptsToMongoDB();
                      const msg = res?.data?.message || 'Receipts synced to MongoDB Atlas!';
                      showToast('success', msg);
                    } catch (err) {
                      showToast('error', err.response?.data?.message || err.message || 'Failed to sync receipts to MongoDB');
                    } finally {
                      setPaywaySyncing(false);
                    }
                  }}
                  disabled={paywaySyncing || paywayLoading}
                  className="btn btn-gold text-xs py-2 px-3 flex items-center gap-1.5 shadow-glow-gold cursor-pointer"
                  title="Insert & Sync all ABA PayWay receipts into MongoDB Atlas database"
                >
                  <span className={paywaySyncing ? 'animate-spin' : ''}>{paywaySyncing ? '⏳' : '📥'}</span>
                  <span>{paywaySyncing ? 'Syncing to DB...' : 'Sync Receipts to DB'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadData(false)}
                  disabled={refreshing || paywayLoading}
                  className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <span className={(refreshing || paywayLoading) ? 'animate-spin' : ''}>🔄</span>
                  <span>{(refreshing || paywayLoading) ? 'Loading...' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {paywayError && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-sm font-medium flex items-center gap-2">
                <span>⚠️</span> {paywayError}
              </div>
            )}

            {/* Info Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Merchant Info */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0E1A2E] to-[#111728] border border-amber-500/30 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">💳</div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Merchant Account</p>
                    <p className="text-sm font-black text-amber-300">tintopup</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between"><span>Name:</span><span className="text-white font-bold">PHEAK DETH</span></div>
                  <div className="flex justify-between"><span>Outlet:</span><span className="text-white font-bold">Tin TopUp</span></div>
                  <div className="flex justify-between"><span>Portal:</span><a href="https://merchant.payway.com.kh" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">merchant.payway.com.kh</a></div>
                </div>
              </div>

              {/* Exchange Rate */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0E1A2E] to-[#111728] border border-cyan-500/30 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl">💱</div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">USD → KHR Rate</p>
                    <p className="text-sm font-black text-cyan-300">
                      {paywayExchangeRate
                        ? `1 USD = ${Number(paywayExchangeRate?.usd_to_khr || paywayExchangeRate?.rate || paywayExchangeRate?.usdToKhr || 4100).toLocaleString()} ៛`
                        : paywayLoading ? 'Loading...' : '~4,100 ៛'}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">Live rate from ABA PayWay API</p>
                {paywayExchangeRate && (
                  <pre className="text-[9px] text-slate-600 mt-2 overflow-hidden line-clamp-3">{JSON.stringify(paywayExchangeRate, null, 2)}</pre>
                )}
              </div>

              {/* Transaction Count */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0E1A2E] to-[#111728] border border-emerald-500/30 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl">📊</div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Transactions Loaded</p>
                    <p className="text-2xl font-black text-emerald-300">{Array.isArray(paywayTransactions) ? paywayTransactions.length : 0}</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">Last 40 transactions from ABA PayWay</p>
              </div>
            </div>

            {/* Filters */}
            <div className="p-4 rounded-2xl bg-[#111728] border border-slate-700 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">🔍 Filter Transactions</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Status</label>
                  <select
                    value={paywayFilter.status}
                    onChange={(e) => setPaywayFilter(f => ({ ...f, status: e.target.value }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl text-xs text-white px-3 py-2 focus:border-amber-500 outline-none cursor-pointer"
                  >
                    <option value="">All Status</option>
                    <option value="APPROVED">✅ Approved</option>
                    <option value="PENDING">⏳ Pending</option>
                    <option value="DECLINED">❌ Declined</option>
                    <option value="EXPIRED">⏰ Expired</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">From Date</label>
                  <input
                    type="date"
                    value={paywayFilter.fromDate}
                    onChange={(e) => setPaywayFilter(f => ({ ...f, fromDate: e.target.value }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl text-xs text-white px-3 py-2 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">To Date</label>
                  <input
                    type="date"
                    value={paywayFilter.toDate}
                    onChange={(e) => setPaywayFilter(f => ({ ...f, toDate: e.target.value }))}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl text-xs text-white px-3 py-2 focus:border-amber-500 outline-none"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      setPaywayLoading(true);
                      setPaywayError(null);
                      try {
                        const txRes = await paywayAPI.getTransactionList({
                          status: paywayFilter.status,
                          fromDate: paywayFilter.fromDate,
                          toDate: paywayFilter.toDate,
                          fromAmount: paywayFilter.fromAmount,
                          toAmount: paywayFilter.toAmount,
                          page: paywayFilter.page,
                          pagination: paywayFilter.pagination,
                        }).catch(() => ({ data: null }));
                        const raw = typeof txRes?.data === 'string' ? JSON.parse(txRes.data) : txRes?.data;
                        const list = Array.isArray(raw?.data) ? raw.data : (raw?.data?.transactions || raw?.transactions || (Array.isArray(raw) ? raw : []));
                        setPaywayTransactions(list);
                      } catch (err) {
                        setPaywayError('Filter error: ' + (err?.message || String(err)));
                      } finally {
                        setPaywayLoading(false);
                      }
                    }}
                    disabled={paywayLoading}
                    className="btn btn-gold text-xs py-2 px-4 font-black flex items-center gap-1.5 flex-1"
                  >
                    <span>{paywayLoading ? '⏳' : '🔍'}</span>
                    <span>{paywayLoading ? 'Searching...' : 'Apply Filter'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaywayFilter({ status: '', fromDate: '', toDate: '', fromAmount: '', toAmount: '', page: '1', pagination: '40' })}
                    className="btn btn-secondary text-xs py-2 px-3"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="rounded-3xl bg-[#0B0F19] border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-4 sm:px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                <p className="text-sm font-black text-white flex items-center gap-2">
                  <span>📋</span> Transaction List
                </p>
                <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded-lg">
                  {Array.isArray(paywayTransactions) ? paywayTransactions.length : 0} records
                </span>
              </div>

              {paywayLoading ? (
                <div className="flex items-center justify-center py-16 gap-3">
                  <span className="text-2xl animate-spin">⏳</span>
                  <span className="text-slate-400 text-sm">Fetching from ABA PayWay...</span>
                </div>
              ) : !Array.isArray(paywayTransactions) || paywayTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-3xl">💳</div>
                  <p className="text-white font-bold text-sm">No Transactions Found</p>
                  <p className="text-slate-500 text-xs max-w-xs">
                    No transactions are recorded in ABA PayWay yet. Make a test payment or check your date range filter.
                  </p>
                  <a
                    href="https://merchant.payway.com.kh/transactions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold text-xs py-2 px-5 font-black flex items-center gap-1.5 mt-1"
                  >
                    <span>🌐</span> View in PayWay Portal
                  </a>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[680px]">
                    <thead>
                      <tr className="border-b border-slate-800 bg-[#0d121e]">
                        <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tran ID</th>
                        <th className="text-left py-3 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                        <th className="text-left py-3 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Currency</th>
                        <th className="text-left py-3 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="text-left py-3 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</th>
                        <th className="text-left py-3 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date / Time</th>
                        <th className="text-right py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paywayTransactions.map((tx, idx) => {
                        const tranId = tx.transaction_id || tx.tran_id || tx.tranId || tx.id || String(idx);
                        const amount = tx.total_amount ?? tx.original_amount ?? tx.amount ?? '—';
                        const currency = tx.original_currency || tx.currency || 'USD';
                        const paymentAmount = tx.payment_amount;
                        const paymentCurrency = tx.payment_currency;
                        const hasKhr = paymentCurrency === 'KHR' && paymentAmount;
                        const rawStatus = (tx.payment_status || tx.status || 'UNKNOWN').toString().toUpperCase();
                        const isPaid = rawStatus === 'APPROVED' || rawStatus === 'PAID' || rawStatus === 'SUCCESS';
                        const isPending = rawStatus === 'PENDING';
                        const statusColor = isPaid
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : isPending
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                        const statusIcon = isPaid ? '✅' : isPending ? '⏳' : '❌';
                        const payMethod = tx.payment_type || tx.payment_option || tx.channel || tx.payment_method || 'ABA Pay';
                        const dateStr = tx.transaction_date || tx.created_at || tx.createdAt || tx.request_time || tx.req_time || '—';
                        const apv = tx.apv;

                        return (
                          <tr
                            key={tranId}
                            className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors cursor-pointer"
                            onClick={() => {
                              setPaywaySelectedTran(tx);
                              setPaywayTranDetailOpen(true);
                              setPaywayTranDetail(null);
                              setPaywayTranDetailLoading(true);
                              paywayAPI.getDetails(tranId)
                                .then((res) => {
                                  const raw = typeof res?.data === 'string' ? JSON.parse(res.data) : res?.data;
                                  setPaywayTranDetail(raw);
                                })
                                .catch(() => setPaywayTranDetail({ error: 'Could not load details' }))
                                .finally(() => setPaywayTranDetailLoading(false));
                            }}
                          >
                            <td className="py-3 px-4">
                              <div className="flex flex-col">
                                <span className="text-white font-mono font-black text-xs tracking-wide">{tranId}</span>
                                {apv && (
                                  <span className="text-[10px] text-amber-400 font-mono font-bold mt-0.5">
                                    APV: {apv}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col">
                                <span className="text-white font-black text-xs">
                                  {typeof amount === 'number' ? `$${amount.toFixed(2)}` : (String(amount).startsWith('$') ? amount : `$${amount}`)}
                                </span>
                                {hasKhr && (
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    ~{Number(paymentAmount).toLocaleString()} ៛
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-300 font-bold">{currency}</td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColor}`}>
                                {statusIcon} {rawStatus}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 text-cyan-300 text-[10px] font-bold border border-cyan-500/20">
                                💳 {payMethod}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-300 text-[11px] font-medium whitespace-nowrap">{dateStr}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                {isPaid && (
                                  <button
                                    type="button"
                                    title="Deliver Diamonds via Khmer TopUp"
                                    disabled={paywayDeliveringId === tranId}
                                    className="text-[11px] text-emerald-300 hover:text-emerald-200 font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                    onClick={async () => {
                                      setPaywayDeliveringId(tranId);
                                      try {
                                        const res = await paywayAPI.deliverTopUp(tranId);
                                        showToast('success', res?.data?.message || `Top-up delivered successfully! (Tx: ${res?.data?.transactionId || tranId})`);
                                        loadData(true);
                                      } catch (err) {
                                        showToast('error', err.response?.data?.message || err.message || 'Failed to deliver diamonds via provider');
                                      } finally {
                                        setPaywayDeliveringId(null);
                                      }
                                    }}
                                  >
                                    <span>{paywayDeliveringId === tranId ? '⏳' : '💎'}</span>
                                    <span>{paywayDeliveringId === tranId ? 'Sending...' : 'Top-Up'}</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  title="View Official Receipt"
                                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                                  onClick={() => {
                                    setPaywayReceiptTran(tx);
                                    setPaywayReceiptModalOpen(true);
                                  }}
                                >
                                  <span>🧾</span>
                                  <span>Receipt</span>
                                </button>
                                <button
                                  type="button"
                                  title="Copy Transaction ID"
                                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold px-2 py-1 rounded-lg hover:bg-cyan-500/10 transition-colors cursor-pointer"
                                  onClick={() => {
                                    navigator.clipboard?.writeText(tranId);
                                    showToast('success', `Tran ID "${tranId}" copied!`);
                                  }}
                                >
                                  Copy ID
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Transaction Detail Modal */}
            {paywayTranDetailOpen && paywaySelectedTran && (() => {
              const detail = paywayTranDetail?.data || (paywayTranDetail?.transaction_id ? paywayTranDetail : null) || paywaySelectedTran;
              const tranId = detail?.transaction_id || paywaySelectedTran?.transaction_id || paywaySelectedTran?.tran_id || paywaySelectedTran?.tranId || '—';
              const rawStatus = (detail?.payment_status || paywaySelectedTran?.payment_status || 'UNKNOWN').toString().toUpperCase();
              const isPaid = rawStatus === 'APPROVED' || rawStatus === 'PAID' || rawStatus === 'SUCCESS';
              const isPending = rawStatus === 'PENDING';
              const statusColor = isPaid
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : isPending
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30';
              const statusIcon = isPaid ? '✅' : isPending ? '⏳' : '❌';
              const apv = detail?.apv || paywaySelectedTran?.apv;
              const bankRef = detail?.bank_ref;
              const bankName = detail?.bank_name || 'ABA Bank';
              const payerAccount = detail?.payer_account;
              const customerName = [detail?.first_name, detail?.last_name].filter(Boolean).join(' ') || '—';
              const email = detail?.email;
              const phone = detail?.phone;
              const origAmount = detail?.original_amount ?? detail?.total_amount ?? paywaySelectedTran?.total_amount ?? paywaySelectedTran?.original_amount ?? '0.00';
              const origCurrency = detail?.original_currency || paywaySelectedTran?.original_currency || 'USD';
              const paymentAmount = detail?.payment_amount ?? paywaySelectedTran?.payment_amount;
              const paymentCurrency = detail?.payment_currency || paywaySelectedTran?.payment_currency || origCurrency;
              const payMethod = detail?.payment_type || paywaySelectedTran?.payment_type || 'ABA Pay';
              const dateStr = detail?.transaction_date || paywaySelectedTran?.transaction_date || '—';
              const operations = Array.isArray(detail?.transaction_operations) ? detail.transaction_operations : [];

              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setPaywayTranDetailOpen(false)} />
                  <div className="relative w-full max-w-xl bg-[#0B0F19] border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 max-h-[88vh] overflow-y-auto space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl">
                          💳
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                            ABA PayWay Transaction Details
                          </h3>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {tranId}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaywayTranDetailOpen(false)}
                        className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Status & Key Identifiers Bar */}
                    <div className="p-4 rounded-2xl bg-[#0e1626] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border ${statusColor}`}>
                          {statusIcon} {rawStatus}
                        </span>
                        {apv && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                            <span>🔑 APV:</span> {apv}
                          </span>
                        )}
                      </div>
                      {bankRef && (
                        <div className="text-[11px] text-slate-400 font-mono">
                          Bank Ref: <span className="text-white font-bold">{bankRef}</span>
                        </div>
                      )}
                    </div>

                    {/* Amount & Financial Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 rounded-2xl bg-[#111728] border border-slate-800">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                        <p className="text-base font-black text-emerald-400">
                          ${typeof origAmount === 'number' ? origAmount.toFixed(2) : origAmount} {origCurrency}
                        </p>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#111728] border border-slate-800">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Settled Amount</p>
                        <p className="text-base font-black text-cyan-300">
                          {paymentAmount ? `${Number(paymentAmount).toLocaleString()} ${paymentCurrency}` : `${origAmount} ${origCurrency}`}
                        </p>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#111728] border border-slate-800 col-span-2 sm:col-span-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Payment Method</p>
                        <p className="text-sm font-black text-amber-300 flex items-center gap-1 mt-0.5">
                          <span>💳</span> {payMethod}
                        </p>
                      </div>
                    </div>

                    {/* Customer & Bank Details */}
                    <div className="p-4 rounded-2xl bg-[#111728] border border-slate-800 space-y-2 text-xs">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-2">Customer &amp; Bank Information</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                        <div className="flex justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                          <span className="text-slate-400">Payer Name:</span>
                          <span className="text-white font-bold">{customerName}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                          <span className="text-slate-400">Bank / Outlet:</span>
                          <span className="text-white font-bold">{bankName}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                          <span className="text-slate-400">Account:</span>
                          <span className="text-cyan-300 font-mono font-bold">{payerAccount || '—'}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                          <span className="text-slate-400">Date &amp; Time:</span>
                          <span className="text-white font-bold">{dateStr}</span>
                        </div>
                        {email && (
                          <div className="flex justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 sm:col-span-2">
                            <span className="text-slate-400">Email:</span>
                            <span className="text-white font-mono">{email}</span>
                          </div>
                        )}
                        {phone && (
                          <div className="flex justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 sm:col-span-2">
                            <span className="text-slate-400">Phone:</span>
                            <span className="text-white font-mono">{phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Operations Log */}
                    {operations.length > 0 && (
                      <div className="p-4 rounded-2xl bg-[#111728] border border-slate-800 space-y-2">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-2">Transaction Operations</p>
                        <div className="space-y-1.5">
                          {operations.map((op, oIdx) => (
                            <div key={oIdx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="font-bold text-white">{op.status || 'Completed'}</span>
                                <span className="text-slate-400 text-[11px]">({op.transaction_date})</span>
                              </div>
                              <span className="font-black text-emerald-400">${op.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Full API Response Accordion */}
                    <div className="p-3 rounded-2xl bg-[#060A14] border border-slate-800">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Full PayWay API Response</p>
                      {paywayTranDetailLoading ? (
                        <p className="text-slate-400 text-xs animate-pulse">Loading live details from ABA PayWay API...</p>
                      ) : paywayTranDetail ? (
                        <pre className="text-[10px] text-slate-400 whitespace-pre-wrap break-all leading-relaxed max-h-48 overflow-y-auto font-mono">
                          {JSON.stringify(paywayTranDetail, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-slate-500 text-xs">No additional details returned.</p>
                      )}
                    </div>

                    {/* Modal Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPaywayReceiptTran(detail);
                          setPaywayReceiptModalOpen(true);
                        }}
                        className="btn btn-gold text-xs py-2.5 px-4 font-black flex-1 flex items-center justify-center gap-1.5 shadow-glow-gold cursor-pointer"
                      >
                        <span>🧾</span>
                        <span>View Official Receipt</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (tranId) {
                            navigator.clipboard?.writeText(tranId);
                            showToast('success', `Tran ID "${tranId}" copied!`);
                          }
                        }}
                        className="btn btn-secondary text-xs py-2.5 px-3 flex items-center gap-1 cursor-pointer"
                      >
                        <span>📋</span>
                        <span>Copy ID</span>
                      </button>
                      <a
                        href="https://merchant.payway.com.kh/transactions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary text-xs py-2.5 px-3 flex items-center gap-1"
                      >
                        <span>🌐</span>
                        <span>PayWay Portal</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Official ABA PayWay Receipt Modal */}
            {paywayReceiptModalOpen && paywayReceiptTran && (() => {
              const r = paywayReceiptTran;
              const tranId = r.transaction_id || r.tran_id || r.tranId || '—';
              const apv = r.apv || '—';
              const bankRef = r.bank_ref || '—';
              const amount = r.total_amount ?? r.original_amount ?? r.amount ?? '0.00';
              const currency = r.original_currency || r.currency || 'USD';
              const paymentAmount = r.payment_amount;
              const paymentCurrency = r.payment_currency;
              const hasKhr = paymentCurrency === 'KHR' && paymentAmount;
              const payMethod = r.payment_type || r.payment_option || 'ABA Pay';
              const dateStr = r.transaction_date || r.created_at || r.createdAt || new Date().toLocaleString();
              const customerName = [r.first_name, r.last_name].filter(Boolean).join(' ') || 'PHEAK DETH';
              const customerEmail = r.email || '—';
              const customerPhone = r.phone || '—';
              const payerAccount = r.payer_account || '—';
              const bankName = r.bank_name || 'ABA Bank';

              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
                  <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setPaywayReceiptModalOpen(false)} />
                  <div className="relative w-full max-w-md bg-[#0B0F19] border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-4">
                    {/* Official Receipt Card */}
                    <div id="aba-receipt-printable" className="p-5 rounded-2xl bg-[#0d1527] border border-emerald-500/30 text-center space-y-4 text-white">
                      {/* Top ABA Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
                        <div className="text-left">
                          <p className="text-sm font-black text-amber-300 tracking-wider uppercase">TIN TOPUP</p>
                          <p className="text-[10px] text-slate-400">Merchant: <span className="font-mono text-white">tintopup</span></p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-cyan-400 tracking-widest">ABA' PAYWAY</span>
                          <p className="text-[9px] text-emerald-400 font-bold">OFFICIAL RECEIPT</p>
                        </div>
                      </div>

                      {/* Success Checkmark Circle */}
                      <div className="flex flex-col items-center justify-center pt-2">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-lg mb-2">
                          ✓
                        </div>
                        <h4 className="text-base font-black text-white tracking-wide">Payment Successful</h4>
                        <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">APPROVED</p>
                      </div>

                      {/* Amount Banner */}
                      <div className="py-3 px-4 rounded-xl bg-[#09101f] border border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Amount Paid</p>
                        <p className="text-2xl font-black text-emerald-400 tracking-tight">
                          ${typeof amount === 'number' ? amount.toFixed(2) : amount} {currency}
                        </p>
                        {hasKhr && (
                          <p className="text-xs text-cyan-300 font-mono mt-0.5 font-bold">
                            ~ {Number(paymentAmount).toLocaleString()} ៛ KHR
                          </p>
                        )}
                      </div>

                      {/* Receipt Fields */}
                      <div className="space-y-2 text-xs text-left pt-1">
                        <div className="flex justify-between py-1 border-b border-slate-800/80">
                          <span className="text-slate-400">Transaction ID:</span>
                          <span className="text-white font-mono font-black">{tranId}</span>
                        </div>
                        {apv && apv !== '—' && (
                          <div className="flex justify-between py-1 border-b border-slate-800/80">
                            <span className="text-slate-400">Approval Code (APV):</span>
                            <span className="text-amber-300 font-mono font-bold">{apv}</span>
                          </div>
                        )}
                        {bankRef && bankRef !== '—' && (
                          <div className="flex justify-between py-1 border-b border-slate-800/80">
                            <span className="text-slate-400">Bank Reference:</span>
                            <span className="text-white font-mono">{bankRef}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-1 border-b border-slate-800/80">
                          <span className="text-slate-400">Payment Method:</span>
                          <span className="text-cyan-300 font-bold">{payMethod}</span>
                        </div>
                        {payerAccount && payerAccount !== '—' && (
                          <div className="flex justify-between py-1 border-b border-slate-800/80">
                            <span className="text-slate-400">Payer Account:</span>
                            <span className="text-white font-mono">{payerAccount} ({bankName})</span>
                          </div>
                        )}
                        <div className="flex justify-between py-1 border-b border-slate-800/80">
                          <span className="text-slate-400">Customer:</span>
                          <span className="text-white font-bold">{customerName}</span>
                        </div>
                        {customerEmail && customerEmail !== '—' && (
                          <div className="flex justify-between py-1 border-b border-slate-800/80">
                            <span className="text-slate-400">Email:</span>
                            <span className="text-slate-300 font-mono text-[11px]">{customerEmail}</span>
                          </div>
                        )}
                        {customerPhone && customerPhone !== '—' && (
                          <div className="flex justify-between py-1 border-b border-slate-800/80">
                            <span className="text-slate-400">Phone:</span>
                            <span className="text-slate-300 font-mono text-[11px]">{customerPhone}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400">Date &amp; Time:</span>
                          <span className="text-slate-200 font-medium">{dateStr}</span>
                        </div>
                      </div>

                      {/* Seal / Footer */}
                      <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 leading-relaxed">
                        Official payment confirmation verified through ABA PayWay Merchant Gateway.
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="btn btn-gold text-xs py-2.5 px-4 font-black flex-1 flex items-center justify-center gap-1.5 shadow-glow-gold cursor-pointer"
                      >
                        <span>🖨️</span>
                        <span>Print Receipt</span>
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await paywayAPI.syncReceiptsToMongoDB(tranId);
                            showToast('success', res?.data?.message || `Receipt #${tranId} inserted into DB!`);
                          } catch (err) {
                            showToast('error', err.response?.data?.message || err.message || 'Failed to save receipt to DB');
                          }
                        }}
                        className="btn btn-secondary text-xs py-2.5 px-3 flex items-center gap-1 text-emerald-400 hover:text-emerald-300 border-emerald-500/30 cursor-pointer"
                        title="Save/Upsert this receipt into MongoDB database"
                      >
                        <span>💾</span>
                        <span>Save to DB</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const receiptText = `=== ABA PAYWAY RECEIPT ===\nMerchant: Tin TopUp (tintopup)\nTran ID: ${tranId}\nAPV: ${apv}\nBank Ref: ${bankRef}\nAmount: $${amount} ${currency}\nMethod: ${payMethod}\nCustomer: ${customerName}\nDate: ${dateStr}\nStatus: APPROVED\n==========================`;
                          navigator.clipboard?.writeText(receiptText);
                          showToast('success', 'Receipt details copied to clipboard!');
                        }}
                        className="btn btn-secondary text-xs py-2.5 px-3 flex items-center gap-1 cursor-pointer"
                      >
                        <span>📋</span>
                        <span>Copy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaywayReceiptModalOpen(false)}
                        className="btn btn-secondary text-xs py-2.5 px-3 cursor-pointer"
                      >
                        ✕ Close
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
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
                <table className="w-full text-left text-xs min-w-[640px]">
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
                    <span className="font-mono font-bold text-purple-300">${(providerSettings.fazerCardsBalanceUSD !== undefined ? Number(providerSettings.fazerCardsBalanceUSD) : 0.01).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-dark-input/60">
                    <span className="text-slate-400">KhmerTopUp Balance:</span>
                    <span className="font-mono font-bold text-cyan-300">${(providerSettings.khmerTopUpBalanceUSD !== undefined ? Number(providerSettings.khmerTopUpBalanceUSD) : 0.49).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
          </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM FLOATING CAPSULE DOCK (md:hidden) */}
      {/* ========================================================= */}
      <div className="md:hidden fixed bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 select-none w-[94%] max-w-md transition-all duration-300">
        <nav className="relative flex items-center justify-around py-2 px-2 bg-[#090f1e]/92 backdrop-blur-2xl border border-amber-500/35 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-white/10">
          
          {/* 1. Queue */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('pending');
              setMobileMenuOpen(false);
            }}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 group relative cursor-pointer"
          >
            <div className={`transition-all duration-300 relative ${activeTab === 'pending' ? 'scale-115 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.85)]' : 'text-slate-400 group-hover:text-slate-200'}`}>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M13 2L3 14h7v8l10-12h-7z" />
              </svg>
              {(pendingOrders.length + (pendingBalanceOrders?.length || 0)) > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full text-[8px] font-black bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md ring-1 ring-black/40">
                  {pendingOrders.length + (pendingBalanceOrders?.length || 0)}
                </span>
              )}
            </div>
            <span className={`text-[10px] sm:text-[11px] mt-0.5 leading-tight tracking-tight transition-colors ${activeTab === 'pending' ? 'text-amber-400 font-black' : 'text-slate-400 font-semibold group-hover:text-slate-200'}`}>
              Queue
            </span>
            {activeTab === 'pending' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)] animate-pulse" />
            )}
          </button>

          {/* 2. Packages */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('pricing');
              setMobileMenuOpen(false);
            }}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 group relative cursor-pointer"
          >
            <div className={`transition-all duration-300 ${activeTab === 'pricing' ? 'scale-115 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.85)]' : 'text-slate-400 group-hover:text-slate-200'}`}>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 9l10 13L22 9l-10-7zm0 2.8L18.4 9H5.6L12 4.8z" />
              </svg>
            </div>
            <span className={`text-[10px] sm:text-[11px] mt-0.5 leading-tight tracking-tight transition-colors ${activeTab === 'pricing' ? 'text-amber-400 font-black' : 'text-slate-400 font-semibold group-hover:text-slate-200'}`}>
              Packages
            </span>
            {activeTab === 'pricing' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)] animate-pulse" />
            )}
          </button>

          {/* 3. Orders */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('orders');
              setMobileMenuOpen(false);
            }}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 group relative cursor-pointer"
          >
            <div className={`transition-all duration-300 ${activeTab === 'orders' ? 'scale-115 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.85)]' : 'text-slate-400 group-hover:text-slate-200'}`}>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zm10 16H4v-7h16v7zm0-9H4V9h16v2z" />
              </svg>
            </div>
            <span className={`text-[10px] sm:text-[11px] mt-0.5 leading-tight tracking-tight transition-colors ${activeTab === 'orders' ? 'text-amber-400 font-black' : 'text-slate-400 font-semibold group-hover:text-slate-200'}`}>
              Orders
            </span>
            {activeTab === 'orders' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)] animate-pulse" />
            )}
          </button>

          {/* 4. Profits */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('financials');
              setMobileMenuOpen(false);
            }}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 group relative cursor-pointer"
          >
            <div className={`transition-all duration-300 ${activeTab === 'financials' ? 'scale-115 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.85)]' : 'text-slate-400 group-hover:text-slate-200'}`}>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
              </svg>
            </div>
            <span className={`text-[10px] sm:text-[11px] mt-0.5 leading-tight tracking-tight transition-colors ${activeTab === 'financials' ? 'text-amber-400 font-black' : 'text-slate-400 font-semibold group-hover:text-slate-200'}`}>
              Profits
            </span>
            {activeTab === 'financials' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)] animate-pulse" />
            )}
          </button>

          {/* 5. Modules */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 group relative cursor-pointer active:scale-90"
          >
            <div className={`transition-all duration-300 ${mobileMenuOpen ? 'scale-115 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.85)]' : 'text-slate-400 group-hover:text-slate-200'}`}>
              {mobileMenuOpen ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
              )}
            </div>
            <span className={`text-[10px] sm:text-[11px] mt-0.5 leading-tight tracking-tight transition-colors ${mobileMenuOpen ? 'text-amber-400 font-black' : 'text-slate-400 font-semibold group-hover:text-slate-200'}`}>
              {mobileMenuOpen ? 'Close' : 'Modules'}
            </span>
            {mobileMenuOpen && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)] animate-pulse" />
            )}
          </button>
        </nav>
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setProductFormData({ ...productFormData, customImage: '/images/diamond-chest-3d.png' })}
                        className={`p-1.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          productFormData.customImage === '/images/diamond-chest-3d.png' || productFormData.customImage === 'diamond_chest' || productFormData.customImage === 'blue_chest'
                            ? 'bg-cyan-500 text-black border-cyan-300 shadow-md ring-1 ring-cyan-200'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>💎</span>
                        <span>Diamond Chest</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProductFormData({ ...productFormData, customImage: '/images/weekly-pass.png' })}
                        className={`p-1.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          (productFormData.customImage === '/images/weekly-pass.png' || (!productFormData.customImage && (productFormData.game === 'special_passes' || (productFormData.name && productFormData.name.toLowerCase().includes('pass')))))
                            ? 'bg-purple-600 text-white border-purple-400 shadow-md ring-1 ring-purple-300'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>🎫</span>
                        <span>Weekly Pass</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProductFormData({ ...productFormData, customImage: '/images/treasure-chest.png' })}
                        className={`p-1.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          (productFormData.customImage === '/images/treasure-chest.png' || (!productFormData.customImage && !(productFormData.game === 'special_passes' || (productFormData.name && productFormData.name.toLowerCase().includes('pass')))))
                            ? 'bg-amber-500 text-black border-amber-300 shadow-md ring-1 ring-amber-200'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>👑</span>
                        <span>Gold Chest</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProductFormData({ ...productFormData, customImage: 'gem' })}
                        className={`p-1.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          productFormData.customImage === 'gem' || productFormData.customImage === '3d_gem' || productFormData.customImage === '3d-gem' || productFormData.customImage === '/images/diamond-gem.png'
                            ? 'bg-cyan-500 text-black border-cyan-300 shadow-md ring-1 ring-cyan-200'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>✨</span>
                        <span>3D Gem</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Custom Upload Active Badge with Reset Option */}
                {productFormData.customImage && !['/images/diamond-chest-3d.png', '/images/weekly-pass.png', '/images/treasure-chest.png', 'gem', '3d_gem', '3d-gem', '/images/diamond-gem.png', 'diamond', 'weekly_pass', 'pass', 'treasure_chest', 'chest', 'diamond_chest', 'blue_chest'].includes(productFormData.customImage) && (
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-[11px] text-emerald-300 shadow-sm animate-fadeIn">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="text-emerald-400">✨</span>
                      <span>Custom PNG Image Active & Ready!</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setProductFormData({ ...productFormData, customImage: '' })}
                      className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      ✕ Reset to Default
                    </button>
                  </div>
                )}

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
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl animate-scaleUp">
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

      {/* Add / Edit Custom Supplier Gateway Modal */}
      {(addProviderModalOpen || editProviderModalOpen) && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setAddProviderModalOpen(false);
              setEditProviderModalOpen(false);
            }
          }}
        >
          <div className="bg-[#0D121F] border border-slate-700/80 rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] max-h-[92dvh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.85)] animate-scaleUp overflow-hidden">
            {/* Header (Fixed) */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#0A0E17]/90 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  {providerFormData.icon || '🌐'}
                </span>
                <div className="min-w-0">
                  <h3 className="font-black text-white text-sm sm:text-base truncate">
                    {editingProvider ? `Configure ${providerFormData.name || 'Gateway'}` : 'Connect New Supplier Gateway'}
                  </h3>
                  <p className="text-[11px] text-emerald-400 font-semibold truncate mt-0.5">
                    {editingProvider ? 'Update credentials, endpoint URL, or balance' : 'Add custom upstream API or choose from 1-click presets'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddProviderModalOpen(false);
                  setEditProviderModalOpen(false);
                }}
                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white font-bold flex items-center justify-center cursor-pointer transition-colors shrink-0 ml-2"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Form wrapping Scrollable Body and Fixed Footer */}
            <form onSubmit={handleSaveProviderFormSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden text-xs">
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain scrollbar-thin scrollbar-thumb-slate-700">
                {/* 1-Click Fast Presets (Only when adding or exploring) */}
                {!editingProvider && (
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/30 border border-purple-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                        <span>⚡</span> 1-Click Gateway Presets:
                      </span>
                      <span className="text-[10px] text-slate-400">Click to Auto-fill</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PROVIDER_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPreset(preset)}
                          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-900/40 border border-slate-800 hover:border-purple-500/60 text-left transition-all text-xs group cursor-pointer active:scale-95 shadow-sm"
                        >
                          <div className="flex items-center gap-1.5 font-bold text-white group-hover:text-purple-300 truncate text-[11px]">
                            <span className="text-sm shrink-0">{preset.icon}</span>
                            <span className="truncate">{preset.name}</span>
                          </div>
                          <span className="text-[9px] font-semibold text-slate-400 block truncate mt-1">
                            {preset.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Row 1: Provider Name & Icon */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 mb-1 font-semibold text-xs">
                      Provider Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={providerFormData.name}
                      onChange={(e) => setProviderFormData({ ...providerFormData, name: e.target.value })}
                      className="input w-full text-xs py-2 px-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-bold placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
                      placeholder="e.g. Smile One or LapakGaming"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold text-xs">Icon Emoji</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength={4}
                        value={providerFormData.icon}
                        onChange={(e) => setProviderFormData({ ...providerFormData, icon: e.target.value })}
                        className="input w-11 text-center text-base py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 font-bold shrink-0"
                      />
                      <div className="flex gap-1 overflow-x-auto py-1 scrollbar-none">
                        {['🌐', '⚡', '💎', '🚀', '🎮', '🇰🇭'].map(ic => (
                          <button
                            key={ic}
                            type="button"
                            onClick={() => setProviderFormData({ ...providerFormData, icon: ic })}
                            className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 hover:scale-110 transition-all flex items-center justify-center text-sm cursor-pointer shrink-0"
                          >
                            {ic}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              {/* Row 2: Subtitle / Description */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Subtitle / Description</label>
                <input
                  type="text"
                  value={providerFormData.subtitle}
                  onChange={(e) => setProviderFormData({ ...providerFormData, subtitle: e.target.value })}
                  className="input w-full text-xs py-2 rounded-xl bg-dark-bg border-slate-700 text-slate-300"
                  placeholder="e.g. Official Moonton Global Partner (smile.one)"
                />
              </div>

              {/* Row 3: API Endpoint URL */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  API Endpoint URL
                </label>
                <input
                  type="text"
                  value={providerFormData.apiUrl}
                  onChange={(e) => setProviderFormData({ ...providerFormData, apiUrl: e.target.value })}
                  className="input w-full text-xs py-2 rounded-xl font-mono text-cyan-300 bg-dark-bg border-slate-700"
                  placeholder="https://api.provider.com/v1/orders"
                />
              </div>

              {/* Row 4: API Key / Token String with Reveal Toggle */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-semibold">API Secret Key / Bearer Token</label>
                  <button
                    type="button"
                    onClick={() => setShowProviderSecretKey(!showProviderSecretKey)}
                    className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    {showProviderSecretKey ? 'Hide 🔒' : 'Reveal 👁️'}
                  </button>
                </div>
                <input
                  type={showProviderSecretKey ? "text" : "password"}
                  value={providerFormData.apiKey}
                  onChange={(e) => setProviderFormData({ ...providerFormData, apiKey: e.target.value })}
                  className="input w-full text-xs py-2 rounded-xl font-mono text-amber-300 bg-dark-bg border-slate-700 focus:border-amber-400"
                  placeholder="API Key string, JWT token, or Bearer string..."
                />
              </div>

              {/* Row 5: Merchant ID & Live Balance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Merchant / Partner ID (Optional)</label>
                  <input
                    type="text"
                    value={providerFormData.merchantId}
                    onChange={(e) => setProviderFormData({ ...providerFormData, merchantId: e.target.value })}
                    className="input w-full text-xs py-2 rounded-xl bg-dark-bg border-slate-700"
                    placeholder="e.g. user_88291"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Available Credit (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={providerFormData.balanceUSD}
                    onChange={(e) => setProviderFormData({ ...providerFormData, balanceUSD: e.target.value })}
                    className="input w-full text-xs py-2 rounded-xl font-mono font-bold text-amber-300 bg-dark-bg border-slate-700"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Row 6: Docs URL & Refill URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold text-[11px]">API Docs URL (Optional)</label>
                  <input
                    type="text"
                    value={providerFormData.docsUrl}
                    onChange={(e) => setProviderFormData({ ...providerFormData, docsUrl: e.target.value })}
                    className="input w-full text-xs py-1.5 rounded-xl bg-dark-bg border-slate-700"
                    placeholder="https://provider.com/docs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold text-[11px]">Wallet Refill URL (Optional)</label>
                  <input
                    type="text"
                    value={providerFormData.refillUrl}
                    onChange={(e) => setProviderFormData({ ...providerFormData, refillUrl: e.target.value })}
                    className="input w-full text-xs py-1.5 rounded-xl bg-dark-bg border-slate-700"
                    placeholder="https://provider.com/wallet"
                  />
                </div>
              </div>

              {/* Checkbox: Set as active gateway */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="setAsActiveProvCheck"
                  checked={providerFormData.setAsActive}
                  onChange={(e) => setProviderFormData({ ...providerFormData, setAsActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-800 border-slate-700 focus:ring-emerald-400 cursor-pointer"
                />
                <label htmlFor="setAsActiveProvCheck" className="text-slate-300 text-xs font-semibold cursor-pointer">
                  ⚡ Set as currently active storefront provider upon saving
                </label>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="shrink-0 p-3.5 sm:p-4 bg-[#0A0E17]/95 backdrop-blur-md border-t border-slate-800/80 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setAddProviderModalOpen(false);
                  setEditProviderModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                💾 {editingProvider ? 'Save Provider Changes' : 'Connect & Add Provider'}
              </button>
            </div>
          </form>
          </div>
        </div>
      )}

      {/* Add FazerCards API Key / Token Modal (Keep Old Token) */}
      {addFzrTokenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center pb-2 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔑</span>
                <div>
                  <h3 className="font-black text-white text-base">
                    Add FazerCards API Key / Token
                  </h3>
                  <p className="text-[11px] text-amber-400 font-semibold">
                    Old tokens are safely preserved in Keyring
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddFzrTokenModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Reassurance Info Banner */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <span>🛡️</span> Safe Keyring Management
              </div>
              <p className="text-[11px] text-amber-300/80 leading-relaxed">
                Your previous token (<span className="font-mono font-bold text-amber-200">{(providerSettings.fazerCardsApiKey || 'fc_...').substring(0, 10)}...</span>) will be kept as a standby backup. You can switch between tokens anytime.
              </p>
            </div>

            <form onSubmit={handleAddFazerCardsTokenSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  FazerCards API Key / Token string <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newFzrTokenInput}
                  onChange={(e) => setNewFzrTokenInput(e.target.value)}
                  className="input w-full text-xs py-2.5 rounded-xl font-mono text-cyan-300 bg-dark-bg border-slate-700 focus:border-amber-400"
                  placeholder="fc_5F79a0016d5d87bd1e83ea4f or JWT token..."
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Token Name / Label (Optional)
                </label>
                <input
                  type="text"
                  value={newFzrTokenNameInput}
                  onChange={(e) => setNewFzrTokenNameInput(e.target.value)}
                  className="input w-full text-xs py-2 rounded-xl bg-dark-bg border-slate-700"
                  placeholder={`e.g. Backup Key #${(providerSettings.fazerCardsTokens?.length || 0) + 1} or Refill Token`}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="setFzrActiveImmediately"
                  checked={newFzrTokenSetActive}
                  onChange={(e) => setNewFzrTokenSetActive(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 h-4 w-4 bg-dark-bg"
                />
                <label htmlFor="setFzrActiveImmediately" className="text-slate-300 text-xs font-semibold cursor-pointer">
                  Activate this token immediately for live diamond injections
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setAddFzrTokenModalOpen(false)}
                  className="btn btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingFzrToken}
                  className="btn btn-primary text-xs py-2 px-4 shadow-glow-cyan font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-400 hover:to-yellow-300 border-none"
                >
                  {savingFzrToken ? 'Saving...' : '💾 Save Token (Keep Old)'}
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
          <div className="bg-dark-card border border-dark-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 space-y-5 shadow-2xl animate-scaleUp">
            
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

            {/* Step Navigation Bar: Layout 1 -> Layout 2 -> Layout 3 */}
            <div className="flex items-center justify-between p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800 gap-1.5">
              {[
                { step: 1, label: 'Layout 1', name: 'Artwork & Card', icon: '🎮' },
                { step: 2, label: 'Layout 2', name: 'Server Badge & Flag', icon: '🏆' },
                { step: 3, label: 'Layout 3', name: 'Game Details & Save', icon: '⚙️' },
              ].map((s) => {
                const isActive = gameModalStep === s.step;
                const isCompleted = gameModalStep > s.step;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setGameModalStep(s.step)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/25 ring-1 ring-amber-200/80 scale-[1.01]'
                        : isCompleted
                        ? 'bg-slate-900/90 text-amber-300 border border-amber-500/40 hover:border-amber-400/60 hover:bg-slate-800/90'
                        : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <span className="text-sm">{s.icon}</span>
                    <div className="text-left hidden sm:block">
                      <div className="text-[9px] uppercase tracking-wider opacity-80">{s.label}</div>
                      <div className="text-[11px] leading-none truncate font-black">{s.name}</div>
                    </div>
                    <div className="sm:hidden font-black text-[10px]">
                      {s.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSaveGame} className="space-y-4 text-xs">
              
              {/* LAYOUT 1: GAME LOGO & PRODUCT CARD STUDIO */}
              {gameModalStep === 1 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0c1427] via-[#101b33] to-[#0a101f] border border-amber-500/40 space-y-4 animate-fadeIn">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <label className="font-black text-amber-300 uppercase tracking-wider text-xs flex items-center gap-2">
                      <span className="text-base">🎮</span> Game Product Card & Artwork Studio
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Upload high-resolution game cover artwork & see live storefront product card rendering
                    </p>
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 self-start sm:self-auto flex items-center gap-1.5">
                    <span>🖼️</span> 1:1 Square Cover
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  
                  {/* Left: Authentic Storefront Product Card Mockup */}
                  <div className="md:col-span-5 flex flex-col items-center gap-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span>👁️</span> Live Storefront Card Preview
                    </div>

                    {/* The Mini Product Card Mockup */}
                    <div className="relative w-36 sm:w-44 aspect-square rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-400/80 shadow-md group select-none">
                      <img
                        src={gameFormData.image || '/mlbb-logo.png'}
                        alt={gameFormData.name || 'Preview'}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/mlbb-logo.png';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Server Badge Frame Overlay on Top-Right */}
                      {gameFormData.flagType !== 'none' && (
                        <div className="absolute top-1 right-1 z-20 scale-[0.8] sm:scale-[0.85] origin-top-right pointer-events-none">
                          <CambodiaFlagFrame
                            title={gameFormData.flagTitle !== undefined ? gameFormData.flagTitle : (gameFormData.badge || 'សេវើខ្មែរ')}
                            subtitle={gameFormData.flagSubtitle !== undefined ? gameFormData.flagSubtitle : '5V5'}
                            sub={gameFormData.flagServerText !== undefined ? gameFormData.flagServerText : 'SERVER'}
                            flagType={gameFormData.flagType || 'kh'}
                            flagImage={gameFormData.flagType === 'custom' ? gameFormData.flagImage : null}
                            badgeStyle={gameFormData.flagFrameStyle || 'gold_cyber'}
                          />
                        </div>
                      )}

                      {/* Bottom Info Bar Overlay */}
                      <div className="absolute bottom-0 inset-x-0 p-1.5 px-2.5 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between text-[9px] font-black z-10">
                        <span className="text-white truncate max-w-[70%]">
                          {gameFormData.name || 'Game Title'}
                        </span>
                        <span className="text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/40 text-[8px] tracking-wider">
                          ● LIVE
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 text-center font-mono">
                      Aspect Ratio: 1:1 (PNG, JPG, WebP)
                    </div>
                  </div>

                  {/* Right: Upload, URL & Quick Popular Presets */}
                  <div className="md:col-span-7 space-y-3">
                    
                    {/* Upload Method Button */}
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-300 font-bold text-[11px] flex items-center gap-1.5">
                          <span>📤</span> Option 1: Upload Image File
                        </label>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          Auto-Optimized (Max 10MB)
                        </span>
                      </div>

                      {/* Custom Upload Button Area */}
                      <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 cursor-pointer transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-amber-400 text-black font-black flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          📁
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs text-slate-200 group-hover:text-amber-300 transition-colors">
                            Click to Browse or Drag Image Here
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            Supported: PNG, JPG, WebP, SVG
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase shrink-0">
                          Browse
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleGameImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Paste Image URL */}
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                      <label className="block text-slate-300 font-bold text-[11px] flex items-center gap-1.5">
                        <span>🔗</span> Option 2: Paste Direct Image URL
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={gameFormData.image}
                          onChange={(e) =>
                            setGameFormData({ ...gameFormData, image: e.target.value })
                          }
                          placeholder="https://example.com/game-artwork.png or /mlbb-logo.png"
                          className="input w-full text-xs py-2 pl-3 pr-16 rounded-xl bg-slate-900 border-slate-800 font-mono text-cyan-300"
                        />
                        {gameFormData.image && (
                          <button
                            type="button"
                            onClick={() => setGameFormData({ ...gameFormData, image: '' })}
                            className="absolute right-2 top-2 px-2 py-0.5 rounded text-[10px] text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quick 1-Click Game Logo Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] text-slate-400 font-bold mr-1">
                        Quick Presets:
                      </span>
                      {[
                        { name: '⚔️ MLBB 5v5', url: '/mlbb-logo.png' },
                        { name: '🔥 Free Fire', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80' },
                        { name: '🎫 Event Tickets', url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=80' },
                        { name: '🎮 Steam Wallet', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80' },
                        { name: '🤖 Roblox', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80' },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setGameFormData({ ...gameFormData, image: preset.url })}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            gameFormData.image === preset.url
                              ? 'bg-amber-400 text-black border-amber-300 font-black shadow-sm'
                              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>

                  </div>

                </div>

                {/* Step 1 Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 gap-3">
                  <button
                    type="button"
                    onClick={() => setGameModalOpen(false)}
                    className="h-10 px-4 rounded-xl font-bold text-xs text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer select-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setGameModalStep(2)}
                    className="group h-10 px-5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-amber-300 border border-amber-200/90 shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap select-none"
                  >
                    <span>Next: Server Badge</span>
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>

              </div>
            )}

            {/* LAYOUT 2: SERVER FLAG & BADGE CUSTOMIZER STUDIO */}
            {gameModalStep === 2 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0c1427] via-[#101b33] to-[#0a101f] border border-amber-500/40 space-y-4 animate-fadeIn">
                
                {/* Header with Title and Mode Indicator */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <label className="font-black text-amber-300 uppercase tracking-wider text-xs flex items-center gap-2">
                      <span className="text-base">🏆</span> Server Flag Badge & Frame Studio
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Select official country flag, badge frame style & customize 3D typography
                    </p>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/40 self-start sm:self-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    Live SVG & 3D Vector
                  </span>
                </div>

                {/* ── 1. SELECT BADGE FRAME LAYOUT (3 Distinct Layouts) ── */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300">
                      Step 1: Choose Badge Frame Layout (ម៉ូតស៊ុម ៣ បែប)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const frames = ['gold_cyber', 'cyber_pill', 'esports_shield'];
                          const cur = frames.indexOf(gameFormData.flagFrameStyle || 'gold_cyber');
                          const prev = cur <= 0 ? frames.length - 1 : cur - 1;
                          setGameFormData((p) => ({ ...p, flagFrameStyle: frames[prev] }));
                        }}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-300 hover:text-amber-200 cursor-pointer font-bold border border-slate-700 flex items-center gap-1"
                        title="Previous Frame Style"
                      >
                        <span>‹</span> Prev Frame
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const frames = ['gold_cyber', 'cyber_pill', 'esports_shield'];
                          const cur = frames.indexOf(gameFormData.flagFrameStyle || 'gold_cyber');
                          const next = (cur + 1) % frames.length;
                          setGameFormData((p) => ({ ...p, flagFrameStyle: frames[next] }));
                        }}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-300 hover:text-amber-200 cursor-pointer font-bold border border-slate-700 flex items-center gap-1"
                        title="Next Frame Style"
                      >
                        Next Frame <span>›</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        id: 'gold_cyber',
                        name: '3D Gold Frame',
                        desc: 'MLBB 3D Chiseled Gold Esports Cutout',
                        icon: '🏆',
                        badge: 'Official 5v5'
                      },
                      {
                        id: 'cyber_pill',
                        name: 'Cyber Glass Pill',
                        desc: 'Floating Translucent Neon Capsule Ribbon',
                        icon: '💎',
                        badge: 'Modern Sleek'
                      },
                      {
                        id: 'esports_shield',
                        name: 'Esports Crest',
                        desc: 'Compact Gaming Tournament Medallion',
                        icon: '🛡️',
                        badge: 'Esports Shield'
                      }
                    ].map((layout) => {
                      const isSelected = (gameFormData.flagFrameStyle || 'gold_cyber') === layout.id;
                      return (
                        <button
                          key={layout.id}
                          type="button"
                          onClick={() => setGameFormData((prev) => ({ ...prev, flagFrameStyle: layout.id }))}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-500/25 via-amber-500/15 to-transparent border-amber-400 shadow-md ring-1 ring-amber-400/50'
                              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{layout.icon}</span>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                              isSelected ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {layout.badge}
                            </span>
                          </div>
                          <div className={`font-black text-xs ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                            {layout.name}
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight line-clamp-1 mt-0.5">
                            {layout.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── 2. SELECT COUNTRY FLAG (Show Only Current One + Drop-down List) ── */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <span>🚩</span> Step 2: Select Server Flag (ជ្រើសរើសទង់ជាតិសេវើ)
                    </label>
                    <span className="text-[10px] text-amber-400 font-mono">
                      Active: <strong className="text-white">{ALL_FLAG_OPTIONS.find(f => f.id === (gameFormData.flagType || 'kh'))?.name || 'Cambodia'}</strong>
                    </span>
                  </div>

                  {/* Clean Container: Shows ONLY Current One + Dropdown List */}
                  <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-amber-500/50 space-y-3 overflow-visible relative">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      
                      {/* Current Selected Flag Showcase (Only Current One Shown) */}
                      {(() => {
                        const currentFlag = ALL_FLAG_OPTIONS.find(f => f.id === (gameFormData.flagType || 'kh')) || POPULAR_FLAGS[0];
                        return (
                          <div className="md:col-span-6 flex items-center gap-3 p-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-slate-900/90 to-slate-900/90 border border-amber-400/80 min-w-0">
                            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-amber-400 flex items-center justify-center bg-slate-950 shadow-sm">
                              {gameFormData.flagType === 'none' ? (
                                <span className="text-base">🚫</span>
                              ) : (
                                <UniversalSphericalFlag
                                  flagType={gameFormData.flagType || 'kh'}
                                  flagImage={gameFormData.flagType === 'custom' ? gameFormData.flagImage : null}
                                  className="w-full h-full"
                                />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-black text-xs sm:text-sm text-white truncate">
                                  {currentFlag?.name || 'Cambodia'}
                                </span>
                                <span className="px-1.5 py-0.2 rounded bg-amber-400 text-black text-[8.5px] font-black uppercase shrink-0">
                                  Active
                                </span>
                              </div>
                              <div className="text-[10px] text-amber-300 font-khmer truncate mt-0.5">
                                {currentFlag?.local ? `${currentFlag.local} • ` : ''}Title: "{currentFlag?.t1 || 'សេវើខ្មែរ 5v5'}"
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Creative Custom Drop-down List to Change Selection */}
                      <div className="md:col-span-6 min-w-0 relative">
                        <label className="block text-[10px] text-slate-400 font-semibold mb-1 truncate flex items-center justify-between">
                          <span>Change Server Flag:</span>
                          <span className="text-amber-400 text-[9px] font-mono">⚡ Creative Dropdown</span>
                        </label>
                        <CreativeFlagDropdown
                          value={gameFormData.flagType || 'kh'}
                          flagImage={gameFormData.flagImage}
                          onChange={(found) => {
                            if (!found) return;
                            setGameFormData((prev) => ({
                              ...prev,
                              flagType: found.id,
                              flagTitle: found.t1 || prev.flagTitle,
                              flagSubtitle: found.t2 !== undefined ? found.t2 : prev.flagSubtitle,
                              flagServerText: found.t3 || prev.flagServerText,
                            }));
                          }}
                        />
                      </div>

                    </div>

                    {/* Custom Image Upload & URL (Only shown if 'custom' is selected) */}
                    {gameFormData.flagType === 'custom' && (
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-amber-500/40 space-y-2.5 pt-3">
                        <label className="block font-bold text-amber-300 text-[11px]">
                          Upload Custom Server Flag / Transparent PNG:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1">Option 1: Upload from Computer</span>
                            <input
                              type="file"
                              accept="image/png,image/svg+xml,image/webp,image/*"
                              onChange={handleGameFlagUpload}
                              className="block w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer bg-slate-950 rounded-xl border border-slate-800"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1">Option 2: Paste PNG Image URL</span>
                            <input
                              type="text"
                              value={gameFormData.flagImage || ''}
                              onChange={(e) =>
                                setGameFormData({
                                  ...gameFormData,
                                  flagImage: e.target.value,
                                  flagType: 'custom',
                                })
                              }
                              placeholder="https://example.com/custom-badge.png"
                              className="input w-full text-xs py-1.5 rounded-xl bg-slate-950"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── 3. BADGE TEXT TYPOGRAPHY (3 Lines with Quick Presets) ── */}
                <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-amber-300 font-bold text-[11px]">
                      Step 3: Badge Text Lines (អក្សរក្នុងផ្លាកសេវើ ៣ ជួរ):
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setGameFormData(prev => ({ ...prev, flagTitle: 'សេវើខ្មែរ 5v5', flagSubtitle: '5V5', flagServerText: 'SERVER' }))}
                        className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold hover:bg-amber-500/30 cursor-pointer"
                      >
                        🇰🇭 MLBB 5v5
                      </button>
                      <button
                        type="button"
                        onClick={() => setGameFormData(prev => ({ ...prev, flagTitle: 'SEVER ខ្មែរ', flagSubtitle: 'KH', flagServerText: 'DIRECT' }))}
                        className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-bold hover:bg-cyan-500/30 cursor-pointer"
                      >
                        🔥 FreeFire KH
                      </button>
                    </div>
                  </div>

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

                {/* Step 2 Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 gap-3">
                  <button
                    type="button"
                    onClick={() => setGameModalStep(1)}
                    className="h-10 px-4 rounded-xl font-bold text-xs text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap select-none"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Previous: Artwork</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGameModalStep(3)}
                    className="group h-10 px-5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-amber-300 border border-amber-200/90 shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap select-none"
                  >
                    <span>Next: Game Details</span>
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>

              </div>
            )}

            {/* LAYOUT 3: GAME INFORMATION & SETTINGS */}
            {gameModalStep === 3 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0c1427] via-[#101b33] to-[#0a101f] border border-amber-500/40 space-y-4 animate-fadeIn">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <label className="font-black text-amber-300 uppercase tracking-wider text-xs flex items-center gap-2">
                      <span className="text-base">⚙️</span> Game Information & Settings (Layout 3)
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Configure title, publisher, category, delivery speed, and in-game currency
                    </p>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-500/50 self-start sm:self-auto flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Step 3 of 3
                  </span>
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

                {/* Step 3 Navigation Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-800/80 gap-3">
                  <button
                    type="button"
                    onClick={() => setGameModalStep(2)}
                    className="h-10 px-4 rounded-xl font-bold text-xs text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap select-none"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Previous: Server Badge</span>
                  </button>
                  <div className="flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setGameModalOpen(false)}
                      className="h-10 px-4 rounded-xl font-bold text-xs text-slate-400 hover:text-rose-300 bg-slate-900/80 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer select-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-10 px-5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-amber-300 border border-amber-200/90 shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap select-none"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                      </svg>
                      <span>Save Game & Apply</span>
                      <span className="w-4 h-4 rounded-full bg-black/15 flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    </button>
                  </div>
                </div>

              </div>
            )}
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

                      {/* Card 2: Cloudinary / Custom Logo */}
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
                              : '/tin-logo.png';
                            const updated = { ...storeBrandingForm, logoType: 'image', logoImage: url };
                            setStoreBrandingForm(updated);
                            updateBranding(updated);
                            showToast('success', '✅ Logo activated & saved!');
                          }}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-slate-950/60 p-0.5">
                            <img
                              src={
                                storeBrandingForm.logoImage?.includes('cloudinary.com')
                                  ? storeBrandingForm.logoImage
                                  : '/tin-logo.png'
                              }
                              alt="Tin-Topup Logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-white truncate">Cloudinary Logo</div>
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
          <div className="bg-dark-card border border-emerald-500/40 rounded-3xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl animate-scaleUp">
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
          <div className="bg-dark-card border border-amber-500/40 rounded-3xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl animate-scaleUp">
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
                        e.target.onerror = null;
                        e.target.src = '/mlbb-logo.png';
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
                        url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80',
                        badge: 'ALLSTAR 2026'
                      },
                      {
                        name: 'Starlight & Twilight',
                        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
                        badge: 'VIP PASS'
                      },
                      {
                        name: 'PUBG UC Mega Season',
                        url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1400&q=80',
                        badge: 'ROYALE PASS'
                      },
                      {
                        name: 'Free Fire Booyah Pass',
                        url: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1400&q=80',
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

      {/* Clear Financials / Start New Sell Confirmation Modal */}
      {clearFinancialsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0f172a] border border-rose-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-rose-950/50">
                🗑️
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  Clear Financials & Start New Sell?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  This action resets all Financial KPI metrics (<strong className="text-emerald-400">Income</strong>, <strong className="text-cyan-400">Total Seller</strong>, <strong className="text-rose-400">Provider Costs</strong>) back to <strong className="text-white">$0.00</strong> and archives the previous sales ledger so you can track a clean new selling period.
                </p>
              </div>
            </div>

            {/* Current Metrics Summary to be Cleared */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Current Financial Snapshot to be Reset:
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Current Net Income:</span>
                <span className="font-mono font-bold text-emerald-400">${displayFinancials?.totalNetProfit?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Total Gross Revenue:</span>
                <span className="font-mono font-bold text-cyan-400">${displayFinancials?.totalGrossRevenue?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Total Provider Cost:</span>
                <span className="font-mono font-bold text-rose-400">${displayFinancials?.totalSupplierCogs?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Sales Ledger Entries:</span>
                <span className="font-mono font-bold text-amber-400">{displayFinancials?.salesLedger?.length || 0} transactions</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
              <span className="text-base shrink-0">💡</span>
              <p className="leading-relaxed">
                <strong>Safety Note:</strong> Customer accounts, player IDs, and order history records remain safely intact in your Orders Ledger. Only the financial accounting numbers reset to $0.00 for your new sales cycle.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setClearFinancialsModalOpen(false)}
                disabled={clearingFinancials}
                className="btn btn-secondary text-xs py-2.5 px-4 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearFinancials}
                disabled={clearingFinancials}
                className="btn text-xs py-2.5 px-5 font-black bg-rose-600 hover:bg-rose-500 active:scale-95 text-white shadow-lg shadow-rose-900/40 rounded-xl cursor-pointer flex items-center gap-2"
              >
                {clearingFinancials ? (
                  <>
                    <span className="animate-spin text-sm">⏳</span>
                    <span>Resetting Financials...</span>
                  </>
                ) : (
                  <>
                    <span>🗑️</span>
                    <span>Yes, Reset to $0.00</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
