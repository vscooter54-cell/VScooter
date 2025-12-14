import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Disabled for demo - no authentication needed
});

// Request interceptor to add token
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
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  updatePassword: (data) => api.put('/users/updatepassword', data),
  forgotPassword: (data) => api.post('/users/forgotpassword', data),
  resetPassword: (token, data) => api.put(`/users/resetpassword/${token}`, data),
  // GDPR endpoints
  exportUserData: () => api.get('/users/export-data'),
  deleteAccount: (data) => api.delete('/users/delete-account', { data }),
};

// Address API
export const addressAPI = {
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (addressId, data) => api.put(`/users/addresses/${addressId}`, data),
  deleteAddress: (addressId) => api.delete(`/users/addresses/${addressId}`),
};

// Product API
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getProductBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getFeaturedProducts: (limit = 4) => api.get('/products/featured', { params: { limit } }),
  getRelatedProducts: (id, limit = 4) => api.get(`/products/${id}/related`, { params: { limit } }),
  getCategories: () => api.get('/products/categories'),
  getTags: () => api.get('/products/tags'),
  checkStock: (items) => api.post('/products/check-stock', { items }),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/items', data),
  updateCartItem: (productId, data) => api.put(`/cart/items/${productId}`, data),
  removeFromCart: (productId) => api.delete(`/cart/items/${productId}`),
  clearCart: () => api.delete('/cart'),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
  removeCoupon: () => api.delete('/cart/coupon'),
  validateCart: () => api.get('/cart/validate'),
  mergeCart: (guestCartItems) => api.post('/cart/merge', { guestCartItems }),
};

// Order API
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
};

// Review API
export const reviewAPI = {
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  createReview: (data) => api.post('/reviews', data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (data) => api.post('/wishlist/items', data),
  updateWishlistItem: (productId, data) => api.put(`/wishlist/items/${productId}`, data),
  removeFromWishlist: (productId) => api.delete(`/wishlist/items/${productId}`),
  clearWishlist: () => api.delete('/wishlist'),
  moveToCart: (productId, quantity) => api.post(`/wishlist/items/${productId}/move-to-cart`, { quantity }),
  moveAllToCart: () => api.post('/wishlist/move-all-to-cart'),
  shareWishlist: (data) => api.put('/wishlist/share', data),
  getSharedWishlist: (token) => api.get(`/wishlist/shared/${token}`),
  checkPriceDrops: () => api.get('/wishlist/check-price-drops'),
};

// Support API
export const supportAPI = {
  createTicket: (data) => api.post('/support/tickets', data),
  getMyTickets: (params) => api.get('/support/tickets/my-tickets', { params }),
  getTicket: (id) => api.get(`/support/tickets/${id}`),
  addMessage: (id, data) => api.post(`/support/tickets/${id}/messages`, data),
  closeTicket: (id, resolution) => api.put(`/support/tickets/${id}/close`, { resolution }),
  reopenTicket: (id) => api.put(`/support/tickets/${id}/reopen`),
  rateTicket: (id, data) => api.post(`/support/tickets/${id}/rate`, data),
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),

  // Customers
  getCustomers: (params) => api.get('/admin/customers', { params }),
  getCustomerDetails: (id) => api.get(`/admin/customers/${id}`),

  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),

  // Analytics
  getAnalytics: (params) => api.get('/admin/analytics', { params }),

  // Products (admin)
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Orders (admin)
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),

  // Reviews (admin)
  getAllReviews: (params) => api.get('/reviews', { params }),
  approveReview: (id) => api.put(`/reviews/${id}/approve`),

  // Coupons
  getCoupons: (params) => api.get('/coupons', { params }),
  createCoupon: (data) => api.post('/coupons', data),
  updateCoupon: (id, data) => api.put(`/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),

  // Support tickets (admin)
  getAllTickets: (params) => api.get('/support/tickets', { params }),
  assignTicket: (id, data) => api.put(`/support/tickets/${id}/assign`, data),
};

export default api;
