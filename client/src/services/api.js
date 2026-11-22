// API Client utility for Paverasa Tech Growth
const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('ptg_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me', { method: 'GET' }),
  changePassword: (payload) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(payload) }),

  // Client Portal
  getClientDashboard: () => request('/client/dashboard', { method: 'GET' }),
  updateClientProfile: (payload) => request('/client/profile', { method: 'PUT', body: JSON.stringify(payload) }),

  // Admin Portal
  getAdminOverview: () => request('/admin/overview', { method: 'GET' }),
  getDbStatus: () => request('/admin/db-status', { method: 'GET' }),
  getAdminClients: () => request('/admin/clients', { method: 'GET' }),
  getAdminClientDetails: (id) => request(`/admin/client/${id}`, { method: 'GET' }),
  createAdminClient: (payload) => request('/admin/clients', { method: 'POST', body: JSON.stringify(payload) }),
  updateClientPassword: (id, payload) => request(`/admin/client/${id}/password`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteClient: (id) => request(`/admin/client/${id}`, { method: 'DELETE' }),
  saveProject: (payload) => request('/admin/projects', { method: 'POST', body: JSON.stringify(payload) }),
  updateProject: (id, payload) => request(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  addMilestone: (projectId, payload) => request(`/admin/projects/${projectId}/milestones`, { method: 'POST', body: JSON.stringify(payload) }),
  updateMilestone: (projectId, milestoneId, payload) => request(`/admin/projects/${projectId}/milestones/${milestoneId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteMilestone: (projectId, milestoneId) => request(`/admin/projects/${projectId}/milestones/${milestoneId}`, { method: 'DELETE' }),
  getAdminMeetings: (clientId) => request(`/admin/meetings${clientId ? `?clientId=${clientId}` : ''}`, { method: 'GET' }),
  createMeeting: (payload) => request('/admin/meetings', { method: 'POST', body: JSON.stringify(payload) }),
  updateMeeting: (id, payload) => request(`/admin/meetings/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteMeeting: (id) => request(`/admin/meetings/${id}`, { method: 'DELETE' }),
  setupPaymentPlan: (payload) => request('/admin/payments/setup', { method: 'POST', body: JSON.stringify(payload) }),
  updateInstallmentStatus: (id, payload) => request(`/admin/installments/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) }),
  sendPaymentDueEmail: (payload) => request('/admin/send-payment-due-email', { method: 'POST', body: JSON.stringify(payload) }),

  // Contact
  submitContact: (payload) => request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
  getInquiries: () => request('/contact', { method: 'GET' })
};
