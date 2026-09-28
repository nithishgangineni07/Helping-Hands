import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: inject JWT token if present in localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hh_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ================= Auth Endpoints =================
export const adminLoginApi = (data) => API.post('/auth/admin/login', data);
export const trustRegisterApi = (formData) =>
  API.post('/auth/trust/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const trustLoginApi = (data) => API.post('/auth/trust/login', data);
export const trustGoogleAuthApi = (data) => API.post('/auth/trust/google', data);
export const getMeApi = () => API.get('/auth/me');
export const logoutApi = () => API.post('/auth/logout');

// ================= Campaign Endpoints (Public) =================
export const getCampaigns = (params) => API.get('/campaigns', { params });
export const getCampaignById = (id) => API.get(`/campaigns/${id}`);
export const getCampaignDonors = (id, params) => API.get(`/campaigns/${id}/donors`, { params });
export const shareCampaign = (id) => API.post(`/campaigns/${id}/share`);
export const createCampaign = (data) => API.post('/campaigns', data);
export const updateCampaign = (id, data) => API.put(`/campaigns/${id}`, data);
export const deleteCampaign = (id) => API.delete(`/campaigns/${id}`);
export const addCampaignUpdate = (id, data) => API.post(`/campaigns/${id}/updates`, data);

// ================= Trust Endpoints (Public) =================
export const getTrusts = (params) => API.get('/trusts', { params });
export const getTrustById = (id) => API.get(`/trusts/${id}`);
export const createTrust = (data) => API.post('/trusts', data);
export const updateTrust = (id, data) => API.put(`/trusts/${id}`, data);
export const deleteTrust = (id) => API.delete(`/trusts/${id}`);

// ================= Donation Endpoints =================
export const createDonation = (data) => API.post('/donations', data);
export const getDonations = (params) => API.get('/donations', { params });
export const getDonationById = (id) => API.get(`/donations/${id}`);

// ================= Trust Portal Endpoints (Private) =================
export const getTrustComplianceStatus = () => API.get('/trust/compliance-status');
export const getTrustProfile = () => API.get('/trust/profile');
export const updateTrustProfile = (formData) =>
  API.put('/trust/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const getTrustDashboard = () => API.get('/trust/dashboard');
export const getTrustCampaigns = (params) => API.get('/trust/campaigns', { params });
export const createTrustCampaign = (formData) =>
  API.post('/trust/campaigns', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const uploadImpactUpdate = (campaignId, formData) =>
  API.post(`/trust/campaigns/${campaignId}/impact`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const getTrustDonations = (params) => API.get('/trust/donations', { params });

// ================= Admin Endpoints (Private) =================
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminTrusts = (params) => API.get('/admin/trusts', { params });
export const getAdminTrustById = (id) => API.get(`/admin/trusts/${id}`);
export const verifyTrust = (id, data = {}) => API.patch(`/admin/trusts/${id}/verify`, data);
export const rejectTrust = (id, data = {}) => API.patch(`/admin/trusts/${id}/reject`, data);
export const suspendTrust = (id, data = {}) => API.patch(`/admin/trusts/${id}/suspend`, data);

export const getAdminCampaigns = (params) => API.get('/admin/campaigns', { params });
export const approveCampaign = (id) => API.patch(`/admin/campaigns/${id}/approve`);
export const rejectCampaign = (id, data = {}) => API.patch(`/admin/campaigns/${id}/reject`, data);
export const suspendCampaign = (id, data = {}) => API.patch(`/admin/campaigns/${id}/suspend`, data);

export const getAdminDonations = (params) => API.get('/admin/donations', { params });
export const getAdminAuditLogs = (params) => API.get('/admin/audit-logs', { params });
export const getAdminReports = () => API.get('/admin/reports');

export const getAdminImpactUpdates = (params) => API.get('/admin/impact-updates', { params });
export const approveImpactUpdate = (id) => API.patch(`/admin/impact-updates/${id}/approve`);
export const rejectImpactUpdate = (id, data = {}) => API.patch(`/admin/impact-updates/${id}/reject`, data);

export default API;
