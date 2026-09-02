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
  getCurrentUser: () => api.get('/auth/me'),
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
  getStatus: (id) => api.get(`/orders/${id}/status`),
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
  getPendingBalanceOrders: () => api.get('/admin/pending-balance-orders'),
  approveTopup: (orderId) => api.post(`/admin/orders/${orderId}/approve-topup`),
};

export default api;
