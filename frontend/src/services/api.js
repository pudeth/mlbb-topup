import axios from 'axios';

const getDefaultApiUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://mlbb-backend-api.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getDefaultApiUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 25000, // 25s — allows Render cold start without hanging forever
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - only redirect if user was logged in
      const hadToken = localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (hadToken && window.location.pathname !== '/topup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  playerLogin: (data) => api.post('/auth/player-login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
};

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getById: (id) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get('/orders/my-orders'),
  getByPlayer: (playerId, serverId) => api.get('/orders/by-player', { params: { playerId, serverId } }),
  getStatus: (id) => api.get(`/orders/${id}/status`),
  getQuickStatus: (id) => api.get(`/orders/${id}/quick-status`),
  checkPayment: (id, manualConfirm = false) =>
    api.post(`/orders/${id}/check-payment${manualConfirm ? '?manualConfirm=true' : ''}`),
  confirmPaid: (id) => api.post(`/orders/${id}/confirm-paid`),
};

// TopUp API
export const topupAPI = {
  checkAccount: (playerId, serverId) =>
    api.get('/topup/check-account', { params: { playerId, serverId } }),
  verifyAccount: (data) => {
    const pId = data?.playerID || data?.playerId || data?.userId;
    const sId = data?.serverID || data?.serverId || data?.zoneId;
    return api.get('/topup/check-account', { params: { playerId: pId, serverId: sId } });
  },
  getFreefireNickname: (uid) => api.get(`/topup/ff-nickname/${uid}`),
};

// Payments API
export const paymentsAPI = {
  create: (data) => api.post('/payments', data),
  process: (orderId, data) =>
    api.post('/payments', {
      orderId,
      ...(typeof data === 'object' ? data : { paymentMethod: data || 'khqr' }),
    }),
  getByOrderId: (orderId) => api.get(`/payments/order/${orderId}`),
};

// KHQR API
export const khqrAPI = {
  checkStatus: (md5Hash) => api.get(`/khqr/status/${md5Hash}`),
};

// ABA PayWay API
export const paywayAPI = {
  create: (data) => api.post('/payway/create', data),
  checkStatus: (tranId, orderId) =>
    api.get(`/payway/status/${tranId}${orderId ? `?orderId=${orderId}` : ''}`),
  checkTransaction: (tranId) => api.post('/payway/check-transaction', { tran_id: tranId }),
  callback: (data) => api.post('/payway/callback', data),
  close: (tranId) => api.post(`/payway/close/${tranId}`),
  getDetails: (tranId) => api.get(`/payway/details/${tranId}`),
  getTransactionList: (params = {}) => {
    const q = new URLSearchParams();
    if (params.fromDate) q.set('fromDate', params.fromDate);
    if (params.toDate) q.set('toDate', params.toDate);
    if (params.fromAmount) q.set('fromAmount', params.fromAmount);
    if (params.toAmount) q.set('toAmount', params.toAmount);
    if (params.status) q.set('status', params.status);
    if (params.page) q.set('page', params.page);
    if (params.pagination) q.set('pagination', params.pagination);
    return api.get(`/payway/list?${q.toString()}`);
  },
  getExchangeRate: () => api.get('/payway/exchange-rate'),
  getPollingLog: (tranId) => api.get(`/payway/polling-log/${tranId}`),
  syncReceiptsToMongoDB: (tranId) => api.post('/payway/sync-mongodb', tranId ? { tranId } : {}),
  deliverTopUp: (tranId) => api.post(`/payway/deliver-topup/${tranId}`),
};

// Bakong Gateway API
export const bakongAPI = {
  getStatus: () => api.get('/admin/bakong/status'),
  updateToken: (data) => api.post('/admin/bakong/token', data),
  verifyToken: () => api.get('/admin/bakong/verify'),
};

// Admin API
export const adminAPI = {
  getAllOrders: () => api.get('/admin/orders'),
  getPendingOrders: () => api.get('/admin/orders/pending'),
  verifyPayment: (orderId) => api.put(`/admin/orders/${orderId}/verify-payment`),
  processTopUp: (orderId) => api.post(`/admin/orders/${orderId}/process-topup`),
  manualCompleteTopUp: (orderId) => api.post(`/admin/orders/${orderId}/manual-complete`),
  batchProcessTopUp: (orderIds) => api.post('/admin/orders/batch-process', { orderIds }),
  updatePaymentStatus: (orderId, status) =>
    api.put(`/admin/orders/${orderId}/payment-status`, { status }),
  updateTopUpStatus: (orderId, status) =>
    api.put(`/admin/orders/${orderId}/topup-status`, { status }),
  getAllUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getReports: () => api.get('/admin/reports'),
  getAnalytics: () => api.get('/admin/analytics'),
  getSystemStatus: () => api.get('/admin/system-status'),
  getAllProducts: () => api.get('/products/all'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  syncRealPackages: () => api.post('/admin/provider/sync-real-packages'),
  getProviderSettings: () => api.get('/admin/provider-settings'),
  updateProviderSettings: (data) => api.put('/admin/provider-settings', data),
  switchProvider: (provider) => api.post('/admin/provider/switch', { provider }),
  testProviderConnection: (data) => api.post('/admin/provider/test-connection', data),
  getFinancialsProfit: () => api.get('/admin/financials/profit'),
  clearFinancials: () => api.post('/admin/financials/clear'),
  getSupplierBalance: () => api.get('/admin/supplier/balance'),
  recordSupplierDeposit: (data) => api.post('/admin/supplier/deposit', data),
  getAllResellers: () => api.get('/admin/resellers'),
  createReseller: (data) => api.post('/admin/resellers', data),
  depositResellerCredit: (id, data) => api.post(`/admin/resellers/${id}/deposit`, data),
  generateResellerApiKey: (id) => api.post(`/admin/resellers/${id}/generate-api-key`),
  getFailedTransactions: () => api.get('/admin/transactions/failed'),
  retryTransaction: (id) => api.post(`/admin/transactions/${id}/retry`),
  getBakongSettings: () => api.get('/admin/bakong-settings'),
  switchBakongAccount: (accountId) => api.post('/admin/bakong/switch-account', { accountId }),
  saveBakongAccount: (data) => api.post('/admin/bakong/accounts', data),
  deleteBakongAccount: (id) => api.delete(`/admin/bakong/accounts/${id}`),
  updateBakongToken: (token) => api.post('/admin/bakong/update-token', { token }),
  testBakongToken: (token) => api.post('/admin/bakong/test-token', { token }),
  addFazerCardsToken: (data) => api.post('/admin/provider/fazercards-tokens', data),
  switchFazerCardsToken: (id) => api.post('/admin/provider/fazercards-tokens/switch', { id }),
  deleteFazerCardsToken: (id) => api.delete(`/admin/provider/fazercards-tokens/${id}`),
  getPendingBalanceOrders: () => api.get('/admin/pending-balance-orders'),
  approveTopup: (orderId) => api.post(`/admin/orders/${orderId}/approve-topup`),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`).catch(() => ({ data: { success: true } })),
};

export default api;
