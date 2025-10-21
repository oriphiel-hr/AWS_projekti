// USLUGAR EXCLUSIVE - API Client
import api from '../api';

// ============================================================
// LEADS
// ============================================================

export const getAvailableLeads = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.city) params.append('city', filters.city);
  if (filters.categoryId) params.append('categoryId', filters.categoryId);
  if (filters.minBudget) params.append('minBudget', filters.minBudget);
  if (filters.maxBudget) params.append('maxBudget', filters.maxBudget);
  
  return api.get(`/exclusive/leads/available?${params.toString()}`);
};

export const purchaseLead = (jobId) => {
  return api.post(`/exclusive/leads/${jobId}/purchase`);
};

export const getMyLeads = (status = null) => {
  const params = status ? `?status=${status}` : '';
  return api.get(`/exclusive/leads/my-leads${params}`);
};

export const markLeadContacted = (purchaseId) => {
  return api.post(`/exclusive/leads/purchases/${purchaseId}/contacted`);
};

export const markLeadConverted = (purchaseId, revenue) => {
  return api.post(`/exclusive/leads/purchases/${purchaseId}/converted`, { revenue });
};

export const requestRefund = (purchaseId, reason) => {
  return api.post(`/exclusive/leads/purchases/${purchaseId}/refund`, { reason });
};

// ============================================================
// CREDITS
// ============================================================

export const getCreditsBalance = () => {
  return api.get('/exclusive/leads/credits/balance');
};

export const getCreditHistory = (limit = 50) => {
  return api.get(`/exclusive/leads/credits/history?limit=${limit}`);
};

export const purchaseCredits = (amount, paymentIntentId) => {
  return api.post('/exclusive/leads/credits/purchase', { amount, paymentIntentId });
};

// ============================================================
// ROI
// ============================================================

export const getROIDashboard = () => {
  return api.get('/exclusive/roi/dashboard');
};

export const getMonthlyStats = (year, month) => {
  return api.get(`/exclusive/roi/monthly-stats?year=${year}&month=${month}`);
};

export const getTopLeads = (limit = 10) => {
  return api.get(`/exclusive/roi/top-leads?limit=${limit}`);
};

// ============================================================
// VERIFICATION
// ============================================================

export const getVerificationStatus = () => {
  return api.get('/verification/status');
};

export const sendPhoneVerificationCode = (phone) => {
  return api.post('/verification/phone/send-code', { phone });
};

export const verifyPhoneCode = (code) => {
  return api.post('/verification/phone/verify-code', { code });
};

export const uploadIDVerification = (idImageFront, idImageBack) => {
  return api.post('/verification/id/upload', { idImageFront, idImageBack });
};

export const verifyCompany = () => {
  return api.post('/verification/company/verify');
};

// ============================================================
// SUBSCRIPTIONS
// ============================================================

export const getSubscriptionPlans = () => {
  return api.get('/subscriptions/plans');
};

export const getMySubscription = () => {
  return api.get('/subscriptions/me');
};

export const subscribeToPlan = (plan, paymentIntentId) => {
  return api.post('/subscriptions/subscribe', { plan, paymentIntentId });
};

export const cancelSubscription = () => {
  return api.post('/subscriptions/cancel');
};

